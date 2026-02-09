import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  // List Jobs
  app.get(api.jobs.list.path, async (req, res) => {
    const search = req.query.search as string | undefined;
    const jobs = await storage.getJobs(search);
    res.json(jobs);
  });

  // Get Job
  app.get(api.jobs.get.path, async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID" });
    }
    const job = await storage.getJob(id);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }
    res.json(job);
  });

  // Create Job
  app.post(api.jobs.create.path, async (req, res) => {
    try {
      const input = api.jobs.create.input.parse(req.body);
      const job = await storage.createJob(input);
      res.status(201).json(job);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  // Update Job
  app.put(api.jobs.update.path, async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID" });
    }
    
    try {
      const existingJob = await storage.getJob(id);
      if (!existingJob) {
        return res.status(404).json({ message: "Job not found" });
      }

      const input = api.jobs.update.input.parse(req.body);
      const updatedJob = await storage.updateJob(id, input);
      res.json(updatedJob);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  // Delete Job
  app.delete(api.jobs.delete.path, async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID" });
    }
    
    const existingJob = await storage.getJob(id);
    if (!existingJob) {
      return res.status(404).json({ message: "Job not found" });
    }
    
    await storage.deleteJob(id);
    res.status(204).send();
  });

  // Seed sample data if empty
  const jobs = await storage.getJobs();
  if (jobs.length === 0) {
    console.log("Seeding database with example job...");
    await storage.createJob({
      clientName: "Arben Hoxha",
      clientPhone: "044 123 456",
      clientAddress: "Rruga B, Prishtinë",
      workDate: new Date().toISOString().split('T')[0],
      workType: "Instalim i ri",
      notes: "Hyrje e veçantë, kati 2.",
      table1Data: {
        "Shteg EM2": { "Salloni": 2, "Kuzhina": 1 },
        "Fasunga": { "Salloni": 1, "Dhoma": 1 }
      },
      table2Data: {
        "Kabell 3×1.5": 100,
        "GIPS": 5
      }
    });
  }

  return httpServer;
}
