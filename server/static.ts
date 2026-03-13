import express, { type Express } from "express";
import fs from "fs";
import path from "path";

export function serveStatic(app: Express) {
  const isProd = process.env.NODE_ENV === "production";
  
  let distPath;
  if (isProd) {
    const possiblePaths = [
      path.resolve(process.cwd(), "dist/public"),
      path.resolve(process.cwd(), "public"), // Fallback for some VPS setups
      path.resolve(path.dirname(fileURLToPath(import.meta.url)), "public"),
      path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "dist", "public")
    ];
    
    distPath = possiblePaths.find(p => fs.existsSync(p)) || possiblePaths[0];
  } else {
    distPath = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "public");
  }

  // Double check if we are in VPS and dist/public exists relative to project root
  const vpsPath = "/var/www/elektronova-asset-manager/dist/public";
  if (fs.existsSync(vpsPath)) {
    distPath = vpsPath;
  }

  console.log(`Serving static files from: ${distPath}`);
  
  if (!fs.existsSync(distPath)) {
    console.error(`ERROR: Could not find build directory: ${distPath}`);
    // Fallback to a safer error handling than throwing, or provide more context
  }

  app.use(express.static(distPath));

  // Fallback to index.html for React SPA
  app.use((req, res, next) => {
    // If it starts with /api or /health, or has an extension (like .js, .css), don't serve index.html
    if (req.path.startsWith('/api') || req.path.startsWith('/health') || req.path.includes('.')) {
      return next();
    }
    
    const indexPath = path.resolve(distPath, "index.html");
    if (fs.existsSync(indexPath)) {
      res.sendFile(indexPath);
    } else {
      next();
    }
  });
}
