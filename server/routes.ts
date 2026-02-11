import type { Express, Request, Response, NextFunction } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import { CATEGORIES, JOB_CATEGORIES, JOB_CATEGORY_PREFIXES, type JobCategory } from "@shared/schema";
import bcrypt from "bcryptjs";
import * as otplib from "otplib";
import QRCode from "qrcode";

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
    for (const qty of Object.values(rooms)) total += qty;
    quantities[itemName] = (quantities[itemName] || 0) + total;
  }

  const simpleFields = ['table2Data', 'cameraData', 'intercomData', 'alarmData', 'serviceData'] as const;
  for (const f of simpleFields) {
    const d = (job[f] || {}) as Record<string, number>;
    for (const [itemName, qty] of Object.entries(d)) {
      allItemNames.add(itemName);
      quantities[itemName] = (quantities[itemName] || 0) + qty;
    }
  }

  return { allItemNames, quantities };
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

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
        const isValid2FA = otplib.verifySync({ token: twoFactorToken, secret: user.twoFactorSecret }).valid;
        if (!isValid2FA) {
          return res.status(400).json({ message: "Kodi 2FA nuk është i saktë" });
        }
      }
      req.session.userId = user.id;
      req.session.role = user.role;
      req.session.username = user.username;
      req.session.fullName = user.fullName;
      const { passwordHash, twoFactorSecret, ...safeUser } = user;
      res.json(safeUser);
    } catch (err) {
      console.error('Login error:', err);
      res.status(500).json({ message: "Gabim në server" });
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
      const otpauthUrl = otplib.generateURI({ secret, issuer: "Elektronova", label: user.username, type: "totp" });
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
      const isValid = otplib.verifySync({ token, secret: user.twoFactorSecret }).valid;
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
      const isValid = otplib.verifySync({ token, secret: user.twoFactorSecret }).valid;
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
    const id = parseInt(req.params.id);
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

  app.get(api.jobs.list.path, requireAuth, async (req, res) => {
    const search = req.query.search as string | undefined;
    let jobsList = await storage.getJobs(search);
    if (req.session?.role !== "admin" && req.session?.userId) {
      jobsList = jobsList.filter(j => j.userId === req.session!.userId);
    }
    res.json(jobsList);
  });

  app.get(api.jobs.get.path, async (req, res) => {
    const id = parseInt(req.params.id);
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

      if (input.status === "oferte") {
        await storage.createJobSnapshot({
          jobId: job.id,
          snapshotType: "quote",
          materialData: {
            table1Data: input.table1Data,
            table2Data: input.table2Data,
            cameraData: input.cameraData,
            intercomData: input.intercomData,
            alarmData: input.alarmData,
            serviceData: input.serviceData,
          },
          prices: input.prices || {},
          purchasePrices: input.purchasePrices || {},
          totalSale: 0,
          totalPurchase: 0,
        });
      }

      res.status(201).json(job);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message, field: err.errors[0].path.join('.') });
      }
      throw err;
    }
  });

  app.put(api.jobs.update.path, async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ message: "Invalid ID" });
    try {
      const existing = await storage.getJob(id);
      if (!existing) return res.status(404).json({ message: "Job not found" });
      const input = api.jobs.update.input.parse(req.body);

      const oldStatus = existing.status;
      const newStatus = input.status;

      if (oldStatus === "oferte" && newStatus && newStatus !== "oferte") {
        const snapshots = await storage.getJobSnapshots(id);
        const hasQuote = snapshots.some(s => s.snapshotType === "quote");
        if (!hasQuote) {
          await storage.createJobSnapshot({
            jobId: id,
            snapshotType: "quote",
            materialData: {
              table1Data: existing.table1Data,
              table2Data: existing.table2Data,
              cameraData: existing.cameraData,
              intercomData: existing.intercomData,
              alarmData: existing.alarmData,
              serviceData: existing.serviceData,
            },
            prices: (existing.prices as Record<string, number>) || {},
            purchasePrices: (existing.purchasePrices as Record<string, number>) || {},
            totalSale: 0,
            totalPurchase: 0,
          });
        }
      }

      if (newStatus === "e_perfunduar" && oldStatus !== "e_perfunduar") {
        const finalData = { ...existing, ...input };
        await storage.createJobSnapshot({
          jobId: id,
          snapshotType: "actual",
          materialData: {
            table1Data: finalData.table1Data,
            table2Data: finalData.table2Data,
            cameraData: finalData.cameraData,
            intercomData: finalData.intercomData,
            alarmData: finalData.alarmData,
            serviceData: finalData.serviceData,
          },
          prices: (finalData.prices as Record<string, number>) || {},
          purchasePrices: (finalData.purchasePrices as Record<string, number>) || {},
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
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ message: "Invalid ID" });
    const existing = await storage.getJob(id);
    if (!existing) return res.status(404).json({ message: "Job not found" });
    await storage.deleteJob(id);
    res.status(204).send();
  });

  // --- DUPLICATE JOB ---
  app.post('/api/jobs/:id/duplicate', async (req, res) => {
    const id = parseInt(req.params.id);
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
    });
    res.status(201).json(duplicated);
  });

  // --- SAVE TEMPLATE ---
  app.post('/api/jobs/:id/save-template', async (req, res) => {
    const id = parseInt(req.params.id);
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
    const id = parseInt(req.params.id);
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
    });
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
    const id = parseInt(req.params.id);
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
      res.json(updated);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      throw err;
    }
  });

  app.delete(api.catalog.delete.path, async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ message: "Invalid ID" });
    const existing = await storage.getCatalogItem(id);
    if (!existing) return res.status(404).json({ message: "Item not found" });
    await storage.deleteCatalogItem(id);
    res.status(204).send();
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
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ message: "ID e pavlefshme" });
    const client = await storage.getClient(id);
    if (!client) return res.status(404).json({ message: "Klienti nuk u gjet" });
    res.json(client);
  });

  app.get('/api/clients/:id/jobs', async (req, res) => {
    const id = parseInt(req.params.id);
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
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ message: "ID e pavlefshme" });
    const existing = await storage.getClient(id);
    if (!existing) return res.status(404).json({ message: "Klienti nuk u gjet" });
    const updated = await storage.updateClient(id, req.body);
    res.json(updated);
  });

  app.delete('/api/clients/:id', async (req, res) => {
    const id = parseInt(req.params.id);
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
    const id = parseInt(req.params.id);
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

  app.put('/api/notifications/:id/read', async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ message: "ID e pavlefshme" });
    await storage.markNotificationRead(id);
    res.json({ success: true });
  });

  app.put('/api/notifications/read-all', async (req, res) => {
    const userId = req.session?.userId;
    await storage.markAllNotificationsRead(userId);
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
              message: `Oferta ${job.invoiceNumber || '#' + job.id} për ${job.clientName} ka ${daysSince} ditë pa u konfirmuar`,
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

      const monthlyData: Record<string, { revenue: number; cost: number; profit: number; jobCount: number }> = {};

      for (const job of completedJobs) {
        const date = job.updatedAt || job.createdAt;
        if (!date) continue;
        const d = new Date(date);
        const monthKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;

        if (!monthlyData[monthKey]) {
          monthlyData[monthKey] = { revenue: 0, cost: 0, profit: 0, jobCount: 0 };
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

      const months = Object.keys(monthlyData).sort();
      const trend = months.map(m => ({
        month: m,
        ...monthlyData[m],
      }));

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
      });
    } catch (err) {
      console.error('Analytics error:', err);
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
      isTemplate: 0,
    });
  }

  // Backfill invoice numbers for existing jobs that don't have one
  const allJobsForBackfill = await storage.getJobs();
  for (const job of allJobsForBackfill) {
    if (!job.invoiceNumber) {
      const invNum = await generateInvoiceNumber(job.category || "electric");
      await storage.updateJob(job.id, { invoiceNumber: invNum });
    }
  }

  return httpServer;
}
