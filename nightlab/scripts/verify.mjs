#!/usr/bin/env node
/**
 * NIGHTLAB — static integrity check.
 *  • every local href/src on every page resolves
 *  • every page loads icons → data → store → ui → page, and mounts header/footer
 *  • the catalog is valid (unique slugs, known categories, sane prices, full specs)
 *  • art() produces well-formed SVG for every product and every variant
 */
import { readFile, readdir, access } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const errors = [];
const warnings = [];

const PAGES = ["index.html", "shop.html", "product.html", "cart.html", "wishlist.html", "about.html", "contact.html", "guide.html", "404.html"];
const SCRIPT_ORDER = ["icons.js", "data.js", "store.js", "ui.js"];

const exists = async (rel) => {
  try {
    await access(path.join(ROOT, rel));
    return true;
  } catch {
    return false;
  }
};

/* ---------- pages ---------- */
let pageCount = 0;
for (const page of PAGES) {
  if (!(await exists(page))) {
    errors.push(`missing page: ${page}`);
    continue;
  }
  pageCount += 1;
  const html = await readFile(path.join(ROOT, page), "utf8");

  const refs = [...html.matchAll(/(?:href|src)="([^"#][^"]*)"/g)].map((m) => m[1]);
  for (const ref of refs) {
    if (/^(https?:|mailto:|tel:|data:|\/\/|#)/.test(ref)) continue;
    const clean = ref.split("?")[0].split("#")[0];
    if (clean && !(await exists(clean))) errors.push(`${page} → broken reference: ${ref}`);
  }

  const scripts = [...html.matchAll(/src="assets\/js\/([a-z-]+\.js)"/g)].map((m) => m[1]);
  SCRIPT_ORDER.forEach((name, i) => {
    if (scripts[i] !== name) errors.push(`${page} → script order broken at ${i}: expected ${name}, got ${scripts[i] || "nothing"}`);
  });

  if (!/<html lang="fa" dir="rtl">/.test(html)) errors.push(`${page} → missing RTL/lang attributes`);
  if (!/data-chrome="header"/.test(html)) errors.push(`${page} → missing header mount`);
  if (!/data-chrome="footer"/.test(html)) errors.push(`${page} → missing footer mount`);
  if (!/maximum-scale|user-scalable/.test(html) && !/<meta name="viewport"/.test(html)) errors.push(`${page} → missing viewport meta`);
}

/* ---------- catalog ---------- */
const sandbox = { window: {} };
const dataSrc = await readFile(path.join(ROOT, "assets/js/data.js"), "utf8");
new Function("window", dataSrc)(sandbox.window);
const STAR = sandbox.window.STAR;

if (!STAR) errors.push("data.js did not expose window.STAR");

const products = STAR ? STAR.products : [];
const cats = new Set((STAR ? STAR.categories : []).map((c) => c.id));
const slugs = new Set();

for (const p of products) {
  if (slugs.has(p.slug)) errors.push(`duplicate slug: ${p.slug}`);
  slugs.add(p.slug);
  if (!cats.has(p.cat)) errors.push(`${p.slug} → unknown category: ${p.cat}`);
  if (!/^NL-\d{2}$/.test(p.code)) errors.push(`${p.slug} → bad product code: ${p.code}`);
  if (!(p.price > 0)) errors.push(`${p.slug} → invalid price`);
  if (p.oldPrice && p.oldPrice <= p.price) errors.push(`${p.slug} → oldPrice must exceed price`);
  if (!(p.rating >= 1 && p.rating <= 5)) errors.push(`${p.slug} → rating out of range`);
  if (!Array.isArray(p.features) || p.features.length < 2) errors.push(`${p.slug} → needs two features`);
  if (!Array.isArray(p.specs) || p.specs.length < 4) errors.push(`${p.slug} → needs a fuller spec table`);
  if (!p.desc || !p.usage || !p.care) errors.push(`${p.slug} → missing copy (desc/usage/care)`);
  if (!p.colors || !p.colors.c1) errors.push(`${p.slug} → missing colours`);

  for (const variant of ["full", "detail", "box"]) {
    const svg = STAR.art(p, { variant });
    if (!svg.startsWith("<svg") || !svg.endsWith("</svg>")) errors.push(`${p.slug}/${variant} → art malformed`);
    if (/undefined|NaN/.test(svg)) errors.push(`${p.slug}/${variant} → art contains undefined/NaN`);
  }
}

/* ---------- assets ---------- */
const imgs = ["assets/img/brand/founder-portrait.jpg", "assets/img/brand/founder-poster.jpg", "assets/favicon.svg"];
for (const f of imgs) if (!(await exists(f))) errors.push(`missing asset: ${f}`);

const brandDir = await readdir(path.join(ROOT, "assets/img/brand"));
brandDir.forEach((f) => {
  if (!/\.(jpe?g|png|webp)$/i.test(f)) errors.push(`unexpected file in brand folder: ${f}`);
});

/* ---------- css tokens ---------- */
const css = (
  await Promise.all(["tokens.css", "components.css", "pages.css"].map((f) => readFile(path.join(ROOT, "assets/css", f), "utf8")))
).join("\n");
["--yellow", "--crystal", "--bg", "--font-fa", "--font-en", "--font-mono"].forEach((token) => {
  if (!css.includes(token)) errors.push(`css is missing ${token}`);
});
if (css.includes("--red:") || css.includes("--volt:")) errors.push("css still contains old LIFE STAR tokens");

const summary = `${pageCount} pages · ${products.length} products · ${cats.size} categories · ${SCRIPT_ORDER.length + 2} shared scripts`;
warnings.forEach((w) => console.warn("⚠ " + w));

if (errors.length) {
  console.error(`\n✗ ${errors.length} problem(s):`);
  [...new Set(errors)].forEach((e) => console.error("  • " + e));
  process.exit(1);
}
console.log(`NIGHTLAB check — ${summary}`);
console.log("✓ everything looks good");
