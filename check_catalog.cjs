const { PGlite } = require("@electric-sql/pglite");
const path = require("path");

async function dumpCatalog() {
  const dbPath = path.resolve(process.cwd(), ".local/elektronova_db");
  const db = new PGlite(dbPath);
  try {
    const res = await db.query("SELECT name FROM catalog_items LIMIT 20");
    console.log("CATALOG NAMES:");
    res.rows.forEach(r => console.log(`'${r.name}'`));
  } catch (err) {
    console.error(err);
  } finally {
    await db.close();
  }
}
dumpCatalog();
