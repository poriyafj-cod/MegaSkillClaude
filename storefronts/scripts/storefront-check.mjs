// Storefront rule engine — dependency-free audit of the storefront design system.
//
//   node storefronts/scripts/storefront-check.mjs --dir <site>   # one site
//   node storefronts/scripts/storefront-check.mjs --all          # every checkout site
//   node storefronts/scripts/storefront-check.mjs --json         # machine readable
//
// Rules are intentionally static and honest: they check contracts this repository can prove
// (RTL, tokens, a11y affordances, dead links, schema, asset weight) and never claim that a
// page renders, deploys or converts. Live checks stay manual and are recorded in PROGRESS.md.
import {readFileSync, readdirSync, statSync, existsSync} from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const STOREFRONTS = path.join(ROOT, 'storefronts');

const PAGES = ['index.html', 'shop.html', 'product.html', 'about.html', 'contact.html'];
const POLICY = ['shipping.html', 'returns.html', 'privacy.html', 'terms.html'];
const TOKENS = ['--bg', '--surface', '--fg', '--accent', '--on-accent', '--border', '--radius', '--font'];
const FONT_HOSTS = /fonts\.(googleapis|gstatic)\.com|use\.typekit\.net|fonts\.cdnfonts\.com/i;

function read(file) {
  try { return readFileSync(file, 'utf8'); } catch { return null; }
}

function bytes(file) {
  try { return statSync(file).size; } catch { return 0; }
}

function htmlFiles(dir) {
  const out = [];
  const walk = (current) => {
    for (const entry of readdirSync(current, {withFileTypes: true})) {
      if (entry.name === 'node_modules' || entry.name.startsWith('.')) continue;
      const full = path.join(current, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (entry.name.endsWith('.html')) out.push(full);
    }
  };
  walk(dir);
  return out.sort();
}

function cssText(dir) {
  const out = [];
  const walk = (current) => {
    for (const entry of readdirSync(current, {withFileTypes: true})) {
      if (entry.name === 'node_modules' || entry.name.startsWith('.')) continue;
      const full = path.join(current, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (entry.name.endsWith('.css')) out.push(read(full) || '');
    }
  };
  walk(dir);
  return out.join('\n');
}

function jsonLd(html) {
  const blocks = [];
  const re = /<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  let match;
  while ((match = re.exec(html))) {
    try { blocks.push(JSON.parse(match[1].trim())); } catch { blocks.push(null); }
  }
  return blocks;
}

function types(blocks) {
  const seen = new Set();
  const visit = (value) => {
    if (!value || typeof value !== 'object') return;
    if (Array.isArray(value)) return value.forEach(visit);
    if (typeof value['@type'] === 'string') seen.add(value['@type']);
    else if (Array.isArray(value['@type'])) value['@type'].forEach((t) => seen.add(t));
    if (value['@graph']) visit(value['@graph']);
  };
  blocks.forEach(visit);
  return seen;
}

/**
 * @param {string} dir site directory
 * @param {{brand?: string, kind?: 'storefront'|'app'}} options
 *   kind 'app'  = single-page web app built with the same design tokens (e.g. the CHAM admin SPA);
 *                 it gets the token/a11y/perf contract but not the multi-page commerce routes.
 */
export function auditSite(dir, {brand = path.basename(dir), kind = 'storefront'} = {}) {
  if (kind === 'app') return auditApp(dir, brand);
  const errors = [];
  const warnings = [];
  const info = {};
  const pages = new Map();
  for (const name of PAGES.concat(POLICY)) {
    const html = read(path.join(dir, name));
    if (html === null) errors.push(`${name}: missing required page`);
    else pages.set(name, html);
  }
  const css = cssText(dir);
  const allHtml = [...pages.values()].join('\n');

  // 1. tokens and typography contract
  const missingTokens = TOKENS.filter((token) => !new RegExp(`${token}\\s*:`).test(css));
  if (pages.size && missingTokens.length) errors.push(`tokens: missing ${missingTokens.join(', ')} in CSS`);
  if (FONT_HOSTS.test(allHtml) || FONT_HOSTS.test(css)) errors.push('fonts: remote font host in critical path (self-host woff2)');
  if (!/--font-display\s*:/.test(css) && pages.size) warnings.push('tokens: no --font-display token');

  // 2. direction, language, one h1, title/description
  for (const [name, html] of pages) {
    if (!/<html[^>]+lang=["']fa["']/.test(html)) errors.push(`${name}: html lang="fa" missing`);
    if (!/<html[^>]+dir=["']rtl["']/.test(html)) errors.push(`${name}: html dir="rtl" missing`);
    if (!/<meta[^>]+name=["']viewport["']/.test(html)) errors.push(`${name}: viewport meta missing`);
    const h1 = (html.match(/<h1[\s>]/gi) || []).length;
    if (h1 !== 1) errors.push(`${name}: expected exactly one h1, found ${h1}`);
    if (!/<title>[^<]{8,}<\/title>/.test(html)) errors.push(`${name}: title missing or too short`);
    if (!/<meta[^>]+name=["']description["'][^>]+content=["'][^"']{40,}/.test(html)) warnings.push(`${name}: meta description missing or short`);
    if (!/property=["']og:image["']/.test(html)) warnings.push(`${name}: og:image missing`);
    if (!/class=["'][^"']*skip-link/.test(html) && !/id=["']main["']/.test(html)) warnings.push(`${name}: no skip-link or #main target`);
  }

  // 3. commerce flow contracts
  const index = pages.get('index.html') || '';
  if (pages.size) {
    if (!/localStorage/.test(allHtml + css)) warnings.push('cart: no localStorage persistence found');
    if (/href=["']#["']/.test(allHtml)) errors.push('links: dead href="#" found (use a real route)');
    if (/lorem ipsum/i.test(allHtml)) errors.push('copy: lorem ipsum in shipped pages');
    if (/three\.min\.js|three@0\.\d/i.test(allHtml) && !/IntersectionObserver/.test(allHtml)) {
      warnings.push('3d: three.js without IntersectionObserver pause');
    }
    if (/autoplay/.test(allHtml) && !/muted/.test(allHtml)) warnings.push('media: autoplay without muted');
  }

  // 4. reduced motion + focus
  if (pages.size && !/prefers-reduced-motion/.test(css)) errors.push('a11y: prefers-reduced-motion block missing');
  if (pages.size && !/:focus-visible/.test(css)) errors.push('a11y: :focus-visible styles missing');
  if (pages.size && /user-scalable=no|maximum-scale=1/.test(allHtml)) errors.push('a11y: viewport blocks pinch zoom');

  // 5. schema
  const indexTypes = types(jsonLd(index));
  info.schema = [...indexTypes];
  if (pages.size && !indexTypes.has('Organization')) warnings.push('seo: Organization JSON-LD missing on home');
  const product = pages.get('product.html');
  if (product) {
    const productTypes = types(jsonLd(product));
    info.productSchema = [...productTypes];
    if (!productTypes.has('Product')) warnings.push('seo: Product JSON-LD not found on product page (may be injected per product)');
  }
  for (const [name, html] of pages) {
    if (/application\/ld\+json/i.test(html) && jsonLd(html).some((b) => b === null)) {
      errors.push(`${name}: invalid JSON-LD block`);
    }
  }

  // 6. asset weight budget (hero and product images)
  const images = [];
  const walk = (current) => {
    for (const entry of readdirSync(current, {withFileTypes: true})) {
      if (entry.name === 'node_modules' || entry.name.startsWith('.')) continue;
      const full = path.join(current, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (/\.(jpe?g|png|webp|avif)$/i.test(entry.name)) images.push(full);
    }
  };
  walk(dir);
  const heavy = images.filter((file) => bytes(file) > 400 * 1024);
  info.images = images.length;
  info.heaviestImageKB = images.reduce((max, file) => Math.max(max, Math.round(bytes(file) / 1024)), 0);
  if (heavy.length) warnings.push(`perf: ${heavy.length} image(s) over 400KB (largest ${Math.max(...heavy.map((f) => Math.round(bytes(f) / 1024)))}KB)`);

  // 7. deployment hygiene
  const vercel = read(path.join(dir, 'vercel.json'));
  if (vercel) {
    for (const header of ['X-Content-Type-Options', 'Referrer-Policy']) {
      if (!vercel.includes(header)) warnings.push(`deploy: ${header} header missing in vercel.json`);
    }
  } else warnings.push('deploy: no vercel.json in site directory');

  info.pages = [...pages.keys()];
  info.brand = brand;
  return {brand, errors, warnings, info, ok: errors.length === 0};
}

/** Audit a single-page app: shared design tokens, a11y affordances, deploy hygiene, image weight. */
function auditApp(dir, brand) {
  const errors = [];
  const warnings = [];
  const shells = [];
  const walk = (current) => {
    for (const entry of readdirSync(current, {withFileTypes: true})) {
      if (entry.name === 'node_modules' || entry.name.startsWith('.')) continue;
      const full = path.join(current, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (entry.name.endsWith('.html') && !/public\//.test(full)) shells.push(full);
    }
  };
  walk(dir);
  const css = cssText(dir);
  const shell = shells.map((file) => read(file) || '').join('\n');
  const missingTokens = TOKENS.filter((token) => !new RegExp(`${token.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*:`).test(css));
  if (missingTokens.length) errors.push(`tokens: missing ${missingTokens.join(', ')} in CSS`);
  if (!shells.length) warnings.push('shell: no HTML entry found');
  for (const file of shells) {
    const html = read(file) || '';
    const name = path.relative(dir, file);
    if (!/<html[^>]+lang=["']fa["']/.test(html)) warnings.push(`${name}: html lang="fa" missing`);
    if (!/<html[^>]+dir=["']rtl["']/.test(html)) warnings.push(`${name}: html dir="rtl" missing`);
    if (/user-scalable=no|maximum-scale=1/.test(html)) errors.push(`${name}: viewport blocks pinch zoom`);
  }
  if (!/prefers-reduced-motion/.test(css)) errors.push('a11y: prefers-reduced-motion block missing');
  if (!/:focus-visible/.test(css)) errors.push('a11y: :focus-visible styles missing');
  if (FONT_HOSTS.test(shell) || FONT_HOSTS.test(css)) errors.push('fonts: remote font host in critical path (self-host woff2)');
  if (!/--font-display\s*:/.test(css) && !/--font\s*:/.test(css)) warnings.push('tokens: no font token');
  const vercel = read(path.join(dir, 'vercel.json'));
  if (vercel) {
    for (const header of ['X-Content-Type-Options', 'Referrer-Policy']) {
      if (!vercel.includes(header)) warnings.push(`deploy: ${header} header missing in vercel.json`);
    }
  } else warnings.push('deploy: no vercel.json in site directory');
  return {brand, errors, warnings, info: {kind: 'app', shells: shells.length, pages: []}, ok: !errors.length};
}

export function checkoutSites() {
  const file = path.join(STOREFRONTS, 'sites.json');
  const raw = read(file);
  if (!raw) return [];
  try {
    return (JSON.parse(raw).sites || []).filter((site) => site.checkout);
  } catch {
    return [];
  }
}

function main() {
  const args = process.argv.slice(2);
  const dirIndex = args.indexOf('--dir');
  const json = args.includes('--json');
  const registered = checkoutSites();
  const explicit = dirIndex >= 0 ? path.resolve(args[dirIndex + 1]) : null;
  const match = explicit ? registered.find((site) => path.join(ROOT, site.checkout) === explicit) : null;
  const targets = explicit
    ? [{dir: explicit, brand: match?.brand || path.basename(explicit), kind: match?.kind || 'storefront'}]
    : checkoutSites().map((site) => ({dir: path.join(ROOT, site.checkout), brand: site.brand, kind: site.kind}));
  if (!targets.length) {
    console.log('No storefront is checked out; live sites are tracked in storefronts/sites.json.');
    return 0;
  }
  let failed = false;
  for (const target of targets) {
    const {dir} = target;
    if (!existsSync(dir)) {
      console.log(`skip ${path.relative(ROOT, dir)} (not present)`);
      continue;
    }
    const report = auditSite(dir, {brand: target.brand || path.basename(dir), kind: target.kind});
    if (!report.ok) failed = true;
    if (json) {
      console.log(JSON.stringify(report, null, 1));
      continue;
    }
    console.log(`\n== ${report.brand} (${path.relative(ROOT, dir)})`);
    console.log(`   pages: ${report.info.pages.length} · images: ${report.info.images ?? 0} · heaviest ${report.info.heaviestImageKB ?? 0}KB`);
    for (const error of report.errors) console.log(`   ✗ ${error}`);
    for (const warning of report.warnings) console.log(`   ! ${warning}`);
    if (!report.errors.length && !report.warnings.length) console.log('   ✓ all static gates pass');
  }
  return failed ? 1 : 0;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  process.exitCode = main();
}
