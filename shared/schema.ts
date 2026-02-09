import { pgTable, text, serial, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// --- Constants (Albanian) ---

export const ROOMS = [
  "Salloni",
  "Kuzhina",
  "Dhoma",
  "Koridor",
  "Banjo",
  "Dhoma 1",
  "Dhoma 2",
  "Koridor 2",
  "Ballkon",
  "Ballkon 2",
  "Shkallat",
] as const;

export const TABLE_1_ITEMS = [
  "Shteg EM2",
  "Shteg EM1",
  "Ndërprerës Alternativ",
  "Ndërprerës Kryqëzor",
  "Ndërprerës i Thjeshtë",
  "Tapa mbyllëse",
  "Ndërprerës për roletne",
  "Ram mbajtës 7 EM",
  "Ram mbajtës 4 EM",
  "Ram mbajtës 3 EM",
  "Ram mbajtës 2 EM",
  "Indikator për banjo",
  "Fasunga",
  "Aster Zile",
  "Kabëll UTP për interfon",
] as const;

export const TABLE_2_ITEMS = [
  "Kabell 5×10",
  "Kabell 5×2.5",
  "Kabell 3×2.5",
  "Kabell 3×1.5",
  "Kabell 4×0.75",
  "Kabëll antene",
  "Kabllo Kamerave",
  "Tabelë e siguresave (3 rendëshe)",
  "Kuti modulare M7",
  "Kuti modulare M4",
  "Kuti modulare M3",
  "Kuti modulare M2",
  "Kuti FI 150",
  "Cevë (GYP) FI 32",
  "Cevë (GYP) FI 25",
  "Cevë (GYP) FI 16",
  "Cevë (GYP) FI 11",
  "GIPS",
  "Trakë shparingu",
  "Gozhda betoni",
  "Vazhduese gypi",
] as const;

export const WORK_TYPES = [
  "Instalim i ri",
  "Riparim",
  "Kamera",
  "Interfon",
  "Tjetër",
] as const;

// --- Data Structures ---

// Table 1 Data: Keyed by Item Name, then by Room Name. Value is quantity (number).
export const table1DataSchema = z.record(z.string(), z.record(z.string(), z.number()));

// Table 2 Data: Keyed by Item Name. Value is quantity (number).
export const table2DataSchema = z.record(z.string(), z.number());

// Price Data: Keyed by Item Name. Value is price (number).
export const priceDataSchema = z.record(z.string(), z.number());

// --- Database Schema ---

export const jobs = pgTable("jobs", {
  id: serial("id").primaryKey(),
  // Client Info
  clientName: text("client_name").notNull(),
  clientPhone: text("client_phone"),
  clientAddress: text("client_address").notNull(),
  workDate: text("work_date").notNull(), 
  workType: text("work_type").notNull(),
  notes: text("notes"),
  
  // Material Data
  table1Data: jsonb("table1_data").$type<z.infer<typeof table1DataSchema>>().notNull().default({}),
  table2Data: jsonb("table2_data").$type<z.infer<typeof table2DataSchema>>().notNull().default({}),
  
  // Pricing Data
  prices: jsonb("prices").$type<z.infer<typeof priceDataSchema>>().notNull().default({}),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// --- Zod Schemas ---

export const insertJobSchema = createInsertSchema(jobs).omit({ 
  id: true, 
  createdAt: true, 
  updatedAt: true 
}).extend({
  table1Data: table1DataSchema,
  table2Data: table2DataSchema,
  prices: priceDataSchema,
});

export type Job = typeof jobs.$inferSelect;
export type InsertJob = z.infer<typeof insertJobSchema>;

// Explicit API Types
export type CreateJobRequest = InsertJob;
export type UpdateJobRequest = Partial<InsertJob>;
export type JobResponse = Job;
export type JobListResponse = Job[];
