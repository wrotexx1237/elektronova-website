import { createServer } from 'vite';
import viteConfig from './vite.config.js'; // Might need to check extension
import path from 'path';

(async () => {
  try {
    console.log("Attempting to create Vite server...");
    const vite = await createServer({
      ...viteConfig,
      configFile: false,
      server: { middlewareMode: true }
    });
    console.log("Vite server created successfully!");
    process.exit(0);
  } catch (err) {
    console.error("Vite creation failed:");
    console.error(err);
    process.exit(1);
  }
})();
