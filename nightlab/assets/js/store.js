/* ==========================================================================
   NIGHTLAB — local store: cart, wishlist, coupon, orders
   Everything persists in localStorage so the demo shop works offline.
   ========================================================================== */
(function () {
  const STAR = window.STAR;
  const KEY = { cart: "nightlab.cart.v1", wish: "nightlab.wishlist.v1", orders: "nightlab.orders.v1", coupon: "nightlab.coupon.v1" };

  function read(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (e) {
      return fallback;
    }
  }

  function write(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      /* storage might be blocked — the UI still works for the session */
    }
    emit();
  }

  function emit() {
    window.dispatchEvent(new CustomEvent("lab:change"));
  }

  /* ---------------- cart ---------------- */
  let cart = read(KEY.cart, []);

  function saveCart() {
    write(KEY.cart, cart);
  }

  function itemKey(slug, packIndex) {
    return slug + ":" + packIndex;
  }

  function addToCart(slug, packIndex, qty) {
    const p = STAR.bySlug(slug);
    if (!p) return null;
    const idx = typeof packIndex === "number" ? packIndex : 0;
    const tier = STAR.packTiers[idx] || STAR.packTiers[0];
    const price = STAR.priceFor(p, idx);
    const key = itemKey(slug, idx);
    const found = cart.find((i) => i.key === key);
    const n = Math.max(1, qty || 1);
    if (found) {
      found.qty = Math.min(30, found.qty + n);
    } else {
      cart.push({ key, slug, pack: idx, size: tier.size, unit: price.unit, qty: n });
    }
    saveCart();
    return p;
  }

  function setQty(key, qty) {
    const item = cart.find((i) => i.key === key);
    if (!item) return;
    if (qty <= 0) {
      cart = cart.filter((i) => i.key !== key);
    } else {
      item.qty = Math.min(30, qty);
    }
    saveCart();
  }

  function removeItem(key) {
    cart = cart.filter((i) => i.key !== key);
    saveCart();
  }

  function clearCart() {
    cart = [];
    coupon = null;
    try {
      localStorage.removeItem(KEY.coupon);
    } catch (e) {}
    saveCart();
  }

  const cartCount = () => cart.reduce((n, i) => n + i.qty, 0);
  const cartSubtotal = () => cart.reduce((n, i) => n + i.unit * i.size * i.qty, 0);
  const cartItems = () => cart.slice();

  /* ---------------- coupon ---------------- */
  let coupon = read(KEY.coupon, null);

  function applyCoupon(code) {
    const clean = String(code || "").trim().toUpperCase();
    const def = STAR.coupons[clean];
    if (!def) return { ok: false, message: "این کد تخفیف معتبر نیست." };
    if (cartSubtotal() < def.min) {
      return {
        ok: false,
        message: "این کد برای سفارش‌های بالای " + STAR.money(def.min) + " تومان فعال است.",
      };
    }
    coupon = { code: clean, ...def };
    write(KEY.coupon, coupon);
    return { ok: true, message: def.label + " فعال شد." };
  }

  function removeCoupon() {
    coupon = null;
    try {
      localStorage.removeItem(KEY.coupon);
    } catch (e) {}
    emit();
  }

  const getCoupon = () => coupon;

  function totals() {
    const subtotal = cartSubtotal();
    let discount = 0;
    let freeShip = false;
    if (coupon) {
      if (coupon.type === "percent") {
        discount = Math.round((subtotal * coupon.value) / 100);
      } else if (coupon.type === "ship") {
        freeShip = true;
      }
    }
    const afterDiscount = Math.max(0, subtotal - discount);
    const shipping = afterDiscount >= STAR.config.freeShipFrom || freeShip || afterDiscount === 0 ? 0 : STAR.config.shipCost;
    return { subtotal, discount, shipping, total: afterDiscount + shipping, afterDiscount, freeShip };
  }

  /* ---------------- wishlist ---------------- */
  let wish = read(KEY.wish, []);

  function toggleWish(slug) {
    const has = wish.includes(slug);
    wish = has ? wish.filter((s) => s !== slug) : wish.concat(slug);
    write(KEY.wish, wish);
    return !has;
  }

  const inWish = (slug) => wish.includes(slug);
  const wishList = () => wish.slice();

  /* ---------------- orders ---------------- */
  let orders = read(KEY.orders, []);

  function code() {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let out = "";
    for (let i = 0; i < 6; i += 1) out += chars[Math.floor(Math.random() * chars.length)];
    return "NL-" + out;
  }

  function saveOrder(data) {
    const order = {
      code: code(),
      at: Date.now(),
      items: cartItems(),
      totals: totals(),
      customer: data,
    };
    orders = [order].concat(orders).slice(0, 20);
    write(KEY.orders, orders);
    clearCart();
    return order;
  }

  function lastOrder() {
    return orders[0] || null;
  }

  window.Store = {
    addToCart,
    setQty,
    removeItem,
    clearCart,
    cartCount,
    cartSubtotal,
    cartItems,
    applyCoupon,
    removeCoupon,
    getCoupon,
    totals,
    toggleWish,
    inWish,
    wishList,
    saveOrder,
    lastOrder,
    itemKey,
  };
})();
