#!/usr/bin/env node
/**
 * LIFE STAR — static integrity check.
 *  • every local href/src in the pages resolves to a real file
 *  • every page loads the scripts in the required order
 *  • data.js builds a valid catalog (unique slugs, known categories, sane prices)
 *  • canSvg() produces well-formed SVG for every product
 */
import { readFile, readdir, access } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const errors = [];
const warnings = [];

const PAGES = ["index.html", "shop.html", "product.html", "cart.html", "wishlist.html", "about.html", "contact.html", "404.html"];
const SCRIPT_ORDER = ["icons.js", "data.js", "store.js", "ui.js"];

const exists = async (rel) => {
  try {
    await access(path.join(ROOT, rel));
    return true;
  } catch {
    return false;
  }
};

/* ---------- 1. pages & links ---------- */
let htmlCount = 0;
for (const page of PAGES) {
  if (!(await exists(page))) {
    errors.push(`missing page: ${page}`);
    continue;
  }
  htmlCount += 1;
  const html = await readFile(path.join(ROOT, page), "utf8");

  const refs = [...html.matchAll(/(?:href|src)="([^"#][^"]*)"/g)].map((m) => m[1]);
  for (const ref of refs) {
    if (/^(https?:|mailto:|tel:|data:|\/\/)/.test(ref)) continue;
    const clean = ref.split("?")[0].split("#")[0];
    if (!clean) continue;
    if (!(await exists(clean))) errors.push(`${page} → broken reference: ${ref}`);
  }

  const scripts = [...html.matchAll(/src="assets\/js\/([a-z-]+\.js)"/g)].map((m) => m[1]);
  SCRIPT_ORDER.forEach((name, i) => {
    if (scripts[i] !== name) errors.push(`${page} → script order broken at ${i}: expected ${name}, found ${scripts[i] || "nothing"}`);
  });

  if (!/<html lang="fa" dir="rtl">/.test(html)) errors.push(`${page} → missing RTL/lang attributes`);
  if (!/data-chrome="header"/.test(html)) errors.push(`${page} → missing header mount`);
  if (!/data-chrome="footer"/.test(html)) errors.push(`${page} → missing footer mount`);
}

/* ---------- 2. catalog ---------- */
const sandbox = { window: {} };
const dataSrc = await readFile(path.join(ROOT, "assets/js/data.js"), "utf8");
new Function("window", dataSrc)(sandbox.window);
const STAR = sandbox.window.STAR;

if (!STAR) errors.push("data.js did not expose window.STAR");

const products = STAR.products || [];
const cats = new Set((STAR.categories || []).map((c) => c.id));
const slugs = new Set();
const images = new Set();

for (const p of products) {
  if (slugs.has(p.slug)) errors.push(`duplicate slug: ${p.slug}`);
  slugs.add(p.slug);
  if (!cats.has(p.cat)) errors.push(`${p.slug} → unknown category: ${p.cat}`);
  if (!(p.price > 0)) errors.push(`${p.slug} → invalid price`);
  if (p.oldPrice && p.oldPrice <= p.price) errors.push(`${p.slug} → oldPrice must be greater than price`);
  if (!(p.caffeine > 0 && p.caffeine <= 300)) errors.push(`${p.slug} → caffeine out of range`);
  if (!Array.isArray(p.colors ? [] : null) && (!p.colors || !p.colors.c1)) errors.push(`${p.slug} → missing colors`);
  if (!Array.isArray(p.notes) || p.notes.length < 2) errors.push(`${p.slug} → needs at least two flavour notes`);

  const svg = STAR.canSvg(p);
  if (!svg.startsWith("<svg") || !svg.endsWith("</svg>")) errors.push(`${p.slug} → canSvg output malformed`);
  if ((svg.match(/<text/g) || []).length < 3) errors.push(`${p.slug} → canSvg is missing label text`);
  if (/undefined|NaN/.test(svg)) errors.push(`${p.slug} → canSvg contains undefined/NaN`);
}

/* ---------- 3. images ---------- */
const imgDirs = ["assets/img/brand", "assets/img/sport"];
for (const dir of imgDirs) {
  let files = [];
  try {
    files = await readdir(path.join(ROOT, dir));
  } catch {
    errors.push(`missing image folder: ${dir}`);
    continue;
  }
  files.forEach((f) => images.add(`${dir}/${f}`));
}
if (images.size < 6) warnings.push(`only ${images.size} images found — the site expects at least 6`);

/* ---------- 4. misc ---------- */
const css = await Promise.all(["tokens.css", "components.css", "pages.css"].map((f) => readFile(path.join(ROOT, "assets/css", f), "utf8")));
const cssJoined = css.join("\n");
["--red", "--volt", "--bg", "--font-fa", "--font-en"].forEach((token) => {
  if (!cssJoined.includes(token)) errors.push(`tokens.css is missing ${token}`);
});

const summary = `${htmlCount} pages · ${products.length} drinks · ${cats.size} categories · ${images.size} images · ${SCRIPT_ORDER.length + 2} scripts`;
if (warnings.length) warnings.forEach((w) => console.warn("⚠ " + w));

if (errors.length) {
  console.error(`\n✗ ${errors.length} problem(s):`);
  [...new Set(errors)].forEach((e) => console.error("  • " + e));
  process.exit(1);
}

console.log(`LIFE STAR check — ${summary}`);
console.log("✓ everything looks good");
