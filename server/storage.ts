import {
  jobs, catalogItems, users, clients, priceHistory, stockEntries, jobSnapshots, notifications,
  type Job, type InsertJob,
  type CatalogItem, type InsertCatalogItem,
  type User, type InsertUser,
  type Client, type InsertClient,
  type PriceHistory, type InsertPriceHistory,
  type StockEntry, type InsertStockEntry,
  type JobSnapshot, type InsertJobSnapshot,
  type Notification, type InsertNotification,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, like, or, asc, and, gte, lte, sql } from "drizzle-orm";

export interface IStorage {
  getJobs(search?: string): Promise<Job[]>;
  getJob(id: number): Promise<Job | undefined>;
  createJob(job: InsertJob): Promise<Job>;
  updateJob(id: number, job: Partial<InsertJob>): Promise<Job>;
  deleteJob(id: number): Promise<void>;
  getTemplates(): Promise<Job[]>;
  getJobsByClientId(clientId: number): Promise<Job[]>;

  getCatalogItems(): Promise<CatalogItem[]>;
  getCatalogItem(id: number): Promise<CatalogItem | undefined>;
  createCatalogItem(item: InsertCatalogItem): Promise<CatalogItem>;
  updateCatalogItem(id: number, item: Partial<InsertCatalogItem>): Promise<CatalogItem>;
  deleteCatalogItem(id: number): Promise<void>;

  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUsers(): Promise<User[]>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, updates: Partial<InsertUser>): Promise<User>;

  getClients(): Promise<Client[]>;
  getClient(id: number): Promise<Client | undefined>;
  createClient(client: InsertClient): Promise<Client>;
  updateClient(id: number, updates: Partial<InsertClient>): Promise<Client>;
  deleteClient(id: number): Promise<void>;
  searchClients(query: string): Promise<Client[]>;

  getPriceHistory(catalogItemId?: number): Promise<PriceHistory[]>;
  createPriceHistory(entry: InsertPriceHistory): Promise<PriceHistory>;

  getStockEntries(catalogItemId?: number): Promise<StockEntry[]>;
  createStockEntry(entry: InsertStockEntry): Promise<StockEntry>;
  updateCatalogStock(id: number, newStock: number): Promise<void>;
  getLowStockItems(): Promise<CatalogItem[]>;

  getJobSnapshots(jobId: number): Promise<JobSnapshot[]>;
  createJobSnapshot(snapshot: InsertJobSnapshot): Promise<JobSnapshot>;

  getNotifications(userId?: number): Promise<Notification[]>;
  getUnreadNotificationCount(userId?: number): Promise<number>;
  createNotification(notification: InsertNotification): Promise<Notification>;
  markNotificationRead(id: number): Promise<void>;
  markAllNotificationsRead(userId?: number): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  // --- JOBS ---
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

  async getTemplates(): Promise<Job[]> {
    return await db.select().from(jobs).where(eq(jobs.isTemplate, 1)).orderBy(desc(jobs.createdAt));
  }

  async getJobsByClientId(clientId: number): Promise<Job[]> {
    return await db.select().from(jobs).where(eq(jobs.clientId, clientId)).orderBy(desc(jobs.createdAt));
  }

  // --- CATALOG ---
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

  // --- USERS ---
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async getUsers(): Promise<User[]> {
    return await db.select().from(users).orderBy(asc(users.fullName));
  }

  async createUser(user: InsertUser): Promise<User> {
    const [created] = await db.insert(users).values(user).returning();
    return created;
  }

  async updateUser(id: number, updates: Partial<InsertUser>): Promise<User> {
    const [updated] = await db.update(users).set(updates).where(eq(users.id, id)).returning();
    return updated;
  }

  // --- CLIENTS ---
  async getClients(): Promise<Client[]> {
    return await db.select().from(clients).orderBy(asc(clients.name));
  }

  async getClient(id: number): Promise<Client | undefined> {
    const [client] = await db.select().from(clients).where(eq(clients.id, id));
    return client;
  }

  async createClient(client: InsertClient): Promise<Client> {
    const [created] = await db.insert(clients).values(client).returning();
    return created;
  }

  async updateClient(id: number, updates: Partial<InsertClient>): Promise<Client> {
    const [updated] = await db.update(clients).set({ ...updates, updatedAt: new Date() }).where(eq(clients.id, id)).returning();
    return updated;
  }

  async deleteClient(id: number): Promise<void> {
    await db.delete(clients).where(eq(clients.id, id));
  }

  async searchClients(query: string): Promise<Client[]> {
    const s = `%${query.toLowerCase()}%`;
    return await db.select().from(clients)
      .where(or(like(clients.name, s), like(clients.phone, s), like(clients.address, s)))
      .orderBy(asc(clients.name));
  }

  // --- PRICE HISTORY ---
  async getPriceHistory(catalogItemId?: number): Promise<PriceHistory[]> {
    if (catalogItemId) {
      return await db.select().from(priceHistory)
        .where(eq(priceHistory.catalogItemId, catalogItemId))
        .orderBy(desc(priceHistory.changedAt));
    }
    return await db.select().from(priceHistory).orderBy(desc(priceHistory.changedAt));
  }

  async createPriceHistory(entry: InsertPriceHistory): Promise<PriceHistory> {
    const [created] = await db.insert(priceHistory).values(entry).returning();
    return created;
  }

  // --- STOCK ENTRIES ---
  async getStockEntries(catalogItemId?: number): Promise<StockEntry[]> {
    if (catalogItemId) {
      return await db.select().from(stockEntries)
        .where(eq(stockEntries.catalogItemId, catalogItemId))
        .orderBy(desc(stockEntries.createdAt));
    }
    return await db.select().from(stockEntries).orderBy(desc(stockEntries.createdAt));
  }

  async createStockEntry(entry: InsertStockEntry): Promise<StockEntry> {
    const [created] = await db.insert(stockEntries).values(entry).returning();
    return created;
  }

  async updateCatalogStock(id: number, newStock: number): Promise<void> {
    await db.update(catalogItems).set({ currentStock: newStock }).where(eq(catalogItems.id, id));
  }

  async getLowStockItems(): Promise<CatalogItem[]> {
    return await db.select().from(catalogItems)
      .where(sql`${catalogItems.currentStock} <= ${catalogItems.minStockLevel} AND ${catalogItems.minStockLevel} > 0`)
      .orderBy(asc(catalogItems.name));
  }

  // --- JOB SNAPSHOTS ---
  async getJobSnapshots(jobId: number): Promise<JobSnapshot[]> {
    return await db.select().from(jobSnapshots)
      .where(eq(jobSnapshots.jobId, jobId))
      .orderBy(desc(jobSnapshots.createdAt));
  }

  async createJobSnapshot(snapshot: InsertJobSnapshot): Promise<JobSnapshot> {
    const [created] = await db.insert(jobSnapshots).values(snapshot).returning();
    return created;
  }

  // --- NOTIFICATIONS ---
  async getNotifications(userId?: number): Promise<Notification[]> {
    if (userId) {
      return await db.select().from(notifications)
        .where(or(eq(notifications.userId, userId), sql`${notifications.userId} IS NULL`))
        .orderBy(desc(notifications.createdAt));
    }
    return await db.select().from(notifications).orderBy(desc(notifications.createdAt));
  }

  async getUnreadNotificationCount(userId?: number): Promise<number> {
    if (userId) {
      const result = await db.select({ count: sql<number>`count(*)` }).from(notifications)
        .where(and(
          eq(notifications.isRead, 0),
          or(eq(notifications.userId, userId), sql`${notifications.userId} IS NULL`)
        ));
      return Number(result[0]?.count || 0);
    }
    const result = await db.select({ count: sql<number>`count(*)` }).from(notifications)
      .where(eq(notifications.isRead, 0));
    return Number(result[0]?.count || 0);
  }

  async createNotification(notification: InsertNotification): Promise<Notification> {
    const [created] = await db.insert(notifications).values(notification).returning();
    return created;
  }

  async markNotificationRead(id: number): Promise<void> {
    await db.update(notifications).set({ isRead: 1 }).where(eq(notifications.id, id));
  }

  async markAllNotificationsRead(userId?: number): Promise<void> {
    if (userId) {
      await db.update(notifications).set({ isRead: 1 })
        .where(or(eq(notifications.userId, userId), sql`${notifications.userId} IS NULL`));
    } else {
      await db.update(notifications).set({ isRead: 1 });
    }
  }
}

export const storage = new DatabaseStorage();
