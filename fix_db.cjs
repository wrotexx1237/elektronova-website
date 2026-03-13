
const { PGlite } = require("@electric-sql/pglite");
const bcrypt = require("bcryptjs");
const path = require("path");
const fs = require("fs");

async function run() {
  console.log("--- ELEKTRONOVA DB FIX ---");
  const dbPath = path.resolve(process.cwd(), ".local/elektronova_db");
  console.log("Checking database at:", dbPath);

  if (!fs.existsSync(dbPath)) {
    console.log("ERROR: Database directory not found! Creating it...");
    fs.mkdirSync(dbPath, { recursive: true });
  }

  const db = new PGlite(dbPath);
  try {
    const password = "Endrit123$";
    const hash = await bcrypt.hash(password, 10);
    
    // Check if users table exists
    try {
        await db.query("SELECT 1 FROM users LIMIT 1");
    } catch (e) {
        console.log("Table 'users' does not exist yet. Running seeder via app first is recommended, but I will try to wait.");
        return;
    }

    const res = await db.query("SELECT * FROM users WHERE username = 'admin'");
    if (res.rows.length === 0) {
      console.log("Admin user not found. Creating...");
      await db.query(`
        INSERT INTO users (username, password_hash, full_name, role, is_active) 
        VALUES ('admin', $1, 'Administrator', 'admin', 1)
      `, [hash]);
    } else {
      console.log("Admin user found. Updating password...");
      await db.query("UPDATE users SET password_hash = $1, is_active = 1 WHERE username = 'admin'", [hash]);
    }
    
    console.log("\nSUCCESS!");
    console.log("User: admin");
    console.log("Pass: " + password);
    console.log("\nJu lutem tani provoni të kyçeni në faqen e login.");
  } catch (err) {
    console.error("FAILED:", err);
  } finally {
    await db.close();
  }
}

run();
