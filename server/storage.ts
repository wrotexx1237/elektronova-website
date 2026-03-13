import {
  jobs, catalogItems, users, clients, priceHistory, stockEntries, jobSnapshots, notifications, workers,
  suppliers, supplierPrices, expenses, feedback,
  type Job, type InsertJob,
  type CatalogItem, type InsertCatalogItem,
  type User, type InsertUser,
  type Client, type InsertClient,
  type PriceHistory, type InsertPriceHistory,
  type StockEntry, type InsertStockEntry,
  type JobSnapshot, type InsertJobSnapshot,
  type Notification, type InsertNotification,
  type Supplier, type InsertSupplier,
  type SupplierPrice, type InsertSupplierPrice,
  type Expense, type InsertExpense,
  type Feedback, type InsertFeedback,
  type Worker, type InsertWorker,
  leaveRequests, attendance, payslips, workerHistory, 
  type LeaveRequest, type InsertLeaveRequest,
  type Attendance, type InsertAttendance,
  type Payslip, type InsertPayslip,
  type WorkerHistory, type InsertWorkerHistory,
} from "../shared/schema";
import { db } from "./db";
import { eq, desc, like, or, asc, and, gte, lte, sql } from "drizzle-orm";

export interface IStorage {
  getJobs(search?: string): Promise<Job[]>;
  getJob(id: number): Promise<Job | undefined>;
  getJobByFeedbackToken(token: string): Promise<Job | undefined>;
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
  updateUser(id: number, updates: Partial<any>): Promise<User>;

  getClients(): Promise<Client[]>;
  getClient(id: number): Promise<Client | undefined>;
  createClient(client: InsertClient): Promise<Client>;
  updateClient(id: number, updates: Partial<InsertClient>): Promise<Client>;
  deleteClient(id: number): Promise<void>;
  searchClients(query: string): Promise<Client[]>;
  getClientByName(name: string): Promise<Client | undefined>;

  getWorkers(): Promise<Worker[]>;
  getWorker(id: number): Promise<Worker | undefined>;
  getWorkerByToken(token: string): Promise<Worker | undefined>;
  createWorker(worker: InsertWorker): Promise<Worker>;
  updateWorker(id: number, updates: Partial<InsertWorker>): Promise<Worker>;
  deleteWorker(id: number): Promise<void>;

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
  deleteNotification(id: number): Promise<void>;
  deleteAllNotifications(userId?: number): Promise<void>;

  getSuppliers(): Promise<Supplier[]>;
  getSupplier(id: number): Promise<Supplier | undefined>;
  createSupplier(supplier: InsertSupplier): Promise<Supplier>;
  updateSupplier(id: number, updates: Partial<InsertSupplier>): Promise<Supplier>;
  deleteSupplier(id: number): Promise<void>;

  getSupplierPrices(supplierId?: number): Promise<SupplierPrice[]>;
  getSupplierPricesByItem(catalogItemId: number): Promise<SupplierPrice[]>;
  upsertSupplierPrice(data: InsertSupplierPrice): Promise<SupplierPrice>;
  deleteSupplierPrice(id: number): Promise<void>;

  getExpenses(filters?: { startDate?: string; endDate?: string; category?: string }): Promise<Expense[]>;
  getExpense(id: number): Promise<Expense | undefined>;
  createExpense(expense: InsertExpense): Promise<Expense>;
  updateExpense(id: number, updates: Partial<InsertExpense>): Promise<Expense>;
  deleteExpense(id: number): Promise<void>;

  getFeedback(jobId?: number): Promise<Feedback[]>;
  createFeedback(fb: InsertFeedback): Promise<Feedback>;
  deleteFeedback(id: number): Promise<void>;

  // --- Leave Requests ---
  getLeaveRequests(workerId?: number): Promise<LeaveRequest[]>;
  getLeaveRequest(id: number): Promise<LeaveRequest | undefined>;
  createLeaveRequest(data: InsertLeaveRequest): Promise<LeaveRequest>;
  updateLeaveRequest(id: number, data: Partial<InsertLeaveRequest>): Promise<LeaveRequest>;
  deleteLeaveRequest(id: number): Promise<void>;

  // --- Attendance ---
  getAttendances(workerId?: number, month?: string): Promise<Attendance[]>; // month format YYYY-MM optional
  getAttendance(id: number): Promise<Attendance | undefined>;
  createAttendance(data: InsertAttendance): Promise<Attendance>;
  updateAttendance(id: number, data: Partial<InsertAttendance>): Promise<Attendance>;
  deleteAttendance(id: number): Promise<void>;

  // --- Payslips ---
  getPayslips(workerId?: number): Promise<Payslip[]>;
  getPayslip(id: number): Promise<Payslip | undefined>;
  createPayslip(data: InsertPayslip): Promise<Payslip>;
  updatePayslip(id: number, data: Partial<InsertPayslip>): Promise<Payslip>;
  deletePayslip(id: number): Promise<void>;

  // --- Worker History ---
  getWorkerHistory(workerId?: number): Promise<WorkerHistory[]>;
  createWorkerHistory(data: InsertWorkerHistory): Promise<WorkerHistory>;

  // --- Helpers for Automations ---
  getPendingLeaveRequests(): Promise<LeaveRequest[]>;
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

  async getJobByFeedbackToken(token: string): Promise<Job | undefined> {
    const [job] = await db.select().from(jobs).where(eq(jobs.feedbackToken, token));
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

  async updateUser(id: number, updates: Partial<any>): Promise<User> {
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

  async getClientByName(name: string): Promise<Client | undefined> {
    const [client] = await db.select().from(clients).where(eq(sql`lower(${clients.name})`, name.toLowerCase()));
    return client;
  }

  // --- WORKERS ---
  async getWorkers(): Promise<Worker[]> {
    return await db.select().from(workers).orderBy(asc(workers.name));
  }

  async getWorker(id: number): Promise<Worker | undefined> {
    const [worker] = await db.select().from(workers).where(eq(workers.id, id));
    return worker;
  }

  async getWorkerByToken(token: string): Promise<Worker | undefined> {
    const [worker] = await db.select().from(workers).where(eq(workers.portalToken, token));
    return worker;
  }

  async createWorker(worker: InsertWorker): Promise<Worker> {
    const crypto = await import('crypto');
    const token = crypto.randomBytes(12).toString('hex');
    const [created] = await db.insert(workers).values({ ...worker, portalToken: token }).returning();
    return created;
  }

  async updateWorker(id: number, updates: Partial<InsertWorker>): Promise<Worker> {
    const [updated] = await db.update(workers).set({ ...updates, updatedAt: new Date() }).where(eq(workers.id, id)).returning();
    return updated;
  }

  async deleteWorker(id: number): Promise<void> {
    await db.delete(workers).where(eq(workers.id, id));
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

  async deleteNotification(id: number): Promise<void> {
    await db.delete(notifications).where(eq(notifications.id, id));
  }

  async deleteAllNotifications(userId?: number): Promise<void> {
    if (userId) {
      await db.delete(notifications).where(eq(notifications.userId, userId));
    } else {
      await db.delete(notifications);
    }
  }

  // --- SUPPLIERS ---
  async getSuppliers(): Promise<Supplier[]> {
    return await db.select().from(suppliers).orderBy(asc(suppliers.name));
  }

  async getSupplier(id: number): Promise<Supplier | undefined> {
    const [s] = await db.select().from(suppliers).where(eq(suppliers.id, id));
    return s;
  }

  async createSupplier(supplier: InsertSupplier): Promise<Supplier> {
    const [created] = await db.insert(suppliers).values(supplier).returning();
    return created;
  }

  async updateSupplier(id: number, updates: Partial<InsertSupplier>): Promise<Supplier> {
    const [updated] = await db.update(suppliers).set(updates).where(eq(suppliers.id, id)).returning();
    return updated;
  }

  async deleteSupplier(id: number): Promise<void> {
    await db.delete(supplierPrices).where(eq(supplierPrices.supplierId, id));
    await db.delete(suppliers).where(eq(suppliers.id, id));
  }

  // --- SUPPLIER PRICES ---
  async getSupplierPrices(supplierId?: number): Promise<SupplierPrice[]> {
    if (supplierId) {
      return await db.select().from(supplierPrices)
        .where(eq(supplierPrices.supplierId, supplierId))
        .orderBy(asc(supplierPrices.catalogItemId));
    }
    return await db.select().from(supplierPrices).orderBy(asc(supplierPrices.supplierId));
  }

  async getSupplierPricesByItem(catalogItemId: number): Promise<SupplierPrice[]> {
    return await db.select().from(supplierPrices)
      .where(eq(supplierPrices.catalogItemId, catalogItemId))
      .orderBy(asc(supplierPrices.price));
  }

  async upsertSupplierPrice(data: InsertSupplierPrice): Promise<SupplierPrice> {
    const [result] = await db.insert(supplierPrices)
      .values(data)
      .onConflictDoUpdate({
        target: [supplierPrices.supplierId, supplierPrices.catalogItemId],
        set: { price: data.price, notes: data.notes, updatedAt: new Date() },
      })
      .returning();
    return result;
  }

  async deleteSupplierPrice(id: number): Promise<void> {
    await db.delete(supplierPrices).where(eq(supplierPrices.id, id));
  }

  // --- EXPENSES ---
  async getExpenses(filters?: { startDate?: string; endDate?: string; category?: string }): Promise<Expense[]> {
    const conditions: any[] = [];
    if (filters?.startDate) conditions.push(gte(expenses.date, filters.startDate));
    if (filters?.endDate) conditions.push(lte(expenses.date, filters.endDate));
    if (filters?.category) conditions.push(eq(expenses.category, filters.category));

    if (conditions.length > 0) {
      return await db.select().from(expenses).where(and(...conditions)).orderBy(desc(expenses.date));
    }
    return await db.select().from(expenses).orderBy(desc(expenses.date));
  }

  async getExpense(id: number): Promise<Expense | undefined> {
    const [e] = await db.select().from(expenses).where(eq(expenses.id, id));
    return e;
  }

  async createExpense(expense: InsertExpense): Promise<Expense> {
    const [created] = await db.insert(expenses).values(expense).returning();
    return created;
  }

  async updateExpense(id: number, updates: Partial<InsertExpense>): Promise<Expense> {
    const [updated] = await db.update(expenses).set(updates).where(eq(expenses.id, id)).returning();
    return updated;
  }

  async deleteExpense(id: number): Promise<void> {
    await db.delete(expenses).where(eq(expenses.id, id));
  }

  // --- FEEDBACK ---
  async getFeedback(jobId?: number): Promise<Feedback[]> {
    if (jobId) {
      return await db.select().from(feedback).where(eq(feedback.jobId, jobId)).orderBy(desc(feedback.createdAt));
    }
    return await db.select().from(feedback).orderBy(desc(feedback.createdAt));
  }

  async createFeedback(fb: InsertFeedback): Promise<Feedback> {
    const [created] = await db.insert(feedback).values(fb).returning();
    return created;
  }

  async deleteFeedback(id: number): Promise<void> {
    await db.delete(feedback).where(eq(feedback.id, id));
  }

  // --- LEAVE REQUESTS ---
  async getLeaveRequests(workerId?: number): Promise<LeaveRequest[]> {
    if (workerId) {
      return await db.select().from(leaveRequests).where(eq(leaveRequests.workerId, workerId)).orderBy(desc(leaveRequests.createdAt));
    }
    return await db.select().from(leaveRequests).orderBy(desc(leaveRequests.createdAt));
  }

  async getLeaveRequest(id: number): Promise<LeaveRequest | undefined> {
    const [req] = await db.select().from(leaveRequests).where(eq(leaveRequests.id, id));
    return req;
  }

  async createLeaveRequest(data: InsertLeaveRequest): Promise<LeaveRequest> {
    const [created] = await db.insert(leaveRequests).values(data).returning();
    return created;
  }

  async updateLeaveRequest(id: number, data: Partial<InsertLeaveRequest>): Promise<LeaveRequest> {
    const [updated] = await db.update(leaveRequests).set(data).where(eq(leaveRequests.id, id)).returning();
    return updated;
  }

  async deleteLeaveRequest(id: number): Promise<void> {
    await db.delete(leaveRequests).where(eq(leaveRequests.id, id));
  }

  // --- ATTENDANCE ---
  async getAttendances(workerId?: number, month?: string): Promise<Attendance[]> {
    const conditions: any[] = [];
    if (workerId) conditions.push(eq(attendance.workerId, workerId));
    if (month) conditions.push(like(attendance.date, `${month}-%`));

    if (conditions.length > 0) {
      return await db.select().from(attendance).where(and(...conditions)).orderBy(desc(attendance.date));
    }
    return await db.select().from(attendance).orderBy(desc(attendance.date));
  }

  async getAttendance(id: number): Promise<Attendance | undefined> {
    const [att] = await db.select().from(attendance).where(eq(attendance.id, id));
    return att;
  }

  async createAttendance(data: InsertAttendance): Promise<Attendance> {
    const [created] = await db.insert(attendance).values(data).returning();
    return created;
  }

  async updateAttendance(id: number, data: Partial<InsertAttendance>): Promise<Attendance> {
    const [updated] = await db.update(attendance).set(data).where(eq(attendance.id, id)).returning();
    return updated;
  }

  async deleteAttendance(id: number): Promise<void> {
    await db.delete(attendance).where(eq(attendance.id, id));
  }

  // --- PAYSLIPS ---
  async getPayslips(workerId?: number): Promise<Payslip[]> {
    if (workerId) {
      return await db.select().from(payslips).where(eq(payslips.workerId, workerId)).orderBy(desc(payslips.year), desc(payslips.month));
    }
    return await db.select().from(payslips).orderBy(desc(payslips.year), desc(payslips.month));
  }

  async getPayslip(id: number): Promise<Payslip | undefined> {
    const [slip] = await db.select().from(payslips).where(eq(payslips.id, id));
    return slip;
  }

  async createPayslip(data: InsertPayslip): Promise<Payslip> {
    const [created] = await db.insert(payslips).values(data).returning();
    return created;
  }

  async updatePayslip(id: number, data: Partial<InsertPayslip>): Promise<Payslip> {
    const [updated] = await db.update(payslips).set(data).where(eq(payslips.id, id)).returning();
    return updated;
  }

  async deletePayslip(id: number): Promise<void> {
    await db.delete(payslips).where(eq(payslips.id, id));
  }

  // --- WORKER HISTORY ---
  async getWorkerHistory(workerId?: number): Promise<WorkerHistory[]> {
    if (workerId) {
      return await db.select().from(workerHistory).where(eq(workerHistory.workerId, workerId)).orderBy(desc(workerHistory.createdAt));
    }
    return await db.select().from(workerHistory).orderBy(desc(workerHistory.createdAt));
  }

  async createWorkerHistory(data: InsertWorkerHistory): Promise<WorkerHistory> {
    const [created] = await db.insert(workerHistory).values(data).returning();
    return created;
  }

  async getPendingLeaveRequests(): Promise<LeaveRequest[]> {
    return await db.select().from(leaveRequests)
      .where(eq(leaveRequests.status, "Në Pritje"))
      .orderBy(asc(leaveRequests.createdAt));
  }
}

export const storage = new DatabaseStorage();
