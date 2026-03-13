import type { Express, Request, Response, NextFunction } from "express";
import type { Server } from "http";
import crypto from "crypto";
import { storage } from "./storage";
import { api } from "../shared/routes";
import { z } from "zod";
import { CATEGORIES, JOB_CATEGORIES, JOB_CATEGORY_PREFIXES, type JobCategory } from "../shared/schema";
import bcrypt from "bcryptjs";
import * as otplib from "otplib";
import QRCode from "qrcode";
import { syncExpenseToCatalog } from "./automations";

async function generateInvoiceNumber(category: string): Promise<string> {
  const prefix = JOB_CATEGORY_PREFIXES[category as JobCategory] || "ELK";
  const allJobs = await storage.getJobs();
  let maxNum = 0;
  for (const job of allJobs) {
    const inv = job.invoiceNumber || "";
    if (inv.startsWith(prefix + "-")) {
      const num = parseInt(inv.substring(prefix.length + 1));
      if (!isNaN(num) && num > maxNum) maxNum = num;
    }
  }
  const next = maxNum + 1;
  return `${prefix}-${String(next).padStart(3, "0")}`;
}

function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (req.session?.userId) {
    return next();
  }
  return res.status(401).json({ message: "Duhet të identifikoheni" });
}

function requireAdmin(req: Request, res: Response, next: NextFunction) {
  if (req.session?.role === "admin") {
    return next();
  }
  return res.status(403).json({ message: "Vetëm admini ka qasje" });
}

function getJobMaterialTotals(job: any) {
  const allItemNames = new Set<string>();
  const quantities: Record<string, number> = {};

  const t1 = (job.table1Data || {}) as Record<string, Record<string, number>>;
  for (const [itemName, rooms] of Object.entries(t1)) {
    allItemNames.add(itemName);
    let total = 0;
    for (const qty of Object.values(rooms as any)) total += qty as number;
    quantities[itemName] = (quantities[itemName] || 0) + total;
  }

  const simpleFields = ['table2Data', 'cameraData', 'intercomData', 'alarmData', 'serviceData'] as const;
  for (const f of simpleFields) {
    const d = (job[f] || {}) as Record<string, number>;
    for (const [itemName, qty] of Object.entries(d)) {
      allItemNames.add(itemName);
      quantities[itemName] = (quantities[itemName] || 0) + (qty as number);
    }
  }

  return { allItemNames, quantities };
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  // ==================== DEBUG / RESET ====================
  // TEMPORARY: Reset admin password and show credentials
  app.get('/api/resetopassin03', async (req, res) => {
    try {
      const passwordHash = await bcrypt.hash("Endrit123$", 10);
      const admin = await storage.getUserByUsername("admin");
      
      if (!admin) {
        await storage.createUser({
          username: "admin",
          passwordHash,
          fullName: "Administrator",
          role: "admin",
          isActive: 1,
          assignedCategories: []
        });
      } else {
        await storage.updateUser(admin.id, { passwordHash, isActive: 1 });
      }
      
      res.send(`
        <html>
          <body style="font-family: sans-serif; padding: 50px; background: #f0f2f5;">
            <div style="background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); max-width: 400px; margin: auto;">
              <h2 style="color: #1a73e8;">Sistemi u rregullua!</h2>
              <p>Kredencialet tani janë vendosur detyrueshëm:</p>
              <p><strong>Përdoruesi:</strong> admin</p>
              <p><strong>Fjalëkalimi:</strong> Endrit123$</p>
              <hr>
              <a href="/login" style="display: block; text-align: center; background: #1a73e8; color: white; padding: 10px; border-radius: 4px; text-decoration: none; margin-top: 20px;">Shko te Faqja Hyrëse</a>
            </div>
          </body>
        </html>
      `);
    } catch (err) {
      console.error('Reset route error:', err);
      res.status(500).send("Gabim gjatë rregullimit.");
    }
  });

  // ==================== AUTH ====================

  app.post('/api/auth/login', async (req, res) => {
    try {
      const { username, password, twoFactorToken } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ message: "Emri dhe fjalëkalimi janë të detyrueshëm" });
      }
      
      const user = await storage.getUserByUsername(username);
      
      if (!user || !user.isActive) {
        return res.status(401).json({ message: "Emri ose fjalëkalimi nuk është i saktë" });
      }
      
      const valid = await bcrypt.compare(password, user.passwordHash);
      
      if (!valid) {
        return res.status(401).json({ message: "Emri ose fjalëkalimi nuk është i saktë" });
      }
      
      if (user.twoFactorEnabled && user.twoFactorSecret) {
        if (!twoFactorToken) {
          return res.status(200).json({ requiresTwoFactor: true, userId: user.id });
        }
        const isValid2FA = (otplib as any).authenticator.verify({ token: twoFactorToken, secret: user.twoFactorSecret });
        if (!isValid2FA) {
          return res.status(400).json({ message: "Kodi 2FA nuk është i saktë" });
        }
      }
      
      if (!req.session) {
        throw new Error("Session middleware not initialized");
      }

      req.session.userId = user.id;
      req.session.role = user.role;
      req.session.username = user.username;
      req.session.fullName = user.fullName;
      
      const { passwordHash, twoFactorSecret, ...safeUser } = user;
      res.json(safeUser);
    } catch (err: any) {
      console.error('Login error:', err);
      res.status(500).json({ 
        message: "Gabim në server"
      });
    }
  });

  app.post('/api/auth/logout', (req, res) => {
    req.session.destroy(() => {
      res.json({ message: "U çkyçët me sukses" });
    });
  });

  app.get('/api/auth/me', async (req, res) => {
    if (!req.session?.userId) {
      return res.status(401).json({ message: "Nuk jeni të identifikuar" });
    }
    const user = await storage.getUser(req.session.userId);
    if (!user) {
      return res.status(401).json({ message: "Përdoruesi nuk u gjet" });
    }
    const { passwordHash, twoFactorSecret, ...safeUser } = user;
    res.json(safeUser);
  });

  // --- PROFILE UPDATE (self-service) ---
  app.patch('/api/auth/profile', requireAuth, async (req, res) => {
    try {
      const userId = req.session!.userId!;
      const { fullName, email, phone } = req.body;
      const updates: any = {};
      if (fullName && typeof fullName === "string" && fullName.trim()) updates.fullName = fullName.trim();
      if (email !== undefined) updates.email = email || null;
      if (phone !== undefined) updates.phone = phone || null;
      if (Object.keys(updates).length === 0) {
        return res.status(400).json({ message: "Asnjë ndryshim" });
      }
      const updated = await storage.updateUser(userId, updates);
      if (updates.fullName) {
        req.session.fullName = updates.fullName;
      }
      const { passwordHash, twoFactorSecret, ...safeUser } = updated;
      res.json(safeUser);
    } catch (err) {
      console.error('Profile update error:', err);
      res.status(500).json({ message: "Gabim në përditësim" });
    }
  });

  // --- CHANGE PASSWORD ---
  app.post('/api/auth/change-password', requireAuth, async (req, res) => {
    try {
      const userId = req.session!.userId!;
      const { currentPassword, newPassword } = req.body;
      if (!currentPassword || !newPassword) {
        return res.status(400).json({ message: "Plotësoni të dyja fushat" });
      }
      if (newPassword.length < 6) {
        return res.status(400).json({ message: "Fjalëkalimi duhet të ketë së paku 6 karaktere" });
      }
      const user = await storage.getUser(userId);
      if (!user) return res.status(404).json({ message: "Përdoruesi nuk u gjet" });
      const valid = await bcrypt.compare(currentPassword, user.passwordHash);
      if (!valid) {
        return res.status(400).json({ message: "Fjalëkalimi aktual nuk është i saktë" });
      }
      const newHash = await bcrypt.hash(newPassword, 10);
      await storage.updateUser(userId, { passwordHash: newHash });
      res.json({ message: "Fjalëkalimi u ndryshua me sukses" });
    } catch (err) {
      console.error('Change password error:', err);
      res.status(500).json({ message: "Gabim në ndryshimin e fjalëkalimit" });
    }
  });

  // --- 2FA SETUP (generate secret + QR) ---
  app.post('/api/auth/2fa/setup', requireAuth, async (req, res) => {
    try {
      const userId = req.session!.userId!;
      const user = await storage.getUser(userId);
      if (!user) return res.status(404).json({ message: "Përdoruesi nuk u gjet" });
      const secret = otplib.generateSecret();
      await storage.updateUser(userId, { twoFactorSecret: secret } as any);
      const otpauthUrl = (otplib as any).authenticator.keyuri(user.username, "Elektronova", secret);
      const qrCodeDataUrl = await QRCode.toDataURL(otpauthUrl);
      res.json({ secret, qrCode: qrCodeDataUrl, otpauthUrl });
    } catch (err) {
      console.error('2FA setup error:', err);
      res.status(500).json({ message: "Gabim në aktivizimin e 2FA" });
    }
  });

  // --- 2FA VERIFY & ENABLE ---
  app.post('/api/auth/2fa/verify', requireAuth, async (req, res) => {
    try {
      const userId = req.session!.userId!;
      const { token } = req.body;
      if (!token) return res.status(400).json({ message: "Vendosni kodin" });
      const user = await storage.getUser(userId);
      if (!user || !user.twoFactorSecret) {
        return res.status(400).json({ message: "2FA nuk është konfiguruar" });
      }
      const isValid = (otplib as any).authenticator.verify({ token, secret: user.twoFactorSecret });
      if (!isValid) {
        return res.status(400).json({ message: "Kodi nuk është i saktë" });
      }
      await storage.updateUser(userId, { twoFactorEnabled: 1 } as any);
      res.json({ message: "2FA u aktivizua me sukses" });
    } catch (err) {
      console.error('2FA verify error:', err);
      res.status(500).json({ message: "Gabim në verifikim" });
    }
  });

  // --- 2FA DISABLE ---
  app.post('/api/auth/2fa/disable', requireAuth, async (req, res) => {
    try {
      const userId = req.session!.userId!;
      const { password } = req.body;
      if (!password) return res.status(400).json({ message: "Vendosni fjalëkalimin" });
      const user = await storage.getUser(userId);
      if (!user) return res.status(404).json({ message: "Përdoruesi nuk u gjet" });
      const valid = await bcrypt.compare(password, user.passwordHash);
      if (!valid) return res.status(400).json({ message: "Fjalëkalimi nuk është i saktë" });
      await storage.updateUser(userId, { twoFactorSecret: null, twoFactorEnabled: 0 } as any);
      res.json({ message: "2FA u çaktivizua me sukses" });
    } catch (err) {
      console.error('2FA disable error:', err);
      res.status(500).json({ message: "Gabim në çaktivizim" });
    }
  });

  // --- 2FA LOGIN VERIFY (called after login if 2FA enabled) ---
  app.post('/api/auth/2fa/login-verify', async (req, res) => {
    try {
      const { userId, token } = req.body;
      if (!userId || !token) return res.status(400).json({ message: "Vendosni kodin" });
      const user = await storage.getUser(userId);
      if (!user || !user.twoFactorSecret || !user.twoFactorEnabled) {
        return res.status(400).json({ message: "2FA nuk është aktive" });
      }
      const isValid = (otplib as any).authenticator.verify({ token, secret: user.twoFactorSecret });
      if (!isValid) {
        return res.status(400).json({ message: "Kodi 2FA nuk është i saktë" });
      }
      req.session.userId = user.id;
      req.session.role = user.role;
      req.session.username = user.username;
      req.session.fullName = user.fullName;
      const { passwordHash, twoFactorSecret, ...safeUser } = user;
      res.json(safeUser);
    } catch (err) {
      console.error('2FA login verify error:', err);
      res.status(500).json({ message: "Gabim në verifikimin 2FA" });
    }
  });

  app.post('/api/auth/register', requireAuth, requireAdmin, async (req, res) => {
    try {
      const { username, password, fullName, role, phone, email, assignedCategories } = req.body;
      if (!username || !password || !fullName) {
        return res.status(400).json({ message: "Plotësoni fushat e detyrueshme" });
      }
      const existing = await storage.getUserByUsername(username);
      if (existing) {
        return res.status(400).json({ message: "Ky emër përdoruesi ekziston" });
      }
      const validRole = "technician";
      const validCategories = Array.isArray(assignedCategories)
        ? assignedCategories.filter((c: string) => JOB_CATEGORIES.includes(c as any))
        : [];
      const passwordHash = await bcrypt.hash(password, 10);
      const user = await storage.createUser({
        username,
        passwordHash,
        fullName,
        role: validRole,
        phone: phone || null,
        email: email || null,
        isActive: 1,
        assignedCategories: validCategories,
      });
      const { passwordHash: _, ...safeUser } = user;
      res.status(201).json(safeUser);
    } catch (err) {
      console.error('Register error:', err);
      res.status(500).json({ message: "Gabim në regjistrim" });
    }
  });

  // --- USERS MANAGEMENT (admin only) ---
  app.get('/api/users', requireAuth, requireAdmin, async (_req, res) => {
    const allUsers = await storage.getUsers();
    const safe = allUsers.map(({ passwordHash, twoFactorSecret, ...u }) => u);
    res.json(safe);
  });

  app.put('/api/users/:id', requireAuth, requireAdmin, async (req, res) => {
    const id = parseInt(req.params.id as string);
    if (isNaN(id)) return res.status(400).json({ message: "ID e pavlefshme" });
    const existingUser = await storage.getUser(id);
    if (!existingUser) return res.status(404).json({ message: "Përdoruesi nuk u gjet" });
    if (existingUser.role === "admin") return res.status(403).json({ message: "Nuk mund të ndryshoni admin-in" });
    const updates: any = {};
    if (req.body.fullName) updates.fullName = req.body.fullName;
    if (req.body.phone !== undefined) updates.phone = req.body.phone;
    if (req.body.email !== undefined) updates.email = req.body.email;
    if (req.body.isActive !== undefined) updates.isActive = req.body.isActive;
    if (req.body.assignedCategories !== undefined) {
      updates.assignedCategories = Array.isArray(req.body.assignedCategories)
        ? req.body.assignedCategories.filter((c: string) => JOB_CATEGORIES.includes(c as any))
        : [];
    }
    if (req.body.password) {
      updates.passwordHash = await bcrypt.hash(req.body.password, 10);
    }
    const updated = await storage.updateUser(id, updates);
    const { passwordHash, twoFactorSecret, ...safeUser } = updated;
    res.json(safeUser);
  });

  // ==================== JOBS ====================

  async function syncClientForJob(jobId: number, name: string, phone?: string | null, address?: string | null) {
    if (!name || !name.trim()) return;
    try {
      const client = await storage.getClientByName(name);
      if (client) {
        const updates: any = {};
        if (phone !== undefined && phone !== client.phone) updates.phone = phone;
        if (address !== undefined && address !== client.address) updates.address = address;
        if (Object.keys(updates).length > 0) {
          await storage.updateClient(client.id, updates);
        }
        await storage.updateJob(jobId, { clientId: client.id });
      } else {
        const newClient = await storage.createClient({
          name: name,
          phone: phone || null,
          address: address || null,
          email: null,
          notes: "Krijuar automatikisht nga puna #" + jobId,
        });
        await storage.updateJob(jobId, { clientId: newClient.id });
      }
    } catch (err) {
      console.error(`syncClientForJob (#${jobId}) error:`, err);
    }
  }

  app.get(api.jobs.list.path, requireAuth, async (req, res) => {
    const search = req.query.search as string | undefined;
    let jobsList = await storage.getJobs(search);
    if (req.session?.role !== "admin" && req.session?.userId) {
      jobsList = jobsList.filter(j => j.userId === req.session!.userId);
    }
    res.json(jobsList);
  });

  app.get(api.jobs.get.path, async (req, res) => {
    const id = parseInt(req.params.id as string);
    if (isNaN(id)) return res.status(400).json({ message: "Invalid ID" });
    const job = await storage.getJob(id);
    if (!job) return res.status(404).json({ message: "Job not found" });
    res.json(job);
  });

  app.post(api.jobs.create.path, requireAuth, async (req, res) => {
    try {
      const input = api.jobs.create.input.parse(req.body);
      if (req.session?.role !== "admin" && req.session?.userId) {
        const creator = await storage.getUser(req.session.userId);
        if (creator?.assignedCategories && creator.assignedCategories.length > 0) {
          if (!creator.assignedCategories.includes(input.category || "electric")) {
            return res.status(403).json({ message: "Nuk keni qasje në këtë kategori" });
          }
        }
      }
      if (!input.invoiceNumber) {
        input.invoiceNumber = await generateInvoiceNumber(input.category || "electric");
      }
      if (req.session?.userId) {
        input.userId = req.session.userId;
      }
      const job = await storage.createJob(input);

      // Auto-create or link client
      await syncClientForJob(job.id, input.clientName, input.clientPhone, input.clientAddress);

      if (input.status === "oferte") {
        await storage.createJobSnapshot({
          jobId: job.id,
          snapshotType: "quote",
          materialData: ({
            table1Data: input.table1Data,
            table2Data: input.table2Data,
            cameraData: input.cameraData,
            intercomData: input.intercomData,
            alarmData: input.alarmData,
            serviceData: input.serviceData,
          }) as any,
          prices: (input.prices || {}) as any,
          purchasePrices: (input.purchasePrices || {}) as any,
          totalSale: 0,
          totalPurchase: 0,
        });
      }

      await storage.createNotification({
        type: "new_job",
        title: "Punë e Re",
        message: `Punë e re ${job.invoiceNumber || '#' + job.id} u krijua për ${input.clientName} (${({ electric: 'Elektrike', camera: 'Kamera', alarm: 'Alarm', intercom: 'Interfon' } as Record<string, string>)[input.category || 'electric'] || input.category})`,
        jobId: job.id,
        catalogItemId: null,
        isRead: 0,
        userId: null,
      });

      res.status(201).json(job);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message, field: err.errors[0].path.join('.') });
      }
      throw err;
    }
  });

  app.put(api.jobs.update.path, async (req, res) => {
    const id = parseInt(req.params.id as string);
    if (isNaN(id)) return res.status(400).json({ message: "Invalid ID" });
    try {
      const existing = await storage.getJob(id);
      if (!existing) return res.status(404).json({ message: "Job not found" });
      const input = api.jobs.update.input.parse(req.body);

      // Auto-sync client if data changed
      const nameChanged = input.clientName && input.clientName !== existing.clientName;
      const phoneChanged = input.clientPhone !== undefined && input.clientPhone !== existing.clientPhone;
      const addressChanged = input.clientAddress !== undefined && input.clientAddress !== existing.clientAddress;

      if (nameChanged || phoneChanged || addressChanged) {
        await syncClientForJob(id, input.clientName || existing.clientName, 
          input.clientPhone !== undefined ? input.clientPhone : existing.clientPhone,
          input.clientAddress !== undefined ? input.clientAddress : existing.clientAddress
        );
      }

      const oldStatus = existing.status;
      const newStatus = input.status;

      if (oldStatus === "oferte" && newStatus && newStatus !== "oferte") {
        const snapshots = await storage.getJobSnapshots(id);
        const hasQuote = snapshots.some(s => s.snapshotType === "quote");
        if (!hasQuote) {
          await storage.createJobSnapshot({
            jobId: id,
            snapshotType: "quote",
            materialData: ({
              table1Data: existing.table1Data,
              table2Data: existing.table2Data,
              cameraData: existing.cameraData,
              intercomData: existing.intercomData,
              alarmData: existing.alarmData,
              serviceData: existing.serviceData,
            }) as any,
            prices: (existing.prices as any) || {},
            purchasePrices: (existing.purchasePrices as any) || {},
            totalSale: 0,
            totalPurchase: 0,
          });
        }
      }

      if (newStatus === "e_perfunduar" && oldStatus !== "e_perfunduar") {
        if (!input.completedDate) {
          input.completedDate = new Date().toISOString().split('T')[0];
        }
        const finalData = { ...existing, ...input };
        await storage.createJobSnapshot({
          jobId: id,
          snapshotType: "actual",
          materialData: ({
            table1Data: finalData.table1Data,
            table2Data: finalData.table2Data,
            cameraData: finalData.cameraData,
            intercomData: finalData.intercomData,
            alarmData: finalData.alarmData,
            serviceData: finalData.serviceData,
          }) as any,
          prices: (finalData.prices as any) || {},
          purchasePrices: (finalData.purchasePrices as any) || {},
          totalSale: 0,
          totalPurchase: 0,
        });

        try {
          const { quantities } = getJobMaterialTotals(finalData);
          const catalog = await storage.getCatalogItems();
          const catalogMap = new Map(catalog.map(c => [c.name, c]));

          for (const [itemName, qty] of Object.entries(quantities)) {
            if (qty <= 0) continue;
            const catItem = catalogMap.get(itemName);
            if (catItem && (catItem.currentStock || 0) > 0) {
              const previousStock = catItem.currentStock || 0;
              const newStock = Math.max(0, previousStock - qty);
              await storage.updateCatalogStock(catItem.id, newStock);
              await storage.createStockEntry({
                catalogItemId: catItem.id,
                itemName: catItem.name,
                entryType: "out",
                quantity: qty,
                previousStock,
                newStock,
                jobId: id,
                notes: `Zbritje automatike - Pune #${id}`,
                createdBy: req.session?.fullName || "System",
              });

              if (catItem.minStockLevel && newStock <= catItem.minStockLevel) {
                await storage.createNotification({
                  type: "low_stock",
                  title: "Stoku i ulët",
                  message: `${catItem.name}: ${newStock} ${catItem.unit} mbetur (min: ${catItem.minStockLevel})`,
                  catalogItemId: catItem.id,
                  jobId: null,
                  isRead: 0,
                  userId: null,
                });
              }
            }
          }
        } catch (stockErr) {
          console.error('Stock deduction error:', stockErr);
        }

        await storage.createNotification({
          type: "job_completed",
          title: "Punë e përfunduar",
          message: `Puna ${existing.invoiceNumber || '#' + id} për ${existing.clientName} u përfundua`,
          jobId: id,
          catalogItemId: null,
          isRead: 0,
          userId: null,
        });

        try {
          const expFinalData = { ...existing, ...input };
          const { quantities: expQuantities } = getJobMaterialTotals(expFinalData);
          const expPurchasePrices = (expFinalData.purchasePrices || {}) as Record<string, number>;
          let totalPurchase = 0;
          for (const [name, qty] of Object.entries(expQuantities)) {
            totalPurchase += (expPurchasePrices[name] || 0) * qty;
          }
          if (totalPurchase > 0) {
            await storage.createExpense({
              description: `Materiale - ${existing.clientName} (${existing.invoiceNumber || '#' + id})`,
              amount: totalPurchase,
              category: "material",
              date: new Date().toISOString().split('T')[0],
              jobId: id,
              supplierId: existing.supplierId || null,
              notes: `Shpenzim automatik nga përfundimi i punës`,
              createdBy: req.session?.fullName || "System",
            });
          }
        } catch (expErr) {
          console.error('Auto expense creation error:', expErr);
        }
      }

      if (input.roomProgressData && existing.category === "electric") {
        if (existing.status === "oferte") {
          const rpd = input.roomProgressData as Record<string, Record<string, boolean>>;
          const hasAnyProgress = Object.values(rpd).some(room => Object.values(room).some(v => v === true));
          if (hasAnyProgress) {
            await storage.updateJob(id, { status: "ne_progres" } as any);
            await storage.createNotification({
              type: "auto_status_change",
              title: "Statusi ndryshoi automatikisht",
              message: `Puna ${existing.invoiceNumber || '#' + id} për ${existing.clientName} kaloi nga "Ofertë" në "Në Progres" sepse progresi filloi.`,
              jobId: id,
              catalogItemId: null,
              isRead: 0,
              userId: null,
            });
          }
        }
        const rpd = input.roomProgressData as Record<string, Record<string, boolean>>;
        const t1 = (input.table1Data || existing.table1Data || {}) as Record<string, Record<string, number>>;
        const ROOM_GENERAL_TASKS = ["Kabllot e ndertuara", "Gypat e vendosura", "Shtekat e hapura"];

        const allRooms = new Set<string>();
        for (const rooms of Object.values(t1)) {
          for (const [room, qty] of Object.entries(rooms as Record<string, number>)) {
            if (qty > 0) allRooms.add(room);
          }
        }

        const roomArr = Array.from(allRooms);
        if (roomArr.length > 0) {
          let totalTasks = 0;
          let totalDone = 0;
          for (const room of roomArr) {
            for (const [itemName, rooms] of Object.entries(t1)) {
              if ((rooms as Record<string, number>)[room] > 0) {
                totalTasks++;
                if (rpd[room]?.[itemName]) totalDone++;
              }
            }
            for (const task of ROOM_GENERAL_TASKS) {
              totalTasks++;
              if (rpd[room]?.[task]) totalDone++;
            }
          }

          if (totalTasks > 0 && totalDone === totalTasks) {
            const oldRpd = (existing.roomProgressData || {}) as Record<string, Record<string, boolean>>;
            let oldTotalDone = 0;
            for (const room of roomArr) {
              for (const [itemName, rooms] of Object.entries(t1)) {
                if ((rooms as Record<string, number>)[room] > 0 && oldRpd[room]?.[itemName]) oldTotalDone++;
              }
              for (const task of ROOM_GENERAL_TASKS) {
                if (oldRpd[room]?.[task]) oldTotalDone++;
              }
            }
            if (oldTotalDone < totalTasks) {
              await storage.createNotification({
                type: "progress_complete",
                title: "Progresi 100% - Gati për përfundim",
                message: `Puna ${existing.invoiceNumber || '#' + id} për ${existing.clientName} ka arritur 100%. Ndryshoni statusin në "E Përfunduar".`,
                jobId: id,
                catalogItemId: null,
                isRead: 0,
                userId: null,
              });
            }
          }
        }
      }

      const updated = await storage.updateJob(id, input);
      res.json(updated);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message, field: err.errors[0].path.join('.') });
      }
      throw err;
    }
  });

  app.delete(api.jobs.delete.path, async (req, res) => {
    const id = parseInt(req.params.id as string);
    if (isNaN(id)) return res.status(400).json({ message: "Invalid ID" });
    const existing = await storage.getJob(id);
    if (!existing) return res.status(404).json({ message: "Job not found" });
    await storage.deleteJob(id);
    res.status(204).send();
  });

  app.get('/api/jobs/conflicts', requireAuth, async (req, res) => {
    try {
      const date = req.query.date as string;
      const excludeId = req.query.excludeId ? parseInt(req.query.excludeId as string) : null;
      if (!date) return res.json([]);
      const allJobs = await storage.getJobs();
      const conflicts = allJobs.filter(j => {
        if (j.isTemplate === 1) return false;
        if (j.status === "e_perfunduar") return false;
        if (excludeId && j.id === excludeId) return false;
        return j.workDate === date;
      }).map(j => ({
        id: j.id,
        invoiceNumber: j.invoiceNumber,
        clientName: j.clientName,
        workType: j.workType,
        category: j.category,
        status: j.status,
      }));
      res.json(conflicts);
    } catch (err) {
      res.status(500).json({ message: "Gabim" });
    }
  });

  // --- DUPLICATE JOB ---
  app.post('/api/jobs/:id/duplicate', async (req, res) => {
    const id = parseInt(req.params.id as string);
    if (isNaN(id)) return res.status(400).json({ message: "Invalid ID" });
    const existing = await storage.getJob(id);
    if (!existing) return res.status(404).json({ message: "Job not found" });

    const category = existing.category || "electric";
    const invoiceNumber = await generateInvoiceNumber(category);

    const duplicated = await storage.createJob({
      invoiceNumber,
      clientName: existing.clientName + " (Kopje)",
      clientPhone: existing.clientPhone || undefined,
      clientAddress: existing.clientAddress,
      workDate: new Date().toISOString().split('T')[0],
      workType: existing.workType,
      category: category as any,
      status: "oferte",
      notes: existing.notes || undefined,
      discountType: (existing.discountType as any) || "percent",
      discountValue: existing.discountValue || 0,
      table1Data: (existing.table1Data as any) || {},
      table2Data: (existing.table2Data as any) || {},
      cameraData: (existing.cameraData as any) || {},
      intercomData: (existing.intercomData as any) || {},
      alarmData: (existing.alarmData as any) || {},
      serviceData: (existing.serviceData as any) || {},
      prices: (existing.prices as any) || {},
      purchasePrices: (existing.purchasePrices as any) || {},
      checklistData: {},
      isTemplate: 0,
      userId: req.session?.userId || null,
      clientId: existing.clientId || null,
    } as any);
    res.status(201).json(duplicated);
  });

  // --- SAVE TEMPLATE ---
  app.post('/api/jobs/:id/save-template', async (req, res) => {
    const id = parseInt(req.params.id as string);
    if (isNaN(id)) return res.status(400).json({ message: "Invalid ID" });
    const existing = await storage.getJob(id);
    if (!existing) return res.status(404).json({ message: "Job not found" });
    const updated = await storage.updateJob(id, { isTemplate: 1 });
    res.json(updated);
  });

  // --- GET TEMPLATES ---
  app.get('/api/templates', async (_req, res) => {
    const templates = await storage.getTemplates();
    res.json(templates);
  });

  // --- USE TEMPLATE ---
  app.post('/api/templates/:id/use', async (req, res) => {
    const id = parseInt(req.params.id as string);
    if (isNaN(id)) return res.status(400).json({ message: "Invalid ID" });
    const template = await storage.getJob(id);
    if (!template) return res.status(404).json({ message: "Template not found" });

    const category = template.category || "electric";
    const invoiceNumber = await generateInvoiceNumber(category);

    const newJob = await storage.createJob({
      invoiceNumber,
      clientName: "",
      clientPhone: undefined,
      clientAddress: "",
      workDate: new Date().toISOString().split('T')[0],
      workType: template.workType,
      category: category as any,
      status: "oferte",
      notes: template.notes || undefined,
      isTemplate: 0,
      discountType: (template.discountType as any) || "percent",
      discountValue: template.discountValue || 0,
      table1Data: (template.table1Data as any) || {},
      table2Data: (template.table2Data as any) || {},
      cameraData: (template.cameraData as any) || {},
      intercomData: (template.intercomData as any) || {},
      alarmData: (template.alarmData as any) || {},
      serviceData: (template.serviceData as any) || {},
      prices: (template.prices as any) || {},
      purchasePrices: (template.purchasePrices as any) || {},
      checklistData: {},
      userId: req.session?.userId || null,
    } as any);
    res.status(201).json(newJob);
  });

  // ==================== CATALOG ====================

  app.get(api.catalog.list.path, async (req, res) => {
    let items = await storage.getCatalogItems();
    if (req.session?.role !== "admin" && req.session?.userId) {
      const user = await storage.getUser(req.session.userId);
      if (user?.assignedCategories && user.assignedCategories.length > 0) {
        const categoryMap: Record<string, string[]> = {
          "electric": ["Pajisje elektrike", "Kabllo & Gypa", "Punë/Shërbime"],
          "camera": ["Kamera", "Punë/Shërbime"],
          "alarm": ["Alarm", "Punë/Shërbime"],
          "intercom": ["Interfon", "Punë/Shërbime"],
        };
        const allowedCatalogCategories = new Set<string>();
        for (const cat of user.assignedCategories) {
          const mapped = categoryMap[cat] || [];
          mapped.forEach(c => allowedCatalogCategories.add(c));
        }
        items = items.filter(item => allowedCatalogCategories.has(item.category));
      }
    }
    res.json(items);
  });

  app.post(api.catalog.create.path, async (req, res) => {
    try {
      const input = api.catalog.create.input.parse(req.body);
      const item = await storage.createCatalogItem(input);
      res.status(201).json(item);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message, field: err.errors[0].path.join('.') });
      }
      throw err;
    }
  });

  app.put(api.catalog.update.path, async (req, res) => {
    const id = parseInt(req.params.id as string);
    if (isNaN(id)) return res.status(400).json({ message: "Invalid ID" });
    const existing = await storage.getCatalogItem(id);
    if (!existing) return res.status(404).json({ message: "Item not found" });
    try {
      const input = api.catalog.update.input.parse(req.body);

      const oldPurchase = existing.purchasePrice || 0;
      const oldSale = existing.salePrice || 0;
      const newPurchase = input.purchasePrice ?? oldPurchase;
      const newSale = input.salePrice ?? oldSale;

      if (oldPurchase !== newPurchase || oldSale !== newSale) {
        await storage.createPriceHistory({
          catalogItemId: id,
          itemName: existing.name,
          oldPurchasePrice: oldPurchase,
          newPurchasePrice: newPurchase,
          oldSalePrice: oldSale,
          newSalePrice: newSale,
          changedBy: req.session?.fullName || "Admin",
        });

        await storage.createNotification({
          type: "price_change",
          title: "Ndryshim çmimi",
          message: `${existing.name}: Shitje ${oldSale}€ → ${newSale}€, Blerje ${oldPurchase}€ → ${newPurchase}€`,
          catalogItemId: id,
          jobId: null,
          isRead: 0,
          userId: null,
        });
      }

      const updated = await storage.updateCatalogItem(id, input);

      // Auto-update prices in open jobs
      try {
        const allJobs = await storage.getJobs();
        const openJobs = allJobs.filter(j => j.status !== 'e_perfunduar' && j.isTemplate !== 1);
        let autoUpdated = 0;

        for (const job of openJobs) {
          const allData = [
            ...(Object.keys((job.table1Data || {}) as Record<string, any>)),
            ...(Object.keys((job.table2Data || {}) as Record<string, any>)),
            ...(Object.keys((job.cameraData || {}) as Record<string, any>)),
            ...(Object.keys((job.intercomData || {}) as Record<string, any>)),
            ...(Object.keys((job.alarmData || {}) as Record<string, any>)),
            ...(Object.keys((job.serviceData || {}) as Record<string, any>)),
          ];

          if (allData.includes(existing.name)) {
            const jobPrices = { ...(job.prices as Record<string, number> || {}) };
            const jobPurchase = { ...(job.purchasePrices as Record<string, number> || {}) };

            if (input.salePrice !== undefined) jobPrices[existing.name] = input.salePrice as number;
            if (input.purchasePrice !== undefined) jobPurchase[existing.name] = input.purchasePrice as number;

            await storage.updateJob(job.id, { prices: jobPrices, purchasePrices: jobPurchase });
            autoUpdated++;
          }
        }

        if (autoUpdated > 0) {
          await storage.createNotification({
            type: 'price_update',
            title: 'Çmimet u përditësuan',
            message: `${existing.name}: ${autoUpdated} punë u përditësuan me çmimet e reja`,
            catalogItemId: id,
            jobId: null,
            isRead: 0,
            userId: null,
          });
        }
      } catch (priceUpdateErr) {
        console.error('Auto price update error:', priceUpdateErr);
      }

      res.json(updated);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      throw err;
    }
  });

  app.delete(api.catalog.delete.path, async (req, res) => {
    const id = parseInt(req.params.id as string);
    if (isNaN(id)) return res.status(400).json({ message: "Invalid ID" });
    const existing = await storage.getCatalogItem(id);
    if (!existing) return res.status(404).json({ message: "Item not found" });
    await storage.deleteCatalogItem(id);
    res.status(204).send();
  });

  // ==================== WORKERS ====================

  app.get(api.workers.list.path, requireAuth, async (req, res) => {
    const workersList = await storage.getWorkers();
    res.json(workersList);
  });

  app.post(api.workers.create.path, requireAuth, requireAdmin, async (req, res) => {
    try {
      const input = api.workers.create.input.parse(req.body);
      const worker = await storage.createWorker(input);
      res.status(201).json(worker);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message, field: err.errors[0].path.join('.') });
      }
      throw err;
    }
  });

  app.put(api.workers.update.path, requireAuth, requireAdmin, async (req, res) => {
    const id = parseInt(req.params.id as string);
    if (isNaN(id)) return res.status(400).json({ message: "Invalid ID" });
    const existing = await storage.getWorker(id);
    if (!existing) return res.status(404).json({ message: "Punëtori nuk u gjet" });

    try {
      const input = api.workers.update.input.parse(req.body);
      const updated = await storage.updateWorker(id, input as any);
      res.json(updated);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message, field: err.errors[0].path.join('.') });
      }
      throw err;
    }
  });

  app.get('/api/workers/status', requireAuth, async (req, res) => {
    const today = new Date().toISOString().split('T')[0];
    const workers = await storage.getWorkers();
    
    // Get all attendances for today
    // We filter in memory for simplicity in this small app
    const allAttendances = await storage.getAttendances();
    const todayAttendances = allAttendances.filter(a => a.date === today);

    const statusMap = workers.map(w => {
      const att = todayAttendances.find(a => a.workerId === w.id);
      let status: 'Active' | 'Finished' | 'Idle' = 'Idle';
      if (att) {
        if (att.checkOut) status = 'Finished';
        else if (att.checkIn) status = 'Active';
      }
      return { workerId: w.id, status };
    });

    res.json(statusMap);
  });

  app.post('/api/workers/:id/reset-token', requireAuth, requireAdmin, async (req, res) => {
    const id = parseInt(req.params.id as string);
    if (isNaN(id)) return res.status(400).json({ message: "Invalid ID" });
    const token = crypto.randomBytes(16).toString('hex');
    const updated = await storage.updateWorker(id, { portalToken: token });
    res.json(updated);
  });

  app.get(api.workers.get.path, requireAuth, async (req, res) => {
    const id = parseInt(req.params.id as string);
    if (isNaN(id)) return res.status(400).json({ message: "Invalid ID" });
    const worker = await storage.getWorker(id);
    if (!worker) return res.status(404).json({ message: "Punëtori nuk u gjet" });
    res.json(worker);
  });

  app.delete(api.workers.delete.path, requireAuth, requireAdmin, async (req, res) => {
    const id = parseInt(req.params.id as string);
    if (isNaN(id)) return res.status(400).json({ message: "Invalid ID" });
    const existing = await storage.getWorker(id);
    if (!existing) return res.status(404).json({ message: "Punëtori nuk u gjet" });
    await storage.deleteWorker(id);
    res.status(204).send();
  });

  // ==================== WORKER PORTAL (MAGIC LINK) ====================
  app.get('/api/worker-portal/:token', async (req, res) => {
    const token = req.params.token;
    if (!token) return res.status(400).json({ message: "Token mungon" });
    
    const worker = await storage.getWorkerByToken(token);
    if (!worker) return res.status(404).json({ message: "Linku është i pavlefshëm ose ka skaduar" });
    
    res.json(worker);
  });

  // --- Worker Portal Attendance ---
  app.get('/api/worker-portal/:token/attendance', async (req, res) => {
    const worker = await storage.getWorkerByToken(req.params.token);
    if (!worker) return res.status(404).json({ message: "Invalid token" });
    const records = await storage.getAttendances(worker.id);
    res.json(records);
  });

  app.post('/api/worker-portal/:token/attendance', async (req, res) => {
    const worker = await storage.getWorkerByToken(req.params.token);
    if (!worker) return res.status(404).json({ message: "Invalid token" });
    
    // Enforce 1 check in per day
    const records = await storage.getAttendances(worker.id);
    const todayStr = req.body.date;
    const existing = records.find(r => r.date === todayStr);
    
    if (existing && existing.checkIn) {
        return res.status(400).json({ message: "Hyrja është regjistruar tashmë për këtë ditë." });
    }

    const created = await storage.createAttendance({ ...req.body, workerId: worker.id });
    res.status(201).json(created);
  });

  app.put('/api/worker-portal/:token/attendance/:id', async (req, res) => {
    const worker = await storage.getWorkerByToken(req.params.token);
    if (!worker) return res.status(404).json({ message: "Invalid token" });
    
    // Get existing to prevent multiple check outs
    const records = await storage.getAttendances(worker.id);
    const id = parseInt(req.params.id as string);
    const existing = records.find(r => r.id === id);
    
    if (existing && existing.checkOut) {
        return res.status(400).json({ message: "Dalja është regjistruar tashmë për këtë ditë." });
    }

    const updated = await storage.updateAttendance(id, req.body);
    res.json(updated);
  });

  // --- Worker Portal Payslips ---
  app.get('/api/worker-portal/:token/payslips', async (req, res) => {
    const worker = await storage.getWorkerByToken(req.params.token);
    if (!worker) return res.status(404).json({ message: "Invalid token" });
    const slips = await storage.getPayslips(worker.id);
    res.json(slips);
  });

  // --- Worker Portal Leave Requests ---
  app.post('/api/worker-portal/:token/leave-requests', async (req, res) => {
    const worker = await storage.getWorkerByToken(req.params.token);
    if (!worker) return res.status(404).json({ message: "Invalid token" });
    const created = await storage.createLeaveRequest({ ...req.body, workerId: worker.id, status: "Në Pritje" });
    
    // Create admin notification
    await storage.createNotification({
      type: "leave_request",
      title: "Kërkesë e re për pushim bashkëpunëtori",
      message: `${worker.name} ka kërkuar pushim ${req.body.type} nga ${req.body.startDate} deri më ${req.body.endDate} (${req.body.days} ditë).`,
      jobId: null,
      catalogItemId: null,
      isRead: 0,
      userId: null
    });

    res.status(201).json(created);
  });

  // ==================== HR ADVANCED (LEAVE, ATTENDANCE, PAYSLIPS, HISTORY) ====================

  // --- Leave Requests ---
  app.get('/api/leave-requests/pending-count', requireAuth, async (req, res) => {
    const requests = await storage.getLeaveRequests();
    const pending = requests.filter(r => r.status === "Në Pritje");
    res.json({ count: pending.length });
  });

  app.get('/api/leave-requests', requireAuth, async (req, res) => {
    const workerId = req.query.workerId ? parseInt(req.query.workerId as string) : undefined;
    const requests = await storage.getLeaveRequests(workerId);
    res.json(requests);
  });

  app.post('/api/leave-requests', requireAuth, requireAdmin, async (req, res) => {
    try {
      const created = await storage.createLeaveRequest(req.body);
      res.status(201).json(created);
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  });

  app.put('/api/leave-requests/:id', requireAuth, requireAdmin, async (req, res) => {
    const id = parseInt(req.params.id as string);
    if (isNaN(id)) return res.status(400).json({ message: "Invalid ID" });
    try {
      const updated = await storage.updateLeaveRequest(id, req.body);
      res.json(updated);
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  });

  app.delete('/api/leave-requests/:id', requireAuth, requireAdmin, async (req, res) => {
    const id = parseInt(req.params.id as string);
    if (isNaN(id)) return res.status(400).json({ message: "Invalid ID" });
    await storage.deleteLeaveRequest(id);
    res.status(204).send();
  });

  // --- Attendance ---
  app.get('/api/attendance', requireAuth, async (req, res) => {
    const workerId = req.query.workerId ? parseInt(req.query.workerId as string) : undefined;
    const month = req.query.month as string | undefined;
    const records = await storage.getAttendances(workerId, month);
    res.json(records);
  });

  app.post('/api/attendance', requireAuth, requireAdmin, async (req, res) => {
    try {
      const created = await storage.createAttendance(req.body);
      res.status(201).json(created);
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  });

  app.put('/api/attendance/:id', requireAuth, requireAdmin, async (req, res) => {
    const id = parseInt(req.params.id as string);
    if (isNaN(id)) return res.status(400).json({ message: "Invalid ID" });
    try {
      const updated = await storage.updateAttendance(id, req.body);
      res.json(updated);
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  });

  app.delete('/api/attendance/:id', requireAuth, requireAdmin, async (req, res) => {
    const id = parseInt(req.params.id as string);
    if (isNaN(id)) return res.status(400).json({ message: "Invalid ID" });
    await storage.deleteAttendance(id);
    res.status(204).send();
  });

  // --- Payslips ---
  app.get('/api/payslips', requireAuth, async (req, res) => {
    const workerId = req.query.workerId ? parseInt(req.query.workerId as string) : undefined;
    const slips = await storage.getPayslips(workerId);
    res.json(slips);
  });

  app.get('/api/payslips/:id', requireAuth, async (req, res) => {
    const id = parseInt(req.params.id as string);
    if (isNaN(id)) return res.status(400).json({ message: "Invalid ID" });
    const slip = await storage.getPayslip(id);
    if (!slip) return res.status(404).json({ message: "Not found" });
    res.json(slip);
  });

  app.post('/api/payslips', requireAuth, requireAdmin, async (req, res) => {
    try {
      // NOTE: Normally gross to net logic goes here, or we accept pre-calculated values from frontend
      const created = await storage.createPayslip(req.body);
      res.status(201).json(created);
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  });

  app.post('/api/payslips/batch', requireAuth, requireAdmin, async (req, res) => {
    try {
      const { month, year } = req.body;
      if (!month || !year) return res.status(400).json({ message: "Muaji dhe viti janë të detyrueshëm" });
      
      const workersList = await storage.getWorkers();
      let generatedCount = 0;

      for (const w of workersList) {
         // Calculate automatic tax and net salary based on base salary
         const pension = w.salary * 0.05;
         const taxable = w.salary - pension;
         let tax = 0;
         if (taxable > 80 && taxable <= 250) tax = (taxable - 80) * 0.04;
         else if (taxable > 250 && taxable <= 450) tax = (170 * 0.04) + ((taxable - 250) * 0.08);
         else if (taxable > 450) tax = (170 * 0.04) + (200 * 0.08) + ((taxable - 450) * 0.10);
         
         // Fetch attendance for the month to calculate automatic overtime (if any)
         const attendances = await storage.getAttendances(w.id);
         const monthAttendances = attendances.filter(a => {
             const d = new Date(a.date);
             return d.getMonth() + 1 === month && d.getFullYear() === year;
         });
         
         let totalOvertimeHours = monthAttendances.reduce((acc, curr) => acc + (curr.overtimeHours || 0), 0);
         const hourlyRate = (w.salary / 4) / w.workingHours;
         const overtimeBonus = totalOvertimeHours * (hourlyRate * 1.5); // Overtime paid at 1.5x

         const net = w.salary - pension - tax + overtimeBonus;

         await storage.createPayslip({
             workerId: w.id,
             month,
             year,
             grossSalary: w.salary,
             netSalary: net,
             pensionContribution: pension,
             taxAmount: tax,
             bonuses: overtimeBonus,
             deductions: 0,
             status: "E Papaguar"
         });
         generatedCount++;
      }

      res.status(201).json({ message: `U gjeneruan ${generatedCount} fletëpagesa.`, count: generatedCount });
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  });

  app.put('/api/payslips/:id', requireAuth, requireAdmin, async (req, res) => {
    const id = parseInt(req.params.id as string);
    if (isNaN(id)) return res.status(400).json({ message: "Invalid ID" });
    try {
      const updated = await storage.updatePayslip(id, req.body);
      res.json(updated);
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  });

  app.delete('/api/payslips/:id', requireAuth, requireAdmin, async (req, res) => {
    const id = parseInt(req.params.id as string);
    if (isNaN(id)) return res.status(400).json({ message: "Invalid ID" });
    await storage.deletePayslip(id);
    res.status(204).send();
  });

  // --- Worker History ---
  app.get('/api/worker-history', requireAuth, async (req, res) => {
    const workerId = req.query.workerId ? parseInt(req.query.workerId as string) : undefined;
    const history = await storage.getWorkerHistory(workerId);
    res.json(history);
  });

  app.post('/api/worker-history', requireAuth, requireAdmin, async (req, res) => {
    try {
      const created = await storage.createWorkerHistory(req.body);
      res.status(201).json(created);
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  });

  // ==================== CLIENTS ====================

  app.get('/api/clients', async (req, res) => {
    const search = req.query.search as string | undefined;
    if (search) {
      const results = await storage.searchClients(search);
      return res.json(results);
    }
    const allClients = await storage.getClients();
    res.json(allClients);
  });

  app.get('/api/clients/:id', async (req, res) => {
    const id = parseInt(req.params.id as string);
    if (isNaN(id)) return res.status(400).json({ message: "ID e pavlefshme" });
    const client = await storage.getClient(id);
    if (!client) return res.status(404).json({ message: "Klienti nuk u gjet" });
    res.json(client);
  });

  app.get('/api/clients/:id/jobs', async (req, res) => {
    const id = parseInt(req.params.id as string);
    if (isNaN(id)) return res.status(400).json({ message: "ID e pavlefshme" });
    const clientJobs = await storage.getJobsByClientId(id);
    res.json(clientJobs);
  });

  app.post('/api/clients', async (req, res) => {
    try {
      const { name, phone, address, email, notes } = req.body;
      if (!name) return res.status(400).json({ message: "Emri është i detyrueshëm" });
      const client = await storage.createClient({
        name, phone: phone || null, address: address || null,
        email: email || null, notes: notes || null,
      });
      res.status(201).json(client);
    } catch (err) {
      console.error('Create client error:', err);
      res.status(500).json({ message: "Gabim" });
    }
  });

  app.put('/api/clients/:id', async (req, res) => {
    const id = parseInt(req.params.id as string);
    if (isNaN(id)) return res.status(400).json({ message: "ID e pavlefshme" });
    const existing = await storage.getClient(id);
    if (!existing) return res.status(404).json({ message: "Klienti nuk u gjet" });
    const updated = await storage.updateClient(id, req.body);
    res.json(updated);
  });

  app.delete('/api/clients/:id', async (req, res) => {
    const id = parseInt(req.params.id as string);
    if (isNaN(id)) return res.status(400).json({ message: "ID e pavlefshme" });
    await storage.deleteClient(id);
    res.status(204).send();
  });

  // ==================== PRICE HISTORY ====================

  app.get('/api/price-history', async (req, res) => {
    const catalogItemId = req.query.catalogItemId ? parseInt(req.query.catalogItemId as string) : undefined;
    const history = await storage.getPriceHistory(catalogItemId);
    res.json(history);
  });

  // ==================== STOCK / INVENTORY ====================

  app.get('/api/stock', async (req, res) => {
    const catalogItemId = req.query.catalogItemId ? parseInt(req.query.catalogItemId as string) : undefined;
    const entries = await storage.getStockEntries(catalogItemId);
    res.json(entries);
  });

  app.get('/api/stock/low', async (_req, res) => {
    const lowItems = await storage.getLowStockItems();
    res.json(lowItems);
  });

  app.post('/api/stock/entry', async (req, res) => {
    try {
      const { catalogItemId, quantity, entryType, notes } = req.body;
      if (!catalogItemId || quantity === undefined) {
        return res.status(400).json({ message: "Plotësoni fushat" });
      }
      const catItem = await storage.getCatalogItem(catalogItemId);
      if (!catItem) return res.status(404).json({ message: "Artikulli nuk u gjet" });

      const previousStock = catItem.currentStock || 0;
      let newStock = previousStock;

      if (entryType === "in") {
        newStock = previousStock + quantity;
      } else if (entryType === "out") {
        newStock = Math.max(0, previousStock - quantity);
      } else {
        newStock = quantity;
      }

      await storage.updateCatalogStock(catalogItemId, newStock);

      const entry = await storage.createStockEntry({
        catalogItemId,
        itemName: catItem.name,
        entryType: entryType || "in",
        quantity,
        previousStock,
        newStock,
        jobId: req.body.jobId || null,
        notes: notes || null,
        createdBy: req.session?.fullName || "Admin",
      });

      if (catItem.minStockLevel && newStock <= catItem.minStockLevel) {
        await storage.createNotification({
          type: "low_stock",
          title: "Stoku i ulët",
          message: `${catItem.name}: ${newStock} ${catItem.unit} mbetur (min: ${catItem.minStockLevel})`,
          catalogItemId,
          jobId: null,
          isRead: 0,
          userId: null,
        });
      }

      res.status(201).json(entry);
    } catch (err) {
      console.error('Stock entry error:', err);
      res.status(500).json({ message: "Gabim" });
    }
  });

  // ==================== JOB SNAPSHOTS (Quote vs Actual) ====================

  app.get('/api/jobs/:id/snapshots', async (req, res) => {
    const id = parseInt(req.params.id as string);
    if (isNaN(id)) return res.status(400).json({ message: "ID e pavlefshme" });
    const snapshots = await storage.getJobSnapshots(id);
    res.json(snapshots);
  });

  // ==================== NOTIFICATIONS ====================

  app.get('/api/notifications', async (req, res) => {
    const userId = req.session?.userId;
    const notifs = await storage.getNotifications(userId);
    res.json(notifs);
  });

  app.get('/api/notifications/unread-count', async (req, res) => {
    const userId = req.session?.userId;
    const count = await storage.getUnreadNotificationCount(userId);
    res.json({ count });
  });

  app.post('/api/notifications', requireAuth, async (req, res) => {
    try {
      const { type, title, message, jobId, catalogItemId, userId } = req.body;
      const notif = await storage.createNotification({
        type, title, message, jobId, catalogItemId, userId,
        isRead: 0
      });
      res.status(201).json(notif);
    } catch (err) {
      console.error('Create notification error:', err);
      res.status(500).json({ message: "Gabim" });
    }
  });

  app.put('/api/notifications/:id/read', async (req, res) => {
    const id = parseInt(req.params.id as string);
    if (isNaN(id)) return res.status(400).json({ message: "ID e pavlefshme" });
    await storage.markNotificationRead(id);
    res.json({ success: true });
  });

  app.put('/api/notifications/read-all', async (req, res) => {
    const userId = req.session?.userId;
    await storage.markAllNotificationsRead(userId);
    res.json({ success: true });
  });

  app.delete('/api/notifications/:id', async (req, res) => {
    const id = parseInt(req.params.id as string);
    if (isNaN(id)) return res.status(400).json({ message: "ID e pavlefshme" });
    await storage.deleteNotification(id);
    res.json({ success: true });
  });

  app.delete('/api/notifications', async (req, res) => {
    const userId = req.session?.userId;
    await storage.deleteAllNotifications(userId);
    res.json({ success: true });
  });

  // --- CHECK STALE OFFERS AND CREATE NOTIFICATIONS ---
  app.post('/api/notifications/check-stale', async (_req, res) => {
    try {
      const allJobs = await storage.getJobs();
      const now = new Date();
      let created = 0;

      for (const job of allJobs) {
        if (job.status !== "oferte" || job.isTemplate === 1) continue;
        const createdDate = job.createdAt ? new Date(job.createdAt) : null;
        if (!createdDate) continue;

        const daysSince = Math.floor((now.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24));
        if (daysSince >= 7) {
          const existingNotifs = await storage.getNotifications();
          const alreadyNotified = existingNotifs.some(
            n => n.type === "stale_offer" && n.jobId === job.id &&
              n.createdAt && (now.getTime() - new Date(n.createdAt).getTime()) < 7 * 24 * 60 * 60 * 1000
          );
          if (!alreadyNotified) {
            await storage.createNotification({
              type: "stale_offer",
              title: "Ofertë e vjetër",
              message: `Oferta ${job.invoiceNumber || '#' + job.id} për ${job.clientName} ka ${daysSince} ditë pa u konfirmuar${job.clientPhone ? '. Tel: ' + job.clientPhone : ''}`,
              jobId: job.id,
              catalogItemId: null,
              isRead: 0,
              userId: null,
            });
            created++;
          }
        }
      }

      const upcomingJobs = allJobs.filter(j => {
        if (j.status === "e_perfunduar" || j.isTemplate === 1) return false;
        const workDate = new Date(j.workDate);
        const daysUntil = Math.floor((workDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        return daysUntil >= 0 && daysUntil <= 3;
      });

      for (const job of upcomingJobs) {
        const existingNotifs = await storage.getNotifications();
        const alreadyNotified = existingNotifs.some(
          n => n.type === "upcoming_work" && n.jobId === job.id &&
            n.createdAt && (now.getTime() - new Date(n.createdAt).getTime()) < 24 * 60 * 60 * 1000
        );
        if (!alreadyNotified) {
          const daysUntil = Math.floor((new Date(job.workDate).getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
          await storage.createNotification({
            type: "upcoming_work",
            title: "Punë e afërt",
            message: `${job.invoiceNumber || '#' + job.id} - ${job.clientName}: ${daysUntil === 0 ? 'SOT' : `për ${daysUntil} ditë`}`,
            jobId: job.id,
            catalogItemId: null,
            isRead: 0,
            userId: job.userId || null,
          });
          created++;
        }
      }

      const existingNotifs = await storage.getNotifications();

      for (const job of allJobs) {
        if (job.status !== "e_perfunduar" || job.isTemplate === 1) continue;
        if (job.paymentStatus === "paguar") continue;
        const completedDate = job.completedDate ? new Date(job.completedDate) : (job.updatedAt ? new Date(job.updatedAt) : null);
        if (!completedDate) continue;
        const daysSinceComplete = Math.floor((now.getTime() - completedDate.getTime()) / (1000 * 60 * 60 * 24));

        const thresholds = [30, 14, 7];
        for (const threshold of thresholds) {
          if (daysSinceComplete >= threshold) {
            const alreadyNotified = existingNotifs.some(
              n => n.type === "payment_overdue" && n.jobId === job.id &&
                n.message?.includes(`${threshold} ditë`)
            );
            if (!alreadyNotified) {
              const paidText = job.paymentStatus === "pjeserisht" ? ` (paguar pjesërisht: €${job.paidAmount || 0})` : "";
              await storage.createNotification({
                type: "payment_overdue",
                title: "Pagesë e vonuar",
                message: `${job.invoiceNumber || '#' + job.id} - ${job.clientName}: ${threshold} ditë pa pagesë${paidText}${job.clientPhone ? '. Tel: ' + job.clientPhone : ''}`,
                jobId: job.id,
                catalogItemId: null,
                isRead: 0,
                userId: null,
              });
              created++;
            }
            break;
          }
        }
      }

      for (const job of allJobs) {
        if (job.status !== "e_perfunduar" || job.isTemplate === 1) continue;
        const completedDate = job.completedDate ? new Date(job.completedDate) : (job.updatedAt ? new Date(job.updatedAt) : null);
        if (!completedDate) continue;
        const daysSinceComplete = Math.floor((now.getTime() - completedDate.getTime()) / (1000 * 60 * 60 * 24));

        if (daysSinceComplete >= 3) {
          const allFeedback = await storage.getFeedback(job.id);
          if (allFeedback.length > 0) continue;

          const alreadyNotified = existingNotifs.some(
            n => n.type === "feedback_reminder" && n.jobId === job.id
          );
          if (!alreadyNotified) {
            await storage.createNotification({
              type: "feedback_reminder",
              title: "Kujtesë - Kërko vlerësim",
              message: `Puna ${job.invoiceNumber || '#' + job.id} për ${job.clientName} u përfundua ${daysSinceComplete} ditë më parë. Dërgoni linkun e vlerësimit!`,
              jobId: job.id,
              catalogItemId: null,
              isRead: 0,
              userId: null,
            });
            created++;
          }
        }
      }

      for (const job of allJobs) {
        if (job.isTemplate === 1 || job.status === "e_perfunduar") continue;
        const prices = (job.prices || {}) as Record<string, number>;
        const hasMaterials = Object.keys(job.table1Data || {}).length > 0 ||
          Object.keys(job.table2Data || {}).length > 0 ||
          Object.keys(job.cameraData || {}).length > 0 ||
          Object.keys(job.intercomData || {}).length > 0 ||
          Object.keys(job.alarmData || {}).length > 0 ||
          Object.keys(job.serviceData || {}).length > 0;
        const hasPrices = Object.values(prices).some(v => v > 0);
        if (hasMaterials && !hasPrices) {
          const alreadyNotified = existingNotifs.some(
            n => n.type === "missing_prices" && n.jobId === job.id &&
              n.createdAt && (now.getTime() - new Date(n.createdAt).getTime()) < 7 * 24 * 60 * 60 * 1000
          );
          if (!alreadyNotified) {
            await storage.createNotification({
              type: "missing_prices",
              title: "Punë pa çmime",
              message: `Puna ${job.invoiceNumber || '#' + job.id} për ${job.clientName} ka materiale por nuk ka çmime të vendosura.`,
              jobId: job.id,
              catalogItemId: null,
              isRead: 0,
              userId: null,
            });
            created++;
          }
        }
      }

      try {
        const expenses = await storage.getExpenses();
        const qiraExpenses = expenses.filter(e => e.category === "qira");
        if (qiraExpenses.length > 0) {
          const lastQira = qiraExpenses.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
          const daysSince = Math.floor((now.getTime() - new Date(lastQira.date).getTime()) / (1000 * 60 * 60 * 24));
          if (daysSince >= 28) {
            const alreadyNotified = existingNotifs.some(
              n => n.type === "recurring_expense" &&
                n.createdAt && (now.getTime() - new Date(n.createdAt).getTime()) < 25 * 24 * 60 * 60 * 1000
            );
            if (!alreadyNotified) {
              await storage.createNotification({
                type: "recurring_expense",
                title: "Kujtesë - Shpenzim Periodik",
                message: `Kanë kaluar ${daysSince} ditë nga shpenzimi i fundit i qirasë. Kontrolloni nëse duhet paguar.`,
                jobId: null,
                catalogItemId: null,
                isRead: 0,
                userId: null,
              });
              created++;
            }
          }
        }
      } catch (recurringErr) {
        console.error('Recurring expense check error:', recurringErr);
      }

      res.json({ created });
    } catch (err) {
      console.error('Check stale error:', err);
      res.status(500).json({ message: "Gabim" });
    }
  });

  // ==================== ANALYTICS ====================

  app.get('/api/analytics/profit', async (req, res) => {
    try {
      const allJobs = await storage.getJobs();
      const completedJobs = allJobs.filter(j => j.status === "e_perfunduar" && j.isTemplate !== 1);

      const monthlyData: Record<string, { revenue: number; cost: number; profit: number; jobCount: number; expenses: number }> = {};

      for (const job of completedJobs) {
        const date = job.updatedAt || job.createdAt;
        if (!date) continue;
        const d = new Date(date);
        const monthKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;

        if (!monthlyData[monthKey]) {
          monthlyData[monthKey] = { revenue: 0, cost: 0, profit: 0, jobCount: 0, expenses: 0 };
        }

        const { quantities } = getJobMaterialTotals(job);
        const prices = (job.prices || {}) as Record<string, number>;
        const purchasePrices = (job.purchasePrices || {}) as Record<string, number>;

        let totalSale = 0;
        let totalPurchase = 0;
        for (const [name, qty] of Object.entries(quantities)) {
          totalSale += (prices[name] || 0) * qty;
          totalPurchase += (purchasePrices[name] || 0) * qty;
        }

        monthlyData[monthKey].revenue += totalSale;
        monthlyData[monthKey].cost += totalPurchase;
        monthlyData[monthKey].profit += (totalSale - totalPurchase);
        monthlyData[monthKey].jobCount++;
      }

      const categoryData: Record<string, { revenue: number; cost: number; profit: number; count: number }> = {};
      for (const job of completedJobs) {
        const cat = job.category || "electric";
        if (!categoryData[cat]) {
          categoryData[cat] = { revenue: 0, cost: 0, profit: 0, count: 0 };
        }
        const { quantities } = getJobMaterialTotals(job);
        const prices = (job.prices || {}) as Record<string, number>;
        const purchasePrices = (job.purchasePrices || {}) as Record<string, number>;
        let totalSale = 0, totalPurchase = 0;
        for (const [name, qty] of Object.entries(quantities)) {
          totalSale += (prices[name] || 0) * qty;
          totalPurchase += (purchasePrices[name] || 0) * qty;
        }
        categoryData[cat].revenue += totalSale;
        categoryData[cat].cost += totalPurchase;
        categoryData[cat].profit += (totalSale - totalPurchase);
        categoryData[cat].count++;
      }

      const seasonalData: Record<string, { revenue: number; profit: number; count: number }> = {};
      const seasonNames: Record<number, string> = { 0: "Dimër", 1: "Pranverë", 2: "Verë", 3: "Vjeshtë" };
      for (const job of completedJobs) {
        const date = job.updatedAt || job.createdAt;
        if (!date) continue;
        const month = new Date(date).getMonth();
        const season = Math.floor(((month + 1) % 12) / 3);
        const seasonName = seasonNames[season];
        if (!seasonalData[seasonName]) {
          seasonalData[seasonName] = { revenue: 0, profit: 0, count: 0 };
        }
        const { quantities } = getJobMaterialTotals(job);
        const prices = (job.prices || {}) as Record<string, number>;
        const purchasePrices = (job.purchasePrices || {}) as Record<string, number>;
        let totalSale = 0, totalPurchase = 0;
        for (const [name, qty] of Object.entries(quantities)) {
          totalSale += (prices[name] || 0) * qty;
          totalPurchase += (purchasePrices[name] || 0) * qty;
        }
        seasonalData[seasonName].revenue += totalSale;
        seasonalData[seasonName].profit += totalSale - totalPurchase;
        seasonalData[seasonName].count++;
      }

      const allExpenses = await storage.getExpenses({});
      const expensesByCategory: Record<string, number> = {};
      let totalExpenseAmount = 0;

      for (const expense of allExpenses) {
        const expDate = expense.date;
        if (!expDate) continue;
        const eParts = expDate.split('-');
        const eMonthKey = `${eParts[0]}-${eParts[1]}`;

        if (!monthlyData[eMonthKey]) {
          monthlyData[eMonthKey] = { revenue: 0, cost: 0, profit: 0, jobCount: 0, expenses: 0 };
        }
        monthlyData[eMonthKey].expenses += expense.amount;
        monthlyData[eMonthKey].profit -= expense.amount;
        totalExpenseAmount += expense.amount;

        const eCat = expense.category || "tjeter";
        expensesByCategory[eCat] = (expensesByCategory[eCat] || 0) + expense.amount;
      }

      const months = Object.keys(monthlyData).sort();
      const trend = months.map(m => ({
        month: m,
        ...monthlyData[m],
      }));

      const totalRevenue = trend.reduce((s, t) => s + t.revenue, 0);
      const totalCost = trend.reduce((s, t) => s + t.cost, 0);
      const totalProfit = totalRevenue - totalCost;
      const avgMonthlyProfit = months.length > 0 ? totalProfit / months.length : 0;

      let prediction = avgMonthlyProfit;
      if (trend.length >= 3) {
        const last3 = trend.slice(-3);
        prediction = last3.reduce((s, t) => s + t.profit, 0) / 3;
      }

      res.json({
        trend,
        categoryBreakdown: categoryData,
        seasonal: seasonalData,
        totals: { revenue: totalRevenue, cost: totalCost, profit: totalProfit },
        avgMonthlyProfit,
        prediction,
        totalJobs: completedJobs.length,
        totalExpenses: totalExpenseAmount,
        netProfit: totalProfit - totalExpenseAmount,
        expensesByCategory,
      });
    } catch (err) {
      console.error('Analytics error:', err);
      res.status(500).json({ message: "Gabim" });
    }
  });

  // --- APPLY BEST SUPPLIER PRICES ---
  app.post('/api/jobs/:id/apply-best-prices', requireAuth, async (req, res) => {
    const id = parseInt(req.params.id as string);
    if (isNaN(id)) return res.status(400).json({ message: "ID e pavlefshme" });
    try {
      const job = await storage.getJob(id);
      if (!job) return res.status(404).json({ message: "Puna nuk u gjet" });

      const catalog = await storage.getCatalogItems();
      const catalogByName = new Map(catalog.map(c => [c.name, c]));
      const allSupplierPrices = await storage.getSupplierPrices();
      const suppliers = await storage.getSuppliers();
      const supplierMap = new Map(suppliers.map(s => [s.id, s.name]));

      const pricesByItem: Record<number, { supplierId: number; supplierName: string; price: number }[]> = {};
      for (const sp of allSupplierPrices) {
        if (!pricesByItem[sp.catalogItemId]) pricesByItem[sp.catalogItemId] = [];
        pricesByItem[sp.catalogItemId].push({
          supplierId: sp.supplierId,
          supplierName: supplierMap.get(sp.supplierId) || 'Unknown',
          price: sp.price,
        });
      }

      const { quantities } = getJobMaterialTotals(job);
      const newPurchasePrices: Record<string, number> = { ...(job.purchasePrices as Record<string, number> || {}) };
      const appliedPrices: { item: string; price: number; supplier: string }[] = [];

      for (const itemName of Object.keys(quantities)) {
        const catItem = catalogByName.get(itemName);
        if (!catItem) continue;
        const itemPrices = pricesByItem[catItem.id];
        if (!itemPrices || itemPrices.length === 0) continue;

        const cheapest = itemPrices.reduce((min, p) => p.price < min.price ? p : min, itemPrices[0]);
        newPurchasePrices[itemName] = cheapest.price;
        appliedPrices.push({ item: itemName, price: cheapest.price, supplier: cheapest.supplierName });
      }

      await storage.updateJob(id, { purchasePrices: newPurchasePrices });
      res.json({ applied: appliedPrices, purchasePrices: newPurchasePrices });
    } catch (err) {
      console.error('Apply best prices error:', err);
      res.status(500).json({ message: "Gabim" });
    }
  });

  // --- MONTHLY REPORT ---
  app.get('/api/reports/monthly', requireAuth, async (req, res) => {
    try {
      const now = new Date();
      const monthParam = parseInt(req.query.month as string) || (now.getMonth() === 0 ? 12 : now.getMonth());
      const yearParam = parseInt(req.query.year as string) || (now.getMonth() === 0 ? now.getFullYear() - 1 : now.getFullYear());

      const startDate = `${yearParam}-${String(monthParam).padStart(2, '0')}-01`;
      const lastDay = new Date(yearParam, monthParam, 0).getDate();
      const endDate = `${yearParam}-${String(monthParam).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`;

      const allJobs = await storage.getJobs();
      const completedJobs = allJobs.filter(j => {
        if (j.status !== 'e_perfunduar' || j.isTemplate) return false;
        const d = j.completedDate || (j.updatedAt ? new Date(j.updatedAt).toISOString().split('T')[0] : null);
        return d && d >= startDate && d <= endDate;
      });

      let totalRevenue = 0;
      let totalCost = 0;
      const jobsSummary = completedJobs.map(job => {
        const { quantities } = getJobMaterialTotals(job);
        const prices = (job.prices || {}) as Record<string, number>;
        const purchasePrices = (job.purchasePrices || {}) as Record<string, number>;
        let revenue = 0;
        let cost = 0;
        for (const [name, qty] of Object.entries(quantities)) {
          revenue += (prices[name] || 0) * qty;
          cost += (purchasePrices[name] || 0) * qty;
        }
        totalRevenue += revenue;
        totalCost += cost;
        return {
          id: job.id,
          invoiceNumber: job.invoiceNumber,
          clientName: job.clientName,
          workType: job.workType,
          category: job.category,
          completedDate: job.completedDate,
          revenue,
          cost,
          profit: revenue - cost,
        };
      });

      const expenses = await storage.getExpenses({ startDate, endDate });
      const totalExpenses = expenses.reduce((s, e) => s + e.amount, 0);
      const expensesByCategory: Record<string, number> = {};
      for (const e of expenses) {
        expensesByCategory[e.category || 'tjeter'] = (expensesByCategory[e.category || 'tjeter'] || 0) + e.amount;
      }

      const catalogItems = await storage.getCatalogItems();
      const lowStockItems = catalogItems.filter(c => c.minStockLevel && c.minStockLevel > 0 && (c.currentStock || 0) <= c.minStockLevel)
        .map(c => ({ name: c.name, currentStock: c.currentStock || 0, minStockLevel: c.minStockLevel, unit: c.unit }));

      res.json({
        month: monthParam,
        year: yearParam,
        startDate,
        endDate,
        completedJobsCount: completedJobs.length,
        jobs: jobsSummary,
        totalRevenue,
        totalCost,
        totalProfit: totalRevenue - totalCost,
        totalExpenses,
        netProfit: totalRevenue - totalCost - totalExpenses,
        expensesByCategory,
        lowStockItems,
      });
    } catch (err) {
      console.error('Monthly report error:', err);
      res.status(500).json({ message: "Gabim" });
    }
  });

  // --- REFRESH PRICES ---
  app.post('/api/jobs/refresh-prices', async (_req, res) => {
    try {
      const catalogList = await storage.getCatalogItems();
      const priceMap: Record<string, number> = {};
      const purchaseMap: Record<string, number> = {};
      for (const item of catalogList) {
        priceMap[item.name] = item.salePrice || 0;
        purchaseMap[item.name] = item.purchasePrice || 0;
      }

      const allJobs = await storage.getJobs();
      let updatedCount = 0;

      for (const job of allJobs) {
        const allItemNames = new Set<string>();

        const t1 = (job.table1Data || {}) as Record<string, Record<string, number>>;
        Object.keys(t1).forEach(n => allItemNames.add(n));
        const simpleFields = ['table2Data', 'cameraData', 'intercomData', 'alarmData', 'serviceData'] as const;
        for (const f of simpleFields) {
          const d = (job[f] || {}) as Record<string, number>;
          Object.keys(d).forEach(n => allItemNames.add(n));
        }

        const newPrices: Record<string, number> = { ...(job.prices as Record<string, number> || {}) };
        const newPurchase: Record<string, number> = { ...(job.purchasePrices as Record<string, number> || {}) };
        let changed = false;

        for (const name of Array.from(allItemNames)) {
          if (name in priceMap) {
            if (newPrices[name] !== priceMap[name]) {
              newPrices[name] = priceMap[name];
              changed = true;
            }
            if (newPurchase[name] !== purchaseMap[name]) {
              newPurchase[name] = purchaseMap[name];
              changed = true;
            }
          }
        }

        if (changed) {
          await storage.updateJob(job.id, { prices: newPrices, purchasePrices: newPurchase });
          updatedCount++;
        }
      }

      res.json({ updated: updatedCount, total: allJobs.length });
    } catch (err) {
      console.error('Refresh prices error:', err);
      res.status(500).json({ message: 'Failed to refresh prices' });
    }
  });

  // ==================== SUPPLIERS ====================

  app.get('/api/suppliers', requireAuth, async (_req, res) => {
    const list = await storage.getSuppliers();
    res.json(list);
  });

  app.post('/api/suppliers', requireAuth, async (req, res) => {
    try {
      const { name, phone, email, address, categories, notes } = req.body;
      if (!name) return res.status(400).json({ message: "Emri i furnitorit eshte i detyrueshem" });
      const supplier = await storage.createSupplier({
        name, phone: phone || null, email: email || null,
        address: address || null, categories: categories || [],
        notes: notes || null,
      });
      res.status(201).json(supplier);
    } catch (err) {
      console.error('Create supplier error:', err);
      res.status(500).json({ message: "Gabim ne krijimin e furnitorit" });
    }
  });

  app.put('/api/suppliers/:id', requireAuth, async (req, res) => {
    const id = parseInt(req.params.id as string);
    if (isNaN(id)) return res.status(400).json({ message: "ID e pavlefshme" });
    const existing = await storage.getSupplier(id);
    if (!existing) return res.status(404).json({ message: "Furnitori nuk u gjet" });
    const updated = await storage.updateSupplier(id, req.body);
    res.json(updated);
  });

  app.delete('/api/suppliers/:id', requireAuth, async (req, res) => {
    const id = parseInt(req.params.id as string);
    if (isNaN(id)) return res.status(400).json({ message: "ID e pavlefshme" });
    await storage.deleteSupplier(id);
    res.status(204).send();
  });

  // ==================== SUPPLIER PRICES ====================

  app.get('/api/supplier-prices', requireAuth, async (req, res) => {
    const supplierId = req.query.supplierId ? parseInt(req.query.supplierId as string) : undefined;
    const list = await storage.getSupplierPrices(supplierId);
    res.json(list);
  });

  app.get('/api/supplier-prices/by-item/:catalogItemId', requireAuth, async (req, res) => {
    const catalogItemId = parseInt(req.params.catalogItemId as string);
    if (isNaN(catalogItemId)) return res.status(400).json({ message: "ID e pavlefshme" });
    const list = await storage.getSupplierPricesByItem(catalogItemId);
    res.json(list);
  });

  app.get('/api/supplier-prices/comparison', requireAuth, async (req, res) => {
    try {
      const allPrices = await storage.getSupplierPrices();
      const allSuppliers = await storage.getSuppliers();
      const allCatalog = await storage.getCatalogItems();

      const supplierMap = new Map(allSuppliers.map(s => [s.id, s]));
      const catalogMap = new Map(allCatalog.map(c => [c.id, c]));

      const byItem: Record<number, { catalogItem: any; suppliers: { supplier: any; price: number; notes: string | null }[] }> = {};

      for (const sp of allPrices) {
        if (!byItem[sp.catalogItemId]) {
          const cat = catalogMap.get(sp.catalogItemId);
          if (!cat) continue;
          byItem[sp.catalogItemId] = { catalogItem: cat, suppliers: [] };
        }
        const supplier = supplierMap.get(sp.supplierId);
        if (!supplier) continue;
        byItem[sp.catalogItemId].suppliers.push({
          supplier: { id: supplier.id, name: supplier.name },
          price: sp.price,
          notes: sp.notes,
        });
      }

      for (const item of Object.values(byItem)) {
        item.suppliers.sort((a, b) => a.price - b.price);
      }

      res.json(Object.values(byItem));
    } catch (err) {
      console.error('Supplier comparison error:', err);
      res.status(500).json({ message: "Gabim" });
    }
  });

  app.post('/api/supplier-prices', requireAuth, async (req, res) => {
    try {
      const { supplierId, catalogItemId, price, notes } = req.body;
      const parsedSupplierId = parseInt(supplierId);
      const parsedCatalogItemId = parseInt(catalogItemId);
      const parsedPrice = parseFloat(price);
      if (isNaN(parsedSupplierId) || isNaN(parsedCatalogItemId) || isNaN(parsedPrice) || parsedPrice < 0) {
        return res.status(400).json({ message: "Të dhëna të pavlefshme. Sigurohuni që furnitori, produkti dhe çmimi janë të sakta." });
      }
      const supplier = await storage.getSupplier(parsedSupplierId);
      if (!supplier) return res.status(404).json({ message: "Furnitori nuk u gjet" });
      const catalogItem = await storage.getCatalogItem(parsedCatalogItemId);
      if (!catalogItem) return res.status(404).json({ message: "Produkti nuk u gjet në katalog" });
      const result = await storage.upsertSupplierPrice({
        supplierId: parsedSupplierId,
        catalogItemId: parsedCatalogItemId,
        price: parsedPrice,
        notes: notes || null,
      });
      res.status(201).json(result);
    } catch (err) {
      console.error('Upsert supplier price error:', err);
      res.status(500).json({ message: "Gabim ne ruajtjen e cmimit" });
    }
  });

  app.delete('/api/supplier-prices/:id', requireAuth, async (req, res) => {
    const id = parseInt(req.params.id as string);
    if (isNaN(id)) return res.status(400).json({ message: "ID e pavlefshme" });
    await storage.deleteSupplierPrice(id);
    res.status(204).send();
  });

  // ==================== EXPENSES ====================

  app.get('/api/expenses', requireAuth, async (req, res) => {
    const startDate = req.query.startDate as string | undefined;
    const endDate = req.query.endDate as string | undefined;
    const category = req.query.category as string | undefined;
    const list = await storage.getExpenses({ startDate, endDate, category: category !== 'all' ? category : undefined });
    res.json(list);
  });

  app.post('/api/expenses', requireAuth, async (req, res) => {
    try {
      const { description, amount, category, date, jobId, supplierId, notes } = req.body;
      if (!description || !amount || !date) {
        return res.status(400).json({ message: "Plotesoni fushat e detyrueshme" });
      }
      const expense = await storage.createExpense({
        description, amount: parseFloat(amount), category: category || 'tjeter',
        date, jobId: jobId || null, supplierId: supplierId || null,
        notes: notes || null, createdBy: req.session?.fullName || null,
      });
      const EXPENSE_CAT_LABELS: Record<string, string> = { karburant: 'Karburant', transport: 'Transport', vegla: 'Vegla', material: 'Material', ushqim: 'Ushqim', telefon: 'Telefon', qira: 'Qira', tjeter: 'Tjetër' };
      await storage.createNotification({
        type: "expense_added",
        title: "Shpenzim i Ri",
        message: `${EXPENSE_CAT_LABELS[category] || category}: ${description} - €${parseFloat(amount).toFixed(2)}`,
        jobId: jobId ? parseInt(jobId) : null,
        catalogItemId: null,
        isRead: 0,
        userId: null,
      });

      // Sync with catalog if it's a material expense
      if (category === 'material') {
        await syncExpenseToCatalog(description, parseFloat(amount), category);
      }

      res.status(201).json(expense);
    } catch (err) {
      console.error('Create expense error:', err);
      res.status(500).json({ message: "Gabim ne krijimin e shpenzimit" });
    }
  });

  app.put('/api/expenses/:id', requireAuth, async (req, res) => {
    const id = parseInt(req.params.id as string);
    if (isNaN(id)) return res.status(400).json({ message: "ID e pavlefshme" });
    const existing = await storage.getExpense(id);
    if (!existing) return res.status(404).json({ message: "Shpenzimi nuk u gjet" });
    const updated = await storage.updateExpense(id, req.body);
    res.json(updated);
  });

  app.delete('/api/expenses/:id', requireAuth, async (req, res) => {
    const id = parseInt(req.params.id as string);
    if (isNaN(id)) return res.status(400).json({ message: "ID e pavlefshme" });
    await storage.deleteExpense(id);
    res.status(204).send();
  });

  // ==================== FEEDBACK ====================

  app.get('/api/feedback', requireAuth, async (req, res) => {
    const jobId = req.query.jobId ? parseInt(req.query.jobId as string) : undefined;
    const list = await storage.getFeedback(jobId);
    res.json(list);
  });

  app.post('/api/feedback', requireAuth, async (req, res) => {
    try {
      const { jobId, clientId, rating, comment } = req.body;
      if (!jobId || !rating) return res.status(400).json({ message: "Plotesoni fushat e detyrueshme" });
      const existing = await storage.getFeedback(jobId);
      if (existing.length > 0) {
        return res.status(400).json({ message: "Kjo punë ka tashmë një vlerësim" });
      }
      const parsedRating = Math.min(5, Math.max(1, parseInt(rating)));
      const fb = await storage.createFeedback({
        jobId, clientId: clientId || null,
        rating: parsedRating,
        comment: comment || null,
      });
      const job = await storage.getJob(jobId);
      const starText = '★'.repeat(parsedRating) + '☆'.repeat(5 - parsedRating);
      await storage.createNotification({
        type: "feedback_received",
        title: "Vlerësim i Ri",
        message: `Vlerësim ${starText} (${parsedRating}/5) për punën "${job?.workType || 'N/A'}" - ${job?.clientName || 'Klient'}${comment ? ': "' + comment.substring(0, 100) + '"' : ''}`,
        jobId,
        isRead: 0,
      });
      res.status(201).json(fb);
    } catch (err) {
      console.error('Create feedback error:', err);
      res.status(500).json({ message: "Gabim ne krijimin e vleresimit" });
    }
  });

  app.delete('/api/feedback/:id', requireAuth, async (req, res) => {
    const id = parseInt(req.params.id as string);
    if (isNaN(id)) return res.status(400).json({ message: "ID e pavlefshme" });
    await storage.deleteFeedback(id);
    res.status(204).send();
  });

  // ==================== PUBLIC FEEDBACK (no auth) ====================

  app.get('/api/public/rate/:token', async (req, res) => {
    try {
      const { token } = req.params;
      if (!token || token.length < 10) return res.status(400).json({ message: "Token i pavlefshëm" });
      const job = await storage.getJobByFeedbackToken(token);
      if (!job) return res.status(404).json({ message: "Puna nuk u gjet" });
      const existingFeedback = await storage.getFeedback(job.id);
      res.json({
        workType: job.workType,
        category: job.category,
        hasFeedback: existingFeedback.length > 0,
        existingRating: existingFeedback.length > 0 ? existingFeedback[0].rating : null,
      });
    } catch (err) {
      console.error('Public rate get error:', err);
      res.status(500).json({ message: "Gabim" });
    }
  });

  app.post('/api/public/rate/:token', async (req, res) => {
    try {
      const { token } = req.params;
      if (!token || token.length < 10) return res.status(400).json({ message: "Token i pavlefshëm" });
      const job = await storage.getJobByFeedbackToken(token);
      if (!job) return res.status(404).json({ message: "Puna nuk u gjet" });
      const ratingSchema = z.object({
        rating: z.coerce.number().min(1).max(5),
        comment: z.string().max(500).optional().default(""),
      });
      const parsed = ratingSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ message: "Vlerësimi duhet të jetë 1-5" });
      }
      const existingFeedback = await storage.getFeedback(job.id);
      if (existingFeedback.length > 0) {
        return res.status(400).json({ message: "Keni dhënë tashmë vlerësimin" });
      }
      const fb = await storage.createFeedback({
        jobId: job.id,
        clientId: job.clientId || null,
        rating: parsed.data.rating,
        comment: parsed.data.comment || null,
      });
      const starText = '★'.repeat(parsed.data.rating) + '☆'.repeat(5 - parsed.data.rating);
      await storage.createNotification({
        type: "feedback_received",
        title: "Vlerësim i Ri nga Klienti",
        message: `${job.clientName || 'Klient'} vlerësoi punën "${job.workType}" me ${starText} (${parsed.data.rating}/5)${parsed.data.comment ? ': "' + parsed.data.comment.substring(0, 100) + '"' : ''}`,
        jobId: job.id,
        isRead: 0,
      });
      res.status(201).json({ id: fb.id, rating: fb.rating });
    } catch (err) {
      console.error('Public rate post error:', err);
      res.status(500).json({ message: "Gabim" });
    }
  });

  app.post('/api/jobs/:id/generate-feedback-token', requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id as string);
      if (isNaN(id)) return res.status(400).json({ message: "ID e pavlefshme" });
      const job = await storage.getJob(id);
      if (!job) return res.status(404).json({ message: "Puna nuk u gjet" });
      if (job.feedbackToken) {
        return res.json({ token: job.feedbackToken });
      }
      const token = crypto.randomBytes(16).toString('hex');
      await storage.updateJob(id, { feedbackToken: token } as any);
      res.json({ token });
    } catch (err) {
      console.error('Generate feedback token error:', err);
      res.status(500).json({ message: "Gabim" });
    }
  });

  // ==================== WARRANTY TRACKING ====================

  app.get('/api/warranties', requireAuth, async (_req, res) => {
    try {
      const allJobs = await storage.getJobs();
      const completedJobs = allJobs.filter(j => j.status === 'e_perfunduar' && j.completedDate);
      const warranties = completedJobs.map(j => {
        const completedDate = new Date(j.completedDate!);
        const months = j.warrantyMonths || 12;
        const expiresDate = new Date(completedDate);
        expiresDate.setMonth(expiresDate.getMonth() + months);
        const now = new Date();
        const daysLeft = Math.ceil((expiresDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        return {
          jobId: j.id,
          invoiceNumber: j.invoiceNumber,
          clientName: j.clientName,
          clientPhone: j.clientPhone,
          workType: j.workType,
          category: j.category,
          completedDate: j.completedDate,
          warrantyMonths: months,
          expiresDate: expiresDate.toISOString().split('T')[0],
          daysLeft,
          isExpired: daysLeft <= 0,
          isExpiringSoon: daysLeft > 0 && daysLeft <= 30,
        };
      }).sort((a, b) => a.daysLeft - b.daysLeft);
      res.json(warranties);
    } catch (err) {
      console.error('Warranty tracking error:', err);
      res.status(500).json({ message: "Gabim" });
    }
  });

  // ==================== REMINDERS (check on startup) ====================
  try {
    const allJobs = await storage.getJobs();
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];
    const todayStr = today.toISOString().split('T')[0];

    for (const job of allJobs) {
      if (job.isTemplate || job.status === 'e_perfunduar') continue;
      const schedDate = job.scheduledDate || job.workDate;
      if (schedDate === tomorrowStr || schedDate === todayStr) {
        const existing = await storage.getNotifications();
        const alreadyNotified = existing.some(n =>
          n.type === 'upcoming_work' && n.jobId === job.id &&
          n.createdAt && new Date(n.createdAt).toISOString().split('T')[0] === todayStr
        );
        if (!alreadyNotified) {
          const label = schedDate === todayStr ? 'Sot' : 'Neser';
          await storage.createNotification({
            type: 'upcoming_work',
            title: `Pune ${label}`,
            message: `${job.clientName} - ${job.workType} (${job.invoiceNumber || '#' + job.id})`,
            jobId: job.id,
            catalogItemId: null,
            isRead: 0,
            userId: job.userId || null,
          });
        }
      }
    }

    const completedJobs = allJobs.filter(j => j.status === 'e_perfunduar' && j.completedDate);
    for (const job of completedJobs) {
      const completedDate = new Date(job.completedDate!);
      const months = job.warrantyMonths || 12;
      const expiresDate = new Date(completedDate);
      expiresDate.setMonth(expiresDate.getMonth() + months);
      const daysLeft = Math.ceil((expiresDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      if (daysLeft <= 30) {
        const existingNotifs = await storage.getNotifications();
        const alreadyNotified = existingNotifs.some(n =>
          n.type === 'warranty_expiring' && n.jobId === job.id &&
          n.createdAt && new Date(n.createdAt).toISOString().split('T')[0] === todayStr
        );
        if (!alreadyNotified) {
          if (daysLeft <= 0) {
            await storage.createNotification({
              type: 'warranty_expiring',
              title: 'Garancia ka skaduar',
              message: `${job.clientName} - ${job.invoiceNumber || '#' + job.id}: Garancia ka skaduar ${Math.abs(daysLeft)} dite me pare`,
              jobId: job.id,
              catalogItemId: null,
              isRead: 0,
              userId: null,
            });
          } else {
            await storage.createNotification({
              type: 'warranty_expiring',
              title: 'Garancia skadon se shpejti',
              message: `${job.clientName} - ${job.invoiceNumber || '#' + job.id}: ${daysLeft} dite te mbetura`,
              jobId: job.id,
              catalogItemId: null,
              isRead: 0,
              userId: null,
            });
          }
        }
      }
    }

    const allCatalogForStock = await storage.getCatalogItems();
    const lowStockItems = allCatalogForStock.filter(c => c.minStockLevel && c.minStockLevel > 0 && (c.currentStock || 0) <= c.minStockLevel);
    for (const item of lowStockItems) {
      const existingNotifs = await storage.getNotifications();
      const alreadyNotified = existingNotifs.some(n =>
        n.type === 'low_stock' && n.catalogItemId === item.id &&
        n.createdAt && new Date(n.createdAt).toISOString().split('T')[0] === todayStr
      );
      if (!alreadyNotified) {
        await storage.createNotification({
          type: 'low_stock',
          title: 'Stoku i ulët',
          message: `${item.name}: ${item.currentStock || 0} ${item.unit} mbetur (min: ${item.minStockLevel})`,
          catalogItemId: item.id,
          jobId: null,
          isRead: 0,
          userId: null,
        });
      }
    }

    const currentDay = today.getDate();
    if (currentDay <= 3) {
      const existingNotifs = await storage.getNotifications();
      const thisMonthKey = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;
      const alreadySummary = existingNotifs.some(n =>
        n.type === 'monthly_summary' &&
        n.createdAt && n.createdAt.toISOString().substring(0, 7) === thisMonthKey
      );
      if (!alreadySummary) {
        const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        const lastMonthStart = `${lastMonth.getFullYear()}-${String(lastMonth.getMonth() + 1).padStart(2, '0')}-01`;
        const lastMonthEnd = new Date(today.getFullYear(), today.getMonth(), 0);
        const lastMonthEndStr = `${lastMonthEnd.getFullYear()}-${String(lastMonthEnd.getMonth() + 1).padStart(2, '0')}-${String(lastMonthEnd.getDate()).padStart(2, '0')}`;

        const lastMonthCompletedJobs = allJobs.filter(j => {
          if (j.status !== 'e_perfunduar' || j.isTemplate) return false;
          const d = j.completedDate || (j.updatedAt ? new Date(j.updatedAt).toISOString().split('T')[0] : null);
          return d && d >= lastMonthStart && d <= lastMonthEndStr;
        });

        let lastMonthRevenue = 0;
        for (const job of lastMonthCompletedJobs) {
          const { quantities } = getJobMaterialTotals(job);
          const prices = (job.prices || {}) as Record<string, number>;
          for (const [name, qty] of Object.entries(quantities)) {
            lastMonthRevenue += (prices[name] || 0) * qty;
          }
        }

        const lastMonthExpenses = await storage.getExpenses({ startDate: lastMonthStart, endDate: lastMonthEndStr });
        const lastMonthExpenseTotal = lastMonthExpenses.reduce((s, e) => s + e.amount, 0);

        await storage.createNotification({
          type: 'monthly_summary',
          title: 'Përmbledhje Mujore',
          message: `Muaji i kaluar: ${lastMonthCompletedJobs.length} punë, ${lastMonthRevenue.toFixed(0)} € fitim, ${lastMonthExpenseTotal.toFixed(0)} € shpenzime`,
          jobId: null,
          catalogItemId: null,
          isRead: 0,
          userId: null,
        });
      }
    }
  } catch (reminderErr) {
    console.error('Reminder check error:', reminderErr);
  }

  // --- SEED DEFAULT CATALOG ---
  // Move maintenance tasks to background to avoid blocking server boot
  (async () => {
    try {
      // --- SEED DEFAULT CATALOG ---
      const catalogList = await storage.getCatalogItems();
      if (catalogList.length === 0) {
        console.log("Seeding default catalog...");
        const defaults = [
          { category: "Pajisje elektrike", name: "Shteg EM2", unit: "copë" },
          { category: "Pajisje elektrike", name: "Shteg EM1", unit: "copë" },
          { category: "Pajisje elektrike", name: "Ndërprerës Alternativ", unit: "copë" },
          { category: "Pajisje elektrike", name: "Ndërprerës Kryqëzor", unit: "copë" },
          { category: "Pajisje elektrike", name: "Ndërprerës i Thjeshtë", unit: "copë" },
          { category: "Pajisje elektrike", name: "Tapa mbyllëse", unit: "copë" },
          { category: "Pajisje elektrike", name: "Ndërprerës për roletne", unit: "copë" },
          { category: "Pajisje elektrike", name: "Ram mbajtës 7 EM", unit: "copë" },
          { category: "Pajisje elektrike", name: "Ram mbajtës 4 EM", unit: "copë" },
          { category: "Pajisje elektrike", name: "Ram mbajtës 3 EM", unit: "copë" },
          { category: "Pajisje elektrike", name: "Ram mbajtës 2 EM", unit: "copë" },
          { category: "Pajisje elektrike", name: "Indikator për banjo", unit: "copë" },
          { category: "Pajisje elektrike", name: "Fasunga", unit: "copë" },
          { category: "Pajisje elektrike", name: "Aster Zile", unit: "copë" },
          { category: "Kabllo & Gypa", name: "Kabell 5×10", unit: "metër" },
          { category: "Kabllo & Gypa", name: "Kabell 5×2.5", unit: "metër" },
          { category: "Kabllo & Gypa", name: "Kabell 3×2.5", unit: "metër" },
          { category: "Kabllo & Gypa", name: "Kabell 3×1.5", unit: "metër" },
          { category: "Kabllo & Gypa", name: "Kabell 4×0.75", unit: "metër" },
          { category: "Kabllo & Gypa", name: "Kabëll antene", unit: "metër" },
          { category: "Kabllo & Gypa", name: "Kabllo Kamerave", unit: "metër" },
          { category: "Kabllo & Gypa", name: "Kabëll UTP për interfon", unit: "metër" },
          { category: "Kabllo & Gypa", name: "Tabelë e siguresave (3 rendëshe)", unit: "copë" },
          { category: "Kabllo & Gypa", name: "Kuti modulare M7", unit: "copë" },
          { category: "Kabllo & Gypa", name: "Kuti modulare M4", unit: "copë" },
          { category: "Kabllo & Gypa", name: "Kuti modulare M3", unit: "copë" },
          { category: "Kabllo & Gypa", name: "Kuti modulare M2", unit: "copë" },
          { category: "Kabllo & Gypa", name: "Kuti FI 150", unit: "copë" },
          { category: "Kabllo & Gypa", name: "Cevë (GYP) FI 32", unit: "metër" },
          { category: "Kabllo & Gypa", name: "Cevë (GYP) FI 25", unit: "metër" },
          { category: "Kabllo & Gypa", name: "Cevë (GYP) FI 16", unit: "metër" },
          { category: "Kabllo & Gypa", name: "Cevë (GYP) FI 11", unit: "metër" },
          { category: "Kabllo & Gypa", name: "GIPS", unit: "copë" },
          { category: "Kabllo & Gypa", name: "Trakë shparingu", unit: "copë" },
          { category: "Kabllo & Gypa", name: "Gozhda betoni", unit: "copë" },
          { category: "Kabllo & Gypa", name: "Vazhduese gypi", unit: "copë" },
          { category: "Kamera", name: "Kamera Dahua 5MP", unit: "copë" },
          { category: "Kamera", name: "Kamera Hikvision 5MP", unit: "copë" },
          { category: "Kamera", name: "Kamera Dahua 2MP", unit: "copë" },
          { category: "Kamera", name: "DVR/NVR 4 kanale", unit: "copë" },
          { category: "Kamera", name: "DVR/NVR 8 kanale", unit: "copë" },
          { category: "Kamera", name: "HDD 1TB", unit: "copë" },
          { category: "Kamera", name: "HDD 2TB", unit: "copë" },
          { category: "Kamera", name: "HDD 4TB", unit: "copë" },
          { category: "Kamera", name: "Konektor BNC", unit: "copë" },
          { category: "Kamera", name: "Konektor DC", unit: "copë" },
          { category: "Kamera", name: "Konektor RJ45", unit: "copë" },
          { category: "Kamera", name: "Kuti për kamera", unit: "copë" },
          { category: "Kamera", name: "Adapter 12V", unit: "copë" },
          { category: "Kamera", name: "Switch PoE", unit: "copë" },
          { category: "Interfon", name: "Monitor Interfoni", unit: "copë" },
          { category: "Interfon", name: "Panel i jashtëm", unit: "copë" },
          { category: "Interfon", name: "Adapter Interfoni", unit: "copë" },
          { category: "Interfon", name: "Kuti për monitor", unit: "copë" },
          { category: "Interfon", name: "Kabell Interfoni UTP", unit: "metër" },
          { category: "Alarm", name: "Panel alarmi", unit: "copë" },
          { category: "Alarm", name: "Tastierë alarmi", unit: "copë" },
          { category: "Alarm", name: "Sirenë brenda", unit: "copë" },
          { category: "Alarm", name: "Sirenë jashtë", unit: "copë" },
          { category: "Alarm", name: "Sensor lëvizje (PIR)", unit: "copë" },
          { category: "Alarm", name: "Magnet dere/dritare", unit: "copë" },
          { category: "Alarm", name: "Battery 12V", unit: "copë" },
          { category: "Punë/Shërbime", name: "Ndërrim llusteri", unit: "copë" },
          { category: "Punë/Shërbime", name: "Ndërrim shtikeri", unit: "copë" },
          { category: "Punë/Shërbime", name: "Ndërrim ndërprerësi", unit: "copë" },
          { category: "Punë/Shërbime", name: "Hapje kanal / shparingu", unit: "metër" },
          { category: "Punë/Shërbime", name: "Montim gypi", unit: "metër" },
          { category: "Punë/Shërbime", name: "Montim kutie modulare", unit: "copë" },
          { category: "Punë/Shërbime", name: "Montim tabelë siguresash", unit: "copë" },
          { category: "Punë/Shërbime", name: "Konfigurim kamera", unit: "set" },
          { category: "Punë/Shërbime", name: "Konfigurim alarmi", unit: "set" },
          { category: "Punë/Shërbime", name: "Shërbim terreni", unit: "orë" },
        ];
        for (const d of defaults) {
          await storage.createCatalogItem({
            category: d.category,
            name: d.name,
            unit: d.unit,
            purchasePrice: 0,
            salePrice: 0,
            currentStock: 0,
            minStockLevel: 0,
            notes: null,
            sortOrder: 0,
          });
        }
      }

      // Seed default admin user if no users exist
      const existingUsers = await storage.getUsers();
      if (existingUsers.length === 0) {
        console.log("Seeding default admin user...");
        const hash = await bcrypt.hash("Endrit123$", 10);
        await storage.createUser({
          username: "admin",
          passwordHash: hash,
          fullName: "Admin Elektronova",
          role: "admin",
          phone: "+383 49 771 673",
          email: null,
          isActive: 1,
          assignedCategories: [],
        });
      }

      // Seed sample job if empty
      const jobsList = await storage.getJobs();
      if (jobsList.length === 0) {
        const invNum = await generateInvoiceNumber("electric");
        await storage.createJob({
          invoiceNumber: invNum,
          clientName: "Arben Hoxha",
          clientPhone: "044 123 456",
          clientAddress: "Rruga B, Prishtinë",
          workDate: new Date().toISOString().split('T')[0],
          workType: "Instalim i ri",
          category: "electric",
          status: "oferte",
          notes: "Kati 2.",
          discountType: "percent",
          discountValue: 0,
          table1Data: { "Shteg EM2": { "Salloni": 2, "Kuzhina": 1 } },
          table2Data: { "Kabell 3×1.5": 100 },
          cameraData: {},
          intercomData: {},
          alarmData: {},
          serviceData: {},
          prices: {},
          purchasePrices: {},
          checklistData: {},
          roomProgressData: {},
          vatRate: 0,
          paymentStatus: "pa_paguar",
          paidAmount: 0,
          warrantyMonths: 12,
          isTemplate: 0,
        } as any);
      }

      // Overcome slow O(N^2) backfill by fetching once
      const allJobsForBackfill = await storage.getJobs();
      const needsBackfill = allJobsForBackfill.filter(j => !j.invoiceNumber);
      if (needsBackfill.length > 0) {
        console.log(`Backfilling invoice numbers for ${needsBackfill.length} jobs...`);
        for (const job of needsBackfill) {
          const invNum = await generateInvoiceNumber(job.category || "electric");
          await storage.updateJob(job.id, { invoiceNumber: invNum });
        }
      }
    } catch (mErr) {
      console.error("Maintenance tasks failed:", mErr);
    }
  })();

  return httpServer;
}
