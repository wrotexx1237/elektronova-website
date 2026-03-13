import express, { type Express } from "express";
import fs from "fs";
import path from "path";

export function serveStatic(app: Express) {
  const isProd = process.env.NODE_ENV === "production";
  
  let distPath;
  if (isProd) {
    // Try multiple possible locations in the packaged app
    const possiblePaths = [
      path.resolve(process.cwd(), "dist/public"),
      path.resolve(process.cwd(), "resources/app/dist/public"),
      path.resolve((process as any).resourcesPath || "", "app/dist/public"),
      path.resolve(import.meta.dirname, "public")
    ];
    
    distPath = possiblePaths.find(p => fs.existsSync(p)) || possiblePaths[0];
  } else {
    distPath = path.resolve(import.meta.dirname, "public");
  }

  console.log(`Serving static files from: ${distPath}`);
  
  if (!fs.existsSync(distPath)) {
    console.error(`ERROR: Could not find build directory: ${distPath}`);
    // Fallback to a safer error handling than throwing, or provide more context
  }

  app.use(express.static(distPath));

  // fall through to index.html if the file doesn't exist
  app.get(/^(?!\/api).*/, (req, res, next) => {
    if (req.path.startsWith('/api') || req.path.includes('.')) {
      return next();
    }
    const indexPath = path.resolve(distPath, "index.html");
    console.log(`[static] Serving index.html for ${req.path}. Exists: ${fs.existsSync(indexPath)}`);
    
    if (fs.existsSync(indexPath)) {
      res.setHeader("Content-Type", "text/html; charset=utf-8");
      res.sendFile(indexPath);
    } else {
      res.status(404).send(`index.html not found at ${indexPath}`);
    }
  });
}
