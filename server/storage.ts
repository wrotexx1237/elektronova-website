import { jobs, type Job, type InsertJob } from "@shared/schema";
import { db } from "./db";
import { eq, desc, like, or } from "drizzle-orm";

export interface IStorage {
  getJobs(search?: string): Promise<Job[]>;
  getJob(id: number): Promise<Job | undefined>;
  createJob(job: InsertJob): Promise<Job>;
  updateJob(id: number, job: Partial<InsertJob>): Promise<Job>;
  deleteJob(id: number): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async getJobs(search?: string): Promise<Job[]> {
    const query = db.select().from(jobs).orderBy(desc(jobs.createdAt));
    
    if (search) {
      const searchLower = `%${search.toLowerCase()}%`;
      return await db.select().from(jobs)
        .where(
          or(
            like(jobs.clientName, searchLower),
            like(jobs.clientAddress, searchLower)
          )
        )
        .orderBy(desc(jobs.createdAt));
    }
    
    return await query;
  }

  async getJob(id: number): Promise<Job | undefined> {
    const [job] = await db.select().from(jobs).where(eq(jobs.id, id));
    return job;
  }

  async createJob(insertJob: InsertJob): Promise<Job> {
    const [job] = await db.insert(jobs).values(insertJob).returning();
    return job;
  }

  async updateJob(id: number, updates: Partial<InsertJob>): Promise<Job> {
    const [updatedJob] = await db
      .update(jobs)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(jobs.id, id))
      .returning();
    return updatedJob;
  }

  async deleteJob(id: number): Promise<void> {
    await db.delete(jobs).where(eq(jobs.id, id));
  }
}

export const storage = new DatabaseStorage();
