#!/usr/bin/env node
/**
 * NAFAS — dependency-free static dev server.
 * Usage: node scripts/serve.mjs [port]
 * Binds 0.0.0.0 so the sandbox preview proxy can reach it.
 */
import { createServer } from "node:http";
import { createReadStream, existsSync, statSync } from "node:fs";
import { extname, join, normalize, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(fileURLToPath(new URL("..", import.meta.url)));
const PORT = Number(process.argv[2] || process.env.PORT || 4321);
const HOST = process.env.HOST || "0.0.0.0";

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2",
  ".txt": "text/plain; charset=utf-8",
  ".map": "application/json; charset=utf-8",
};

function resolvePath(urlPath) {
  const clean = decodeURIComponent(urlPath.split("?")[0].split("#")[0]);
  const safe = normalize(clean).replace(/^(\.\.[/\\])+/, "");
  let target = join(ROOT, safe);

  // Keep requests inside the project root.
  if (!target.startsWith(ROOT + sep) && target !== ROOT) return null;

  if (existsSync(target) && statSync(target).isDirectory()) {
    target = join(target, "index.html");
  }
  if (!existsSync(target) && existsSync(target + ".html")) {
    target = target + ".html";
  }
  return existsSync(target) && statSync(target).isFile() ? target : null;
}

const server = createServer((req, res) => {
  const url = req.url || "/";
  const file = resolvePath(url);

  if (!file) {
    const notFound = join(ROOT, "404.html");
    res.writeHead(404, { "Content-Type": MIME[".html"] });
    if (existsSync(notFound)) {
      createReadStream(notFound).pipe(res);
    } else {
      res.end("<!doctype html><html lang='fa' dir='rtl'><meta charset='utf-8'><title>۴۰۴</title><body style='font-family:sans-serif;padding:40px'><h1>۴۰۴ — صفحه پیدا نشد</h1><p><a href='/'>بازگشت به خانه</a></p></body></html>");
    }
    return;
  }

  const ext = extname(file).toLowerCase();
  const headers = {
    "Content-Type": MIME[ext] || "application/octet-stream",
    "Cache-Control": ext === ".html" ? "no-cache" : "public, max-age=3600",
    "X-Content-Type-Options": "nosniff",
  };

  res.writeHead(200, headers);
  if (req.method === "HEAD") return res.end();
  createReadStream(file).pipe(res);
});

server.listen(PORT, HOST, () => {
  console.log(`NAFAS running → http://${HOST}:${PORT}/  (root: ${ROOT})`);
});
