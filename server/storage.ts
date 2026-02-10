import { jobs, catalogItems, type Job, type InsertJob, type CatalogItem, type InsertCatalogItem } from "@shared/schema";
import { db } from "./db";
import { eq, desc, like, or, asc } from "drizzle-orm";

export interface IStorage {
  getJobs(search?: string): Promise<Job[]>;
  getJob(id: number): Promise<Job | undefined>;
  createJob(job: InsertJob): Promise<Job>;
  updateJob(id: number, job: Partial<InsertJob>): Promise<Job>;
  deleteJob(id: number): Promise<void>;

  getCatalogItems(): Promise<CatalogItem[]>;
  getCatalogItem(id: number): Promise<CatalogItem | undefined>;
  createCatalogItem(item: InsertCatalogItem): Promise<CatalogItem>;
  updateCatalogItem(id: number, item: Partial<InsertCatalogItem>): Promise<CatalogItem>;
  deleteCatalogItem(id: number): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async getJobs(search?: string): Promise<Job[]> {
    if (search) {
      const s = `%${search.toLowerCase()}%`;
      return await db.select().from(jobs)
        .where(or(like(jobs.clientName, s), like(jobs.clientAddress, s)))
        .orderBy(desc(jobs.createdAt));
    }
    return await db.select().from(jobs).orderBy(desc(jobs.createdAt));
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
    const [updatedJob] = await db.update(jobs).set({ ...updates, updatedAt: new Date() }).where(eq(jobs.id, id)).returning();
    return updatedJob;
  }

  async deleteJob(id: number): Promise<void> {
    await db.delete(jobs).where(eq(jobs.id, id));
  }

  async getCatalogItems(): Promise<CatalogItem[]> {
    return await db.select().from(catalogItems).orderBy(asc(catalogItems.category), asc(catalogItems.sortOrder));
  }

  async getCatalogItem(id: number): Promise<CatalogItem | undefined> {
    const [item] = await db.select().from(catalogItems).where(eq(catalogItems.id, id));
    return item;
  }

  async createCatalogItem(item: InsertCatalogItem): Promise<CatalogItem> {
    const [created] = await db.insert(catalogItems).values(item).returning();
    return created;
  }

  async updateCatalogItem(id: number, updates: Partial<InsertCatalogItem>): Promise<CatalogItem> {
    const [updated] = await db.update(catalogItems).set(updates).where(eq(catalogItems.id, id)).returning();
    return updated;
  }

  async deleteCatalogItem(id: number): Promise<void> {
    await db.delete(catalogItems).where(eq(catalogItems.id, id));
  }
}

export const storage = new DatabaseStorage();
