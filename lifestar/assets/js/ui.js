/* ==========================================================================
   LIFE STAR — shared UI: chrome, product cards, drawer, search, toasts
   ========================================================================== */
(function () {
  const STAR = window.STAR;
  const Store = window.Store;
  const icon = window.icon;
  const money = STAR.money;

  const NAV = [
    { href: "index.html", label: "خانه", key: "home" },
    { href: "shop.html", label: "فروشگاه", key: "shop" },
    { href: "about.html", label: "داستان برند", key: "about" },
    { href: "contact.html", label: "تماس", key: "contact" },
  ];

  const page = document.body.dataset.page || "";

  /* ---------------- templates ---------------- */
  function headerHTML() {
    const links = NAV.map(
      (n) =>
        '<a class="nav__link" href="' +
        n.href +
        '"' +
        (page === n.key ? ' aria-current="page"' : "") +
        ">" +
        n.label +
        "</a>"
    ).join("");

    return (
      '<div class="header">' +
      '<div class="container header__bar">' +
      '<a class="brand" href="index.html" aria-label="لایف استار — صفحهٔ اصلی">' +
      '<span class="brand__mark">' + icon("star") + "</span>" +
      '<span class="brand__text"><span class="brand__en">LIFE STAR</span><span class="brand__fa">سوختِ حرکت</span></span>' +
      "</a>" +
      '<nav class="nav" aria-label="منوی اصلی">' + links + "</nav>" +
      '<div class="header__actions">' +
      '<button class="icon-btn" type="button" data-open-search aria-label="جست‌وجو">' + icon("search") + "</button>" +
      '<a class="icon-btn" href="wishlist.html" aria-label="علاقه‌مندی‌ها">' + icon("heart") +
      '<span class="icon-btn__count" data-wish-count hidden>0</span></a>' +
      '<button class="icon-btn" type="button" data-open-cart aria-label="سبد خرید">' + icon("cart") +
      '<span class="icon-btn__count" data-cart-count hidden>0</span></button>' +
      '<button class="icon-btn header__burger" type="button" data-open-menu aria-label="منو">' + icon("menu") + "</button>" +
      "</div></div></div>" +
      '<div class="mobile-menu" id="mobileMenu" aria-hidden="true">' +
      '<div class="mobile-menu__head"><span class="brand__en">LIFE STAR</span>' +
      '<button class="icon-btn" type="button" data-close-menu aria-label="بستن">' + icon("close") + "</button></div>" +
      '<nav class="mobile-menu__nav" aria-label="منوی موبایل">' +
      NAV.map((n, i) => '<a href="' + n.href + '">' + n.label + "<span>0" + (i + 1) + "</span></a>").join("") +
      '<a href="cart.html">سبد خرید<span>' + icon("arrowLeft") + "</span></a>" +
      "</nav>" +
      '<a class="btn btn--volt btn--block" href="shop.html">همین حالا سفارش بده ' + icon("arrowLeft") + "</a>" +
      "</div>"
    );
  }

  function footerHTML() {
    return (
      '<footer class="footer"><div class="container">' +
      '<div class="footer__grid">' +
      '<div class="footer__brand"><a class="brand" href="index.html"><span class="brand__mark">' + icon("star") +
      '</span><span class="brand__text"><span class="brand__en">LIFE STAR</span><span class="brand__fa">سوختِ حرکت</span></span></a>' +
      "<p>نوشیدنی انرژی‌زا برای تمرین، دانشگاه و شیفت‌های شب. بدون قند اضافه در خط زیرو، با کافئین دقیق و طعم واقعی میوه.</p>" +
      '<div class="socials" style="margin-top:16px">' +
      '<a href="#" aria-label="اینستاگرام">' + icon("instagram") + "</a>" +
      '<a href="#" aria-label="تلگرام">' + icon("telegram") + "</a>" +
      '<a href="#" aria-label="واتس‌اپ">' + icon("whatsapp") + "</a>" +
      "</div></div>" +
      '<div class="footer__col"><h4>فروشگاه</h4>' +
      '<a href="shop.html">همهٔ نوشیدنی‌ها</a><a href="shop.html?cat=zero">زیرو شکر</a>' +
      '<a href="shop.html?cat=coffee">کافئین غلیظ</a><a href="shop.html?cat=recovery">بازیابی</a>' +
      '<a href="shop.html?tag=sale">تخفیف‌دارها</a></div>' +
      '<div class="footer__col"><h4>پشتیبانی</h4>' +
      '<a href="contact.html">تماس با ما</a><a href="contact.html#faq">سؤالات متداول</a>' +
      '<a href="contact.html">پیگیری سفارش</a><a href="about.html">دربارهٔ ما</a></div>' +
      '<div class="footer__col"><h4>ارتباط</h4>' +
      '<a href="tel:' + STAR.config.phoneRaw + '">' + STAR.config.phone + "</a>" +
      '<a href="mailto:' + STAR.config.email + '">' + STAR.config.email + "</a>" +
      "<span>" + STAR.config.instagram + "</span><span>تهران، ولیعصر</span></div>" +
      "</div>" +
      '<div class="footer__bottom"><span>© ۱۴۰۵ لایف استار — همهٔ حقوق محفوظ است.</span>' +
      "<span>ساخته‌شده برای حرکت · ۱۸+ · مصرف متعادل کافئین</span></div>" +
      "</div></footer>"
    );
  }

  function cartDrawerHTML() {
    return (
      '<div class="drawer" id="cartDrawer" aria-hidden="true">' +
      '<div class="drawer__scrim" data-close-cart></div>' +
      '<aside class="drawer__panel" role="dialog" aria-modal="true" aria-label="سبد خرید">' +
      '<div class="drawer__head"><h2 class="h-3">سبد خرید</h2>' +
      '<button class="icon-btn" type="button" data-close-cart aria-label="بستن">' + icon("close") + "</button></div>" +
      '<div class="drawer__body" data-drawer-body></div>' +
      '<div class="drawer__foot" data-drawer-foot></div>' +
      "</aside></div>"
    );
  }

  function searchHTML() {
    return (
      '<div class="search-overlay" id="searchOverlay" aria-hidden="true">' +
      '<div class="search-overlay__box">' +
      '<div class="cluster" style="justify-content:space-between;margin-bottom:10px">' +
      '<span class="eyebrow">جست‌وجو</span>' +
      '<button class="icon-btn" type="button" data-close-search aria-label="بستن">' + icon("close") + "</button></div>" +
      '<input class="search-overlay__input" type="search" placeholder="طعم، دسته یا اسم نوشیدنی…" data-search-input aria-label="جست‌وجو در نوشیدنی‌ها" />' +
      '<div class="search-overlay__hint"><span>پرجست‌وجوترین‌ها:</span>' +
      '<button class="chip-btn" type="button" data-term="گیلاس">گیلاس</button>' +
      '<button class="chip-btn" type="button" data-term="زیرو">زیرو</button>' +
      '<button class="chip-btn" type="button" data-term="کافی">کافی</button>' +
      '<button class="chip-btn" type="button" data-term="نعنا">نعنا</button></div>' +
      '<div class="search-results" data-search-results></div>' +
      "</div></div>"
    );
  }

  /* ---------------- product card ---------------- */
  function badgeHTML(p) {
    const out = [];
    if (p.tags.includes("sale") && p.oldPrice) out.push('<span class="pill pill--red">٪' + Math.round((1 - p.price / p.oldPrice) * 100) + " تخفیف</span>");
    else if (p.tags.includes("new")) out.push('<span class="pill pill--volt">جدید</span>');
    if (p.tags.includes("bestseller")) out.push('<span class="pill">پرفروش</span>');
    if (p.stock <= 24) out.push('<span class="pill pill--ice">موجودی محدود</span>');
    return out.join("");
  }

  function productCard(p, opts) {
    const o = opts || {};
    const wish = Store.inWish(p.slug);
    return (
      '<article class="pc" data-product="' + p.slug + '" style="--pc-glow:' + hexA(p.colors.c1, 0.42) + '">' +
      '<div class="pc__media">' +
      '<div class="pc__badges">' + badgeHTML(p) + "</div>" +
      '<button class="pc__wish' + (wish ? " is-active" : "") + '" type="button" data-wish="' + p.slug + '" aria-label="افزودن به علاقه‌مندی‌ها" aria-pressed="' + wish + '">' + icon("heart") + "</button>" +
      STAR.canSvg(p) +
      '<div class="pc__quick">' +
      '<button class="btn btn--volt btn--sm" type="button" data-add="' + p.slug + '">' + icon("plus") + " افزودن سریع</button>" +
      '<a class="btn btn--dark btn--sm" href="product.html?p=' + p.slug + '" aria-label="جزئیات">' + icon("arrowLeft") + "</a>" +
      "</div></div>" +
      '<div class="pc__body">' +
      '<span class="pc__cat">' + STAR.catName(p.cat) + " · " + p.volume + "ml</span>" +
      '<h3 class="pc__name"><a href="product.html?p=' + p.slug + '">' + p.name + " — " + p.nameEn + "</a></h3>" +
      '<div class="pc__specs">' +
      "<span>" + icon("bolt") + p.caffeine + "mg کافئین</span>" +
      "<span>" + icon("leaf") + (p.sugar === 0 ? "بدون شکر" : p.sugar + "g شکر") + "</span>" +
      "</div>" +
      '<div class="pc__foot">' +
      '<span class="price"><span class="price__now">' + money(p.price) + " <small>تومان</small></span>" +
      (p.oldPrice ? '<del class="price__old">' + money(p.oldPrice) + "</del>" : "") +
      "</span>" +
      '<span class="rating">' + icon("star") + p.rating.toFixed(1) + "</span>" +
      "</div></div></article>"
    );
  }

  function hexA(hex, a) {
    const h = hex.replace("#", "");
    const n = parseInt(h.length === 3 ? h.split("").map((c) => c + c).join("") : h, 16);
    return "rgba(" + ((n >> 16) & 255) + "," + ((n >> 8) & 255) + "," + (n & 255) + "," + a + ")";
  }

  /* ---------------- cart drawer rendering ---------------- */
  function renderDrawer() {
    const body = document.querySelector("[data-drawer-body]");
    const foot = document.querySelector("[data-drawer-foot]");
    if (!body || !foot) return;
    const items = Store.cartItems();

    if (!items.length) {
      body.innerHTML =
        '<div class="empty-state" style="border:0;padding:48px 10px">' + icon("cart") +
        "<p style=\"margin-top:10px\">سبدت خالیه. یه قوطی بردار و حرکت رو شروع کن.</p></div>";
      foot.innerHTML = '<a class="btn btn--volt btn--block" href="shop.html">دیدن نوشیدنی‌ها</a>';
      return;
    }

    body.innerHTML = items
      .map((i) => {
        const p = STAR.bySlug(i.slug);
        if (!p) return "";
        return (
          '<div class="line-item">' +
          '<div class="line-item__art">' + STAR.canSvg(p, { label: false }) + "</div>" +
          '<div><div class="line-item__name">' + p.name + ' — ' + p.nameEn + "</div>" +
          '<div class="line-item__meta">' + i.size + " عددی · " + money(i.unit) + " تومان/عدد</div>" +
          '<div class="qty" style="margin-top:6px"><button type="button" data-qty="' + i.key + '" data-delta="-1" aria-label="کمتر">−</button>' +
          "<span>" + i.qty + '</span><button type="button" data-qty="' + i.key + '" data-delta="1" aria-label="بیشتر">+</button></div></div>' +
          '<div style="text-align:end"><div class="line-item__price">' + money(i.unit * i.size * i.qty) + "</div>" +
          '<button class="icon-btn" style="width:30px;height:30px;margin-top:8px" type="button" data-remove="' + i.key + '" aria-label="حذف">' + icon("trash") + "</button></div>" +
          "</div>"
        );
      })
      .join("");

    const t = Store.totals();
    foot.innerHTML =
      '<div class="summary__row"><span>جمع کالاها</span><strong>' + money(t.subtotal) + " تومان</strong></div>" +
      '<div class="summary__row"><span>ارسال</span><strong>' + (t.shipping === 0 ? "رایگان" : money(t.shipping) + " تومان") + "</strong></div>" +
      '<div class="summary__total"><span>مبلغ نهایی</span><span>' + money(t.total) + " تومان</span></div>" +
      '<a class="btn btn--volt btn--block" style="margin-top:14px" href="cart.html">تکمیل سفارش ' + icon("arrowLeft") + "</a>" +
      '<button class="btn btn--ghost btn--block btn--sm" style="margin-top:8px" type="button" data-close-cart>ادامهٔ خرید</button>';
  }

  function syncCounts() {
    const c = Store.cartCount();
    document.querySelectorAll("[data-cart-count]").forEach((el) => {
      el.textContent = c;
      el.hidden = c === 0;
    });
    const w = Store.wishList().length;
    document.querySelectorAll("[data-wish-count]").forEach((el) => {
      el.textContent = w;
      el.hidden = w === 0;
    });
    document.querySelectorAll("[data-wish]").forEach((btn) => {
      const active = Store.inWish(btn.dataset.wish);
      btn.classList.toggle("is-active", active);
      btn.setAttribute("aria-pressed", String(active));
    });
  }

  /* ---------------- toasts ---------------- */
  function toast(message, type) {
    let stack = document.querySelector(".toast-stack");
    if (!stack) {
      stack = document.createElement("div");
      stack.className = "toast-stack";
      document.body.appendChild(stack);
    }
    const el = document.createElement("div");
    el.className = "toast" + (type === "error" ? " toast--error" : "");
    el.innerHTML = icon(type === "error" ? "info" : "checkCircle") + "<span>" + message + "</span>";
    stack.appendChild(el);
    setTimeout(() => {
      el.classList.add("is-out");
      setTimeout(() => el.remove(), 320);
    }, 2600);
  }

  /* ---------------- overlays ---------------- */
  function openDrawer() {
    const d = document.getElementById("cartDrawer");
    if (!d) return;
    d.classList.add("is-open");
    d.setAttribute("aria-hidden", "false");
    document.body.classList.add("is-locked");
    renderDrawer();
  }

  function closeDrawer() {
    const d = document.getElementById("cartDrawer");
    if (!d) return;
    d.classList.remove("is-open");
    d.setAttribute("aria-hidden", "true");
    document.body.classList.remove("is-locked");
  }

  function openSearch() {
    const s = document.getElementById("searchOverlay");
    if (!s) return;
    s.classList.add("is-open");
    s.setAttribute("aria-hidden", "false");
    document.body.classList.add("is-locked");
    renderSearch("");
    const input = s.querySelector("[data-search-input]");
    setTimeout(() => input && input.focus(), 60);
  }

  function closeSearch() {
    const s = document.getElementById("searchOverlay");
    if (!s) return;
    s.classList.remove("is-open");
    s.setAttribute("aria-hidden", "true");
    document.body.classList.remove("is-locked");
  }

  function renderSearch(term) {
    const box = document.querySelector("[data-search-results]");
    if (!box) return;
    const q = String(term || "").trim().toLowerCase();
    const list = q
      ? STAR.products.filter(
          (p) =>
            (p.name + " " + p.nameEn + " " + STAR.catName(p.cat) + " " + p.notes.join(" ")).toLowerCase().includes(q)
        )
      : STAR.products.filter((p) => p.tags.includes("bestseller")).slice(0, 4);

    if (!list.length) {
      box.innerHTML = '<p class="muted small" style="padding:12px 4px">چیزی پیدا نشد. «زیرو»، «کافی» یا «نعنا» رو امتحان کن.</p>';
      return;
    }
    box.innerHTML = list
      .slice(0, 6)
      .map(
        (p) =>
          '<a class="search-result" href="product.html?p=' + p.slug + '">' +
          STAR.canSvg(p, { label: false }) +
          '<span><span class="search-result__name">' + p.name + "</span>" +
          '<span class="search-result__meta">' + p.nameEn + " · " + money(p.price) + " تومان</span></span>" +
          "</a>"
      )
      .join("");
  }

  /* ---------------- chrome mount ---------------- */
  function mountChrome() {
    const h = document.querySelector('[data-chrome="header"]');
    const f = document.querySelector('[data-chrome="footer"]');
    if (h) h.innerHTML = headerHTML();
    if (f) f.innerHTML = footerHTML();
    document.body.insertAdjacentHTML("beforeend", cartDrawerHTML() + searchHTML());

    document.addEventListener("click", (e) => {
      const t = e.target.closest("[data-open-cart],[data-close-cart],[data-open-search],[data-close-search],[data-open-menu],[data-close-menu],[data-wish],[data-add],[data-qty],[data-remove],[data-term]");
      if (!t) return;

      if (t.matches("[data-open-cart]")) {
        e.preventDefault();
        openDrawer();
      } else if (t.matches("[data-close-cart]")) {
        closeDrawer();
      } else if (t.matches("[data-open-search]")) {
        e.preventDefault();
        openSearch();
      } else if (t.matches("[data-close-search]")) {
        closeSearch();
      } else if (t.matches("[data-open-menu]")) {
        const m = document.getElementById("mobileMenu");
        m.classList.add("is-open");
        m.setAttribute("aria-hidden", "false");
        document.body.classList.add("is-locked");
      } else if (t.matches("[data-close-menu]")) {
        const m = document.getElementById("mobileMenu");
        m.classList.remove("is-open");
        m.setAttribute("aria-hidden", "true");
        document.body.classList.remove("is-locked");
      } else if (t.matches("[data-wish]")) {
        const on = Store.toggleWish(t.dataset.wish);
        toast(on ? "به علاقه‌مندی‌ها اضافه شد" : "از علاقه‌مندی‌ها حذف شد");
        document.querySelectorAll('[data-product="' + t.dataset.wish + '"]').forEach((card) => {
          card.dispatchEvent(new CustomEvent("star:wish", { bubbles: false }));
        });
      } else if (t.matches("[data-add]")) {
        const p = Store.addToCart(t.dataset.add, 0, 1);
        if (p) {
          toast(p.name + " به سبد اضافه شد");
          openDrawer();
        }
      } else if (t.matches("[data-qty]")) {
        const key = t.dataset.qty;
        const delta = Number(t.dataset.delta);
        const item = Store.cartItems().find((i) => i.key === key);
        if (item) Store.setQty(key, item.qty + delta);
      } else if (t.matches("[data-remove]")) {
        Store.removeItem(t.dataset.remove);
        toast("از سبد حذف شد");
      } else if (t.matches("[data-term]")) {
        const input = document.querySelector("[data-search-input]");
        if (input) {
          input.value = t.dataset.term;
          renderSearch(t.dataset.term);
        }
      }
    });

    document.addEventListener("input", (e) => {
      if (e.target.matches("[data-search-input]")) renderSearch(e.target.value);
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        closeDrawer();
        closeSearch();
        const m = document.getElementById("mobileMenu");
        if (m) {
          m.classList.remove("is-open");
          document.body.classList.remove("is-locked");
        }
      }
    });

    window.addEventListener("star:change", () => {
      syncCounts();
      renderDrawer();
    });

    hydrateIcons();
    syncCounts();
    renderDrawer();
  }

  /* ---------------- helpers ---------------- */
  function hydrateIcons(root) {
    (root || document).querySelectorAll("[data-icon]").forEach((el) => {
      if (!el.dataset.done) {
        el.innerHTML = icon(el.dataset.icon);
        el.dataset.done = "1";
      }
    });
  }

  function observeReveals(root) {
    hydrateIcons(root);
    const nodes = (root || document).querySelectorAll("[data-reveal]");
    if (!("IntersectionObserver" in window)) {
      nodes.forEach((n) => n.classList.add("is-visible"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) {
            en.target.classList.add("is-visible");
            io.unobserve(en.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    );
    nodes.forEach((n) => io.observe(n));
  }

  function bindAccordions(root) {
    (root || document).querySelectorAll(".acc").forEach((acc) => {
      const btn = acc.querySelector(".acc__btn");
      if (!btn) return;
      btn.addEventListener("click", () => {
        const open = acc.classList.toggle("is-open");
        btn.setAttribute("aria-expanded", String(open));
      });
    });
  }

  function countdown(el, target) {
    if (!el) return;
    const pad = (n) => String(n).padStart(2, "0");
    const tick = () => {
      const diff = Math.max(0, target - Date.now());
      const d = Math.floor(diff / 86400000);
      const h = Math.floor((diff % 86400000) / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      el.querySelectorAll("[data-cd]").forEach((node) => {
        const k = node.dataset.cd;
        const val = k === "d" ? d : k === "h" ? h : k === "m" ? m : s;
        node.textContent = pad(val);
      });
    };
    tick();
    setInterval(tick, 1000);
  }

  function stars(rating, count) {
    const full = Math.round(rating);
    let out = "";
    for (let i = 0; i < 5; i += 1) out += i < full ? icon("star") : icon("star");
    return out;
  }

  window.UI = {
    mountChrome,
    productCard,
    renderDrawer,
    syncCounts,
    toast,
    openDrawer,
    closeDrawer,
    openSearch,
    closeSearch,
    renderSearch,
    hydrateIcons,
    observeReveals,
    bindAccordions,
    countdown,
    stars,
    icon,
    hexA,
  };
})();
