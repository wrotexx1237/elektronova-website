import { pgTable, text, serial, jsonb, timestamp, integer, real, boolean, uniqueIndex } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// --- Constants (Albanian) ---

export const ROOMS = [
  "Salloni", "Kuzhina", "Dhoma", "Koridor", "Banjo",
  "Dhoma 1", "Dhoma 2", "Koridor 2", "Ballkon", "Ballkon 2", "Shkallat",
] as const;

export const CATEGORIES = [
  "Pajisje elektrike",
  "Kabllo & Gypa",
  "Kamera",
  "Interfon",
  "Alarm",
  "Punë/Shërbime",
] as const;

export const UNITS = ["copë", "metër", "set", "orë"] as const;

export const WORK_TYPES = [
  "Instalim i ri", "Riparim", "Kamera", "Interfon", "Alarm", "Tjetër",
] as const;

export const JOB_CATEGORIES = ["electric", "camera", "alarm", "intercom"] as const;
export type JobCategory = typeof JOB_CATEGORIES[number];

export const JOB_CATEGORY_LABELS: Record<JobCategory, string> = {
  electric: "Rrymë (Elektrike)",
  camera: "Kamera",
  alarm: "Alarm",
  intercom: "Interfon",
};

export const JOB_STATUSES = ["oferte", "ne_progres", "e_perfunduar"] as const;
export type JobStatus = typeof JOB_STATUSES[number];

export const JOB_STATUS_LABELS: Record<JobStatus, string> = {
  oferte: "Ofertë",
  ne_progres: "Në Progres",
  e_perfunduar: "E Përfunduar",
};

export const JOB_CATEGORY_PREFIXES: Record<JobCategory, string> = {
  electric: "ELK",
  camera: "KAM",
  alarm: "ALM",
  intercom: "INT",
};

export const DISCOUNT_TYPES = ["percent", "fixed"] as const;
export type DiscountType = typeof DISCOUNT_TYPES[number];

export const USER_ROLES = ["admin", "technician"] as const;
export type UserRole = typeof USER_ROLES[number];

export const NOTIFICATION_TYPES = ["stale_offer", "upcoming_work", "low_stock", "price_change", "job_completed", "warranty_expiring", "payment_reminder"] as const;
export type NotificationType = typeof NOTIFICATION_TYPES[number];

export const PAYMENT_STATUSES = ["pa_paguar", "pjeserisht", "paguar"] as const;
export type PaymentStatus = typeof PAYMENT_STATUSES[number];

export const PAYMENT_STATUS_LABELS: Record<PaymentStatus, string> = {
  pa_paguar: "Pa Paguar",
  pjeserisht: "Pjesërisht",
  paguar: "E Paguar",
};

export const PAYMENT_METHODS = ["cash", "bank", "other"] as const;
export type PaymentMethod = typeof PAYMENT_METHODS[number];

export const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
  cash: "Para në dorë",
  bank: "Transfer bankar",
  other: "Tjetër",
};

export const EXPENSE_CATEGORIES = ["karburant", "transport", "vegla", "material", "ushqim", "telefon", "qira", "tjeter"] as const;
export type ExpenseCategory = typeof EXPENSE_CATEGORIES[number];

export const EXPENSE_CATEGORY_LABELS: Record<ExpenseCategory, string> = {
  karburant: "Karburant",
  transport: "Transport",
  vegla: "Vegla pune",
  material: "Material",
  ushqim: "Ushqim",
  telefon: "Telefon/Internet",
  qira: "Qira",
  tjeter: "Tjetër",
};

export const STOCK_ENTRY_TYPES = ["in", "out", "adjustment"] as const;
export type StockEntryType = typeof STOCK_ENTRY_TYPES[number];

// --- Checklist Templates ---
export const CHECKLIST_ELEKTRIKE = [
  "Ndërrim i llusterit",
  "Ndërrim i shtikerit",
  "Ndërrim i ndërprerësit",
  "Shtim pikë rryme",
  "Riparim linje / shkurtim",
  "Montim panel / kuti / sigurime",
  "Testim: tension / vazhdimësi / RCD",
];

export const CHECKLIST_KAMERA = [
  "Kamera (sa copë)",
  "DVR/NVR",
  "HDD (kapaciteti)",
  "PSU / trafo",
  "Konektorë BNC/RJ45",
  "Kabllo kamera (metra)",
  "Switch/Router (nëse IP)",
  "Konfigurim (remote view)",
  "Testim natën / IR / kënd",
];

export const CHECKLIST_ALARM = [
  "Panel alarmi",
  "Tastierë",
  "Sirenë brenda/jashtë",
  "Sensorë lëvizje (PIR)",
  "Magnetë dere/dritare",
  "Battery 12V",
  "Kabllo (metra)",
  "Programim zonash",
  "Testim sirene + zonash",
];

export const CHECKLIST_INTERFON = [
  "Panel jashtë",
  "Monitor brenda",
  "PSU/transformator",
  "Kabllo (metra)",
  "Montim kasete / gyp",
  "Testim audio/video + hapje dere",
];

export const CHECKLIST_FINAL = [
  "Foto të instalimit",
  "Testim final",
  "Password/QR për klientin",
  "Remote access",
  "Garanci / shënime",
  "Nënshkrimi i klientit",
];

// --- Data Structures ---
export const table1DataSchema = z.record(z.string(), z.record(z.string(), z.number()));
export const simpleDataSchema = z.record(z.string(), z.number());
export const priceDataSchema = z.record(z.string(), z.number());
export const checklistDataSchema = z.record(z.string(), z.boolean());

// --- Users Table ---
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  fullName: text("full_name").notNull(),
  role: text("role").notNull().default("technician"),
  phone: text("phone"),
  email: text("email"),
  isActive: integer("is_active").notNull().default(1),
  assignedCategories: jsonb("assigned_categories").$type<string[]>().default([]),
  twoFactorSecret: text("two_factor_secret"),
  twoFactorEnabled: integer("two_factor_enabled").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

// --- Clients Table ---
export const clients = pgTable("clients", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  phone: text("phone"),
  address: text("address"),
  email: text("email"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertClientSchema = createInsertSchema(clients).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type Client = typeof clients.$inferSelect;
export type InsertClient = z.infer<typeof insertClientSchema>;

// --- Catalog Items Table ---
export const catalogItems = pgTable("catalog_items", {
  id: serial("id").primaryKey(),
  category: text("category").notNull(),
  name: text("name").notNull(),
  unit: text("unit").notNull().default("copë"),
  purchasePrice: real("purchase_price").default(0),
  salePrice: real("sale_price").default(0),
  currentStock: real("current_stock").default(0),
  minStockLevel: real("min_stock_level").default(0),
  notes: text("notes"),
  sortOrder: integer("sort_order").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertCatalogItemSchema = createInsertSchema(catalogItems).omit({
  id: true,
  createdAt: true,
});

export type CatalogItem = typeof catalogItems.$inferSelect;
export type InsertCatalogItem = z.infer<typeof insertCatalogItemSchema>;

// --- Price History Table ---
export const priceHistory = pgTable("price_history", {
  id: serial("id").primaryKey(),
  catalogItemId: integer("catalog_item_id").notNull(),
  itemName: text("item_name").notNull(),
  oldPurchasePrice: real("old_purchase_price"),
  newPurchasePrice: real("new_purchase_price"),
  oldSalePrice: real("old_sale_price"),
  newSalePrice: real("new_sale_price"),
  changedBy: text("changed_by"),
  changedAt: timestamp("changed_at").defaultNow(),
});

export const insertPriceHistorySchema = createInsertSchema(priceHistory).omit({
  id: true,
  changedAt: true,
});

export type PriceHistory = typeof priceHistory.$inferSelect;
export type InsertPriceHistory = z.infer<typeof insertPriceHistorySchema>;

// --- Stock Entries Table ---
export const stockEntries = pgTable("stock_entries", {
  id: serial("id").primaryKey(),
  catalogItemId: integer("catalog_item_id").notNull(),
  itemName: text("item_name").notNull(),
  entryType: text("entry_type").notNull().default("in"),
  quantity: real("quantity").notNull(),
  previousStock: real("previous_stock").default(0),
  newStock: real("new_stock").default(0),
  jobId: integer("job_id"),
  notes: text("notes"),
  createdBy: text("created_by"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertStockEntrySchema = createInsertSchema(stockEntries).omit({
  id: true,
  createdAt: true,
});

export type StockEntry = typeof stockEntries.$inferSelect;
export type InsertStockEntry = z.infer<typeof insertStockEntrySchema>;

// --- Job Snapshots Table (Quote vs Actual) ---
export const jobSnapshots = pgTable("job_snapshots", {
  id: serial("id").primaryKey(),
  jobId: integer("job_id").notNull(),
  snapshotType: text("snapshot_type").notNull().default("quote"),
  materialData: jsonb("material_data").$type<Record<string, any>>().notNull().default({}),
  prices: jsonb("prices").$type<Record<string, number>>().notNull().default({}),
  purchasePrices: jsonb("purchase_prices").$type<Record<string, number>>().notNull().default({}),
  totalSale: real("total_sale").default(0),
  totalPurchase: real("total_purchase").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertJobSnapshotSchema = createInsertSchema(jobSnapshots).omit({
  id: true,
  createdAt: true,
});

export type JobSnapshot = typeof jobSnapshots.$inferSelect;
export type InsertJobSnapshot = z.infer<typeof insertJobSnapshotSchema>;

// --- Notifications Table ---
export const notifications = pgTable("notifications", {
  id: serial("id").primaryKey(),
  type: text("type").notNull(),
  title: text("title").notNull(),
  message: text("message").notNull(),
  jobId: integer("job_id"),
  catalogItemId: integer("catalog_item_id"),
  isRead: integer("is_read").notNull().default(0),
  userId: integer("user_id"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertNotificationSchema = createInsertSchema(notifications).omit({
  id: true,
  createdAt: true,
});

export type Notification = typeof notifications.$inferSelect;
export type InsertNotification = z.infer<typeof insertNotificationSchema>;

// --- Suppliers Table ---
export const suppliers = pgTable("suppliers", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  phone: text("phone"),
  email: text("email"),
  address: text("address"),
  categories: jsonb("categories").$type<string[]>().default([]),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertSupplierSchema = createInsertSchema(suppliers).omit({
  id: true,
  createdAt: true,
});

export type Supplier = typeof suppliers.$inferSelect;
export type InsertSupplier = z.infer<typeof insertSupplierSchema>;

// --- Supplier Prices Table ---
export const supplierPrices = pgTable("supplier_prices", {
  id: serial("id").primaryKey(),
  supplierId: integer("supplier_id").notNull(),
  catalogItemId: integer("catalog_item_id").notNull(),
  price: real("price").notNull().default(0),
  notes: text("notes"),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => [
  uniqueIndex("supplier_catalog_unique").on(table.supplierId, table.catalogItemId),
]);

export const insertSupplierPriceSchema = createInsertSchema(supplierPrices).omit({
  id: true,
  updatedAt: true,
});

export type SupplierPrice = typeof supplierPrices.$inferSelect;
export type InsertSupplierPrice = z.infer<typeof insertSupplierPriceSchema>;

// --- Expenses Table ---
export const expenses = pgTable("expenses", {
  id: serial("id").primaryKey(),
  description: text("description").notNull(),
  amount: real("amount").notNull(),
  category: text("category").notNull().default("tjeter"),
  date: text("date").notNull(),
  jobId: integer("job_id"),
  supplierId: integer("supplier_id"),
  notes: text("notes"),
  createdBy: text("created_by"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertExpenseSchema = createInsertSchema(expenses).omit({
  id: true,
  createdAt: true,
});

export type Expense = typeof expenses.$inferSelect;
export type InsertExpense = z.infer<typeof insertExpenseSchema>;

// --- Feedback Table ---
export const feedback = pgTable("feedback", {
  id: serial("id").primaryKey(),
  jobId: integer("job_id").notNull(),
  clientId: integer("client_id"),
  rating: integer("rating").notNull().default(5),
  comment: text("comment"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertFeedbackSchema = createInsertSchema(feedback).omit({
  id: true,
  createdAt: true,
});

export type Feedback = typeof feedback.$inferSelect;
export type InsertFeedback = z.infer<typeof insertFeedbackSchema>;

// --- Jobs Table ---
export const jobs = pgTable("jobs", {
  id: serial("id").primaryKey(),
  invoiceNumber: text("invoice_number"),
  clientName: text("client_name").notNull(),
  clientPhone: text("client_phone"),
  clientAddress: text("client_address").notNull(),
  workDate: text("work_date").notNull(),
  workType: text("work_type").notNull(),
  category: text("category").default("electric"),
  status: text("status").default("oferte"),
  notes: text("notes"),
  scheduledDate: text("scheduled_date"),
  locationUrl: text("location_url"),
  latitude: real("latitude"),
  longitude: real("longitude"),
  feedbackToken: text("feedback_token"),
  isTemplate: integer("is_template").default(0),
  userId: integer("user_id"),
  clientId: integer("client_id"),
  supplierId: integer("supplier_id"),

  discountType: text("discount_type").default("percent"),
  discountValue: real("discount_value").default(0),

  vatRate: real("vat_rate").default(0),
  paymentStatus: text("payment_status").default("pa_paguar"),
  paidAmount: real("paid_amount").default(0),
  paymentDate: text("payment_date"),
  paymentMethod: text("payment_method"),
  warrantyMonths: integer("warranty_months").default(12),
  completedDate: text("completed_date"),

  table1Data: jsonb("table1_data").$type<Record<string, Record<string, number>>>().notNull().default({}),
  table2Data: jsonb("table2_data").$type<Record<string, number>>().notNull().default({}),
  cameraData: jsonb("camera_data").$type<Record<string, number>>().notNull().default({}),
  intercomData: jsonb("intercom_data").$type<Record<string, number>>().notNull().default({}),
  alarmData: jsonb("alarm_data").$type<Record<string, number>>().notNull().default({}),
  serviceData: jsonb("service_data").$type<Record<string, number>>().notNull().default({}),

  prices: jsonb("prices").$type<Record<string, number>>().notNull().default({}),
  purchasePrices: jsonb("purchase_prices").$type<Record<string, number>>().notNull().default({}),
  checklistData: jsonb("checklist_data").$type<Record<string, boolean>>().notNull().default({}),

  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertJobSchema = z.object({
  invoiceNumber: z.string().nullable().optional(),
  clientName: z.string().min(1, "Emri i klientit eshte i detyrueshem"),
  clientPhone: z.string().nullable().optional(),
  clientAddress: z.string().min(1, "Adresa eshte e detyrueshme"),
  workDate: z.string().min(1),
  workType: z.string().min(1),
  category: z.enum(JOB_CATEGORIES).optional().default("electric"),
  status: z.enum(JOB_STATUSES).optional().default("oferte"),
  notes: z.string().nullable().optional(),
  scheduledDate: z.string().nullable().optional(),
  locationUrl: z.string().nullable().optional(),
  latitude: z.coerce.number().nullable().optional(),
  longitude: z.coerce.number().nullable().optional(),
  feedbackToken: z.string().nullable().optional(),
  isTemplate: z.coerce.number().min(0).max(1).optional().default(0),
  userId: z.number().nullable().optional(),
  clientId: z.number().nullable().optional(),
  supplierId: z.number().nullable().optional(),
  discountType: z.enum(DISCOUNT_TYPES).optional().default("percent"),
  discountValue: z.coerce.number().min(0).optional().default(0),
  vatRate: z.coerce.number().min(0).max(100).optional().default(0),
  paymentStatus: z.enum(PAYMENT_STATUSES).optional().default("pa_paguar"),
  paidAmount: z.coerce.number().min(0).optional().default(0),
  paymentDate: z.string().nullable().optional(),
  paymentMethod: z.enum(PAYMENT_METHODS).nullable().optional(),
  warrantyMonths: z.coerce.number().min(0).optional().default(12),
  completedDate: z.string().nullable().optional(),
  table1Data: z.record(z.string(), z.record(z.string(), z.coerce.number().default(0))).optional().default({}),
  table2Data: z.record(z.string(), z.coerce.number().default(0)).optional().default({}),
  cameraData: z.record(z.string(), z.coerce.number().default(0)).optional().default({}),
  intercomData: z.record(z.string(), z.coerce.number().default(0)).optional().default({}),
  alarmData: z.record(z.string(), z.coerce.number().default(0)).optional().default({}),
  serviceData: z.record(z.string(), z.coerce.number().default(0)).optional().default({}),
  prices: z.record(z.string(), z.coerce.number().default(0)).optional().default({}),
  purchasePrices: z.record(z.string(), z.coerce.number().default(0)).optional().default({}),
  checklistData: z.record(z.string(), z.boolean()).optional().default({}),
});

export type Job = typeof jobs.$inferSelect;
export type InsertJob = z.infer<typeof insertJobSchema>;
export type CreateJobRequest = InsertJob;
export type UpdateJobRequest = Partial<InsertJob>;
export type JobResponse = Job;
