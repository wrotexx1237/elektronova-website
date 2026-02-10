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

  // --- SEED DEFAULT CATALOG ---
  const catalogList = await storage.getCatalogItems();
  if (catalogList.length === 0) {
    console.log("Seeding default catalog...");
    const defaults = [
      { category: "Pajisje elektrike", name: "Shteg EM2", unit: "copë", servicePrice: 0 },
      { category: "Pajisje elektrike", name: "Shteg EM1", unit: "copë", servicePrice: 0 },
      { category: "Pajisje elektrike", name: "Ndërprerës Alternativ", unit: "copë", servicePrice: 0 },
      { category: "Pajisje elektrike", name: "Ndërprerës Kryqëzor", unit: "copë", servicePrice: 0 },
      { category: "Pajisje elektrike", name: "Ndërprerës i Thjeshtë", unit: "copë", servicePrice: 0 },
      { category: "Pajisje elektrike", name: "Tapa mbyllëse", unit: "copë", servicePrice: 0 },
      { category: "Pajisje elektrike", name: "Ndërprerës për roletne", unit: "copë", servicePrice: 0 },
      { category: "Pajisje elektrike", name: "Ram mbajtës 7 EM", unit: "copë", servicePrice: 0 },
      { category: "Pajisje elektrike", name: "Ram mbajtës 4 EM", unit: "copë", servicePrice: 0 },
      { category: "Pajisje elektrike", name: "Ram mbajtës 3 EM", unit: "copë", servicePrice: 0 },
      { category: "Pajisje elektrike", name: "Ram mbajtës 2 EM", unit: "copë", servicePrice: 0 },
      { category: "Pajisje elektrike", name: "Indikator për banjo", unit: "copë", servicePrice: 0 },
      { category: "Pajisje elektrike", name: "Fasunga", unit: "copë", servicePrice: 0 },
      { category: "Pajisje elektrike", name: "Aster Zile", unit: "copë", servicePrice: 0 },
      { category: "Kabllo & Gypa", name: "Kabell 5×10", unit: "metër", servicePrice: 0 },
      { category: "Kabllo & Gypa", name: "Kabell 5×2.5", unit: "metër", servicePrice: 0 },
      { category: "Kabllo & Gypa", name: "Kabell 3×2.5", unit: "metër", servicePrice: 0 },
      { category: "Kabllo & Gypa", name: "Kabell 3×1.5", unit: "metër", servicePrice: 0 },
      { category: "Kabllo & Gypa", name: "Kabell 4×0.75", unit: "metër", servicePrice: 0 },
      { category: "Kabllo & Gypa", name: "Kabëll antene", unit: "metër", servicePrice: 0 },
      { category: "Kabllo & Gypa", name: "Kabllo Kamerave", unit: "metër", servicePrice: 0 },
      { category: "Kabllo & Gypa", name: "Kabëll UTP për interfon", unit: "metër", servicePrice: 0 },
      { category: "Kabllo & Gypa", name: "Tabelë e siguresave (3 rendëshe)", unit: "copë", servicePrice: 0 },
      { category: "Kabllo & Gypa", name: "Kuti modulare M7", unit: "copë", servicePrice: 0 },
      { category: "Kabllo & Gypa", name: "Kuti modulare M4", unit: "copë", servicePrice: 0 },
      { category: "Kabllo & Gypa", name: "Kuti modulare M3", unit: "copë", servicePrice: 0 },
      { category: "Kabllo & Gypa", name: "Kuti modulare M2", unit: "copë", servicePrice: 0 },
      { category: "Kabllo & Gypa", name: "Kuti FI 150", unit: "copë", servicePrice: 0 },
      { category: "Kabllo & Gypa", name: "Cevë (GYP) FI 32", unit: "metër", servicePrice: 0 },
      { category: "Kabllo & Gypa", name: "Cevë (GYP) FI 25", unit: "metër", servicePrice: 0 },
      { category: "Kabllo & Gypa", name: "Cevë (GYP) FI 16", unit: "metër", servicePrice: 0 },
      { category: "Kabllo & Gypa", name: "Cevë (GYP) FI 11", unit: "metër", servicePrice: 0 },
      { category: "Kabllo & Gypa", name: "GIPS", unit: "copë", servicePrice: 0 },
      { category: "Kabllo & Gypa", name: "Trakë shparingu", unit: "copë", servicePrice: 0 },
      { category: "Kabllo & Gypa", name: "Gozhda betoni", unit: "copë", servicePrice: 0 },
      { category: "Kabllo & Gypa", name: "Vazhduese gypi", unit: "copë", servicePrice: 0 },
      { category: "Kamera", name: "Kamera Dahua 5MP", unit: "copë", servicePrice: 0 },
      { category: "Kamera", name: "Kamera Hikvision 5MP", unit: "copë", servicePrice: 0 },
      { category: "Kamera", name: "Kamera Dahua 2MP", unit: "copë", servicePrice: 0 },
      { category: "Kamera", name: "DVR/NVR 4 kanale", unit: "copë", servicePrice: 0 },
      { category: "Kamera", name: "DVR/NVR 8 kanale", unit: "copë", servicePrice: 0 },
      { category: "Kamera", name: "HDD 1TB", unit: "copë", servicePrice: 0 },
      { category: "Kamera", name: "HDD 2TB", unit: "copë", servicePrice: 0 },
      { category: "Kamera", name: "HDD 4TB", unit: "copë", servicePrice: 0 },
      { category: "Kamera", name: "Konektor BNC", unit: "copë", servicePrice: 0 },
      { category: "Kamera", name: "Konektor DC", unit: "copë", servicePrice: 0 },
      { category: "Kamera", name: "Konektor RJ45", unit: "copë", servicePrice: 0 },
      { category: "Kamera", name: "Kuti për kamera", unit: "copë", servicePrice: 0 },
      { category: "Kamera", name: "Adapter 12V", unit: "copë", servicePrice: 0 },
      { category: "Kamera", name: "Switch PoE", unit: "copë", servicePrice: 0 },
      { category: "Interfon", name: "Monitor Interfoni", unit: "copë", servicePrice: 0 },
      { category: "Interfon", name: "Panel i jashtëm", unit: "copë", servicePrice: 0 },
      { category: "Interfon", name: "Adapter Interfoni", unit: "copë", servicePrice: 0 },
      { category: "Interfon", name: "Kuti për monitor", unit: "copë", servicePrice: 0 },
      { category: "Interfon", name: "Kabell Interfoni UTP", unit: "metër", servicePrice: 0 },
      { category: "Alarm", name: "Panel alarmi", unit: "copë", servicePrice: 0 },
      { category: "Alarm", name: "Tastierë alarmi", unit: "copë", servicePrice: 0 },
      { category: "Alarm", name: "Sirenë brenda", unit: "copë", servicePrice: 0 },
      { category: "Alarm", name: "Sirenë jashtë", unit: "copë", servicePrice: 0 },
      { category: "Alarm", name: "Sensor lëvizje (PIR)", unit: "copë", servicePrice: 0 },
      { category: "Alarm", name: "Magnet dere/dritare", unit: "copë", servicePrice: 0 },
      { category: "Alarm", name: "Battery 12V", unit: "copë", servicePrice: 0 },
      { category: "Punë/Shërbime", name: "Ndërrim llusteri", unit: "copë", servicePrice: 0 },
      { category: "Punë/Shërbime", name: "Ndërrim shtikeri", unit: "copë", servicePrice: 0 },
      { category: "Punë/Shërbime", name: "Ndërrim ndërprerësi", unit: "copë", servicePrice: 0 },
      { category: "Punë/Shërbime", name: "Hapje kanal / shparingu", unit: "metër", servicePrice: 0 },
      { category: "Punë/Shërbime", name: "Montim gypi", unit: "metër", servicePrice: 0 },
      { category: "Punë/Shërbime", name: "Montim kutie modulare", unit: "copë", servicePrice: 0 },
      { category: "Punë/Shërbime", name: "Montim tabelë siguresash", unit: "copë", servicePrice: 0 },
      { category: "Punë/Shërbime", name: "Konfigurim kamera", unit: "set", servicePrice: 0 },
      { category: "Punë/Shërbime", name: "Konfigurim alarmi", unit: "set", servicePrice: 0 },
      { category: "Punë/Shërbime", name: "Shërbim terreni", unit: "orë", servicePrice: 0 },
    ];
    for (const d of defaults) {
      await storage.createCatalogItem({
        category: d.category,
        name: d.name,
        unit: d.unit,
        purchasePrice: 0,
        servicePrice: d.servicePrice,
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
      notes: "Kati 2.",
      table1Data: { "Shteg EM2": { "Salloni": 2, "Kuzhina": 1 } },
      table2Data: { "Kabell 3×1.5": 100 },
      cameraData: {},
      intercomData: {},
      alarmData: {},
      serviceData: {},
      prices: {},
      checklistData: {},
    });
  }

  return httpServer;
}
