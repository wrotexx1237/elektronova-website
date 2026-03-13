
const { PGlite } = require("@electric-sql/pglite");
const bcrypt = require("bcryptjs");
const path = require("path");
const fs = require("fs");

async function megaFix() {
  console.log("=== ELEKTRONOVA MEGA DATABASE REPAIR ===");
  
  const dbPath = path.resolve(process.cwd(), ".local/elektronova_db");
  console.log("Database path:", dbPath);
  
  if (!fs.existsSync(dbPath)) {
    console.log("Creating database folder...");
    fs.mkdirSync(dbPath, { recursive: true });
  }

  const db = new PGlite(dbPath);
  
  try {
    console.log("1. Ensuring 'users' table and 'admin' user...");
    await db.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username TEXT NOT NULL UNIQUE,
        password_hash TEXT NOT NULL,
        full_name TEXT NOT NULL,
        role TEXT NOT NULL DEFAULT 'technician',
        phone TEXT,
        email TEXT,
        is_active INTEGER NOT NULL DEFAULT 1,
        assigned_categories JSONB DEFAULT '[]',
        two_factor_secret TEXT,
        two_factor_enabled INTEGER NOT NULL DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    const hash = await bcrypt.hash("Endrit123$", 10);
    const userCheck = await db.query("SELECT * FROM users WHERE username = 'admin'");
    if (userCheck.rows.length === 0) {
        await db.query("INSERT INTO users (username, password_hash, full_name, role, is_active) VALUES ('admin', $1, 'Administrator', 'admin', 1)", [hash]);
        console.log(" - Admin created.");
    } else {
        await db.query("UPDATE users SET password_hash = $1, is_active = 1 WHERE username = 'admin'", [hash]);
        console.log(" - Admin updated.");
    }

    console.log("2. Ensuring 'jobs' table and all columns...");
    await db.query(`CREATE TABLE IF NOT EXISTS jobs (id SERIAL PRIMARY KEY)`);

    // List of columns to check/add for jobs table
    const columns = [
        { name: "invoice_number", type: "TEXT" },
        { name: "client_name", type: "TEXT" },
        { name: "client_phone", type: "TEXT" },
        { name: "client_address", type: "TEXT" },
        { name: "work_date", type: "TEXT" },
        { name: "work_type", type: "TEXT" },
        { name: "category", type: "TEXT DEFAULT 'electric'" },
        { name: "status", type: "TEXT DEFAULT 'oferte'" },
        { name: "notes", type: "TEXT" },
        { name: "scheduled_date", type: "TEXT" },
        { name: "location_url", type: "TEXT" },
        { name: "latitude", type: "REAL" },
        { name: "longitude", type: "REAL" },
        { name: "feedback_token", type: "TEXT" },
        { name: "is_template", type: "INTEGER DEFAULT 0" },
        { name: "user_id", type: "INTEGER" },
        { name: "client_id", type: "INTEGER" },
        { name: "supplier_id", type: "INTEGER" },
        { name: "discount_type", type: "TEXT DEFAULT 'percent'" },
        { name: "discount_value", type: "REAL DEFAULT 0" },
        { name: "vat_rate", type: "REAL DEFAULT 0" },
        { name: "payment_status", type: "TEXT DEFAULT 'pa_paguar'" },
        { name: "paid_amount", type: "REAL DEFAULT 0" },
        { name: "payment_date", type: "TEXT" },
        { name: "payment_method", type: "TEXT" },
        { name: "warranty_months", type: "INTEGER DEFAULT 12" },
        { name: "completed_date", type: "TEXT" },
        { name: "table1_data", type: "JSONB DEFAULT '{}'" },
        { name: "table2_data", type: "JSONB DEFAULT '{}'" },
        { name: "camera_data", type: "JSONB DEFAULT '{}'" },
        { name: "intercom_data", type: "JSONB DEFAULT '{}'" },
        { name: "alarm_data", type: "JSONB DEFAULT '{}'" },
        { name: "service_data", type: "JSONB DEFAULT '{}'" },
        { name: "prices", type: "JSONB DEFAULT '{}'" },
        { name: "purchase_prices", type: "JSONB DEFAULT '{}'" },
        { name: "checklist_data", type: "JSONB DEFAULT '{}'" },
        { name: "room_progress_data", type: "JSONB DEFAULT '{}'" },
        { name: "created_at", type: "TIMESTAMP DEFAULT CURRENT_TIMESTAMP" },
        { name: "updated_at", type: "TIMESTAMP DEFAULT CURRENT_TIMESTAMP" }
    ];

    for (const col of columns) {
        try {
            await db.query(`ALTER TABLE jobs ADD COLUMN ${col.name} ${col.type}`);
            console.log(` - Added column: ${col.name}`);
        } catch (e) {
            // Already exists, ignore
        }
    }

    console.log("\n✅ MEGA REPAIR COMPLETE!");
    console.log("Databaza tani ka të gjitha kolonat që mungonin.");
    console.log("Ju lutem rinisni PM2 tani.");

  } catch (err) {
    console.error("❌ ERROR:", err);
  } finally {
    await db.close();
  }
}

megaFix();
