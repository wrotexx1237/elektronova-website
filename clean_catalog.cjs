const { PGlite } = require("@electric-sql/pglite");
const path = require("path");

async function cleanCatalog() {
  console.log("=== ELEKTRONOVA CATALOG CLEANUP ===");
  
  const dbPath = path.resolve(process.cwd(), ".local/elektronova_db");
  console.log("Database path:", dbPath);
  
  const db = new PGlite(dbPath);
  
  try {
    console.log("Fetching catalog items...");
    const result = await db.query("SELECT id, name FROM catalog_items");
    const items = result.rows;
    
    let updateCount = 0;
    
    for (const item of items) {
      // Logic: 
      // 1. If ends with a space followed by '0' or 'O' (likely accidental suffix)
      // 2. If ends with '0' or 'O' AND the base name looks like a known seeder name
      
      const glitchedRegex = /(.+[\w\d])\s*[0O]$/;
      const match = item.name.match(glitchedRegex);
      
      if (match) {
        const cleanName = match[1].trim();
        console.log(`[FIX] "${item.name}" -> "${cleanName}"`);
        
        await db.query("UPDATE catalog_items SET name = $1 WHERE id = $2", [cleanName, item.id]);
        updateCount++;
      }
    }
    
    console.log(`\n✅ CLEANUP COMPLETE! Fixed ${updateCount} items.`);
    
  } catch (err) {
    console.error("\n❌ ERROR:", err);
  } finally {
    await db.close();
  }
}

cleanCatalog();
