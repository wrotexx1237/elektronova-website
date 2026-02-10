import { pgTable, text, serial, jsonb, timestamp, integer, real } from "drizzle-orm/pg-core";
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

// --- Catalog Items Table ---
export const catalogItems = pgTable("catalog_items", {
  id: serial("id").primaryKey(),
  category: text("category").notNull(),
  name: text("name").notNull(),
  unit: text("unit").notNull().default("copë"),
  purchasePrice: real("purchase_price").default(0),
  salePrice: real("sale_price").default(0),
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

// --- Jobs Table ---
export const jobs = pgTable("jobs", {
  id: serial("id").primaryKey(),
  clientName: text("client_name").notNull(),
  clientPhone: text("client_phone"),
  clientAddress: text("client_address").notNull(),
  workDate: text("work_date").notNull(),
  workType: text("work_type").notNull(),
  category: text("category").default("electric"),
  notes: text("notes"),

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
  clientName: z.string().min(1, "Emri i klientit eshte i detyrueshem"),
  clientPhone: z.string().nullable().optional(),
  clientAddress: z.string().min(1, "Adresa eshte e detyrueshme"),
  workDate: z.string().min(1),
  workType: z.string().min(1),
  category: z.enum(JOB_CATEGORIES).optional().default("electric"),
  notes: z.string().nullable().optional(),
  table1Data: z.record(z.string(), z.record(z.string(), z.number())).optional().default({}),
  table2Data: z.record(z.string(), z.number()).optional().default({}),
  cameraData: z.record(z.string(), z.number()).optional().default({}),
  intercomData: z.record(z.string(), z.number()).optional().default({}),
  alarmData: z.record(z.string(), z.number()).optional().default({}),
  serviceData: z.record(z.string(), z.number()).optional().default({}),
  prices: z.record(z.string(), z.number()).optional().default({}),
  purchasePrices: z.record(z.string(), z.number()).optional().default({}),
  checklistData: z.record(z.string(), z.boolean()).optional().default({}),
});

export type Job = typeof jobs.$inferSelect;
export type InsertJob = z.infer<typeof insertJobSchema>;
export type CreateJobRequest = InsertJob;
export type UpdateJobRequest = Partial<InsertJob>;
export type JobResponse = Job;
