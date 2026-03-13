import { drizzle } from "drizzle-orm/pglite";
import { PGlite } from "@electric-sql/pglite";
import * as schema from "../shared/schema";
import path from "path";

// In production (Electron), we use a persistent path provided by the main process
// In development, we can use memory or a local folder
// Using a path in .local to avoid conflicts on Windows
const dbPath = path.resolve(process.cwd(), ".local/elektronova_db");

export const pool = new PGlite(dbPath);
export const db = drizzle(pool, { schema });
