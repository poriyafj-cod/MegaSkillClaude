#!/usr/bin/env node
/**
 * NIGHTLAB — jsdom smoke tests.
 * Loads every page with the real scripts inlined and walks the shop:
 * age gate, catalog, filters, sorting, bundle pricing, cart, coupons,
 * wishlist, contact validation and the guide page.
 *
 *   npm i --no-save jsdom && node scripts/smoke.mjs
 */
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { JSDOM, VirtualConsole } from "jsdom";

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
  window.matchMedia = window.matchMedia || function(){ return { matches:false, addEventListener(){}, removeEventListener(){} }; };
`;

async function loadPage(page, opts) {
  const o = opts || {};
  const file = page.split("?")[0];
  let html = await readFile(path.join(ROOT, file), "utf8");
  const scripts = [...html.matchAll(/<script src="(assets\/js\/[a-z-]+\.js)"><\/script>/g)];

  for (const [tag, src] of scripts) {
    const code = await readFile(path.join(ROOT, src), "utf8");
    html = html.replace(tag, `<script>${code.replace(/<\/script>/g, "<\\/script>")}</script>`);
  }
  html = html.replace(/<link[^>]+fonts\.googleapis[^>]*>/g, "");

  const errs = [];
  const vc = new VirtualConsole();
  vc.on("jsdomError", (e) => errs.push(e.message));
  vc.on("error", (e) => errs.push(String(e)));

  const dom = new JSDOM(html, {
    runScripts: "dangerously",
    pretendToBeVisual: true,
    url: "http://localhost/" + page,
    virtualConsole: vc,
    beforeParse(window) {
      window.eval(STUBS);
      if (!o.noAge) window.localStorage.setItem("nightlab.age.v1", "1");
      Object.entries(o.seed || {}).forEach(([k, v]) => window.localStorage.setItem(k, JSON.stringify(v)));
    },
  });
  await new Promise((r) => setTimeout(r, 70));
  return { dom, errs, doc: dom.window.document };
}

const q = (ctx, sel) => ctx.doc.querySelector(sel);
const qa = (ctx, sel) => [...ctx.doc.querySelectorAll(sel)];

/* ---------------- age gate ---------------- */
console.log("\nage gate");
{
  const ctx = await loadPage("index.html", { noAge: true });
  ok("gate is injected on first visit", !!q(ctx, "#ageGate"));
  ok("page is locked while gate is open", ctx.doc.body.classList.contains("is-locked"));
  const yes = q(ctx, "[data-age-yes]");
  yes.dispatchEvent(new ctx.dom.window.MouseEvent("click", { bubbles: true }));
  await new Promise((r) => setTimeout(r, 320));
  ok("confirmation is stored", ctx.dom.window.localStorage.getItem("nightlab.age.v1") === "1");
  ok("gate is removed after confirming", !q(ctx, "#ageGate"));

  const returned = await loadPage("index.html");
  ok("gate stays closed on return", !q(returned, "#ageGate"));

  const denied = await loadPage("shop.html", { noAge: true });
  q(denied, "[data-age-no]").dispatchEvent(new denied.dom.window.MouseEvent("click", { bubbles: true }));
  ok("declining shows a refusal", q(denied, "[data-age-denied]").hidden === false);
}

/* ---------------- home ---------------- */
console.log("\nhome");
{
  const ctx = await loadPage("index.html");
  ok("no page errors", ctx.errs.length === 0, ctx.errs[0]);
  ok("header + footer mounted", !!q(ctx, ".header__bar") && !!q(ctx, ".footer__grid"));
  ok("notice bar mentions discreet shipping", /بی‌نام/.test(q(ctx, ".notice-bar").textContent));
  ok("hero poster uses the founder shot", /founder-poster\.jpg/.test(q(ctx, ".poster img").src));
  ok("5 category cards", qa(ctx, ".cat").length === 5, String(qa(ctx, ".cat").length));
  ok("bestseller grid has 4 cards", qa(ctx, "[data-bestsellers] .pc").length === 4);
  ok("new-arrivals grid has 4 cards", qa(ctx, "[data-new] .pc").length === 4);
  ok("three testimonials", qa(ctx, ".quote").length === 3);
  ok("kit grid offers 6 items", qa(ctx, "[data-kit-grid] .kit__item").length === 6);

  const pick = (i) =>
    qa(ctx, "[data-kit-grid] .kit__item")[i].dispatchEvent(new ctx.dom.window.MouseEvent("click", { bubbles: true }));
  pick(0);
  pick(1);
  ok("kit counts selections", q(ctx, "[data-kit-count]").textContent === "۲", q(ctx, "[data-kit-count]").textContent);
  ok("no discount below three items", /انتخاب کن/.test(q(ctx, "[data-kit-off]").textContent));

  pick(2);
  ok("15% discount applied at three items", /۱۵|−/.test(q(ctx, "[data-kit-off]").textContent), q(ctx, "[data-kit-off]").textContent);
  ok("kit total is a price", /تومان/.test(q(ctx, "[data-kit-total]").textContent));

  q(ctx, "[data-kit-add]").dispatchEvent(new ctx.dom.window.MouseEvent("click", { bubbles: true }));
  const cart = JSON.parse(ctx.dom.window.localStorage.getItem("nightlab.cart.v1") || "[]");
  ok("kit adds three items to the cart", cart.length === 3, JSON.stringify(cart.length));
  ok("drawer opens after adding", q(ctx, "#cartDrawer").classList.contains("is-open"));

  const news = q(ctx, "[data-newsletter]");
  news.querySelector("input").value = "not-an-email";
  news.dispatchEvent(new ctx.dom.window.Event("submit", { bubbles: true, cancelable: true }));
  ok("newsletter rejects a bad address", !ctx.dom.window.localStorage.getItem("nightlab.news.v1"));
}

/* ---------------- shop ---------------- */
console.log("\nshop");
{
  const ctx = await loadPage("shop.html");
  ok("no page errors", ctx.errs.length === 0, ctx.errs[0]);
  ok("default grid shows 8 cards", qa(ctx, "[data-grid] .pc").length === 8, String(qa(ctx, "[data-grid] .pc").length));
  ok("count badge shows the full catalog", q(ctx, "[data-count]").textContent === "۱۲");

  const vib = q(ctx, 'input[name="cat"][value="vibrators"]');
  vib.checked = true;
  vib.dispatchEvent(new ctx.dom.window.Event("change", { bubbles: true }));
  ok("category filter narrows to 4", qa(ctx, "[data-grid] .pc").length === 4, String(qa(ctx, "[data-grid] .pc").length));
  ok("url keeps the category", ctx.dom.window.location.search.includes("cat=vibrators"));
  ok("active filter becomes a chip", !!q(ctx, '[data-chip="cat"]'));

  const sort = q(ctx, "[data-sort]");
  sort.value = "price-asc";
  sort.dispatchEvent(new ctx.dom.window.Event("change", { bubbles: true }));
  const prices = qa(ctx, "[data-grid] .price__now").map((el) =>
    Number(
      el.textContent
        .replace(/[^\d۰-۹]/g, "")
        .replace(/[۰-۹]/g, (d) => "۰۱۲۳۴۵۶۷۸۹".indexOf(d))
    )
  );
  ok("price ascending", prices.every((v, i) => i === 0 || prices[i - 1] <= v), prices.join(","));

  q(ctx, "[data-chip]").dispatchEvent(new ctx.dom.window.MouseEvent("click", { bubbles: true }));
  ok("chip removes the filter", qa(ctx, "[data-grid] .pc").length === 8);

  q(ctx, "[data-more]").dispatchEvent(new ctx.dom.window.MouseEvent("click", { bubbles: true }));
  ok("load more reveals 12", qa(ctx, "[data-grid] .pc").length === 12, String(qa(ctx, "[data-grid] .pc").length));
}

/* ---------------- product ---------------- */
console.log("\nproduct");
{
  const ctx = await loadPage("product.html?p=silicone-wand");
  ok("no page errors", ctx.errs.length === 0, ctx.errs[0]);
  ok("title rendered", /واند/.test(q(ctx, ".pdp__title").textContent));
  ok("three gallery thumbs", qa(ctx, "[data-thumbs] .gallery__thumb").length === 3);
  ok("four bundle options", qa(ctx, ".packsize button").length === 4);
  ok("four accordions", qa(ctx, ".acc").length === 4);
  ok("spec table is populated", qa(ctx, ".spec-table tr").length >= 6);

  const before = q(ctx, "[data-price-block] .price__now").textContent;
  q(ctx, '.packsize button[data-tier="2"]').dispatchEvent(new ctx.dom.window.MouseEvent("click", { bubbles: true }));
  const after = q(ctx, "[data-price-block] .price__now").textContent;
  ok("bundle switch changes the price", before !== after, before + " → " + after);

  q(ctx, '[data-q="1"]').dispatchEvent(new ctx.dom.window.MouseEvent("click", { bubbles: true }));
  q(ctx, "[data-buy]").dispatchEvent(new ctx.dom.window.MouseEvent("click", { bubbles: true }));
  const cart = JSON.parse(ctx.dom.window.localStorage.getItem("nightlab.cart.v1") || "[]");
  ok("adds the chosen bundle (3 × 2)", cart.length === 1 && cart[0].size === 3 && cart[0].qty === 2, JSON.stringify(cart));
  ok("cart badge updates", q(ctx, "[data-cart-count]").textContent === "2");

  const missing = await loadPage("product.html?p=nope");
  ok("unknown product falls back", /پیدا نشد/.test(missing.doc.body.textContent));
}

/* ---------------- cart ---------------- */
console.log("\ncart");
{
  const seed = { "nightlab.cart.v1": [{ key: "water-lube:1", slug: "water-lube", pack: 1, size: 2, unit: 304000, qty: 2 }] };
  const ctx = await loadPage("cart.html", { seed });
  ok("no page errors", ctx.errs.length === 0, ctx.errs[0]);
  ok("line item rendered", qa(ctx, "[data-cart] .line-item").length === 1);
  ok("summary shows a total", /تومان/.test(q(ctx, "[data-summary]").textContent));
  ok("free-shipping meter present", !!q(ctx, ".ship-hint__fill"));

  const input = q(ctx, "[data-coupon-input]");
  input.value = "LAB10";
  q(ctx, "[data-coupon]").dispatchEvent(new ctx.dom.window.MouseEvent("click", { bubbles: true }));
  ok("LAB10 is accepted", JSON.parse(ctx.dom.window.localStorage.getItem("nightlab.coupon.v1") || "null").code === "LAB10");

  const qtyUp = q(ctx, '[data-qty-inc][data-delta="1"]');
  qtyUp.dispatchEvent(new ctx.dom.window.MouseEvent("click", { bubbles: true }));
  ok("quantity increases", JSON.parse(ctx.dom.window.localStorage.getItem("nightlab.cart.v1"))[0].qty === 3);

  q(ctx, "[data-next]").dispatchEvent(new ctx.dom.window.MouseEvent("click", { bubbles: true }));
  ok("step 2 opens", q(ctx, '[data-step-panel="2"]').hidden === false);
  q(ctx, "[data-next]").dispatchEvent(new ctx.dom.window.MouseEvent("click", { bubbles: true }));
  ok("empty form blocks step 3", q(ctx, '[data-step-panel="3"]').hidden === true);
  ok("validation messages appear", qa(ctx, ".field__error").some((e) => e.textContent.trim().length > 0));

  // fill the form and place the order
  const set = (name, value) => (q(ctx, `[name="${name}"]`).value = value);
  set("name", "ن. راد");
  set("phone", "09121234567");
  set("province", "تهران");
  set("city", "تهران");
  set("address", "خیابان مطهری، پلاک ۹۱، واحد ۲");
  set("postal", "1234567890");
  q(ctx, "[data-next]").dispatchEvent(new ctx.dom.window.MouseEvent("click", { bubbles: true }));
  ok("step 3 opens with a valid form", q(ctx, '[data-step-panel="3"]').hidden === false);

  q(ctx, "[data-place]").dispatchEvent(new ctx.dom.window.MouseEvent("click", { bubbles: true }));
  ok("terms are required", q(ctx, "[data-success]").hidden === true);

  q(ctx, '[name="terms"]').checked = true;
  q(ctx, "[data-place]").dispatchEvent(new ctx.dom.window.MouseEvent("click", { bubbles: true }));
  ok("order is saved", ctx.dom.window.localStorage.getItem("nightlab.orders.v1").includes("NL-"));
  ok("success screen shows a code", /NL-/.test(q(ctx, "[data-success]").textContent));
  ok("cart is emptied", JSON.parse(ctx.dom.window.localStorage.getItem("nightlab.cart.v1") || "[]").length === 0);
}

/* ---------------- empty cart ---------------- */
console.log("\ncart (empty)");
{
  const ctx = await loadPage("cart.html");
  ok("empty state rendered", !!q(ctx, "[data-cart] .empty-state"));
  ok("summary suggests a start", /هنوز چیزی/.test(q(ctx, "[data-summary]").textContent));
  ok("checkout bar hidden", q(ctx, "[data-checkout]").hidden === true);

  ctx.dom.window.eval("window.Store.addToCart('silent-bullet', 0, 1)");
  await new Promise((r) => setTimeout(r, 40));
  ok("adding repaints the page", qa(ctx, "[data-cart] .line-item").length === 1);
  ok("checkout bar returns", q(ctx, "[data-checkout]").hidden === false);
}

/* ---------------- wishlist ---------------- */
console.log("\nwishlist");
{
  const ctx = await loadPage("wishlist.html", { seed: { "nightlab.wishlist.v1": ["duo-ring", "soft-cuffs"] } });
  ok("wishlist renders two cards", qa(ctx, "[data-wish-grid] .pc").length === 2);
  ok("bulk add button visible", q(ctx, "[data-wish-bulk]").hidden === false);
  q(ctx, "[data-wish-bulk]").dispatchEvent(new ctx.dom.window.MouseEvent("click", { bubbles: true }));
  ok("bulk add fills the cart", JSON.parse(ctx.dom.window.localStorage.getItem("nightlab.cart.v1")).length === 2);
}

/* ---------------- contact + guide ---------------- */
console.log("\ncontact & guide");
{
  const ctx = await loadPage("contact.html");
  const form = q(ctx, "[data-contact-form]");
  form.dispatchEvent(new ctx.dom.window.Event("submit", { bubbles: true, cancelable: true }));
  ok("empty form shows errors", qa(ctx, ".field__error").some((e) => e.textContent.trim().length > 0));

  form.querySelector('[name="name"]').value = "آ. کاوه";
  form.querySelector('[name="phone"]').value = "09120000000";
  form.querySelector('[name="topic"]').value = "مشاورهٔ خرید";
  form.querySelector('[name="message"]').value = "برای شروع چه چیزی پیشنهاد می‌کنید؟";
  form.dispatchEvent(new ctx.dom.window.Event("submit", { bubbles: true, cancelable: true }));
  ok("message is stored", (ctx.dom.window.localStorage.getItem("nightlab.messages.v1") || "").includes("مشاوره"));
  ok("success banner shown", q(ctx, "[data-contact-done]").hidden === false);
  ok("six FAQ items", qa(ctx, ".acc").length === 6);

  const guide = await loadPage("guide.html");
  ok("guide page renders", qa(guide, ".guide-card").length === 3);
  ok("safety rules listed", qa(guide, ".safety li").length === 7);
}

/* ---------------- summary ---------------- */
console.log("\n" + "-".repeat(48));
if (fails.length) {
  console.error(`✗ ${fails.length} failed, ${pass} passed`);
  fails.forEach((f) => console.error("  • " + f));
  process.exit(1);
}
console.log(`✓ ${pass} assertions passed`);
