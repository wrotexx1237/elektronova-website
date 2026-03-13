import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { serveStatic } from "./static";
import { createServer } from "http";
import path from "path";
import fs from "fs";
import { startAutomations } from "./automations";
import session from "express-session";
import createMemoryStore from "memorystore";
import { pool, db } from "./db";
import { migrate } from "drizzle-orm/pglite/migrator";
import { log } from "./log";

const app = express();
const httpServer = createServer(app);

declare module "http" {
  interface IncomingMessage {
    rawBody: unknown;
  }
}

declare module "express-session" {
  interface SessionData {
    userId?: number;
    role?: string;
    username?: string;
    fullName?: string;
  }
}

app.use(
  express.json({
    limit: '10mb',
    verify: (req, _res, buf) => {
      req.rawBody = buf;
    },
  }),
);

app.use(express.urlencoded({ extended: false }));

const MemoryStore = createMemoryStore(session);
app.use(
  session({
    store: new MemoryStore({
      checkPeriod: 86400000 // prune expired entries every 24h
    }),
    secret: process.env.SESSION_SECRET || "elektronova-secret-key-2024",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60 * 1000,
    },
  })
);

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  log("Running migrations...");
  const isProd = process.env.NODE_ENV === "production";
  
  let migrationsFolder;
  if (isProd) {
    // In Electron production, migrations are in resources/app/migrations
    // process.cwd() might be different, so we use __dirname (or similar)
    // Since we are bundled, we can try relative to current file or process.resourcesPath if available
    const possiblePaths = [
      path.resolve(process.cwd(), "migrations"),
      path.resolve((process as any).resourcesPath || "", "app/migrations"),
      path.resolve(path.dirname(process.execPath), "resources/app/migrations"),
      path.resolve(process.cwd(), "resources/app/migrations")
    ];
    
    migrationsFolder = possiblePaths.find(p => {
        try { return fs.existsSync(p); } catch { return false; }
    }) || possiblePaths[3];
  } else {
    migrationsFolder = path.resolve(process.cwd(), "migrations");
  }
    
  log(`Migrations folder: ${migrationsFolder}`);
    
  try {
    await migrate(db, { migrationsFolder });
    log("Migrations complete.");
  } catch (err: any) {
    console.error("Migration failed:", err);
  }

  await registerRoutes(httpServer, app);
  
  // Seed admin user if it doesn't exist (ensures first-time login works)
  (async () => {
    try {
      const { storage } = await import("./storage");
      const { default: bcrypt } = await import("bcryptjs");
      const admin = await storage.getUserByUsername("admin");
      if (!admin) {
        const passwordHash = await bcrypt.hash("Endrit123$", 10);
        await storage.createUser({
          username: "admin",
          passwordHash,
          fullName: "Administrator",
          role: "admin",
          isActive: 1,
          assignedCategories: []
        });
        log("Fresh DB: Default admin user seeded.");
      }
    } catch (e) {
      console.error("Seed failed:", e);
    }
  })();

  startAutomations(); // Re-enabled automations
  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (process.env.NODE_ENV === "production") {
    serveStatic(app);
  } else {
    const { setupVite } = await import("./vite");
    await setupVite(httpServer, app);
  }

  app.use((err: any, _req: Request, res: Response, next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    console.error("Internal Server Error:", err);

    if (res.headersSent) {
      return next(err);
    }

    return res.status(status).json({ message });
  });

  // ALWAYS serve the app on the port specified in the environment variable PORT
  // Other ports are firewalled. Default to 5000 if not specified.
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = parseInt(process.env.PORT || "5000", 10);
  httpServer.listen(
    {
      port,
      host: "127.0.0.1",
    },
    () => {
      log(`serving on port ${port}`);
    },
  );
})();
