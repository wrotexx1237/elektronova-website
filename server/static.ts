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
