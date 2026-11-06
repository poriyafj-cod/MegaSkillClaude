#!/usr/bin/env node
/**
 * NAFAS — repository self-check.
 * Verifies that every local asset/link referenced by the pages exists,
 * that the catalog is internally consistent and that images are on disk.
 *
 * Usage: node scripts/verify.mjs
 */
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(fileURLToPath(new URL("..", import.meta.url)));
const errors = [];
const notes = [];

const pages = readdirSync(ROOT).filter((f) => f.endsWith(".html"));

/* ---------- 1. links & assets inside HTML ---------- */
for (const page of pages) {
  const raw = readFileSync(join(ROOT, page), "utf8");
  // inline <script> bodies contain template strings, not real URLs — strip them first
  const html = raw.replace(/<script(?![^>]*\ssrc=)[\s\S]*?<\/script>/gi, "");
  const refs = [
    ...html.matchAll(/(?:href|src)="([^"#][^"]*)"/g),
    ...html.matchAll(/content="(assets\/[^"]+)"/g),
  ].map((m) => m[1]);

  for (const ref of refs) {
    if (/^(https?:|mailto:|tel:|data:|\/\/)/i.test(ref)) continue;
    const clean = ref.split("?")[0].split("#")[0];
    if (!clean) continue;
    const target = join(ROOT, clean);
    if (!existsSync(target)) errors.push(`${page}: missing file → ${clean}`);
  }

  // every page must mount the chrome)
  if (!raw.includes('data-chrome="header"')) errors.push(`${page}: header slot missing`);
  if (!raw.includes('data-chrome="footer"')) errors.push(`${page}: footer slot missing`);
}

/* ---------- 2. catalog data ---------- */
const dataSrc = readFileSync(join(ROOT, "assets/js/data.js"), "utf8");
const slugs = [...dataSrc.matchAll(/slug:\s*"([^"]+)"/g)].map((m) => m[1]);
const ids = [...dataSrc.matchAll(/id:\s*"(p\d+)"/g)].map((m) => m[1]);

if (new Set(slugs).size !== slugs.length) errors.push("data.js: duplicate product slugs");
if (new Set(ids).size !== ids.length) errors.push("data.js: duplicate product ids");

for (const slug of slugs) {
  for (const suffix of [".jpg", "-detail.jpg"]) {
    const file = join(ROOT, "assets/img/products", slug + suffix);
    if (!existsSync(file)) errors.push(`data.js: missing image for "${slug}" → ${slug}${suffix}`);
  }
}

if (slugs.length < 10) notes.push(`only ${slugs.length} products in the catalog`);
if (pages.length < 6) notes.push(`only ${pages.length} html pages`);

/* ---------- 3. brand images ---------- */
for (const img of [
  "nafas-hero.jpg",
  "nafas-look.jpg",
  "nafas-og.jpg",
  "nafas-contact.jpg",
  "nafas-garden.jpg",
  "nafas-frame-peace.jpg",
  "nafas-frame-smile.jpg",
  "nafas-frame-laugh.jpg",
  "nafas-frame-peek.jpg",
]) {
  if (!existsSync(join(ROOT, "assets/img/brand", img))) errors.push(`missing brand image → ${img}`);
}

/* ---------- 4. JS parses ---------- */
const jsFiles = readdirSync(join(ROOT, "assets/js")).filter((f) => f.endsWith(".js"));
for (const file of jsFiles) {
  const src = readFileSync(join(ROOT, "assets/js", file), "utf8");
  try {
    // eslint-disable-next-line no-new-func
    new Function(src);
  } catch (err) {
    errors.push(`assets/js/${file}: ${err.message}`);
  }
}

/* ---------- report ---------- */
console.log(`NAFAS check — ${pages.length} pages, ${slugs.length} products, ${jsFiles.length} scripts`);
notes.forEach((n) => console.log(`  note: ${n}`));

if (errors.length) {
  console.error(`\n✗ ${errors.length} problem(s):`);
  errors.forEach((e) => console.error(`  - ${e}`));
  process.exit(1);
}

console.log("✓ everything looks good");
