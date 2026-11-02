#!/usr/bin/env node
/**
 * LIFE STAR — jsdom smoke tests.
 * Loads each page with the real scripts inlined and exercises the shop:
 * catalog rendering, filters/sorting, product options, cart totals, coupons,
 * wishlist and the contact form validation.
 *
 *   npm i --no-save jsdom && node scripts/smoke.mjs
 */
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { JSDOM } from "jsdom";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
let pass = 0;
const fails = [];

function ok(name, cond, extra) {
  if (cond) {
    pass += 1;
    console.log("  ✓ " + name);
  } else {
    fails.push(name + (extra ? " — " + extra : ""));
    console.log("  ✗ " + name + (extra ? " — " + extra : ""));
  }
}

const STUBS = `
  window.IntersectionObserver = class { constructor(){} observe(){} unobserve(){} disconnect(){} };
  window.scrollTo = function(){};
  window.matchMedia = window.matchMedia || function(){ return { matches:false, addEventListener(){}, removeEventListener(){}, addListener(){}, removeListener(){} }; };
`;

async function loadPage(page, seed) {
  const file = page.split("?")[0];
  let html = await readFile(path.join(ROOT, file), "utf8");
  const scripts = [...html.matchAll(/<script src="(assets\/js\/[a-z-]+\.js)"><\/script>/g)];

  // inline every local script, in order, so jsdom needs no network
  for (const [tag, src] of scripts) {
    const code = await readFile(path.join(ROOT, src), "utf8");
    html = html.replace(tag, `<script>${code.replace(/<\/script>/g, "<\\/script>")}</script>`);
  }
  // drop external font stylesheet (jsdom must not fetch)
  html = html.replace(/<link[^>]+fonts\.googleapis[^>]*>/g, "");

  const dom = new JSDOM(html, {
    runScripts: "dangerously",
    pretendToBeVisual: true,
    url: "http://localhost/" + page,
    beforeParse(window) {
      window.eval(STUBS);
      if (seed) Object.entries(seed).forEach(([k, v]) => window.localStorage.setItem(k, JSON.stringify(v)));
    },
  });
  await new Promise((r) => setTimeout(r, 60));
  return dom;
}

const q = (dom, sel) => dom.window.document.querySelector(sel);
const qa = (dom, sel) => [...dom.window.document.querySelectorAll(sel)];

/* ---------------- home ---------------- */
console.log("\nhome");
{
  const dom = await loadPage("index.html");
  const doc = dom.window.document;
  ok("header mounted", !!q(dom, ".header__bar"));
  ok("footer mounted", !!q(dom, ".footer__grid"));
  ok("hero can is an svg", !!q(dom, "[data-hero-can] svg"));
  ok("4 category cards", qa(dom, ".cat").length === 4, String(qa(dom, ".cat").length));
  ok("bestseller grid filled", qa(dom, "[data-bestsellers] .pc").length === 4);
  ok("lookbook has 7 shots", qa(dom, ".look").length === 7);
  ok("pack tiers rendered", qa(dom, "[data-pack] [data-tier]").length === 4);
  ok("caffeine compare rows", qa(dom, ".nutri__row").length === 4);

  // pack builder switches tiers
  const tier3 = q(dom, '[data-pack] [data-tier="3"]');
  tier3.dispatchEvent(new dom.window.MouseEvent("click", { bubbles: true }));
  ok("pack tier switch updates price", q(dom, "[data-pack-price]").textContent.trim() !== "۰", q(dom, "[data-pack-price]").textContent);
}

/* ---------------- shop ---------------- */
console.log("\nshop");
{
  const dom = await loadPage("shop.html");
  ok("default grid shows 8 cards", qa(dom, "[data-grid] .pc").length === 8, String(qa(dom, "[data-grid] .pc").length));
  ok("count text present", /نوشیدنی/.test(q(dom, "[data-count]").textContent));

  const zero = q(dom, 'input[name="cat"][value="zero"]');
  zero.checked = true;
  zero.dispatchEvent(new dom.window.Event("change", { bubbles: true }));
  ok("zero filter → 4 drinks", qa(dom, "[data-grid] .pc").length === 4, String(qa(dom, "[data-grid] .pc").length));
  ok("url synced with cat=zero", dom.window.location.search.includes("cat=zero"));

  const sort = q(dom, "[data-sort]");
  sort.value = "price-asc";
  sort.dispatchEvent(new dom.window.Event("change", { bubbles: true }));
  const prices = qa(dom, "[data-grid] .price__now").map((el) => Number(el.textContent.replace(/[^\d۰-۹]/g, "").replace(/[۰-۹]/g, (d) => "۰۱۲۳۴۵۶۷۸۹".indexOf(d))));
  ok("price ascending sort", prices.every((v, i) => i === 0 || prices[i - 1] <= v), prices.join(","));
}

/* ---------------- product ---------------- */
console.log("\nproduct");
{
  const dom = await loadPage("product.html?p=sour-cherry");
  ok("product title rendered", /گیلاس/.test(q(dom, ".pdp__title").textContent));
  ok("4 pack sizes", qa(dom, ".packsize button").length === 4);
  ok("media & thumbs", qa(dom, "[data-thumbs] .gallery__thumb").length === 3);

  const before = q(dom, "[data-price-block] .price__now").textContent;
  const big = q(dom, '.packsize button[data-tier="3"]');
  big.dispatchEvent(new dom.window.MouseEvent("click", { bubbles: true }));
  const after = q(dom, "[data-price-block] .price__now").textContent;
  ok("pack switch changes price", before !== after, before + " → " + after);

  q(dom, "[data-buy]").dispatchEvent(new dom.window.MouseEvent("click", { bubbles: true }));
  const cart = JSON.parse(dom.window.localStorage.getItem("lifestar.cart.v1") || "[]");
  ok("add to cart stores 24-pack", cart.length === 1 && cart[0].size === 24, JSON.stringify(cart));
  ok("cart badge shows count", q(dom, "[data-cart-count]").textContent === "1");

  const unknown = await loadPage("product.html?p=does-not-exist");
  ok("unknown product shows fallback", /پیدا نشد/.test(unknown.window.document.body.textContent));
}

/* ---------------- cart ---------------- */
console.log("\ncart");
{
  const seed = {
    "lifestar.cart.v1": [{ key: "sour-cherry:1", slug: "sour-cherry", pack: 1, size: 6, unit: 63000, qty: 2 }],
  };
  const dom = await loadPage("cart.html", seed);
  ok("cart item rendered", qa(dom, "[data-cart] .line-item").length === 1);
  ok("summary total rendered", /تومان/.test(q(dom, "[data-summary]").textContent));
  ok("shipping bar present", !!q(dom, ".ship-hint__fill"));

  const input = q(dom, "[data-coupon-input]");
  input.value = "STAR10";
  q(dom, "[data-coupon]").dispatchEvent(new dom.window.MouseEvent("click", { bubbles: true }));
  const saved = JSON.parse(dom.window.localStorage.getItem("lifestar.coupon.v1") || "null");
  ok("coupon STAR10 accepted", saved && saved.code === "STAR10", JSON.stringify(saved));

  const bad = q(dom, "[data-coupon-input]");
  bad.value = "NOPE";
  q(dom, "[data-coupon]").dispatchEvent(new dom.window.MouseEvent("click", { bubbles: true }));
  ok("invalid coupon rejected", JSON.parse(dom.window.localStorage.getItem("lifestar.coupon.v1")).code === "STAR10");

  // step navigation
  q(dom, "[data-next]").dispatchEvent(new dom.window.MouseEvent("click", { bubbles: true }));
  ok("step 2 visible after next", q(dom, '[data-step-panel="2"]').hidden === false);
  ok("steps indicator marks step 2", /is-active/.test(qa(dom, ".step")[1].className));
}

/* ---------------- wishlist ---------------- */
console.log("\nwishlist");
{
  const dom = await loadPage("wishlist.html", { "lifestar.wishlist.v1": ["zero-grape", "mint-storm"] });
  ok("wishlist renders 2 cards", qa(dom, "[data-wish-grid] .pc").length === 2, String(qa(dom, "[data-wish-grid] .pc").length));
  ok("bulk button visible", q(dom, "[data-wish-bulk]").hidden === false);
}

/* ---------------- contact ---------------- */
console.log("\ncontact");
{
  const dom = await loadPage("contact.html");
  const doc = dom.window.document;
  const form = q(dom, "[data-contact-form]");
  form.dispatchEvent(new dom.window.Event("submit", { bubbles: true, cancelable: true }));
  ok("empty form shows errors", qa(dom, ".field__error").some((e) => e.textContent.trim().length > 0));

  form.querySelector('[name="name"]').value = "نیما راد";
  form.querySelector('[name="phone"]').value = "09121234567";
  form.querySelector('[name="topic"]').value = "پیگیری سفارش";
  form.querySelector('[name="message"]').value = "سلام، وضعیت سفارش من چطور است؟";
  form.dispatchEvent(new dom.window.Event("submit", { bubbles: true, cancelable: true }));
  ok("valid form stores message", (dom.window.localStorage.getItem("lifestar.messages.v1") || "").includes("نیما"));
  ok("success banner shown", q(dom, "[data-contact-done]").hidden === false);
  ok("faq accordions bound", qa(dom, ".acc").length === 5);
}

/* ---------------- summary ---------------- */
console.log("\n" + "-".repeat(46));
if (fails.length) {
  console.error(`✗ ${fails.length} failed, ${pass} passed`);
  fails.forEach((f) => console.error("  • " + f));
  process.exit(1);
}
console.log(`✓ ${pass} assertions passed`);
process.exit(0);
