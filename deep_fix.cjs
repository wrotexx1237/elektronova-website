
const { PGlite } = require("@electric-sql/pglite");
const bcrypt = require("bcryptjs");
const path = require("path");
const fs = require("fs");

async function scanAndFix() {
  console.log("=== ELEKTRONOVA DEEP DIAGNOSTIC & FIX ===");
  
  const rootDir = process.cwd();
  const dbPath = path.resolve(rootDir, ".local/elektronova_db");
  
  console.log("Current Directory:", rootDir);
  console.log("Target DB Path:", dbPath);
  
  if (!fs.existsSync(dbPath)) {
    console.log("!!! WARNING: Target DB folder does not exist at expected path.");
    console.log("Creating folder...");
    fs.mkdirSync(dbPath, { recursive: true });
  }

  const db = new PGlite(dbPath);
  
  try {
    console.log("Connecting to DB...");
    
    // Create users table if missing
    console.log("Ensuring 'users' table exists...");
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

    const password = "Endrit123$";
    const hash = await bcrypt.hash(password, 10);
    
    const res = await db.query("SELECT * FROM users WHERE username = 'admin'");
    if (res.rows.length === 0) {
      console.log("Admin user missing. Inserting 'admin'...");
      await db.query(`
        INSERT INTO users (username, password_hash, full_name, role, is_active) 
        VALUES ('admin', $1, 'Administrator', 'admin', 1)
      `, [hash]);
    } else {
      console.log("Admin user found. ID:", res.rows[0].id, "Active:", res.rows[0].is_active);
      console.log("Forcing password reset...");
      await db.query("UPDATE users SET password_hash = $1, is_active = 1 WHERE username = 'admin'", [hash]);
    }

    console.log("Verifying final state...");
    const final = await db.query("SELECT id, username, is_active FROM users");
    console.table(final.rows);

    console.log("\n✅ SUCCESS! The database is now READY.");
    console.log("Credentials confirmed: admin / " + password);
    console.log("\nKthehuni te browser-i dhe provoni sërish.");
  } catch (err) {
    console.error("❌ ERROR during scan/fix:", err);
  } finally {
    await db.close();
  }
}

scanAndFix();
