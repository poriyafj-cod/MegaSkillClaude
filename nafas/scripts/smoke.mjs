#!/usr/bin/env node
/**
 * NAFAS — headless smoke test (jsdom).
 * Boots each page with its real scripts and checks the important flows:
 * chrome mounting, catalog rendering, filtering, product page, cart → checkout.
 *
 * Usage: node scripts/smoke.mjs
 */
import { readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { JSDOM, VirtualConsole } from "jsdom";

const ROOT = resolve(fileURLToPath(new URL("..", import.meta.url)));
const failures = [];
const pass = [];

const check = (label, condition) => {
  if (condition) pass.push(label);
  else failures.push(label);
};

const virtualConsole = new VirtualConsole();
virtualConsole.on("jsdomError", (err) => {
  const msg = String(err && err.message);
  // jsdom has no layout engine: navigation & scrolling are expected to be unimplemented.
  if (/Not implemented|Could not parse CSS/i.test(msg)) return;
  failures.push("jsdom error: " + msg);
});

async function boot(page, { seed } = {}) {
  const file = page.split("?")[0];
  const html = readFileSync(join(ROOT, file), "utf8");
  const dom = new JSDOM(html, {
    url: "http://localhost/" + page,
    runScripts: "dangerously",
    pretendToBeVisual: true,
    virtualConsole,
    beforeParse(window) {
      if (seed) {
        Object.keys(seed).forEach((k) => window.localStorage.setItem(k, seed[k]));
      }
    },
  });

  const { window } = dom;
  // external scripts are not fetched by jsdom → evaluate them in document order
  const sources = Array.from(window.document.querySelectorAll("script[src]")).map((s) =>
    s.getAttribute("src")
  );
  await new Promise((r) => window.addEventListener("load", r));

  for (const src of sources) {
    if (!src.startsWith("assets/")) continue;
    window.eval(readFileSync(join(ROOT, src), "utf8"));
  }
  return window;
}

const money = (n) => n;

/* ------------------------------------------------------------------ */
/* 1 — home                                                            */
/* ------------------------------------------------------------------ */
{
  const w = await boot("index.html");
  const d = w.document;

  check("home: header mounted", Boolean(d.querySelector(".site-header .brand__name")));
  check("home: footer mounted", Boolean(d.querySelector(".site-footer")));
  check("home: 6 category cards", d.querySelectorAll(".cat-card").length === 6);
  check("home: 8 bestsellers", d.querySelectorAll("#bestsellerGrid .product-card").length === 8);
  check("home: 4 new arrivals", d.querySelectorAll("#newGrid .product-card").length === 4);
  check("home: testimonials", d.querySelectorAll(".testimonial").length === 3);
  check("home: features strip", d.querySelectorAll(".feature").length === 4);
  check("home: countdown rendered", /\d|۰|۱|۲|۳/.test(d.querySelector('[data-cd="days"]').textContent));
  check("home: hero image present", Boolean(d.querySelector(".hero__photo img")));
  check("home: icons injected", d.querySelectorAll("[data-icon]").length === 0);
  check("home: contact sheet image", Boolean(d.querySelector("#faces .film__print img[src*='nafas-contact']")));
  check("home: contact sheet stamp", /۱۲/.test(d.querySelector("#faces .film__stamp").textContent));
  check("home: contact sheet points", d.querySelectorAll("#faces .film__list li").length === 3);
  check("home: every brand face image exists", [...d.querySelectorAll("#faces img")].every((img) => img.getAttribute("src").startsWith("assets/img/brand/")));
}

/* ------------------------------------------------------------------ */
/* 2 — shop filtering & sorting                                        */
/* ------------------------------------------------------------------ */
{
  const w = await boot("shop.html");
  const d = w.document;

  const cards = () => d.querySelectorAll("#shopGrid .product-card").length;
  check("shop: renders products", cards() > 0);
  check("shop: result count text", /محصول/.test(d.querySelector("#resultCount").textContent));

  const before = cards();
  const catBox = d.querySelector('[data-cat][value="hair"]');
  catBox.checked = true;
  catBox.dispatchEvent(new w.Event("change", { bubbles: true }));
  const hairCount = cards();
  check("shop: category filter narrows results", hairCount > 0 && hairCount < before);

  const clear = d.querySelector("[data-clear-filters]");
  clear.click();
  check("shop: clearing filters restores list", cards() === before);

  // sorting
  const sort = d.querySelector("#sortSelect");
  sort.value = "price-asc";
  sort.dispatchEvent(new w.Event("change", { bubbles: true }));
  const prices = Array.from(d.querySelectorAll("#shopGrid .price")).map((el) =>
    Number(el.textContent.replace(/[^۰-۹0-9]/g, "").replace(/[۰-۹]/g, (c) => "۰۱۲۳۴۵۶۷۸۹".indexOf(c)))
  );
  check("shop: price-asc sorted", prices.every((p, i) => i === 0 || prices[i - 1] <= p));

  // search query from url
  const w2 = await boot("shop.html?q=" + encodeURIComponent("مروارید"));
  check("shop: search url filters", w2.document.querySelectorAll("#shopGrid .product-card").length > 0);
}

/* ------------------------------------------------------------------ */
/* 3 — product detail                                                  */
/* ------------------------------------------------------------------ */
{
  const w = await boot("product.html?p=gold-hoops");
  const d = w.document;
  check("pdp: title filled", d.querySelector("#pdpTitle").textContent.indexOf("حلقه") !== -1);
  check("pdp: price rendered", /تومان/.test(d.querySelector("#pdpPrice").textContent));
  check("pdp: 2 gallery thumbs", d.querySelectorAll(".gallery__thumb").length === 2);
  check("pdp: accordion items", d.querySelectorAll(".accordion__item").length === 4);
  check("pdp: related products", d.querySelectorAll("#relatedGrid .product-card").length === 4);
  check("pdp: stock pill", d.querySelector("#pdpStock").textContent.length > 0);

  // add to cart from PDP opens drawer & updates badge
  d.querySelector("#addToCart").click();
  const badge = d.querySelector("[data-cart-count]");
  check("pdp: add to cart updates badge", badge.textContent !== "۰");
  check("pdp: cart drawer opened", d.querySelector("#cartDrawer").classList.contains("is-open"));
  check("pdp: drawer has line item", d.querySelectorAll("#cartDrawer .line-item").length === 1);

  // missing product
  const w2 = await boot("product.html?p=does-not-exist");
  check("pdp: unknown product shows fallback", /پیدا نشد/.test(w2.document.body.textContent));
}

/* ------------------------------------------------------------------ */
/* 4 — cart page + checkout                                            */
/* ------------------------------------------------------------------ */
{
  const seed = {
    "nafas.cart.v1": JSON.stringify({
      items: [
        { id: "p01", qty: 1, opts: "طلایی" },
        { id: "p11", qty: 2, opts: "صورتی" },
      ],
    }),
  };
  const w = await boot("cart.html", { seed });
  const d = w.document;

  check("cart: rows rendered", d.querySelectorAll(".cart-row").length === 2);
  check("cart: summary total", /تومان/.test(d.querySelector("#summary").textContent));

  // coupon
  d.querySelector("#couponInput").value = "NAFAS10";
  d.querySelector("#applyCoupon").click();
  check("cart: coupon applied", /اعمال شد/.test(d.querySelector("#couponMsg").textContent));

  // qty update
  const inc = d.querySelector("[data-cart-inc]");
  inc.click();
  check("cart: qty increment re-renders rows", d.querySelectorAll(".cart-row").length === 2);

  // go to checkout
  d.querySelector("#toCheckout").click();
  check("cart: checkout panel visible", d.querySelector("#checkoutPanel").hidden === false);

  // submit empty form → validation
  d.querySelector("#checkoutForm").dispatchEvent(new w.Event("submit", { bubbles: true, cancelable: true }));
  check("cart: validation blocks empty form", d.querySelector("#orderSuccess").hidden !== false);

  // fill form and submit
  d.querySelector("#fName").value = "نفس محمدی";
  d.querySelector("#fPhone").value = "۰۹۱۲۳۴۵۶۷۸۹";
  d.querySelector("#fProvince").value = "تهران";
  d.querySelector("#fCity").value = "تهران";
  d.querySelector("#fAddress").value = "خیابان ولیعصر، کوچهٔ بهار، پلاک ۱۲، واحد ۳";
  d.querySelector("#fPostal").value = "۱۹۸۷۶۵۴۳۲۱";
  d.querySelector("#fTerms").checked = true;
  d.querySelector("#checkoutForm").dispatchEvent(new w.Event("submit", { bubbles: true, cancelable: true }));

  check("cart: success panel shown", d.querySelector("#orderSuccess").hidden === false);
  check("cart: order code rendered", /NF-\d+/.test(d.querySelector("#orderSuccess").textContent));
  check("cart: cart cleared", JSON.parse(w.localStorage.getItem("nafas.cart.v1") || '{"items":[]}').items.length === 0);
  check(
    "cart: order persisted",
    JSON.parse(w.localStorage.getItem("nafas.orders.v1") || "[]").length === 1
  );
}

/* ------------------------------------------------------------------ */
/* 5 — wishlist, about, contact                                        */
/* ------------------------------------------------------------------ */
{
  const w = await boot("wishlist.html", { seed: { "nafas.wishlist.v1": JSON.stringify(["p06", "p11"]) } });
  check("wishlist: renders saved items", w.document.querySelectorAll("#wishGrid .product-card").length === 2);
  check("wishlist: count pill", /۲/.test(w.document.querySelector("#wishCount").textContent));
}
{
  const w = await boot("about.html");
  check("about: header mounted", Boolean(w.document.querySelector(".site-header")));
  check("about: timeline entries", w.document.querySelectorAll(".timeline__item").length === 4);
  check("about: 4 polaroid faces", w.document.querySelectorAll("#faces .frame").length === 4);
  check("about: every face has a caption", [...w.document.querySelectorAll("#faces .frame")].every((f) => f.querySelector("figcaption")?.textContent.trim().length > 3));
}
{
  const w = await boot("contact.html");
  const d = w.document;
  check("contact: faq rendered", d.querySelectorAll("#faqList .accordion__item").length === 5);
  d.querySelector("#cName").value = "آوا رضایی";
  d.querySelector("#cPhone").value = "09121112233";
  d.querySelector("#cSubject").value = "پیگیری سفارش";
  d.querySelector("#cMessage").value = "سلام، می‌خواستم وضعیت سفارشم رو پیگیری کنم.";
  d.querySelector("#cConsent").checked = true;
  d.querySelector("#contactForm").dispatchEvent(new w.Event("submit", { bubbles: true, cancelable: true }));
  check("contact: success state", /پیامت رسید/.test(d.body.textContent));
}

/* ------------------------------------------------------------------ */
console.log(`\nNAFAS smoke — ${pass.length} passed, ${failures.length} failed`);
failures.forEach((f) => console.error("  ✗ " + f));
if (failures.length) process.exit(1);
console.log("✓ all flows working");
void money;
process.exit(0);
