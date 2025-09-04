import express, { type Express } from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer, createLogger } from "vite";
import { type Server } from "http";
import viteConfig from "../vite.config";
import { nanoid } from "nanoid";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const viteLogger = createLogger();

export function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  console.log(`${formattedTime} [${source}] ${message}`);
}

export async function setupVite(app: Express, server: Server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true as const,
  };

  const vite = await createViteServer({
    ...viteConfig,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      },
    },
    server: serverOptions,
    appType: "custom",
  });

  app.use(vite.middlewares);
  app.use("*", async (req, res, next) => {
    const url = req.originalUrl;

    try {
      const clientTemplate = path.resolve(__dirname, "..", "client", "index.html");

      console.log("[setupVite] Serving index.html from:", clientTemplate);

      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e as Error);
      next(e);
    }
  });
}

export function serveStatic(app: Express) {
  const distPath = path.resolve(process.cwd(), "dist/client");

  console.log("[serveStatic] Looking for client build at:", distPath);

  if (!fs.existsSync(distPath)) {
    console.error("[serveStatic] ❌ Client build not found! Serving API only.");
    
    // Show what's actually in the dist directory for debugging
    const distDir = path.resolve(process.cwd(), "dist");
    if (fs.existsSync(distDir)) {
      console.log("[serveStatic] Contents of dist directory:", fs.readdirSync(distDir));
    } else {
      console.log("[serveStatic] No dist directory found at all");
    }
    
    // Don't crash - serve a simple response instead
    app.use("*", (_req, res) => {
      res.json({ 
        status: "API running",
        message: "Client build not found. Please ensure the build process completed successfully.",
        timestamp: new Date().toISOString(),
        expectedPath: distPath
      });
    });
    return;
  }

  console.log("[serveStatic] ✅ Found client build, serving static files...");

  app.use(express.static(distPath));

  app.use("*", (_req, res) => {
    const indexPath = path.resolve(distPath, "index.html");
    console.log("[serveStatic] Serving index.html from:", indexPath);
    res.sendFile(indexPath);
  });
}
