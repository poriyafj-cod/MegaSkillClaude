/* ==========================================================================
   NAFAS — shared UI: chrome (header/footer/drawers), cards, toasts, reveal
   ========================================================================== */
(function () {
  "use strict";

  const D = window.NAFAS;
  const S = window.NAFAS_STORE;
  const icon = window.svgIcon;

  const qs = (sel, root) => (root || document).querySelector(sel);
  const qsa = (sel, root) => Array.prototype.slice.call((root || document).querySelectorAll(sel));

  const esc = (str) =>
    String(str == null ? "" : str).replace(/[&<>"']/g, (c) => {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });

  const stars = (rating) => {
    const full = Math.round(rating);
    let out = '<span class="stars" aria-hidden="true">';
    for (let i = 0; i < 5; i++) {
      out += '<span style="opacity:' + (i < full ? 1 : 0.25) + '">' + icon("star") + "</span>";
    }
    return out + "</span>";
  };

  const NAV = [
    { href: "index.html", label: "خانه", page: "home" },
    { href: "shop.html", label: "فروشگاه", page: "shop" },
    {
      href: "shop.html",
      label: "کالکشن‌ها",
      page: "collections",
      children: [
        { href: "shop.html?tag=new", label: "تازه رسیده‌ها" },
        { href: "shop.html?tag=bestseller", label: "پرفروش‌ترین‌ها" },
        { href: "shop.html?tag=sale", label: "تخفیف‌دارها" },
        { href: "shop.html?cat=necklace", label: "کالکشن مروارید" },
        { href: "shop.html?cat=hair", label: "حال‌وهوای Y2K" },
      ],
    },
    { href: "about.html", label: "داستان نفس", page: "about" },
    { href: "contact.html", label: "تماس با ما", page: "contact" },
  ];

  /* ------------------------------------------------------------------ */
  /* Header                                                              */
  /* ------------------------------------------------------------------ */
  function headerHTML() {
    const page = document.body.getAttribute("data-page") || "";
    const active = (p) => (p === page || (p === "collections" && page === "collections") ? " is-active" : "");

    const navLinks = NAV.map((item) => {
      if (item.children) {
        return (
          '<div class="has-menu">' +
          '<a class="nav__link' + active(item.page) + '" href="' + item.href + '">' +
          esc(item.label) +
          icon("chevron-down").replace("<svg", '<svg style="width:14px;height:14px"') +
          "</a>" +
          '<div class="nav__dropdown">' +
          item.children
            .map((c) => '<a href="' + c.href + '">' + esc(c.label) + "<span>›</span></a>")
            .join("") +
          "</div></div>"
        );
      }
      return (
        '<a class="nav__link' + active(item.page) + '" href="' + item.href + '">' + esc(item.label) + "</a>"
      );
    }).join("");

    const mobileLinks = NAV.map(
      (item) => '<a href="' + item.href + '">' + esc(item.label) + icon("chevron-left") + "</a>"
    ).join("");

    return (
      '<div class="topbar"><div class="container topbar__inner">' +
      '<div class="topbar__main"><span>ارسال رایگان برای سفارش‌های بالای ' +
      S.money(D.freeShippingThreshold) +
      " تومان</span>" +
      '<span class="topbar__sep"></span>' +
      "<span>کد تخفیف اولین خرید: <b>NAFAS10</b></span></div>" +
      '<div class="topbar__side"><a href="contact.html">پیگیری سفارش</a><a href="contact.html#faq">سؤالات متداول</a></div>' +
      "</div></div>" +
      '<header class="site-header" id="siteHeader"><div class="container header__inner">' +
      '<a class="brand" href="index.html" aria-label="نفس — صفحهٔ اصلی">' +
      '<span class="brand__mark">' + icon("sparkle") + "</span>" +
      '<span class="brand__name">NAFAS</span>' +
      '<span class="brand__fa">نفس</span></a>' +
      '<nav class="nav" aria-label="منوی اصلی">' + navLinks + "</nav>" +
      '<div class="header__actions">' +
      '<button class="icon-btn" type="button" data-open-search aria-label="جست‌وجو">' + icon("search") + "</button>" +
      '<a class="icon-btn" href="wishlist.html" aria-label="علاقه‌مندی‌ها">' + icon("heart") +
      '<span class="icon-btn__count" data-wish-count data-empty="true">۰</span></a>' +
      '<button class="icon-btn" type="button" data-open-cart aria-label="سبد خرید">' + icon("bag") +
      '<span class="icon-btn__count" data-cart-count data-empty="true">۰</span></button>' +
      '<button class="icon-btn menu-btn" type="button" data-open-menu aria-label="منو">' + icon("menu") + "</button>" +
      "</div></div></header>" +
      '<div class="mobile-menu" id="mobileMenu" aria-hidden="true">' +
      '<div class="mobile-menu__head"><a class="brand" href="index.html"><span class="brand__mark">' +
      icon("sparkle") +
      '</span><span class="brand__name">NAFAS</span></a>' +
      '<button class="icon-btn" type="button" data-close-menu aria-label="بستن منو">' + icon("close") + "</button></div>" +
      '<div><nav class="mobile-menu__nav">' + mobileLinks + "</nav>" +
      '<div class="mobile-menu__foot">' +
      '<a class="btn btn--block" href="shop.html">خرید کن ' + icon("arrow-left") + "</a>" +
      '<p class="small muted">پشتیبانی: ' + esc(D.brand.phone) + "</p>" +
      "</div></div></div>"
    );
  }

  /* ------------------------------------------------------------------ */
  /* Footer                                                              */
  /* ------------------------------------------------------------------ */
  function footerHTML() {
    const shopLinks = D.categories
      .map((c) => '<li><a href="shop.html?cat=' + c.id + '">' + esc(c.name) + "</a></li>")
      .join("");

    return (
      '<footer class="site-footer"><div class="container">' +
      '<div class="footer__top">' +
      '<div class="footer__brand">' +
      '<a class="brand" href="index.html"><span class="brand__mark">' + icon("sparkle") +
      '</span><span class="brand__name">NAFAS</span><span class="brand__fa">نفس</span></a>' +
      '<p class="footer__about">' + esc(D.brand.tagline) +
      ". اکسسوری‌های دست‌ساز و پریمیوم با آبکاری چندلایه، برای استایل روزمرهٔ دخترهای نسل جدید.</p>" +
      '<div class="socials">' +
      '<a href="https://instagram.com/" target="_blank" rel="noopener" aria-label="اینستاگرام">' + icon("instagram") + "</a>" +
      '<a href="https://t.me/" target="_blank" rel="noopener" aria-label="تلگرام">' + icon("telegram") + "</a>" +
      '<a href="https://wa.me/" target="_blank" rel="noopener" aria-label="واتس‌اپ">' + icon("whatsapp") + "</a>" +
      "</div></div>" +
      '<div class="footer__col"><h4>فروشگاه</h4><ul>' + shopLinks + "</ul></div>" +
      '<div class="footer__col"><h4>پشتیبانی</h4><ul>' +
      '<li><a href="contact.html#faq">سؤالات متداول</a></li>' +
      '<li><a href="contact.html">پیگیری سفارش</a></li>' +
      '<li><a href="contact.html">شرایط مرجوعی</a></li>' +
      '<li><a href="contact.html">راهنمای سایز</a></li>' +
      '<li><a href="about.html">دربارهٔ ما</a></li>' +
      "</ul></div>" +
      '<div class="footer__col"><h4>ارتباط با نفس</h4><ul>' +
      "<li>" + esc(D.brand.address) + "</li>" +
      '<li><a href="tel:' + D.brand.phoneRaw + '">' + esc(D.brand.phone) + "</a></li>" +
      '<li><a href="mailto:' + esc(D.brand.email) + '">' + esc(D.brand.email) + "</a></li>" +
      "<li>" + esc(D.brand.hours) + "</li>" +
      "</ul></div>" +
      "</div>" +
      '<div class="footer__bigword">NAFAS</div>' +
      '<div class="footer__bottom"><span>© ۱۴۰۵ نفس — تمام حقوق محفوظ است.</span>' +
      '<div class="pay-badges"><span>پرداخت آنلاین</span><span>کارت‌به‌کارت</span><span>پرداخت در محل</span><span>ارسال با پست</span></div>' +
      "</div></div></footer>"
    );
  }

  /* ------------------------------------------------------------------ */
  /* Drawers, search, overlay, toasts                                    */
  /* ------------------------------------------------------------------ */
  function drawersHTML() {
    return (
      '<div class="overlay" id="overlay" hidden></div>' +
      /* cart drawer */
      '<aside class="drawer" id="cartDrawer" aria-label="سبد خرید" aria-hidden="true">' +
      '<div class="drawer__head"><h2 class="drawer__title">سبد خرید <span class="muted small" data-cart-count-label></span></h2>' +
      '<button class="icon-btn" type="button" data-close-drawer aria-label="بستن">' + icon("close") + "</button></div>" +
      '<div class="drawer__body" data-cart-body></div>' +
      '<div class="drawer__foot" data-cart-foot></div></aside>' +
      /* search modal */
      '<div class="search-modal" id="searchModal" aria-hidden="true">' +
      '<div class="search-modal__inner">' +
      '<div class="search-bar" style="display:flex;justify-content:space-between;align-items:center;margin-bottom:18px">' +
      '<span class="eyebrow">جست‌وجو در نفس</span>' +
      '<button class="icon-btn" type="button" data-close-search aria-label="بستن جست‌وجو">' + icon("close") + "</button></div>" +
      '<div class="search-field">' + icon("search") +
      '<input type="search" id="searchInput" placeholder="مثلاً: گردنبند مروارید، گیره، کیف…" autocomplete="off" aria-label="جست‌وجوی محصول">' +
      "</div>" +
      '<div class="cluster" style="margin-top:14px"><span class="small muted">پرجست‌وجوترین‌ها:</span>' +
      ["مروارید", "گیره", "حلقه", "کیف", "نقره‌ای"]
        .map((t) => '<button class="chip-btn" type="button" data-search-term="' + t + '">' + t + "</button>")
        .join("") +
      "</div>" +
      '<div class="search-results" id="searchResults"></div>' +
      "</div></div>" +
      '<div class="toast-stack" id="toastStack" aria-live="polite"></div>'
    );
  }

  function toast(message, type) {
    const stack = qs("#toastStack");
    if (!stack) return;
    const node = document.createElement("div");
    node.className = "toast" + (type === "error" ? " toast--error" : "");
    node.innerHTML = icon(type === "error" ? "close" : "check") + "<span>" + esc(message) + "</span>";
    stack.appendChild(node);
    setTimeout(() => {
      node.classList.add("is-leaving");
      setTimeout(() => node.remove(), 260);
    }, 2600);
  }

  let lastFocused = null;

  function openLayer(el) {
    if (!el) return;
    lastFocused = document.activeElement;
    el.classList.add("is-open");
    el.removeAttribute("hidden");
    el.setAttribute("aria-hidden", "false");
    document.body.classList.add("is-locked");
    const overlay = qs("#overlay");
    if (overlay) {
      overlay.hidden = false;
      overlay.classList.add("is-open");
    }
    const focusable = el.querySelector("input, button, a");
    if (focusable) setTimeout(() => focusable.focus({ preventScroll: true }), 120);
  }

  function closeLayers() {
    qsa(".drawer, .search-modal, .filters.is-open").forEach((el) => {
      el.classList.remove("is-open");
      el.setAttribute("aria-hidden", "true");
    });
    const menu = qs("#mobileMenu");
    if (menu) {
      menu.classList.remove("is-open");
      menu.setAttribute("aria-hidden", "true");
    }
    const overlay = qs("#overlay");
    if (overlay) {
      overlay.classList.remove("is-open");
      overlay.hidden = true;
    }
    document.body.classList.remove("is-locked");
    if (lastFocused && typeof lastFocused.focus === "function") {
      lastFocused.focus({ preventScroll: true });
    }
  }

  /* ------------------------------------------------------------------ */
  /* Cart drawer rendering                                              */
  /* ------------------------------------------------------------------ */
  function renderCartDrawer() {
    const body = qs("[data-cart-body]");
    const foot = qs("[data-cart-foot]");
    if (!body || !foot) return;

    const lines = S.lines();
    const totals = S.totals();

    if (!lines.length) {
      body.innerHTML =
        '<div class="empty-state">' +
        '<span class="empty-state__icon">' + icon("bag") + "</span>" +
        "<p><b>سبد خریدت خالیه!</b><br>وقتشه یه چیز خوشگل انتخاب کنی.</p>" +
        '<a class="btn btn--sm" href="shop.html">دیدن محصولات</a>' +
        "</div>";
      foot.innerHTML = "";
      return;
    }

    body.innerHTML = lines
      .map(
        (l) =>
          '<div class="line-item">' +
          '<a class="line-item__media" href="product.html?p=' + l.product.slug + '">' +
          '<img src="assets/img/products/' + l.product.slug + '.jpg" alt="' + esc(l.product.name) + '"></a>' +
          "<div><div class=\"line-item__name\">" +
          esc(l.product.name) +
          "</div>" +
          (l.opts ? '<div class="line-item__meta">' + esc(l.opts) + "</div>" : "") +
          '<div class="line-item__meta">' + S.money(l.product.price) + " تومان</div>" +
          '<div style="display:flex;align-items:center;gap:10px;margin-top:8px">' +
          '<span class="qty"><button type="button" data-line-dec="' + l.product.id + '" data-opts="' + esc(l.opts) + '" aria-label="کاهش">−</button>' +
          "<span>" + S.fmtNum(l.qty) + "</span>" +
          '<button type="button" data-line-inc="' + l.product.id + '" data-opts="' + esc(l.opts) + '" aria-label="افزایش">+</button></span>' +
          '<button type="button" class="line-item__remove" data-line-remove="' + l.product.id + '" data-opts="' + esc(l.opts) + '">حذف</button>' +
          "</div></div>" +
          '<div class="price">' + S.money(l.line_total) + "</div>" +
          "</div>"
      )
      .join("");

    foot.innerHTML =
      '<div class="summary__row"><span>جمع کالاها</span><b>' + S.money(totals.subtotal) + " تومان</b></div>" +
      '<div class="summary__row"><span>ارسال</span><b>' +
      (totals.shipping === 0 ? "رایگان" : S.money(totals.shipping) + " تومان") +
      "</b></div>" +
      (totals.discount
        ? '<div class="summary__row"><span>تخفیف</span><b>−' + S.money(totals.discount) + " تومان</b></div>"
        : "") +
      '<div class="summary__row summary__row--total"><span>مبلغ قابل پرداخت</span><b>' +
      S.money(totals.total) +
      " تومان</b></div>" +
      '<a class="btn btn--block" href="cart.html">تکمیل خرید ' + icon("arrow-left") + "</a>" +
      '<button class="btn btn--ghost btn--block btn--sm" type="button" data-close-drawer>ادامهٔ خرید</button>';
  }

  function updateCounts() {
    const cartCount = S.count();
    const wishCount = S.wishItems().length;

    qsa("[data-cart-count]").forEach((el) => {
      el.textContent = S.fmtNum(cartCount);
      el.dataset.empty = cartCount === 0 ? "true" : "false";
    });
    qsa("[data-wish-count]").forEach((el) => {
      el.textContent = S.fmtNum(wishCount);
      el.dataset.empty = wishCount === 0 ? "true" : "false";
    });
    const label = qs("[data-cart-count-label]");
    if (label) label.textContent = cartCount ? "(" + S.fmtNum(cartCount) + " کالا)" : "";

    qsa("[data-like]").forEach((btn) => {
      btn.classList.toggle("is-active", S.inWish(btn.getAttribute("data-like")));
      btn.setAttribute("aria-pressed", S.inWish(btn.getAttribute("data-like")) ? "true" : "false");
    });

    renderCartDrawer();
  }

  /* ------------------------------------------------------------------ */
  /* Product card                                                       */
  /* ------------------------------------------------------------------ */
  function badgeFor(p) {
    if (p.tags.indexOf("new") !== -1) return '<span class="badge badge--new">جدید</span>';
    if (p.oldPrice) {
      const off = Math.round(((p.oldPrice - p.price) / p.oldPrice) * 100);
      return '<span class="badge badge--sale">' + S.fmtNum(off) + "٪ تخفیف</span>";
    }
    if (p.tags.indexOf("bestseller") !== -1) return '<span class="badge">پرفروش</span>';
    return "";
  }

  function productCard(p, opts) {
    const options = opts || {};
    const cat = S.categoryOf(p.cat);
    const liked = S.inWish(p.id);
    return (
      '<article class="product-card" data-reveal' + (options.delay ? ' style="--reveal-delay:' + options.delay + 'ms"' : "") + ">" +
      '<div class="pc-media">' +
      '<a class="pc-link" href="product.html?p=' + p.slug + '" aria-label="' + esc(p.name) + '"></a>' +
      '<picture class="pc-picture">' +
      '<source srcset="assets/img/products/' + p.slug + '.avif" type="image/avif">' +
      '<source srcset="assets/img/products/' + p.slug + '.webp" type="image/webp">' +
      '<img class="pc-img pc-img--main" src="assets/img/products/' + p.slug + '.jpg" alt="' + esc(p.name) +
      '" width="1000" height="1250" loading="lazy" decoding="async">' +
      '</picture>' +
      '<picture class="pc-picture pc-picture--alt" style="position:absolute;inset:0;margin:0">' +
      '<source srcset="assets/img/products/' + p.slug + '-detail.avif" type="image/avif">' +
      '<source srcset="assets/img/products/' + p.slug + '-detail.webp" type="image/webp">' +
      '<img class="pc-img pc-img--alt" src="assets/img/products/' + p.slug + '-detail.jpg" alt="" aria-hidden="true" loading="lazy" decoding="async">' +
      '</picture>' +
      '<span class="pc-badges">' + badgeFor(p) + "</span>" +
      '<button class="pc-like' + (liked ? " is-active" : "") + '" type="button" data-like="' + p.id +
      '" aria-label="افزودن به علاقه‌مندی‌ها" aria-pressed="' + (liked ? "true" : "false") + '">' + icon("heart") + "</button>" +
      '<button class="pc-quick" type="button" data-quick-add="' + p.id + '">' + icon("bag") + "افزودن سریع</button>" +
      "</div>" +
      '<div class="pc-body">' +
      '<span class="pc-cat">' + esc(cat ? cat.name : "") + "</span>" +
      '<h3 class="pc-name"><a href="product.html?p=' + p.slug + '">' + esc(p.name) + "</a></h3>" +
      '<div class="rating">' + stars(p.rating) + "<span>" + S.fmtNum(p.reviews) + " نظر</span></div>" +
      '<div class="pc-foot"><div class="price-row">' +
      '<span class="price">' + S.money(p.price) + " <small>تومان</small></span>" +
      (p.oldPrice ? '<del class="price--old">' + S.money(p.oldPrice) + "</del>" : "") +
      "</div></div></div></article>"
    );
  }

  /* ------------------------------------------------------------------ */
  /* Search                                                            */
  /* ------------------------------------------------------------------ */
  function searchProducts(term) {
    const q = String(term || "").trim().toLowerCase();
    if (!q) return [];
    const norm = (s) => String(s || "").toLowerCase();
    return D.products
      .map((p) => {
        const hay = norm(p.name) + " " + norm(p.nameEn) + " " + norm(p.short) + " " + norm(p.slug);
        const catName = S.categoryOf(p.cat) ? S.categoryOf(p.cat).name : "";
        const hayFull = hay + " " + norm(catName);
        let score = 0;
        if (norm(p.name).indexOf(q) !== -1) score += 10;
        if (hayFull.indexOf(q) !== -1) score += 5;
        q.split(/\s+/).forEach((word) => {
          if (word && hayFull.indexOf(word) !== -1) score += 1;
        });
        return { p: p, score: score };
      })
      .filter((r) => r.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 8)
      .map((r) => r.p);
  }

  function renderSearch(term) {
    const box = qs("#searchResults");
    if (!box) return;
    const results = searchProducts(term);
    if (!String(term || "").trim()) {
      box.innerHTML =
        '<p class="small muted" style="padding:10px 4px">چیزی بنویس یا یکی از پیشنهادهای بالا را انتخاب کن.</p>';
      return;
    }
    if (!results.length) {
      box.innerHTML =
        '<p class="small muted" style="padding:10px 4px">چیزی با «' + esc(term) + '» پیدا نشد. با کلمهٔ دیگری امتحان کن.</p>';
      return;
    }
    box.innerHTML = results
      .map(
        (p) =>
          '<a class="search-result" href="product.html?p=' + p.slug + '">' +
          '<span class="search-result__media"><picture>' +
        '<source srcset="assets/img/products/' + p.slug + '.avif" type="image/avif">' +
        '<source srcset="assets/img/products/' + p.slug + '.webp" type="image/webp">' +
        '<img src="assets/img/products/' + p.slug + '.jpg" alt="" loading="lazy"></picture></span>' +
          "<span><b style=\"font-size:.92rem\">" + esc(p.name) + "</b>" +
          '<span class="small muted" style="display:block">' + esc(S.categoryOf(p.cat).name) + "</span></span>" +
          '<span class="price" style="font-size:.85rem">' + S.money(p.price) + "</span></a>"
      )
      .join("");
  }

  /* ------------------------------------------------------------------ */
  /* Reveal on scroll                                                   */
  /* ------------------------------------------------------------------ */
  function initReveal(root) {
    const nodes = qsa("[data-reveal]", root || document);
    if (!("IntersectionObserver" in window)) {
      nodes.forEach((n) => n.classList.add("is-visible"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    );
    nodes.forEach((n) => {
      if (!n.classList.contains("is-visible")) io.observe(n);
    });
  }

  /* ------------------------------------------------------------------ */
  /* Motion gate                                                        */
  /* ------------------------------------------------------------------ */
  const MOTION_OFF =
    typeof window.matchMedia === "function" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ------------------------------------------------------------------ */
  /* Parallax (scroll) + tilt (mouse) — the 360° hero feel              */
  /* ------------------------------------------------------------------ */
  function initParallax() {
    if (MOTION_OFF) return;
    const nodes = qsa("[data-parallax]");
    if (!nodes.length) return;
    const tick = () => {
      const winH = window.innerHeight;
      nodes.forEach((n) => {
        const rect = n.getBoundingClientRect();
        const p = Math.max(0, Math.min(1, (winH - rect.top) / (winH + rect.height)));
        n.style.setProperty("--p", p.toFixed(3));
      });
    };
    tick();
    window.addEventListener("scroll", tick, { passive: true });
  }

  function initTilt() {
    if (MOTION_OFF) return;
    const root = qs(".hero__visual");
    if (!root) return;
    const cards = qsa(".float-card, .hero__photo", root);
    const move = (e) => {
      const rect = root.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      cards.forEach((c) => {
        c.classList.add("tilt");
        c.style.setProperty("--tilt-x", (y * -9).toFixed(2) + "deg");
        c.style.setProperty("--tilt-y", (x * 9).toFixed(2) + "deg");
        c.style.setProperty("--tilt-lift", ((Math.abs(x) + Math.abs(y)) * 10).toFixed(2) + "px");
      });
    };
    const leave = () => {
      cards.forEach((c) => {
        c.classList.remove("tilt");
        c.style.removeProperty("--tilt-x");
        c.style.removeProperty("--tilt-y");
        c.style.removeProperty("--tilt-lift");
      });
    };
    root.addEventListener("mousemove", move, { passive: true });
    root.addEventListener("mouseleave", leave);
    root.addEventListener("touchmove", (e) => {
      const touch = e.touches[0];
      if (!touch) return;
      const rect = root.getBoundingClientRect();
      const x = (touch.clientX - rect.left) / rect.width - 0.5;
      const y = (touch.clientY - rect.top) / rect.height - 0.5;
      cards.forEach((c) => {
        c.classList.add("tilt");
        c.style.setProperty("--tilt-x", (y * -9).toFixed(2) + "deg");
        c.style.setProperty("--tilt-y", (x * 9).toFixed(2) + "deg");
        c.style.setProperty("--tilt-lift", ((Math.abs(x) + Math.abs(y)) * 10).toFixed(2) + "px");
      });
    }, { passive: true });
    root.addEventListener("touchend", leave);
  }

  /* ------------------------------------------------------------------ */
  /* Mount                                                              */
  /* ------------------------------------------------------------------ */
  function mount() {
    const headerSlot = qs("[data-chrome='header']");
    if (headerSlot) headerSlot.outerHTML = headerHTML();

    const footerSlot = qs("[data-chrome='footer']");
    if (footerSlot) footerSlot.outerHTML = footerHTML();

    document.body.insertAdjacentHTML("beforeend", drawersHTML());

    /* inline icon placeholders used in static markup */
    qsa("[data-icon]").forEach((el) => {
      const name = el.getAttribute("data-icon");
      el.outerHTML = icon(name);
    });

    const yearTarget = qs("[data-year]");
    if (yearTarget) yearTarget.textContent = "۱۴۰۵";

    updateCounts();
    initReveal();
    initParallax();
    initTilt();
    renderSearch("");

    /* header state */
    const header = qs("#siteHeader");
    const onScroll = () => {
      if (header) header.classList.toggle("is-stuck", window.scrollY > 8);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    /* delegated clicks */
    document.addEventListener("click", (e) => {
      const t = e.target.closest(
        "[data-open-cart],[data-open-search],[data-close-drawer],[data-close-search],[data-open-menu],[data-close-menu]," +
          "[data-quick-add],[data-like],[data-line-inc],[data-line-dec],[data-line-remove],[data-search-term],[data-toast]"
      );
      if (!t) return;

      if (t.hasAttribute("data-open-cart")) {
        openLayer(qs("#cartDrawer"));
        return;
      }
      if (t.hasAttribute("data-open-search")) {
        openLayer(qs("#searchModal"));
        const input = qs("#searchInput");
        if (input) setTimeout(() => input.focus(), 140);
        return;
      }
      if (t.hasAttribute("data-close-drawer") || t.hasAttribute("data-close-search")) {
        closeLayers();
        return;
      }
      if (t.hasAttribute("data-open-menu")) {
        const menu = qs("#mobileMenu");
        menu.classList.add("is-open");
        menu.setAttribute("aria-hidden", "false");
        document.body.classList.add("is-locked");
        return;
      }
      if (t.hasAttribute("data-close-menu")) {
        const menu = qs("#mobileMenu");
        menu.classList.remove("is-open");
        menu.setAttribute("aria-hidden", "true");
        document.body.classList.remove("is-locked");
        return;
      }
      if (t.hasAttribute("data-quick-add")) {
        e.preventDefault();
        const id = t.getAttribute("data-quick-add");
        const p = S.getProduct(id);
        const first = p && p.colors && p.colors.length ? p.colors[0].name : "";
        S.add(id, 1, first);
        toast("«" + (p ? p.name : "محصول") + "» به سبد اضافه شد");
        openLayer(qs("#cartDrawer"));
        return;
      }
      if (t.hasAttribute("data-like")) {
        e.preventDefault();
        const active = S.toggleWish(t.getAttribute("data-like"));
        toast(active ? "به علاقه‌مندی‌ها اضافه شد ♥" : "از علاقه‌مندی‌ها حذف شد");
        return;
      }
      if (t.hasAttribute("data-line-inc")) {
        const id = t.getAttribute("data-line-inc");
        const opts = t.getAttribute("data-opts") || "";
        const line = S.lines().find((l) => l.product.id === id && l.opts === opts);
        S.setQty(id, opts, (line ? line.qty : 1) + 1);
        return;
      }
      if (t.hasAttribute("data-line-dec")) {
        const id = t.getAttribute("data-line-dec");
        const opts = t.getAttribute("data-opts") || "";
        const line = S.lines().find((l) => l.product.id === id && l.opts === opts);
        S.setQty(id, opts, (line ? line.qty : 1) - 1);
        return;
      }
      if (t.hasAttribute("data-line-remove")) {
        S.remove(t.getAttribute("data-line-remove"), t.getAttribute("data-opts") || "");
        return;
      }
      if (t.hasAttribute("data-search-term")) {
        const input = qs("#searchInput");
        if (input) {
          input.value = t.getAttribute("data-search-term");
          renderSearch(input.value);
        }
        return;
      }
    });

    const overlay = qs("#overlay");
    if (overlay) overlay.addEventListener("click", closeLayers);

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeLayers();
    });

    const searchInput = qs("#searchInput");
    if (searchInput) {
      searchInput.addEventListener("input", (e) => renderSearch(e.target.value));
      searchInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          const results = searchProducts(searchInput.value);
          if (results.length) window.location.href = "product.html?p=" + results[0].slug;
          else window.location.href = "shop.html?q=" + encodeURIComponent(searchInput.value);
        }
      });
    }

    document.addEventListener("nafas:change", updateCounts);
    document.addEventListener("nafas:cart-added", () => openLayer(qs("#cartDrawer")));
  }

  window.NAFAS_UI = {
    mount: mount,
    toast: toast,
    productCard: productCard,
    stars: stars,
    initReveal: initReveal,
    updateCounts: updateCounts,
    openLayer: openLayer,
    closeLayers: closeLayers,
    esc: esc,
    qs: qs,
    qsa: qsa,
    renderSearch: renderSearch,
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", mount);
  } else {
    mount();
  }
})();
