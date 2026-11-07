/* ==========================================================================
   NAFAS — product detail page
   ========================================================================== */
(function () {
  "use strict";

  const D = window.NAFAS;
  const S = window.NAFAS_STORE;
  const UI = window.NAFAS_UI;
  const icon = window.svgIcon;
  const qs = UI.qs;

  const REVIEW_POOL = [
    { name: "نیلوفر", meta: "خرید تاییدشده", text: "دقیقاً همون چیزی بود که در عکس دیدم. بسته‌بندی خیلی تمیز و شیک بود و سریع رسید.", rating: 5, initial: "ن" },
    { name: "سارا", meta: "خرید تاییدشده", text: "سبک و خوش‌ساخته. دو هفته‌ست هر روز استفاده می‌کنم و هیچ تغییر رنگی نداده.", rating: 5, initial: "س" },
    { name: "آیدا", meta: "خرید تاییدشده", text: "برای هدیه گرفتم و خودم هم پس‌انداز کردم برای یکی. ارزش قیمتش رو داره.", rating: 4, initial: "آ" },
    { name: "کیانا", meta: "خرید تاییدشده", text: "سایز و رنگ همونی بود که انتخاب کردم. پشتیبانی هم سریع جواب داد.", rating: 5, initial: "ک" },
  ];

  const state = { product: null, color: null, size: null, qty: 1 };

  const el = (id) => document.getElementById(id);

  function readProduct() {
    const params = new URLSearchParams(window.location.search);
    const slug = params.get("p") || params.get("id");
    let product = slug ? S.bySlug(slug) : null;
    if (!product && slug) product = S.getProduct(slug);
    return product;
  }

  /* ---------- gallery ---------- */
  function renderGallery(p) {
    const thumbs = el("galleryThumbs");
    const main = el("galleryImg");
    if (!thumbs || !main) return;

    const shots = [
      { src: "assets/img/products/" + p.slug + ".jpg", label: "نمای اصلی" },
      { src: "assets/img/products/" + p.slug + "-detail.jpg", label: "جزئیات" },
    ];

    thumbs.innerHTML = shots
      .map(
        (s, i) =>
          '<button class="gallery__thumb' + (i === 0 ? " is-active" : "") + '" type="button" data-shot="' + s.src +
          '" aria-label="' + s.label + '"><picture><source srcset="' + s.src.replace(".jpg", ".avif") + '" type="image/avif"><source srcset="' +
          s.src.replace(".jpg", ".webp") + '" type="image/webp"><img src="' + s.src + '" alt="" loading="lazy"></picture></button>'
      )
      .join("");

    main.src = shots[0].src;
    main.alt = p.name;
    syncGallerySources(shots[0].src);

    thumbs.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-shot]");
      if (!btn) return;
      main.src = btn.getAttribute("data-shot");
      thumbs.querySelectorAll(".gallery__thumb").forEach((t) => t.classList.remove("is-active"));
      btn.classList.add("is-active");
      syncGallerySources(main.src);
    });

    main.parentElement.addEventListener("click", () => {
      const other = shots.find((s) => main.src.indexOf(s.src) === -1);
      if (other) {
        main.src = other.src;
        syncGallerySources(main.src);
      }
    });
  }

  function syncGallerySources(src) {
    const pic = document.getElementById("galleryMainPicture");
    if (!pic) return;
    const avif = pic.querySelector('source[type="image/avif"]');
    const webp = pic.querySelector('source[type="image/webp"]');
    if (avif) avif.srcset = src.replace(".jpg", ".avif");
    if (webp) webp.srcset = src.replace(".jpg", ".webp");
  }

  /* ---------- info ---------- */
  function renderInfo(p) {
    const cat = S.categoryOf(p.cat);
    document.title = p.name + " | نفس";

    el("pdpCat").textContent = cat ? cat.name : "";
    el("pdpTitle").textContent = p.name;
    el("pdpRating").innerHTML = UI.stars(p.rating) + "<span>" + S.fmtNum(p.rating) + "</span>";
    el("pdpReviews").textContent = "(" + S.fmtNum(p.reviews) + " نظر)";
    el("pdpCode").textContent = "کد محصول: " + p.id.toUpperCase();
    el("pdpShort").textContent = p.short;

    const stockEl = el("pdpStock");
    if (p.stock <= 0) {
      stockEl.textContent = "ناموجود";
      stockEl.className = "pill";
    } else if (p.stock <= 10) {
      stockEl.textContent = "فقط " + S.fmtNum(p.stock) + " عدد باقی مانده";
      stockEl.className = "pill pill--lime";
    } else {
      stockEl.textContent = "موجود در انبار";
      stockEl.className = "pill";
    }

    const off = p.oldPrice ? Math.round(((p.oldPrice - p.price) / p.oldPrice) * 100) : 0;
    el("pdpPrice").innerHTML =
      '<span class="price">' + S.money(p.price) + " <small>تومان</small></span>" +
      (p.oldPrice ? '<del class="price--old">' + S.money(p.oldPrice) + "</del>" : "") +
      (off ? '<span class="badge badge--sale">' + S.fmtNum(off) + "٪ تخفیف</span>" : "");

    /* colours */
    if (p.colors && p.colors.length) {
      state.color = p.colors[0].name;
      el("colorBlock").hidden = false;
      el("colorLabel").textContent = state.color;
      el("colorOptions").innerHTML = p.colors
        .map(
          (c) =>
            '<button type="button" class="option-btn' + (c.name === state.color ? " is-active" : "") +
            '" data-color="' + UI.esc(c.name) + '">' + UI.esc(c.name) + "</button>"
        )
        .join("");
    }

    /* sizes / letters */
    if (p.sizes && p.sizes.length) {
      state.size = p.sizes[0];
      el("sizeBlock").hidden = false;
      el("sizeLabel").textContent = state.size;
      el("sizeLabelText").textContent = p.sizes.length && p.sizes[0].length === 1 ? "حرف" : "سایز";
      el("sizeOptions").innerHTML = p.sizes
        .map(
          (s) =>
            '<button type="button" class="option-btn' + (s === state.size ? " is-active" : "") +
            '" data-size="' + UI.esc(s) + '">' + UI.esc(s) + "</button>"
        )
        .join("");
    }

    /* shipping note */
    const note = el("pdpShipNote");
    if (note) {
      const gap = Math.max(0, D.freeShippingThreshold - p.price);
      note.textContent = gap
        ? "با " + S.money(gap) + " تومان خرید بیشتر، ارسال سفارشت رایگان می‌شود."
        : "ارسال این سفارش رایگان است.";
    }

    /* accordion */
    const acc = el("pdpAccordion");
    if (acc) {
      const specRows = p.specs
        .map((s) => "<tr><th>" + UI.esc(s[0]) + "</th><td>" + UI.esc(s[1]) + "</td></tr>")
        .join("");
      const items = [
        {
          title: "توضیحات محصول",
          body: "<p>" + UI.esc(p.desc) + "</p>",
          open: true,
        },
        {
          title: "مشخصات",
          body: '<table class="spec-table">' + specRows + "</table>",
        },
        {
          title: "ارسال و مرجوعی",
          body:
            "<ul><li>ارسال تهران ۲۴ تا ۴۸ ساعت کاری، شهرستان ۳ تا ۵ روز کاری.</li>" +
            "<li>ارسال رایگان برای سفارش‌های بالای " + S.money(D.freeShippingThreshold) + " تومان.</li>" +
            "<li>۷ روز مهلت تعویض یا بازگشت، در صورت استفاده‌نشدن کالا.</li></ul>",
        },
        {
          title: "راهنمای سایز و نگهداری",
          body:
            "<ul><li>برای حلقه، دور انگشت را با نخ اندازه بگیرید و با جدول سایز تطبیق دهید.</li>" +
            "<li>گردنبندهای قابل تنظیم با هر دور گردنی می‌نشینند.</li>" +
            "<li>برای عمر بیشتر، از تماس با آب، عطر و مواد شوینده پرهیز کنید.</li></ul>",
        },
      ];

      acc.innerHTML = items
        .map(
          (it, i) =>
            '<div class="accordion__item' + (it.open ? " is-open" : "") + '">' +
            '<button class="accordion__btn" type="button" aria-expanded="' + (it.open ? "true" : "false") + '">' +
            UI.esc(it.title) + '<span class="accordion__icon"></span></button>' +
            '<div class="accordion__panel"><div>' + it.body + "</div></div></div>"
        )
        .join("");

      acc.addEventListener("click", (e) => {
        const btn = e.target.closest(".accordion__btn");
        if (!btn) return;
        const item = btn.parentElement;
        const isOpen = item.classList.contains("is-open");
        acc.querySelectorAll(".accordion__item").forEach((it) => {
          it.classList.remove("is-open");
          const b = it.querySelector(".accordion__btn");
          if (b) b.setAttribute("aria-expanded", "false");
        });
        if (!isOpen) {
          item.classList.add("is-open");
          btn.setAttribute("aria-expanded", "true");
        }
      });
    }
  }

  /* ---------- reviews ---------- */
  function renderReviews(p) {
    const wrap = el("reviews");
    if (!wrap) return;
    const pool = REVIEW_POOL.slice(0, 3);
    wrap.innerHTML = pool
      .map(
        (r) =>
          '<article class="review"><div class="review__head"><span class="review__who"><span class="avatar">' +
          UI.esc(r.initial) + "</span>" + UI.esc(r.name) + "</span>" +
          '<span class="rating">' + UI.stars(r.rating) + "<span>" + S.fmtNum(r.rating) + "</span></span></div>" +
          "<p>" + UI.esc(r.text) + "</p></article>"
      )
      .join("");
    const avg = el("reviewAvg");
    if (avg) avg.textContent = "میانگین " + S.fmtNum(p.rating) + " از ۵ · " + S.fmtNum(p.reviews) + " نظر";
  }

  /* ---------- related ---------- */
  function renderRelated(p) {
    const grid = el("relatedGrid");
    if (!grid) return;
    const sameCat = D.products.filter((x) => x.cat === p.cat && x.id !== p.id);
    const others = D.products
      .filter((x) => x.cat !== p.cat && x.id !== p.id)
      .sort((a, b) => b.popularity - a.popularity);
    const picks = sameCat.concat(others).slice(0, 4);
    grid.innerHTML = picks.map((x, i) => UI.productCard(x, { delay: i * 60 })).join("");
  }

  /* ---------- actions ---------- */
  function bindActions(p) {
    const qtyValue = el("qtyValue");
    el("qtyInc").addEventListener("click", () => {
      state.qty = Math.min(10, state.qty + 1);
      qtyValue.textContent = S.fmtNum(state.qty);
    });
    el("qtyDec").addEventListener("click", () => {
      state.qty = Math.max(1, state.qty - 1);
      qtyValue.textContent = S.fmtNum(state.qty);
    });

    const colorOptions = el("colorOptions");
    if (colorOptions) {
      colorOptions.addEventListener("click", (e) => {
        const btn = e.target.closest("[data-color]");
        if (!btn) return;
        state.color = btn.getAttribute("data-color");
        el("colorLabel").textContent = state.color;
        colorOptions.querySelectorAll(".option-btn").forEach((b) => b.classList.remove("is-active"));
        btn.classList.add("is-active");
      });
    }

    const sizeOptions = el("sizeOptions");
    if (sizeOptions) {
      sizeOptions.addEventListener("click", (e) => {
        const btn = e.target.closest("[data-size]");
        if (!btn) return;
        state.size = btn.getAttribute("data-size");
        el("sizeLabel").textContent = state.size;
        sizeOptions.querySelectorAll(".option-btn").forEach((b) => b.classList.remove("is-active"));
        btn.classList.add("is-active");
      });
    }

    el("addToCart").addEventListener("click", () => {
      const opts = [state.color, state.size].filter(Boolean).join(" · ");
      S.add(p.id, state.qty, opts);
      UI.toast(S.fmtNum(state.qty) + " عدد «" + p.name + "» به سبد اضافه شد");
      UI.openLayer(qs("#cartDrawer"));
    });

    const like = el("pdpLike");
    const syncLike = () => {
      const active = S.inWish(p.id);
      like.classList.toggle("is-active", active);
      like.setAttribute("aria-pressed", active ? "true" : "false");
    };
    syncLike();
    like.addEventListener("click", () => {
      const active = S.toggleWish(p.id);
      syncLike();
      UI.toast(active ? "به علاقه‌مندی‌ها اضافه شد ♥" : "از علاقه‌مندی‌ها حذف شد");
    });
  }

  function renderNotFound() {
    const pdp = el("pdp");
    if (!pdp) return;
    pdp.outerHTML =
      '<div class="success-card" style="grid-column:1/-1">' +
      '<div class="success-card__icon" style="background:var(--v-100);color:var(--v-700)">' + icon("search") + "</div>" +
      "<h1 class=\"h-2\">این محصول پیدا نشد</h1>" +
      '<p class="muted">ممکن است لینک اشتباه باشد یا محصول از کالکشن حذف شده باشد.</p>' +
      '<a class="btn" href="shop.html">رفتن به فروشگاه</a></div>';
  }

  function init() {
    const p = readProduct();
    if (!p) {
      renderNotFound();
      return;
    }
    state.product = p;
    renderGallery(p);
    renderInfo(p);
    renderReviews(p);
    renderRelated(p);
    bindActions(p);
    UI.initReveal();

    /* breadcrumb trail */
    const cat = S.categoryOf(p.cat);
    const bc = el("breadcrumbs");
    if (bc && cat) {
      bc.innerHTML +=
        '<span class="breadcrumbs__sep" aria-hidden="true">/</span>' +
        '<a href="shop.html?cat=' + cat.id + '">' + UI.esc(cat.name) + "</a>" +
        '<span class="breadcrumbs__sep" aria-hidden="true">/</span>' +
        '<span aria-current="page">' + UI.esc(p.name) + "</span>";
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
