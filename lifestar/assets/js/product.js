/* ==========================================================================
   LIFE STAR — product detail page
   ========================================================================== */
(function () {
  const STAR = window.STAR;
  const Store = window.Store;
  const UI = window.UI;
  const icon = window.icon;
  const money = STAR.money;

  UI.mountChrome();

  const slug = new URLSearchParams(location.search).get("p") || STAR.products[0].slug;
  const product = STAR.bySlug(slug);
  const root = document.querySelector("[data-pdp]");

  if (!product) {
    root.innerHTML =
      '<div class="empty-state" style="grid-column:1/-1">' + icon("info") +
      "<h1 class='h-2'>این نوشیدنی پیدا نشد</h1>" +
      '<p class="muted" style="margin:10px 0 18px">ممکن است آدرس اشتباه باشد یا محصول از کالکشن حذف شده باشد.</p>' +
      '<a class="btn" href="shop.html">دیدن همهٔ نوشیدنی‌ها ' + icon("arrowLeft") + "</a></div>";
    return;
  }

  document.title = product.name + " — " + product.nameEn + " | لایف استار";
  const desc = document.querySelector('meta[name="description"]');
  if (desc) desc.setAttribute("content", product.desc.slice(0, 155));
  const crumb = document.querySelector("[data-crumb]");
  if (crumb) crumb.textContent = product.name;

  /* ---------- gallery ---------- */
  const gallery = document.querySelector("[data-gallery]");
  const media = [
    { type: "can", label: "قوطی" },
    ...(product.slug === "sour-cherry" ? [{ type: "photo", src: "assets/img/brand/can-real.jpg", label: "عکس واقعی" }] : []),
    { type: "can2", label: "نمای نزدیک" },
  ];
  let active = 0;

  function renderMedia() {
    const m = media[active];
    gallery.innerHTML =
      (m.type === "photo"
        ? '<img src="' + m.src + '" alt="' + product.name + ' — عکس واقعی محصول" />'
        : STAR.canSvg(product, { label: m.type !== "can2" })) +
      '<span class="gallery__zoom">' + icon("zoom") + " بزرگ‌نمایی</span>";
  }

  const thumbs = document.querySelector("[data-thumbs]");
  thumbs.innerHTML = media
    .map(
      (m, i) =>
        '<button class="gallery__thumb' + (i === 0 ? " is-active" : "") + '" type="button" data-thumb="' + i + '" aria-label="' + m.label + '">' +
        (m.type === "photo" ? '<img src="' + m.src + '" alt="" />' : STAR.canSvg(product, { label: m.type !== "can2" })) +
        "</button>"
    )
    .join("");

  thumbs.addEventListener("click", (e) => {
    const b = e.target.closest("[data-thumb]");
    if (!b) return;
    active = Number(b.dataset.thumb);
    thumbs.querySelectorAll(".gallery__thumb").forEach((t) => t.classList.toggle("is-active", t === b));
    renderMedia();
  });
  renderMedia();

  /* ---------- header info ---------- */
  const info = document.querySelector("[data-info]");
  let tier = 0;
  let qty = 1;

  function priceBlock() {
    const pr = STAR.priceFor(product, tier);
    return (
      '<div class="pdp__price"><span class="price"><span class="price__now">' + money(pr.total) + " <small>تومان</small></span>" +
      (product.oldPrice && tier === 0 ? '<del class="price__old">' + money(product.oldPrice) + "</del>" : "") +
      "</span>" +
      (pr.off ? '<span class="pill pill--volt">٪' + pr.off + " تخفیف پک</span>" : "") +
      "</div>"
    );
  }

  info.innerHTML =
    '<div class="cluster" style="margin-bottom:12px">' +
    (product.tags.includes("new") ? '<span class="pill pill--volt">تازه رسیده</span>' : "") +
    (product.tags.includes("bestseller") ? '<span class="pill">پرفروش</span>' : "") +
    '<span class="pill pill--ice">' + product.stock + " عدد در انبار</span></div>" +
    '<h1 class="pdp__title">' + product.name + "</h1>" +
    '<div class="pdp__en">' + product.nameEn + " · " + product.volume + "ml</div>" +
    '<div class="cluster" style="gap:14px;margin-top:12px">' +
    '<span class="rating">' + icon("star") + product.rating.toFixed(1) + "</span>" +
    '<span class="muted small">' + product.reviews + " نظر ثبت‌شده</span>" +
    '<span class="muted small">' + icon("bolt") + " " + product.caffeine + "mg کافئین</span></div>" +
    '<div data-price-block>' + priceBlock() + "</div>" +
    '<p class="lead" style="margin-top:16px">' + product.desc + "</p>" +
    '<div class="options-block"><div class="options-block__label"><span>طعم و رنگ قوطی</span><span class="muted small">' + product.notes.join(" · ") + "</span></div>" +
    '<div class="option-row">' +
    '<span class="swatch is-active" style="background:' + product.colors.c1 + '" title="' + product.nameEn + '"></span>' +
    STAR.categories
      .filter((c) => c.id === product.cat)
      .map((c) => '<span class="pill" style="margin-inline-start:6px">' + icon(c.icon) + c.name + "</span>")
      .join("") +
    "</div></div>" +
    '<div class="options-block"><div class="options-block__label"><span>اندازهٔ پک</span><span class="muted small">هرچه بیشتر، ارزان‌تر</span></div>' +
    '<div class="packsize" data-packsize>' +
    STAR.packTiers
      .map(
        (t, i) =>
          '<button type="button" data-tier="' + i + '" class="' + (i === 0 ? "is-active" : "") + '"><strong>' + t.label + "</strong><span>" +
          (t.off ? "٪" + t.off + " ارزان‌تر" : "قیمت پایه") + "</span></button>"
      )
      .join("") +
    "</div></div>" +
    '<div class="buy-row">' +
    '<div class="qty" data-qty-box><button type="button" data-q="-1" aria-label="کمتر">−</button><span data-qty>1</span><button type="button" data-q="1" aria-label="بیشتر">+</button></div>' +
    '<button class="btn btn--volt" type="button" data-buy>' + icon("cart") + " افزودن به سبد</button>" +
    '<button class="icon-btn" style="width:48px;height:48px" type="button" data-wish="' + product.slug + '" aria-label="علاقه‌مندی">' + icon("heart") + "</button>" +
    "</div>" +
    '<div class="assurance"><span>' + icon("truck") + " ارسال ۲۴ ساعته</span><span>" + icon("shield") + " ضمانت اصالت</span><span>" + icon("refresh") + " ۷ روز مرجوعی</span><span>" + icon("snow") + " ارسال سرد</span></div>" +
    '<div class="accordion">' +
    accHTML("ترکیبات و ارزش غذایی", nutriHTML(), true) +
    accHTML("مشخصات", specHTML()) +
    accHTML("ارسال و شرایط", shipHTML()) +
    "</div>";

  function accHTML(title, body, open) {
    return (
      '<div class="acc' + (open ? " is-open" : "") + '">' +
      '<button class="acc__btn" type="button" aria-expanded="' + (open ? "true" : "false") + '">' + title + icon("chevronDown") + "</button>" +
      '<div class="acc__panel"><div><div class="acc__inner">' + body + "</div></div></div></div>"
    );
  }

  function nutriHTML() {
    const bars = [
      { label: "کافئین", val: product.caffeine, max: 220, unit: "mg", cls: "" },
      { label: "شکر", val: product.sugar, max: 30, unit: "g", cls: "nutri__fill--ice" },
      { label: "کالری", val: product.kcal, max: 140, unit: "kcal", cls: "nutri__fill--volt" },
      { label: "تورین", val: 1000, max: 1200, unit: "mg", cls: "" },
    ];
    return (
      '<div class="nutri">' +
      bars
        .map(
          (b) =>
            '<div class="nutri__row"><span class="muted">' + b.label + "</span>" +
            '<span class="nutri__bar"><span class="nutri__fill ' + b.cls + '" style="--w:' + Math.min(100, (b.val / b.max) * 100) + '%"></span></span>' +
            "<strong>" + b.val + " " + b.unit + "</strong></div>"
        )
        .join("") +
      '</div><p class="small muted" style="margin-top:14px">' + product.ingredients + "</p>" +
      '<p class="small muted" style="margin-top:8px">مصرف بیش از ۴۰۰ میلی‌گرم کافئین در روز توصیه نمی‌شود. برای افراد زیر ۱۸ سال، باردار یا دارای فشار خون مناسب نیست.</p>'
    );
  }

  function specHTML() {
    return (
      '<table class="spec-table"><tbody>' +
      "<tr><th>حجم</th><td>" + product.volume + " میلی‌لیتر</td></tr>" +
      "<tr><th>کافئین</th><td>" + product.caffeine + " میلی‌گرم</td></tr>" +
      "<tr><th>شکر</th><td>" + (product.sugar === 0 ? "بدون شکر (سوکرالوز)" : product.sugar + " گرم") + "</td></tr>" +
      "<tr><th>انرژی</th><td>" + product.kcal + " کیلوکالری</td></tr>" +
      "<tr><th>دسته</th><td>" + STAR.catName(product.cat) + "</td></tr>" +
      "<tr><th>نگهداری</th><td>محل خشک و خنک، بهترین مصرف سرد</td></tr>" +
      "<tr><th>تاریخ انقضا</th><td>۱۸ ماه از تاریخ تولید</td></tr>" +
      "</tbody></table>"
    );
  }

  function shipHTML() {
    return (
      "<ul style='display:grid;gap:8px'>" +
      "<li>ارسال تهران ۲۴ تا ۴۸ ساعت کاری، شهرستان ۳ تا ۵ روز کاری.</li>" +
      "<li>سفارش بالای " + money(STAR.config.freeShipFrom) + " تومان ارسال رایگان دارد.</li>" +
      "<li>بسته‌بندی عایق سرد برای نگه‌داشتن طعم تا لحظهٔ باز کردن.</li>" +
      "<li>۷ روز مهلت مرجوعی برای قوطی‌های پلمب‌نشده.</li></ul>"
    );
  }

  info.addEventListener("click", (e) => {
    const tierBtn = e.target.closest("[data-tier]");
    if (tierBtn) {
      tier = Number(tierBtn.dataset.tier);
      info.querySelectorAll("[data-packsize] button").forEach((b) => b.classList.toggle("is-active", b === tierBtn));
      info.querySelector("[data-price-block]").innerHTML = priceBlock();
      return;
    }
    const q = e.target.closest("[data-q]");
    if (q) {
      qty = Math.max(1, Math.min(30, qty + Number(q.dataset.q)));
      info.querySelector("[data-qty]").textContent = qty;
      return;
    }
    if (e.target.closest("[data-buy]")) {
      const p = Store.addToCart(product.slug, tier, qty);
      if (p) {
        UI.toast(qty + " × " + STAR.packTiers[tier].label + " " + p.name + " اضافه شد");
        UI.openDrawer();
      }
    }
  });

  UI.bindAccordions(info);

  /* ---------- reviews ---------- */
  const rev = document.querySelector("[data-reviews]");
  if (rev) {
    const pool = STAR.reviewsPool.slice(0, 3);
    rev.innerHTML =
      '<div class="reviews__score">' +
      "<strong>" + product.rating.toFixed(1) + "</strong>" +
      '<div class="quote__stars" style="justify-content:center;margin:8px 0">' + icon("star").repeat(5) + "</div>" +
      '<div class="muted small">' + product.reviews + " نظر ثبت‌شده</div>" +
      '<button class="btn btn--dark btn--sm btn--block" style="margin-top:14px" type="button" data-write-review>نوشتن نظر</button>' +
      "</div>" +
      '<div class="reviews__list">' +
      pool
        .map(
          (r) =>
            '<article class="review"><div class="review__head"><span class="avatar">' + r.name.charAt(0) + "</span>" +
            '<span class="review__name">' + r.name + '</span><span class="quote__stars">' + icon("star").repeat(r.stars) + "</span></div>" +
            "<p>" + r.text + "</p></article>"
        )
        .join("") +
      "</div>";

    rev.addEventListener("click", (e) => {
      if (e.target.closest("[data-write-review]")) UI.toast("فرم نظر در نسخهٔ بعدی فعال می‌شود");
    });
  }

  /* ---------- related ---------- */
  const rel = document.querySelector("[data-related]");
  if (rel) rel.innerHTML = STAR.related(product, 4).map((p) => UI.productCard(p)).join("");

  UI.observeReveals();
})();
