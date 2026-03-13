const { PGlite } = require("@electric-sql/pglite");
const path = require("path");

async function fix() {
  console.log("=== ELEKTRONOVA VPS DB FIX ===");
  const dbPath = path.resolve(process.cwd(), ".local/elektronova_db");
  console.log("Targeting DB:", dbPath);
  
  const db = new PGlite(dbPath);
  
  try {
    console.log("1. Checking for 'unit' column in 'catalog_items'...");
    const res = await db.query("SELECT * FROM catalog_items LIMIT 1");
    
    // If we can select, it means table exists. Let's check for unit in the first row's keys
    const firstRow = res.rows[0];
    if (firstRow && firstRow.hasOwnProperty('unit')) {
      console.log("Column 'unit' already exists. No fix needed here.");
    } else {
      console.log("Column 'unit' MISSING. Adding it...");
      await db.query("ALTER TABLE catalog_items ADD COLUMN unit TEXT NOT NULL DEFAULT 'copë'");
      console.log("✅ Column added successfully!");
    }
    
    // Check if other columns might be missing (e.g. room_progress_data in jobs)
    console.log("2. Checking for 'room_progress_data' column in 'jobs'...");
    try {
      await db.query("SELECT room_progress_data FROM jobs LIMIT 1");
      console.log("Column 'room_progress_data' already exists.");
    } catch (e) {
      console.log("Column 'room_progress_data' MISSING. Adding it...");
      await db.query("ALTER TABLE jobs ADD COLUMN room_progress_data JSONB DEFAULT '{}'");
      console.log("✅ Column added successfully!");
    }

    console.log("\n✅ ALL DB PATHS VERIFIED!");
  } catch (err) {
    console.error("\n❌ ERROR DURING FIX:", err);
    console.log("Manual intervention might be needed.");
  } finally {
    await db.close();
  }
}

fix();
