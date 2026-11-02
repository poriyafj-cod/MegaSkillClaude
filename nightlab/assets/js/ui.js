/* ==========================================================================
   NIGHTLAB — shared UI: chrome, age gate, product cards, drawer, search, toast
   ========================================================================== */
(function () {
  const STAR = window.STAR;
  const Store = window.Store;
  const icon = window.icon;
  const money = STAR.money;
  const AGE_KEY = "nightlab.age.v1";

  const NAV = [
    { href: "index.html", label: "خانه", key: "home" },
    { href: "shop.html", label: "فروشگاه", key: "shop" },
    { href: "guide.html", label: "راهنمای انتخاب", key: "guide" },
    { href: "about.html", label: "داستان برند", key: "about" },
    { href: "contact.html", label: "تماس", key: "contact" },
  ];

  const page = document.body.dataset.page || "";

  function hexA(hex, alpha) {
    const h = hex.replace("#", "");
    const n = parseInt(h.length === 3 ? h.split("").map((c) => c + c).join("") : h, 16);
    return "rgba(" + ((n >> 16) & 255) + "," + ((n >> 8) & 255) + "," + (n & 255) + "," + alpha + ")";
  }

  /* ---------------- chrome ---------------- */
  function brandHTML() {
    return (
      '<a class="brand" href="index.html" aria-label="نایت‌لب — صفحهٔ اصلی">' +
      '<span class="brand__mark"><span class="brand__tile"><i>Nl</i><b>99</b></span></span>' +
      '<span class="brand__text"><span class="brand__en">NIGHTLAB</span><span class="brand__fa">لابراتوار شب</span></span>' +
      "</a>"
    );
  }

  function headerHTML() {
    const links = NAV.map(
      (n) => '<a class="nav__link" href="' + n.href + '"' + (page === n.key ? ' aria-current="page"' : "") + ">" + n.label + "</a>"
    ).join("");

    return (
      '<div class="notice-bar"><div class="container notice-bar__inner">' +
      "<span>" + icon("package") + " بسته‌بندی کامل بی‌نام — بدون نام فروشگاه روی جعبه و فاکتور</span>" +
      "<span>" + icon("lock") + " پرداخت امن · " + icon("truck") + " ارسال ۲۴ ساعته · <b>۱۸+</b></span>" +
      "</div></div>" +
      '<div class="header"><div class="container header__bar">' +
      brandHTML() +
      '<nav class="nav" aria-label="منوی اصلی">' + links + "</nav>" +
      '<div class="header__actions">' +
      '<button class="icon-btn" type="button" data-open-search aria-label="جست‌وجو">' + icon("search") + "</button>" +
      '<a class="icon-btn" href="wishlist.html" aria-label="علاقه‌مندی‌ها">' + icon("heart") + '<span class="icon-btn__count" data-wish-count hidden>0</span></a>' +
      '<button class="icon-btn" type="button" data-open-cart aria-label="سبد خرید">' + icon("cart") + '<span class="icon-btn__count" data-cart-count hidden>0</span></button>' +
      '<button class="icon-btn header__burger" type="button" data-open-menu aria-label="منو">' + icon("menu") + "</button>" +
      "</div></div></div>" +
      '<div class="mobile-menu" id="mobileMenu" aria-hidden="true">' +
      '<div class="mobile-menu__head"><span class="brand__en">NIGHTLAB</span>' +
      '<button class="icon-btn" type="button" data-close-menu aria-label="بستن">' + icon("close") + "</button></div>" +
      '<nav class="mobile-menu__nav" aria-label="منوی موبایل">' +
      NAV.map((n, i) => '<a href="' + n.href + '">' + n.label + "<span>0" + (i + 1) + "</span></a>").join("") +
      '<a href="cart.html">سبد خرید<span>' + icon("arrowLeft") + "</span></a>" +
      "</nav>" +
      '<a class="btn btn--yellow btn--block" href="shop.html">دیدن کالکشن ' + icon("arrowLeft") + "</a>" +
      "</div>"
    );
  }

  function footerHTML() {
    return (
      '<footer class="footer"><div class="container">' +
      '<div class="footer__grid">' +
      '<div class="footer__brand">' + brandHTML() +
      "<p>بوتیک بزرگسالان با رویکرد روشن: محصول بدن‌سازگار، بسته‌بندی بی‌نام و اطلاعات صادقانه. بدون شرم، بدون اغراق.</p>" +
      '<div class="socials" style="margin-top:16px">' +
      '<a href="#" aria-label="اینستاگرام">' + icon("instagram") + "</a>" +
      '<a href="#" aria-label="تلگرام">' + icon("telegram") + "</a>" +
      '<a href="#" aria-label="واتس‌اپ">' + icon("whatsapp") + "</a></div></div>" +
      '<div class="footer__col"><h4>فروشگاه</h4>' +
      '<a href="shop.html">همهٔ محصولات</a><a href="shop.html?cat=vibrators">ویبراتور و ماساژور</a>' +
      '<a href="shop.html?cat=couples">زوج</a><a href="shop.html?cat=lube">لوبریکانت</a>' +
      '<a href="shop.html?tag=sale">تخفیف‌دارها</a></div>' +
      '<div class="footer__col"><h4>پشتیبانی</h4>' +
      '<a href="contact.html">تماس با ما</a><a href="contact.html#faq">سؤالات متداول</a>' +
      '<a href="guide.html">راهنمای انتخاب</a><a href="about.html">دربارهٔ نایت‌لب</a></div>' +
      '<div class="footer__col"><h4>ارتباط</h4>' +
      '<a href="tel:' + STAR.config.phoneRaw + '">' + STAR.config.phone + "</a>" +
      '<a href="mailto:' + STAR.config.email + '">' + STAR.config.email + "</a>" +
      "<span>" + STAR.config.instagram + "</span><span>تهران، مطهری</span></div>" +
      "</div>" +
      '<div class="footer__bottom"><span>© ۱۴۰۵ نایت‌لب — همهٔ حقوق محفوظ است.</span>' +
      "<span>فقط برای افراد بالای ۱۸ سال · ارسال بی‌نام · بازگشت تا ۷ روز</span></div>" +
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
      '<span class="eyebrow">جست‌وجو در کالکشن</span>' +
      '<button class="icon-btn" type="button" data-close-search aria-label="بستن">' + icon("close") + "</button></div>" +
      '<input class="search-overlay__input" type="search" placeholder="اسم محصول، کد یا ویژگی…" data-search-input aria-label="جست‌وجو" />' +
      '<div class="search-overlay__hint"><span>پیشنهاد:</span>' +
      '<button class="chip-btn" type="button" data-term="واند">واند</button>' +
      '<button class="chip-btn" type="button" data-term="لوبریکانت">لوبریکانت</button>' +
      '<button class="chip-btn" type="button" data-term="کیت">کیت</button>' +
      '<button class="chip-btn" type="button" data-term="بی‌صدا">بی‌صدا</button></div>' +
      '<div class="search-results" data-search-results></div>' +
      "</div></div>"
    );
  }

  /* ---------------- age gate ---------------- */
  function ageGateHTML() {
    return (
      '<div class="agegate" id="ageGate" role="dialog" aria-modal="true" aria-labelledby="ageTitle">' +
      '<div class="agegate__card">' +
      '<div class="tape tape--thin" aria-hidden="true"></div>' +
      '<div class="agegate__tile"><span class="tile"><b>18</b><i>+</i><em>AGE</em></span></div>' +
      '<h1 class="agegate__title" id="ageTitle">این سایت برای بزرگسالان است</h1>' +
      '<p class="agegate__text">محتوای نایت‌لب شامل محصولات بزرگسالان است. برای ورود باید بالای ۱۸ سال باشی. ' +
      "اطلاعات تو ذخیره نمی‌شود؛ فقط همین مرورگر یادش می‌ماند.</p>" +
      '<div class="agegate__actions">' +
      '<button class="btn btn--yellow" type="button" data-age-yes>بله، بالای ۱۸ سالمه</button>' +
      '<button class="btn btn--ghost" type="button" data-age-no>نه، خارج می‌شوم</button>' +
      "</div>" +
      '<p class="agegate__foot mono">NIGHTLAB · ADULTS ONLY · 18+</p>' +
      '<div class="agegate__denied" data-age-denied hidden><p>ورود مجاز نیست. اگر بالای ۱۸ سال هستی، بعداً برگرد.</p></div>' +
      "</div></div>"
    );
  }

  function ageGate() {
    if (document.body.dataset.agegate === "off") return;
    let ok = false;
    try {
      ok = localStorage.getItem(AGE_KEY) === "1";
    } catch (e) {}
    if (ok) return;

    document.body.insertAdjacentHTML("beforeend", ageGateHTML());
    const gate = document.getElementById("ageGate");
    document.body.classList.add("is-locked");

    gate.addEventListener("click", (e) => {
      if (e.target.closest("[data-age-yes]")) {
        try {
          localStorage.setItem(AGE_KEY, "1");
        } catch (err) {}
        gate.classList.add("is-leaving");
        document.body.classList.remove("is-locked");
        setTimeout(() => gate.remove(), 260);
      }
      if (e.target.closest("[data-age-no]")) {
        gate.querySelector("[data-age-denied]").hidden = false;
        gate.querySelector(".agegate__actions").hidden = true;
      }
    });
  }

  /* ---------------- product card ---------------- */
  function badgeHTML(p) {
    const out = [];
    if (p.tags.includes("new")) out.push('<span class="pill pill--crystal">تازه</span>');
    if (p.tags.includes("bestseller")) out.push('<span class="pill">پرفروش</span>');
    if (p.oldPrice) out.push('<span class="pill pill--sale">٪' + money(Math.round((1 - p.price / p.oldPrice) * 100)) + " تخفیف</span>");
    if (p.stock <= 20) out.push('<span class="pill pill--dark">موجودی کم</span>');
    return out.join("");
  }

  function productCard(p, opts) {
    const o = opts || {};
    const wish = Store.inWish(p.slug);
    return (
      '<article class="pc" data-product="' + p.slug + '" data-reveal' + (o.delay ? ' style="--reveal-delay:' + o.delay + 'ms"' : "") + ">" +
      '<div class="pc__media" style="--pc-glow:' + hexA(p.colors.c1, 0.34) + '">' +
      '<div class="pc__badges">' + badgeHTML(p) + "</div>" +
      '<button class="pc__wish' + (wish ? " is-active" : "") + '" type="button" data-wish="' + p.slug + '" aria-label="علاقه‌مندی" aria-pressed="' + wish + '">' + icon("heart") + "</button>" +
      STAR.art(p) +
      '<div class="pc__quick">' +
      '<button class="btn btn--yellow btn--sm" type="button" data-add="' + p.slug + '">' + icon("plus") + " افزودن سریع</button>" +
      '<a class="btn btn--dark btn--sm" href="product.html?p=' + p.slug + '" aria-label="جزئیات">' + icon("arrowLeft") + "</a>" +
      "</div></div>" +
      '<div class="pc__body">' +
      '<span class="pc__cat mono">' + p.code + " · " + STAR.catName(p.cat) + "</span>" +
      '<h3 class="pc__name"><a href="product.html?p=' + p.slug + '">' + p.name + " — " + p.nameEn + "</a></h3>" +
      '<div class="pc__specs">' +
      "<span>" + icon("check") + p.features[0] + "</span>" +
      "<span>" + icon("check") + p.features[1] + "</span>" +
      "</div>" +
      '<div class="pc__foot">' +
      '<span class="price"><span class="price__now">' + money(p.price) + " <small>تومان</small></span>" +
      (p.oldPrice ? '<del class="price__old">' + money(p.oldPrice) + "</del>" : "") +
      "</span>" +
      '<span class="rating">' + icon("star") + p.rating.toFixed(1) + "</span>" +
      "</div></div></article>"
    );
  }

  /* ---------------- toast ---------------- */
  let toastTimer = null;
  function toast(message, kind) {
    let el = document.querySelector(".toast");
    if (!el) {
      el = document.createElement("div");
      el.className = "toast";
      document.body.appendChild(el);
    }
    el.className = "toast is-visible" + (kind ? " toast--" + kind : "");
    el.innerHTML = (kind === "error" ? icon("info") : icon("checkCircle")) + "<span>" + message + "</span>";
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove("is-visible"), 2600);
  }

  /* ---------------- drawer ---------------- */
  function renderDrawer() {
    const body = document.querySelector("[data-drawer-body]");
    const foot = document.querySelector("[data-drawer-foot]");
    if (!body || !foot) return;
    const items = Store.cartItems();

    if (!items.length) {
      body.innerHTML =
        '<div class="empty-state">' + icon("cart") +
        '<h3 class="h-3" style="margin:10px 0">سبد خالیه</h3>' +
        '<p class="muted small">از کالکشن یکی انتخاب کن؛ همه با بسته‌بندی بی‌نام می‌رسند.</p>' +
        '<a class="btn btn--sm" href="shop.html">دیدن محصولات</a></div>';
      foot.innerHTML = "";
      return;
    }

    body.innerHTML = items
      .map((i) => {
        const p = STAR.bySlug(i.slug);
        if (!p) return "";
        return (
          '<div class="drawer-item">' +
          '<div class="drawer-item__art">' + STAR.art(p) + "</div>" +
          "<div><b>" + p.name + "</b>" +
          '<div class="small muted">' + (i.size > 1 ? "پک " + i.size + " عددی" : "تک عدد") + " · " + money(i.unit * i.size * i.qty) + " تومان</div>" +
          '<div class="qty qty--sm"><button type="button" data-qty="' + i.key + '" data-delta="-1" aria-label="کمتر">−</button>' +
          "<span>" + i.qty + '</span><button type="button" data-qty="' + i.key + '" data-delta="1" aria-label="بیشتر">+</button></div></div>' +
          "</div>"
        );
      })
      .join("");

    const t = Store.totals();
    foot.innerHTML =
      '<div class="drawer__row"><span>جمع</span><b>' + money(t.subtotal) + " تومان</b></div>" +
      '<p class="small muted">' + (t.shipping === 0 ? "ارسال رایگان" : "ارسال " + money(t.shipping) + " تومان") + " · بسته‌بندی بی‌نام</p>" +
      '<a class="btn btn--yellow btn--block" href="cart.html">تکمیل سفارش ' + icon("arrowLeft") + "</a>";
  }

  function openDrawer() {
    const d = document.getElementById("cartDrawer");
    if (!d) return;
    renderDrawer();
    d.classList.add("is-open");
    d.setAttribute("aria-hidden", "false");
    document.body.classList.add("is-locked");
  }

  function closeDrawer() {
    const d = document.getElementById("cartDrawer");
    if (!d) return;
    d.classList.remove("is-open");
    d.setAttribute("aria-hidden", "true");
    document.body.classList.remove("is-locked");
  }

  /* ---------------- search ---------------- */
  function renderSearch(q) {
    const box = document.querySelector("[data-search-results]");
    if (!box) return;
    if (!String(q).trim()) {
      box.innerHTML = "";
      return;
    }
    const found = STAR.search(q).slice(0, 5);
    box.innerHTML = found.length
      ? found
          .map(
            (p) =>
              '<a class="search-result" href="product.html?p=' + p.slug + '">' +
              '<span class="search-result__art">' + STAR.art(p) + "</span>" +
              "<span><b>" + p.name + "</b><em>" + p.nameEn + " · " + money(p.price) + " تومان</em></span></a>"
          )
          .join("")
      : '<p class="muted small" style="padding:14px 4px">چیزی پیدا نشد. اسم دیگری امتحان کن.</p>';
  }

  function openSearch() {
    const s = document.getElementById("searchOverlay");
    if (!s) return;
    s.classList.add("is-open");
    s.setAttribute("aria-hidden", "false");
    const input = s.querySelector("[data-search-input]");
    if (input) setTimeout(() => input.focus(), 60);
  }

  function closeSearch() {
    const s = document.getElementById("searchOverlay");
    if (!s) return;
    s.classList.remove("is-open");
    s.setAttribute("aria-hidden", "true");
  }

  /* ---------------- counts ---------------- */
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
  }

  /* ---------------- icons & reveals ---------------- */
  function hydrateIcons(root) {
    (root || document).querySelectorAll("[data-icon]").forEach((el) => {
      if (!el.dataset.done) {
        el.innerHTML = icon(el.dataset.icon);
        el.dataset.done = "1";
      }
    });
  }

  let observer = null;
  function observeReveals(root) {
    hydrateIcons(root);
    const nodes = (root || document).querySelectorAll("[data-reveal]:not(.is-visible)");
    if (!nodes.length) return;
    if (!("IntersectionObserver" in window)) {
      nodes.forEach((n) => n.classList.add("is-visible"));
      return;
    }
    if (!observer) {
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-visible");
              observer.unobserve(entry.target);
            }
          });
        },
        { rootMargin: "0px 0px -8% 0px", threshold: 0.05 }
      );
    }
    nodes.forEach((n) => observer.observe(n));
  }

  function bindAccordions(root) {
    (root || document).querySelectorAll(".acc").forEach((acc) => {
      const btn = acc.querySelector(".acc__btn");
      if (!btn || btn.dataset.bound) return;
      btn.dataset.bound = "1";
      btn.addEventListener("click", () => {
        const open = acc.classList.toggle("is-open");
        btn.setAttribute("aria-expanded", String(open));
      });
    });
  }

  /* ---------------- mount ---------------- */
  function mountChrome() {
    const h = document.querySelector('[data-chrome="header"]');
    const f = document.querySelector('[data-chrome="footer"]');
    if (h) h.innerHTML = headerHTML();
    if (f) f.innerHTML = footerHTML();
    document.body.insertAdjacentHTML("beforeend", cartDrawerHTML() + searchHTML());

    document.addEventListener("click", (e) => {
      const t = e.target.closest(
        "[data-open-cart],[data-close-cart],[data-open-search],[data-close-search],[data-open-menu],[data-close-menu],[data-wish],[data-add],[data-qty],[data-remove],[data-term]"
      );
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
        if (m) {
          m.classList.add("is-open");
          m.setAttribute("aria-hidden", "false");
          document.body.classList.add("is-locked");
        }
      } else if (t.matches("[data-close-menu]")) {
        const m = document.getElementById("mobileMenu");
        if (m) {
          m.classList.remove("is-open");
          m.setAttribute("aria-hidden", "true");
          document.body.classList.remove("is-locked");
        }
      } else if (t.matches("[data-wish]")) {
        const on = Store.toggleWish(t.dataset.wish);
        t.classList.toggle("is-active", on);
        t.setAttribute("aria-pressed", String(on));
        toast(on ? "به علاقه‌مندی‌ها اضافه شد" : "از علاقه‌مندی‌ها حذف شد");
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

    window.addEventListener("lab:change", () => {
      syncCounts();
      renderDrawer();
    });

    hydrateIcons();
    syncCounts();
    renderDrawer();
    ageGate();
  }

  window.UI = {
    mountChrome,
    productCard,
    toast,
    openDrawer,
    closeDrawer,
    hydrateIcons,
    observeReveals,
    bindAccordions,
    syncCounts,
    hexA,
  };
})();
