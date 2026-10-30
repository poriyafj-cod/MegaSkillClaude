/* ==========================================================================
   NAFAS — tiny client-side store (cart, wishlist, orders) + helpers
   Everything is persisted in localStorage; no backend required.
   ========================================================================== */
(function () {
  "use strict";

  const D = window.NAFAS;
  const KEYS = {
    cart: "nafas.cart.v1",
    wish: "nafas.wishlist.v1",
    orders: "nafas.orders.v1",
    coupon: "nafas.coupon.v1",
  };

  /* ---------------- helpers ---------------- */
  const safeParse = (raw, fallback) => {
    try {
      const v = JSON.parse(raw);
      return v === null || v === undefined ? fallback : v;
    } catch (e) {
      return fallback;
    }
  };

  const read = (key, fallback) => {
    try {
      return safeParse(localStorage.getItem(key), fallback);
    } catch (e) {
      return fallback;
    }
  };

  const write = (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      /* storage might be disabled — the UI still works for this session */
    }
  };

  const fmtNum = (n) =>
    new Intl.NumberFormat("fa-IR", { maximumFractionDigits: 0 }).format(Number(n) || 0);

  const money = (n) => fmtNum(n);

  const getProduct = (id) => D.products.find((p) => p.id === id) || null;
  const bySlug = (slug) => D.products.find((p) => p.slug === slug) || null;
  const categoryOf = (id) => D.categories.find((c) => c.id === id) || null;

  const variantLabel = (opts) => {
    if (!opts) return "";
    if (typeof opts === "string") return opts;
    return [opts.color, opts.size].filter(Boolean).join(" · ");
  };

  /* ---------------- state ---------------- */
  let cart = read(KEYS.cart, { items: [] });
  if (!cart || !Array.isArray(cart.items)) cart = { items: [] };
  // Drop lines whose product disappeared from the catalog.
  cart.items = cart.items.filter((it) => getProduct(it.id));

  let wish = read(KEYS.wish, []);
  if (!Array.isArray(wish)) wish = [];
  wish = wish.filter((id) => getProduct(id));

  let coupon = read(KEYS.coupon, null);
  if (coupon && !D.coupons[coupon]) coupon = null;

  const emit = (type) => {
    document.dispatchEvent(new CustomEvent("nafas:change", { detail: { type } }));
  };

  /* ---------------- cart ---------------- */
  const findLine = (id, opts) =>
    cart.items.find((it) => it.id === id && (it.opts || "") === (opts || ""));

  function add(id, qty, opts) {
    const product = getProduct(id);
    if (!product) return false;
    const q = Math.max(1, Number(qty) || 1);
    const line = findLine(id, opts);
    if (line) {
      line.qty = Math.min(99, line.qty + q);
    } else {
      cart.items.push({ id: id, qty: Math.min(99, q), opts: opts || "" });
    }
    write(KEYS.cart, cart);
    emit("cart");
    return true;
  }

  function setQty(id, opts, qty) {
    const line = findLine(id, opts);
    if (!line) return;
    const q = Math.max(0, Math.min(99, Number(qty) || 0));
    if (q === 0) {
      cart.items = cart.items.filter((it) => it !== line);
    } else {
      line.qty = q;
    }
    write(KEYS.cart, cart);
    emit("cart");
  }

  function remove(id, opts) {
    cart.items = cart.items.filter((it) => !(it.id === id && (it.opts || "") === (opts || "")));
    write(KEYS.cart, cart);
    emit("cart");
  }

  function clear() {
    cart.items = [];
    coupon = null;
    try {
      localStorage.removeItem(KEYS.coupon);
    } catch (e) {}
    write(KEYS.cart, cart);
    emit("cart");
  }

  const count = () => cart.items.reduce((sum, it) => sum + it.qty, 0);

  const lines = () =>
    cart.items
      .map((it) => {
        const p = getProduct(it.id);
        return p ? { product: p, qty: it.qty, opts: it.opts || "", line_total: p.price * it.qty } : null;
      })
      .filter(Boolean);

  const subtotal = () => lines().reduce((sum, l) => sum + l.line_total, 0);

  function applyCoupon(code) {
    const key = String(code || "").trim().toUpperCase();
    const rule = D.coupons[key];
    if (!rule) return { ok: false, message: "این کد تخفیف معتبر نیست." };
    if (subtotal() < rule.min)
      return {
        ok: false,
        message: "این کد برای سفارش‌های بالای " + money(rule.min) + " تومان فعال است.",
      };
    coupon = key;
    write(KEYS.coupon, key);
    emit("cart");
    return { ok: true, message: "کد " + key + " اعمال شد — " + rule.label };
  }

  function removeCoupon() {
    coupon = null;
    try {
      localStorage.removeItem(KEYS.coupon);
    } catch (e) {}
    emit("cart");
  }

  function totals() {
    const sub = subtotal();
    const rule = coupon ? D.coupons[coupon] : null;
    let discount = 0;
    let shipping = sub >= D.freeShippingThreshold || sub === 0 ? 0 : D.shippingCost;
    if (rule && rule.type === "percent") {
      discount = Math.round((sub * rule.value) / 100);
    }
    if (rule && rule.type === "shipping") {
      shipping = 0;
    }
    const total = Math.max(0, sub - discount) + shipping;
    return {
      subtotal: sub,
      discount: discount,
      shipping: shipping,
      total: total,
      coupon: coupon,
      freeShippingGap: Math.max(0, D.freeShippingThreshold - sub),
    };
  }

  /* ---------------- wishlist ---------------- */
  const inWish = (id) => wish.indexOf(id) !== -1;

  function toggleWish(id) {
    if (!getProduct(id)) return false;
    if (inWish(id)) {
      wish = wish.filter((w) => w !== id);
    } else {
      wish.push(id);
    }
    write(KEYS.wish, wish);
    emit("wish");
    return inWish(id);
  }

  const wishItems = () => wish.map(getProduct).filter(Boolean);

  /* ---------------- orders ---------------- */
  function saveOrder(payload) {
    const orders = read(KEYS.orders, []);
    const order = Object.assign(
      {
        code: "NF-" + String(Math.floor(100000 + Math.random() * 899999)),
        createdAt: new Date().toISOString(),
        items: lines(),
        totals: totals(),
      },
      payload || {}
    );
    orders.unshift(order);
    write(KEYS.orders, orders.slice(0, 20));
    return order;
  }

  window.NAFAS_STORE = {
    fmtNum: fmtNum,
    money: money,
    getProduct: getProduct,
    bySlug: bySlug,
    categoryOf: categoryOf,
    variantLabel: variantLabel,
    add: add,
    setQty: setQty,
    remove: remove,
    clear: clear,
    count: count,
    lines: lines,
    subtotal: subtotal,
    totals: totals,
    applyCoupon: applyCoupon,
    removeCoupon: removeCoupon,
    inWish: inWish,
    toggleWish: toggleWish,
    wishItems: wishItems,
    saveOrder: saveOrder,
  };
})();
