import { storage } from "./storage";
import { log } from "./log";
import { type Job, type CatalogItem } from "@shared/schema";
import { subDays, isMonday, startOfYesterday, endOfYesterday, format, startOfWeek, endOfWeek, subWeeks } from "date-fns";

async function checkDebt() {
  log("Running debt tracking automation...", "automations");
  try {
    const jobs = await storage.getJobs();
    const now = new Date();

    for (const job of jobs) {
      if (job.status === "e_perfunduar" && job.paymentStatus !== "paguar" && !job.isTemplate) {
        const completedDate = job.updatedAt ? new Date(job.updatedAt) : (job.workDate ? new Date(job.workDate) : null);
        if (!completedDate) continue;

        const daysSince = Math.floor((now.getTime() - completedDate.getTime()) / (1000 * 60 * 60 * 24));
        
        // Check for 15 and 30 days
        if (daysSince === 15 || daysSince === 30) {
          const title = `Vonesë Pagese: ${job.clientName}`;
          const message = `Procesverbali për ${job.clientName} ka ${daysSince} ditë që është përfunduar por nuk është paguar plotësisht. Statusi: ${job.paymentStatus === 'pjeserisht' ? 'Pjesërisht' : 'Pa paguar'}.`;
          
          // Check if similar notification already exists for this jobId and type/days
          const existingNotifs = await storage.getNotifications();
          const alreadyNotified = existingNotifs.some(n => 
            n.jobId === job.id && 
            n.type === "debt_alert" && 
            n.message.includes(`${daysSince} ditë`)
          );

          if (!alreadyNotified) {
            await storage.createNotification({
              type: "debt_alert",
              title,
              message,
              jobId: job.id,
              isRead: 0
            });
            log(`Created debt alert for job ${job.id} (${daysSince} days)`, "automations");
          }
        }
      }
    }
  } catch (err) {
    console.error("Debt check failed:", err);
  }
}

async function checkWarranties() {
  log("Running warranty tracking automation...", "automations");
  try {
    const jobs = await storage.getJobs();
    const now = new Date();
    
    for (const job of jobs) {
      // Only check completed jobs with a warranty set
      if (job.status === "e_perfunduar" && job.warrantyMonths && !job.isTemplate) {
        const startDate = job.workDate ? new Date(job.workDate) : (job.createdAt ? new Date(job.createdAt) : null);
        if (!startDate) continue;

        // Calculate expiry: startDate + warrantyMonths
        const expiryDate = new Date(startDate);
        expiryDate.setMonth(expiryDate.getMonth() + job.warrantyMonths);
        
        // Days until expiry
        const daysToExpiry = Math.floor((expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        
        // Notify if it expires in roughly 30 days
        if (daysToExpiry >= 25 && daysToExpiry <= 31) {
          const title = `Skadimi i Garancisë: ${job.clientName}`;
          const message = `Garancia për ${job.clientName} skadon më ${format(expiryDate, 'dd/MM/yyyy')} (pas rreth një muaji).`;

          const existingNotifs = await storage.getNotifications();
          const alreadyNotified = existingNotifs.some(n => 
            n.jobId === job.id && 
            n.type === "warranty_expiry"
          );

          if (!alreadyNotified) {
            await storage.createNotification({
              type: "warranty_expiry",
              title,
              message,
              jobId: job.id,
              isRead: 0
            });
            log(`Created warranty alert for job ${job.id}`, "automations");
          }
        }
      }
    }
  } catch (err) {
    console.error("Warranty check failed:", err);
  }
}

async function sendWeeklySummary() {
  if (!isMonday(new Date())) return;
  
  log("Running weekly summary automation...", "automations");
  try {
    const lastWeekStart = startOfWeek(subWeeks(new Date(), 1), { weekStartsOn: 1 });
    const lastWeekEnd = endOfWeek(subWeeks(new Date(), 1), { weekStartsOn: 1 });

    const allJobs = await storage.getJobs();
    const lastWeekJobs = allJobs.filter(j => {
        if (!j.createdAt) return false;
        const d = new Date(j.createdAt);
        return d >= lastWeekStart && d <= lastWeekEnd;
    });

    const completed = lastWeekJobs.filter(j => j.status === "e_perfunduar").length;
    const offers = lastWeekJobs.filter(j => j.status === "oferte").length;
    
    let totalRevenue = 0;
    for (const job of lastWeekJobs) {
        if (job.status === "e_perfunduar") {
            const prices = (job.prices || {}) as Record<string, number>;
            for (const v of Object.values(prices)) totalRevenue += (v || 0);
        }
    }

    await storage.createNotification({
      type: "weekly_summary",
      title: `Përmbledhja Javore (${format(lastWeekStart, 'dd/MM')} - ${format(lastWeekEnd, 'dd/MM')})`,
      message: `Javën e kaluar janë krijuar ${lastWeekJobs.length} punë të reja. Prej tyre ${completed} janë përfunduar dhe ${offers} janë ende në ofertë. Totali i faturuar për punët e përfunduara: €${totalRevenue.toFixed(2)}.`,
      isRead: 0
    });
    log("Created weekly summary notification", "automations");
  } catch (err) {
    console.error("Weekly summary failed:", err);
  }
}

async function checkLowStock() {
  log("Running low stock tracking automation...", "automations");
  try {
    const lowStockItems = await storage.getLowStockItems();
    for (const item of lowStockItems) {
      const title = `Stok i Ulët: ${item.name}`;
      const message = `Artikulli "${item.name}" ka rënë në nivelin ${item.currentStock} ${item.unit}. (Minimumi: ${item.minStockLevel})`;

      const existingNotifs = await storage.getNotifications();
      const alreadyNotified = existingNotifs.some(n => 
        n.catalogItemId === item.id && 
        n.type === "low_stock" &&
        n.isRead === 0
      );

      if (!alreadyNotified) {
        await storage.createNotification({
          type: "low_stock",
          title,
          message,
          catalogItemId: item.id,
          isRead: 0
        });
        log(`Created low stock alert for item ${item.id}`, "automations");
      }
    }
  } catch (err) {
    console.error("Low stock check failed:", err);
  }
}

async function checkPendingLeaveRequests() {
  log("Running pending leave request tracking automation...", "automations");
  try {
    const pendingRequests = await storage.getPendingLeaveRequests();
    const now = new Date();
    
    for (const req of pendingRequests) {
      if (!req.createdAt) continue;
      const hoursSince = Math.floor((now.getTime() - new Date(req.createdAt).getTime()) / (1000 * 60 * 60));
      
      // Notify if pending for more than 48 hours and we haven't reminded recently
      if (hoursSince >= 48) {
        const worker = await storage.getWorker(req.workerId);
        const title = `Kujtesë: Kërkesë për Leje në Pritje`;
        const message = `Kërkesa për leje nga ${worker?.name || 'Punëtori'} (${req.type}) është në pritje prej ${Math.floor(hoursSince/24)} ditësh.`;

        const existingNotifs = await storage.getNotifications();
        const alreadyNotified = existingNotifs.some(n => 
          n.type === "leave_request_reminder" && 
          n.message.includes(worker?.name || '') &&
          n.isRead === 0
        );

        if (!alreadyNotified) {
          await storage.createNotification({
            type: "leave_request_reminder",
            title,
            message,
            isRead: 0
          });
          log(`Created leave request reminder for worker ${req.workerId}`, "automations");
        }
      }
    }
  } catch (err) {
    console.error("Pending leave check failed:", err);
  }
}

async function checkDormantClients() {
  log("Running dormant client tracking automation...", "automations");
  try {
    const clients = await storage.getClients();
    const jobs = await storage.getJobs();
    const now = new Date();
    const sixMonthsAgo = subDays(now, 180);

    for (const client of clients) {
      const clientJobs = jobs.filter(j => j.clientId === client.id);
      if (clientJobs.length === 0) continue;

      const latestJob = clientJobs.reduce((prev, curr) => {
        const prevDate = prev.updatedAt ? new Date(prev.updatedAt) : new Date(0);
        const currDate = curr.updatedAt ? new Date(curr.updatedAt) : new Date(0);
        return currDate > prevDate ? curr : prev;
      });

      const lastActivity = latestJob.updatedAt ? new Date(latestJob.updatedAt) : new Date(0);
      
      if (lastActivity < sixMonthsAgo) {
        const title = `Klient Joaktiv: ${client.name}`;
        const message = `Klienti "${client.name}" nuk ka pasur asnjë aktivitet që nga ${format(lastActivity, 'dd/MM/yyyy')} (mbi 6 muaj).`;

        const existingNotifs = await storage.getNotifications();
        const alreadyNotified = existingNotifs.some(n => 
          n.type === "dormant_client" && 
          n.message.includes(client.name) &&
          n.isRead === 0
        );

        if (!alreadyNotified) {
          await storage.createNotification({
            type: "dormant_client",
            title,
            message,
            isRead: 0
          });
          log(`Created dormant client alert for ${client.name}`, "automations");
        }
      }
    }
  } catch (err) {
    console.error("Dormant client check failed:", err);
  }
}

async function checkMargins() {
  log("Running margin protection automation...", "automations");
  try {
    const catalog = await storage.getCatalogItems();
    for (const item of catalog) {
      if (item.purchasePrice && item.salePrice && item.purchasePrice > 0) {
        const profit = item.salePrice - item.purchasePrice;
        const margin = (profit / item.salePrice) * 100;

        if (margin < 20) {
          const title = `Marzh i Ulët: ${item.name}`;
          const message = `Artikulli "${item.name}" ka një marzh fitimi prej vetëm ${margin.toFixed(1)}%. (Shitja: ${item.salePrice}€, Blerja: ${item.purchasePrice}€). Rekomandohet rishikimi i çmimit.`;

          const existingNotifs = await storage.getNotifications();
          const alreadyNotified = existingNotifs.some(n => 
            n.catalogItemId === item.id && 
            n.type === "low_margin" &&
            n.isRead === 0
          );

          if (!alreadyNotified) {
            await storage.createNotification({
              type: "low_margin",
              title,
              message,
              catalogItemId: item.id,
              isRead: 0
            });
            log(`Created low margin alert for item ${item.id}`, "automations");
          }
        }
      }
    }
  } catch (err) {
    console.error("Margin check failed:", err);
  }
}

async function checkMissingPrices() {
  if (!isMonday(new Date())) return;
  
  log("Running missing prices report automation...", "automations");
  try {
    const catalog = await storage.getCatalogItems();
    const missing = catalog.filter(item => !item.purchasePrice || !item.salePrice || item.purchasePrice === 0 || item.salePrice === 0);
    
    if (missing.length > 0) {
      const title = `Raport: Artikuj pa Çmime`;
      const message = `Ka ${missing.length} artikuj në katalog që nuk kanë të vendosur çmimin e blerjes ose të shitjes. Ju lutem plotësoni ato në menaxhimin e katalogut.`;

      await storage.createNotification({
        type: "missing_prices_report",
        title,
        message,
        isRead: 0
      });
      log("Created missing prices report notification", "automations");
    }
  } catch (err) {
    console.error("Missing prices check failed:", err);
  }
}

async function checkStockForecast() {
  log("Running stock demand forecast automation...", "automations");
  try {
    const jobs = await storage.getJobs();
    const catalog = await storage.getCatalogItems();
    const forecast: Record<string, number> = {};

    // Only look at pending/in-progress jobs
    const activeJobs = jobs.filter(j => (j.status === "oferte" || j.status === "ne_progres") && !j.isTemplate);

    for (const job of activeJobs) {
      // Helper to sum material from all categories
      const tables = ['table1Data', 'table2Data', 'cameraData', 'intercomData', 'alarmData', 'serviceData'];
      for (const tableKey of tables) {
        const data = (job as any)[tableKey];
        if (!data || typeof data !== 'object') continue;

        if (tableKey === 'table1Data') {
          // Table 1 is nested by room
          for (const rooms of Object.values(data)) {
            if (!rooms || typeof rooms !== 'object') continue;
            for (const [itemName, qty] of Object.entries(rooms as Record<string, number>)) {
              if (typeof qty === 'number') {
                forecast[itemName] = (forecast[itemName] || 0) + qty;
              }
            }
          }
        } else {
          for (const [itemName, qty] of Object.entries(data as Record<string, number>)) {
            if (typeof qty === 'number') {
              forecast[itemName] = (forecast[itemName] || 0) + qty;
            }
          }
        }
      }
    }

    for (const [name, needed] of Object.entries(forecast)) {
      if (needed <= 0) continue;
      const item = catalog.find(c => c.name === name);
      if (item) {
        const available = item.currentStock || 0;
        if (available < needed) {
          const shortage = needed - available;
          const title = `Parashikim Stoku: ${item.name}`;
          const message = `Për të plotësuar të gjitha ofertat dhe punët aktive, nevojiten edhe ${shortage} ${item.unit} shtesë të "${item.name}". (Nevojiten: ${needed}, Keni: ${available})`;

          const existingNotifs = await storage.getNotifications();
          const alreadyNotified = existingNotifs.some(n => 
            n.catalogItemId === item.id && 
            n.type === "stock_forecast_alert" &&
            n.isRead === 0 &&
            n.message.includes(needed.toString())
          );

          if (!alreadyNotified) {
            await storage.createNotification({
              type: "stock_forecast_alert",
              title,
              message,
              catalogItemId: item.id,
              isRead: 0
            });
            log(`Created stock forecast alert for item ${item.id}`, "automations");
          }
        }
      }
    }
  } catch (err) {
    console.error("Stock forecast failed:", err);
  }
}

async function sendMonthlyWorkerReport() {
  const now = new Date();
  // Run on the 1st of every month
  if (now.getDate() !== 1) return;

  log("Running monthly worker report automation...", "automations");
  try {
    const workers = await storage.getWorkers();
    const lastMonth = now.getMonth() === 0 ? 11 : now.getMonth() - 1;
    const year = now.getMonth() === 0 ? now.getFullYear() - 1 : now.getFullYear();
    const monthStr = `${year}-${(lastMonth + 1).toString().padStart(2, '0')}`;

    for (const worker of workers) {
      const attendances = await storage.getAttendances(worker.id, monthStr);
      const allJobs = await storage.getJobs();
      
      // Filter jobs where the worker might have been involved.
      // Note: jobs table doesn't have a direct 'workerId' per job, but we might have 'assignedTo' 
      // or similar in metadata. Assuming jobs created by userId or similar for now if available.
      // Re-checking schema... jobs has userId.
      const completedJobs = allJobs.filter(j => j.status === "e_perfunduar" && j.userId === worker.id);
      
      const totalOvertime = attendances.reduce((sum, a) => sum + (a.overtimeHours || 0), 0);
      const daysWorked = attendances.length;

      const title = `Raporti Mujor: ${worker.name} (${monthStr})`;
      const message = `Përmbledhja për ${worker.name}: ${daysWorked} ditë pune, ${totalOvertime} orë shtesë. ${completedJobs.length} punë të përfunduara këtë muaj.`;

      await storage.createNotification({
        type: "worker_monthly_report",
        title,
        message,
        isRead: 0
      });
      log(`Created monthly report for worker ${worker.id}`, "automations");
    }
  } catch (err) {
    console.error("Monthly worker report failed:", err);
  }
}

async function backfillClients() {
  log("Running client backfill automation...", "automations");
  try {
    const jobs = await storage.getJobs();
    for (const job of jobs) {
      if (!job.clientName) continue;
      
      const existingClient = await storage.getClientByName(job.clientName);
      
      if (!existingClient) {
        log(`Creating client for existing job: ${job.clientName}`, "automations");
        await storage.createClient({
          name: job.clientName,
          phone: job.clientPhone || "",
          address: job.clientAddress || "",
          notes: `Created automatically from existing job ${job.invoiceNumber || job.id}`
        });
      }
    }
    log("Client backfill complete.", "automations");
  } catch (err) {
    console.error("Client backfill failed:", err);
  }
}

export async function syncExpenseToCatalog(description: string, amount: number, category: string) {
  if (category !== "material") return;
  
  log(`Checking catalog sync for expense: ${description}`, "automations");
  try {
    const catalog = await storage.getCatalogItems();
    // Try to find a catalog item that matches the description (exact match)
    // In a more advanced version, we could use fuzzy matching or a dropdown in the UI.
    const match = catalog.find(item => item.name.toLowerCase() === description.toLowerCase());
    
    if (match) {
      const oldPrice = match.purchasePrice || 0;
      // Note: amount is total for the expense. If it's a bulk purchase, we might need qty.
      // But simple expense table doesn't have qty. 
      // Assuming for now it's a per-unit price or we just alert if it changed.
      // For now, let's just create a notification if it's different.
      if (Math.abs(oldPrice - amount) > 0.01) {
        await storage.createNotification({
          type: "price_change",
          title: `Ndryshim Çmimi: ${match.name}`,
          message: `Çmimi i fundit i blerjes për "${match.name}" nga shpenzimet është ${amount.toFixed(2)}€ (Katalogu: ${oldPrice.toFixed(2)}€). Klikoni për ta përditësuar katalogun.`,
          catalogItemId: match.id,
          isRead: 0
        });
        log(`Price mismatch detected for ${match.name}: ${oldPrice} -> ${amount}`, "automations");
      }
    }
  } catch (err) {
    console.error("Expense to catalog sync failed:", err);
  }
}

export async function startAutomations() {
  try {
    log("Starting background automations...", "automations");
    
    // Initial run
    await backfillClients();
    await checkDebt();
    await checkWarranties();
    await sendWeeklySummary();
    await checkLowStock();
    await checkPendingLeaveRequests();
    await checkDormantClients();
    await sendMonthlyWorkerReport();
    await checkMargins();
    await checkMissingPrices();
    await checkStockForecast();

    // Schedule periodic checks (every 6 hours)
    setInterval(async () => {
      try {
        await checkDebt();
        await checkWarranties();
        await sendWeeklySummary();
        await checkLowStock();
        await checkPendingLeaveRequests();
        await checkDormantClients();
        await sendMonthlyWorkerReport();
        await checkMargins();
        await checkMissingPrices();
        await checkStockForecast();
      } catch (innerErr) {
        console.error("Scheduled automation failed:", innerErr);
      }
    }, 6 * 60 * 60 * 1000);
  } catch (err) {
    console.error("Background automations startup failed:", err);
  }
}
