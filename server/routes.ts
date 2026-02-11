import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import { CATEGORIES } from "@shared/schema";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  // --- JOBS ---
  app.get(api.jobs.list.path, async (req, res) => {
    const search = req.query.search as string | undefined;
    const jobsList = await storage.getJobs(search);
    res.json(jobsList);
  });

  app.get(api.jobs.get.path, async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ message: "Invalid ID" });
    const job = await storage.getJob(id);
    if (!job) return res.status(404).json({ message: "Job not found" });
    res.json(job);
  });

  app.post(api.jobs.create.path, async (req, res) => {
    try {
      const input = api.jobs.create.input.parse(req.body);
      const job = await storage.createJob(input);
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

  // --- CATALOG ---
  app.get(api.catalog.list.path, async (_req, res) => {
    const items = await storage.getCatalogItems();
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

  // --- REFRESH PRICES (update all jobs with latest catalog prices) ---
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
        notes: null,
        sortOrder: 0,
      });
    }
  }

  // Seed sample job if empty
  const jobsList = await storage.getJobs();
  if (jobsList.length === 0) {
    await storage.createJob({
      clientName: "Arben Hoxha",
      clientPhone: "044 123 456",
      clientAddress: "Rruga B, Prishtinë",
      workDate: new Date().toISOString().split('T')[0],
      workType: "Instalim i ri",
      category: "electric",
      notes: "Kati 2.",
      table1Data: { "Shteg EM2": { "Salloni": 2, "Kuzhina": 1 } },
      table2Data: { "Kabell 3×1.5": 100 },
      cameraData: {},
      intercomData: {},
      alarmData: {},
      serviceData: {},
      prices: {},
      purchasePrices: {},
      checklistData: {},
    });
  }

  return httpServer;
}
