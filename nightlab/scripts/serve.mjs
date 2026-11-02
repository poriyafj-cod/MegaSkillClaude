#!/usr/bin/env node
/**
 * NIGHTLAB — zero-dependency static server.
 * Supports clean URLs (/shop → shop.html), range-free streaming and a soft 404.
 *
 *   node scripts/serve.mjs            → http://localhost:4321
 *   PORT=8080 node scripts/serve.mjs  → http://localhost:8080
 */
import http from "node:http";
import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const PORT = Number(process.env.PORT || 4321);
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
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
  ".woff2": "font/woff2",
};

async function resolveFile(urlPath) {
  const clean = decodeURIComponent(urlPath.split("?")[0]);
  const safe = path.normalize(clean).replace(/^(\.\.[/\\])+/, "");
  const candidates = [path.join(ROOT, safe)];

  if (safe.endsWith("/")) candidates.push(path.join(ROOT, safe, "index.html"));
  else {
    candidates.push(path.join(ROOT, `${safe}.html`));
    candidates.push(path.join(ROOT, safe, "index.html"));
  }

  for (const candidate of candidates) {
    if (!candidate.startsWith(ROOT)) continue;
    try {
      const info = await stat(candidate);
      if (info.isFile()) return { file: candidate, size: info.size };
    } catch {
      /* keep looking */
    }
  }
  return null;
}

const server = http.createServer(async (req, res) => {
  const found = await resolveFile(req.url || "/");
  if (!found) {
    const notFound = await resolveFile("/404.html");
    res.writeHead(404, { "content-type": MIME[".html"] });
    if (notFound) createReadStream(notFound.file).pipe(res);
    else res.end("404 — not found");
    return;
  }
  const ext = path.extname(found.file).toLowerCase();
  res.writeHead(200, {
    "content-type": MIME[ext] || "application/octet-stream",
    "content-length": found.size,
    "cache-control": ext === ".html" ? "no-cache" : "public, max-age=3600",
  });
  createReadStream(found.file).pipe(res);
});

server.listen(PORT, HOST, () => {
  console.log(`NIGHTLAB → http://${HOST}:${PORT}/`);
  console.log(`clean URLs enabled · serving ${ROOT}`);
});
