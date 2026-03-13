
const { PGlite } = require("@electric-sql/pglite");
const bcrypt = require("bcryptjs");
const path = require("path");
const fs = require("fs");

async function megaFix() {
  console.log("=== ELEKTRONOVA ULTRA-MEGA DATABASE REPAIR ===");
  
  const dbPath = path.resolve(process.cwd(), ".local/elektronova_db");
  console.log("Database path:", dbPath);
  
  const db = new PGlite(dbPath);
  
  try {
    console.log("1. Ensuring all core tables exist...");

    const tables = [
      {
        name: "user_sessions",
        sql: `CREATE TABLE IF NOT EXISTS user_sessions (
          sid TEXT PRIMARY KEY,
          sess JSONB NOT NULL,
          expire TIMESTAMP(6) NOT NULL
        )`
      },
      {
        name: "users",
        sql: `CREATE TABLE IF NOT EXISTS users (
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
        )`
      },
      {
        name: "clients",
        sql: `CREATE TABLE IF NOT EXISTS clients (
          id SERIAL PRIMARY KEY,
          name TEXT NOT NULL,
          phone TEXT,
          address TEXT,
          email TEXT,
          notes TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`
      },
      {
        name: "catalog_items",
        sql: `CREATE TABLE IF NOT EXISTS catalog_items (
          id SERIAL PRIMARY KEY,
          category TEXT NOT NULL,
          name TEXT NOT NULL,
          unit TEXT NOT NULL DEFAULT 'copë',
          purchase_price REAL DEFAULT 0,
          sale_price REAL DEFAULT 0,
          current_stock REAL DEFAULT 0,
          min_stock_level REAL DEFAULT 0,
          notes TEXT,
          sort_order INTEGER DEFAULT 0,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`
      },
      {
        name: "price_history",
        sql: `CREATE TABLE IF NOT EXISTS price_history (
          id SERIAL PRIMARY KEY,
          catalog_item_id INTEGER NOT NULL,
          item_name TEXT NOT NULL,
          old_purchase_price REAL,
          new_purchase_price REAL,
          old_sale_price REAL,
          new_sale_price REAL,
          changed_by TEXT,
          changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`
      },
      {
        name: "stock_entries",
        sql: `CREATE TABLE IF NOT EXISTS stock_entries (
          id SERIAL PRIMARY KEY,
          catalog_item_id INTEGER NOT NULL,
          item_name TEXT NOT NULL,
          entry_type TEXT NOT NULL DEFAULT 'in',
          quantity REAL NOT NULL,
          previous_stock REAL DEFAULT 0,
          new_stock REAL DEFAULT 0,
          job_id INTEGER,
          notes TEXT,
          created_by TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`
      },
      {
        name: "job_snapshots",
        sql: `CREATE TABLE IF NOT EXISTS job_snapshots (
          id SERIAL PRIMARY KEY,
          job_id INTEGER NOT NULL,
          snapshot_type TEXT NOT NULL DEFAULT 'quote',
          material_data JSONB NOT NULL DEFAULT '{}',
          prices JSONB NOT NULL DEFAULT '{}',
          purchase_prices JSONB NOT NULL DEFAULT '{}',
          total_sale REAL DEFAULT 0,
          total_purchase REAL DEFAULT 0,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`
      },
      {
        name: "notifications",
        sql: `CREATE TABLE IF NOT EXISTS notifications (
          id SERIAL PRIMARY KEY,
          type TEXT NOT NULL,
          title TEXT NOT NULL,
          message TEXT NOT NULL,
          job_id INTEGER,
          catalog_item_id INTEGER,
          is_read INTEGER NOT NULL DEFAULT 0,
          user_id INTEGER,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`
      },
      {
        name: "suppliers",
        sql: `CREATE TABLE IF NOT EXISTS suppliers (
          id SERIAL PRIMARY KEY,
          name TEXT NOT NULL,
          phone TEXT,
          email TEXT,
          address TEXT,
          categories JSONB DEFAULT '[]',
          notes TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`
      },
      {
        name: "supplier_prices",
        sql: `CREATE TABLE IF NOT EXISTS supplier_prices (
          id SERIAL PRIMARY KEY,
          supplier_id INTEGER NOT NULL,
          catalog_item_id INTEGER NOT NULL,
          price REAL NOT NULL DEFAULT 0,
          notes TEXT,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`
      },
      {
        name: "expenses",
        sql: `CREATE TABLE IF NOT EXISTS expenses (
          id SERIAL PRIMARY KEY,
          description TEXT NOT NULL,
          amount REAL NOT NULL,
          category TEXT NOT NULL DEFAULT 'tjeter',
          date TEXT NOT NULL,
          job_id INTEGER,
          supplier_id INTEGER,
          notes TEXT,
          created_by TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`
      },
      {
        name: "feedback",
        sql: `CREATE TABLE IF NOT EXISTS feedback (
          id SERIAL PRIMARY KEY,
          job_id INTEGER NOT NULL,
          client_id INTEGER,
          rating INTEGER NOT NULL DEFAULT 5,
          comment TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`
      },
      {
        name: "jobs",
        sql: `CREATE TABLE IF NOT EXISTS jobs (
          id SERIAL PRIMARY KEY,
          invoice_number TEXT,
          client_name TEXT NOT NULL,
          client_phone TEXT,
          client_address TEXT NOT NULL,
          work_date TEXT NOT NULL,
          work_type TEXT NOT NULL,
          category TEXT DEFAULT 'electric',
          status TEXT DEFAULT 'oferte',
          notes TEXT,
          scheduled_date TEXT,
          location_url TEXT,
          latitude REAL,
          longitude REAL,
          feedback_token TEXT,
          is_template INTEGER DEFAULT 0,
          user_id INTEGER,
          client_id INTEGER,
          supplier_id INTEGER,
          discount_type TEXT DEFAULT 'percent',
          discount_value REAL DEFAULT 0,
          vat_rate REAL DEFAULT 0,
          payment_status TEXT DEFAULT 'pa_paguar',
          paid_amount REAL DEFAULT 0,
          payment_date TEXT,
          payment_method TEXT,
          warranty_months INTEGER DEFAULT 12,
          completed_date TEXT,
          table1_data JSONB DEFAULT '{}',
          table2_data JSONB DEFAULT '{}',
          camera_data JSONB DEFAULT '{}',
          intercom_data JSONB DEFAULT '{}',
          alarm_data JSONB DEFAULT '{}',
          service_data JSONB DEFAULT '{}',
          prices JSONB DEFAULT '{}',
          purchase_prices JSONB DEFAULT '{}',
          checklist_data JSONB DEFAULT '{}',
          room_progress_data JSONB DEFAULT '{}',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`
      },
      {
        name: "workers",
        sql: `CREATE TABLE IF NOT EXISTS workers (
          id SERIAL PRIMARY KEY,
          name TEXT NOT NULL,
          personal_number TEXT NOT NULL,
          address TEXT NOT NULL,
          city TEXT NOT NULL,
          phone TEXT NOT NULL,
          email TEXT,
          profession TEXT NOT NULL,
          position TEXT NOT NULL,
          department TEXT NOT NULL,
          salary REAL NOT NULL,
          payment_method TEXT NOT NULL DEFAULT 'bank',
          bank_account TEXT NOT NULL,
          bank_name TEXT NOT NULL,
          start_date TEXT NOT NULL,
          contract_type TEXT NOT NULL DEFAULT 'Caktuar',
          contract_duration TEXT,
          working_hours INTEGER NOT NULL DEFAULT 40,
          work_schedule TEXT NOT NULL DEFAULT 'Hëne - Premte, 08:00 - 16:00',
          workplace TEXT NOT NULL DEFAULT 'Zyrat qendrore / Terren',
          probation_period TEXT NOT NULL DEFAULT '1 Muaj',
          worker_signature TEXT,
          employer_signature TEXT,
          portal_token TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`
      },
      {
        name: "leave_requests",
        sql: `CREATE TABLE IF NOT EXISTS leave_requests (
          id SERIAL PRIMARY KEY,
          worker_id INTEGER NOT NULL,
          type TEXT NOT NULL DEFAULT 'Vjetor',
          start_date TEXT NOT NULL,
          end_date TEXT NOT NULL,
          days INTEGER NOT NULL,
          status TEXT NOT NULL DEFAULT 'Në Pritje',
          reason TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`
      },
      {
        name: "attendance",
        sql: `CREATE TABLE IF NOT EXISTS attendance (
          id SERIAL PRIMARY KEY,
          worker_id INTEGER NOT NULL,
          date TEXT NOT NULL,
          check_in TEXT,
          check_out TEXT,
          overtime_hours REAL DEFAULT 0,
          notes TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`
      },
      {
        name: "payslips",
        sql: `CREATE TABLE IF NOT EXISTS payslips (
          id SERIAL PRIMARY KEY,
          worker_id INTEGER NOT NULL,
          month INTEGER NOT NULL,
          year INTEGER NOT NULL,
          gross_salary REAL NOT NULL,
          net_salary REAL NOT NULL,
          pension_contribution REAL DEFAULT 0,
          tax_amount REAL DEFAULT 0,
          bonuses REAL DEFAULT 0,
          deductions REAL DEFAULT 0,
          status TEXT NOT NULL DEFAULT 'E Papaguar',
          notes TEXT,
          generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`
      },
      {
        name: "worker_history",
        sql: `CREATE TABLE IF NOT EXISTS worker_history (
          id SERIAL PRIMARY KEY,
          worker_id INTEGER NOT NULL,
          change_type TEXT NOT NULL,
          old_value TEXT,
          new_value TEXT NOT NULL,
          effective_date TEXT NOT NULL,
          notes TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`
      }
    ];

    for (const table of tables) {
      process.stdout.write(` - Table: ${table.name}... `);
      await db.query(table.sql);
      process.stdout.write("OK\n");
    }

    console.log("2. Ensuring 'admin' user exists...");
    const hash = await bcrypt.hash("Endrit123$", 10);
    const userCheck = await db.query("SELECT * FROM users WHERE username = 'admin'");
    if (userCheck.rows.length === 0) {
        await db.query("INSERT INTO users (username, password_hash, full_name, role, is_active) VALUES ('admin', $1, 'Administrator', 'admin', 1)", [hash]);
        console.log(" - Admin created.");
    } else {
        await db.query("UPDATE users SET password_hash = $1, is_active = 1 WHERE username = 'admin'", [hash]);
        console.log(" - Admin verified.");
    }

    console.log("\n✅ ULTRA-MEGA REPAIR COMPLETE!");
    console.log("Tani të gjitha tabelat (18) ekzistojnë në VPS.");
    console.log("Ju lutem rinisni PM2 sërish.");

  } catch (err) {
    console.error("\n❌ ERROR:", err);
  } finally {
    await db.close();
  }
}

megaFix();
