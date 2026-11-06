// Proves the storefront gate is not vacuously green: a good fixture passes, a bad fixture fails.
import assert from 'node:assert/strict';
import {mkdtempSync, mkdirSync, writeFileSync, rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import path from 'node:path';
import test from 'node:test';
import {auditSite, checkoutSites} from '../scripts/storefront-check.mjs';

const CSS = `:root{--bg:#0B0B0F;--surface:#14141B;--fg:#F5F2EC;--accent:#F28A1E;--on-accent:#0B0B0F;
--border:#26262F;--radius:16px;--font:"Vazirmatn",system-ui;--font-display:"Vazirmatn",system-ui}
:focus-visible{outline:2px solid var(--accent)}
@media (prefers-reduced-motion: reduce){*{animation-duration:.01ms !important}}`;

const SHELL = `<!doctype html><html lang="fa" dir="rtl"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>فروشگاه نمونه — صفحه</title>
<meta name="description" content="این یک فروشگاه نمونه برای آزمون قرارداد طراحی است و متن کافی دارد.">
<meta property="og:image" content="/og.jpg"><link rel="stylesheet" href="styles.css"></head>
<body><a class="skip-link" href="#main">رفتن به محتوا</a><main id="main"><h1>عنوان</h1>
<script type="application/ld+json">{"@type":"Organization","name":"نمونه"}</script></main>
<script>localStorage.getItem('cart')</script></body></html>`;

const PAGES = ['index.html', 'shop.html', 'product.html', 'about.html', 'contact.html',
  'shipping.html', 'returns.html', 'privacy.html', 'terms.html'];

function fixture() {
  const dir = mkdtempSync(path.join(tmpdir(), 'storefront-'));
  for (const page of PAGES) writeFileSync(path.join(dir, page), SHELL);
  writeFileSync(path.join(dir, 'styles.css'), CSS);
  writeFileSync(path.join(dir, 'vercel.json'), JSON.stringify({
    headers: [{source: '/(.*)', headers: [{key: 'X-Content-Type-Options', value: 'nosniff'},
      {key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin'}]}],
  }));
  return dir;
}

test('a compliant fixture passes every static gate', () => {
  const dir = fixture();
  try {
    const report = auditSite(dir);
    assert.deepEqual(report.errors, []);
    assert.equal(report.ok, true);
  } finally {
    rmSync(dir, {recursive: true, force: true});
  }
});

test('missing pages, LTR shells, dead links and remote fonts are caught', () => {
  const dir = fixture();
  try {
    for (const page of ['shop.html', 'product.html']) rmSync(path.join(dir, page));
    writeFileSync(path.join(dir, 'index.html'), SHELL
      .replace('dir="rtl"', 'dir="ltr"')
      .replace('user-scalable', 'user-scalable')
      .replace('</main>', '<a href="#">خرید</a><img src="https://fonts.googleapis.com/x.css"></main>')
      .replace('</head>', '<link href="https://fonts.googleapis.com/css2?family=Inter" rel="stylesheet"></head>'));
    const report = auditSite(dir);
    const text = report.errors.join('\n');
    assert.equal(report.ok, false);
    assert.match(text, /shop\.html: missing required page/);
    assert.match(text, /dir="rtl" missing/);
    assert.match(text, /dead href="#" found/);
    assert.match(text, /remote font host/);
  } finally {
    rmSync(dir, {recursive: true, force: true});
  }
});

test('two h1s, zoom blocking and invalid JSON-LD are errors, not warnings', () => {
  const dir = fixture();
  try {
    writeFileSync(path.join(dir, 'about.html'), SHELL
      .replace('width=device-width,initial-scale=1', 'width=device-width,maximum-scale=1')
      .replace('<h1>عنوان</h1>', '<h1>یک</h1><h1>دو</h1>')
      .replace('{"@type":"Organization","name":"نمونه"}', '{broken json'));
    const report = auditSite(dir);
    const text = report.errors.join('\n');
    assert.match(text, /about\.html: expected exactly one h1, found 2/);
    assert.match(text, /viewport blocks pinch zoom/);
    assert.match(text, /about\.html: invalid JSON-LD block/);
  } finally {
    rmSync(dir, {recursive: true, force: true});
  }
});

test('single-page app kind gets the token contract without commerce routes', () => {
  const dir = mkdtempSync(path.join(tmpdir(), 'storefront-app-'));
  try {
    writeFileSync(path.join(dir, 'index.html'), '<!doctype html><html lang="fa" dir="rtl"><head><meta name="viewport" content="width=device-width"></head><body><div id="root"></div></body></html>');
    writeFileSync(path.join(dir, 'app.css'), CSS);
    mkdirSync(path.join(dir, 'src'));
    writeFileSync(path.join(dir, 'src/app.css'), CSS);
    const report = auditSite(dir, {kind: 'app'});
    assert.deepEqual(report.errors, []);
    assert.equal(report.info.kind, 'app');
  } finally {
    rmSync(dir, {recursive: true, force: true});
  }
});

test('every registered checkout site exists and declares a unique id and kind', () => {
  const sites = checkoutSites();
  const ids = sites.map((site) => site.id);
  assert.equal(new Set(ids).size, ids.length);
  for (const site of sites) {
    assert.ok(['storefront', 'app'].includes(site.kind), `${site.id}: kind must be storefront|app`);
    assert.match(site.checkout, /^[a-z-]+\/?$/, `${site.id}: checkout must be a repo-relative path`);
  }
});
