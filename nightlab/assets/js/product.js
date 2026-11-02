/* ==========================================================================
   NIGHTLAB — product detail page
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
      '<div class="empty-state" style="grid-column:1/-1">' + icon("search") +
      "<h1 class='h-2'>این محصول پیدا نشد</h1>" +
      '<p class="muted" style="margin:10px 0 18px">ممکن است آدرس اشتباه باشد یا محصول از کالکشن حذف شده باشد.</p>' +
      '<a class="btn btn--yellow" href="shop.html">دیدن همهٔ محصولات ' + icon("arrowLeft") + "</a></div>";
    return;
  }

  document.title = product.name + " — " + product.nameEn + " | نایت‌لب";
  const desc = document.querySelector('meta[name="description"]');
  if (desc) desc.setAttribute("content", product.desc.slice(0, 155));
  const crumb = document.querySelector("[data-crumb]");
  if (crumb) crumb.textContent = product.name;

  /* ---------- gallery ---------- */
  const gallery = document.querySelector("[data-gallery]");
  const media = [
    { variant: "full", label: "نمای کلی" },
    { variant: "detail", label: "ابعاد" },
    { variant: "box", label: "بستهٔ بی‌نام" },
  ];
  let active = 0;

  function mediaHTML(m) {
    return STAR.art(product, { variant: m.variant });
  }

  function renderMedia() {
    gallery.innerHTML =
      mediaHTML(media[active]) +
      '<span class="gallery__zoom">' + icon("zoom") + " بزرگ‌نمایی</span>";
    gallery.setAttribute("aria-label", product.name + " — " + media[active].label);
  }

  const thumbs = document.querySelector("[data-thumbs]");
  thumbs.innerHTML = media
    .map(
      (m, i) =>
        '<button class="gallery__thumb' + (i === 0 ? " is-active" : "") + '" type="button" data-thumb="' + i + '" aria-label="' + m.label + '">' +
        mediaHTML(m) + "</button>"
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

  /* ---------- info ---------- */
  const info = document.querySelector("[data-info]");
  let tier = 0;
  let qty = 1;

  function priceBlock() {
    const pr = STAR.priceFor(product, tier);
    return (
      '<span class="price"><span class="price__now">' + money(pr.total) + " <small>تومان</small></span>" +
      (product.oldPrice && tier === 0 ? '<del class="price__old">' + money(product.oldPrice) + "</del>" : "") +
      "</span>" +
      (pr.off ? '<span class="pill pill--crystal">٪' + money(pr.off) + " تخفیف بسته</span>" : "")
    );
  }

  info.innerHTML =
    '<div class="cluster" style="margin-bottom:10px">' +
    (product.tags.includes("new") ? '<span class="pill pill--crystal">تازه</span>' : "") +
    (product.tags.includes("bestseller") ? '<span class="pill">پرفروش</span>' : "") +
    (product.oldPrice ? '<span class="pill pill--sale">تخفیف‌دار</span>' : "") +
    '<span class="pill pill--dark">' + money(product.stock) + " عدد موجود</span></div>" +
    '<span class="mono">' + product.code + " · " + STAR.catName(product.cat).toUpperCase() + "</span>" +
    '<h1 class="pdp__title">' + product.name + "</h1>" +
    '<div class="pdp__en">' + product.nameEn + "</div>" +
    '<div class="cluster" style="gap:14px;margin-top:12px">' +
    '<span class="rating">' + icon("star") + product.rating.toFixed(1) + "</span>" +
    '<span class="muted small">' + money(product.reviews) + " نظر ثبت‌شده</span>" +
    '<span class="muted small">' + icon("package") + " ارسال بی‌نام</span></div>" +
    '<div class="pdp__price" data-price-block>' + priceBlock() + "</div>" +
    '<p class="lead" style="margin-top:16px">' + product.desc + "</p>" +
    '<div class="pdp__feature-list">' +
    product.features.map((f) => "<span>" + icon("check") + f + "</span>").join("") +
    "</div>" +
    '<div class="options-block"><div class="options-block__label"><span>اندازهٔ بسته</span>' +
    '<span class="muted small">هرچه بیشتر، ارزان‌تر</span></div>' +
    '<div class="packsize" data-packsize>' +
    STAR.packTiers
      .map(
        (t, i) =>
          '<button type="button" data-tier="' + i + '" class="' + (i === 0 ? "is-active" : "") + '"><strong>' + t.label + "</strong><span>" +
          (t.off ? "٪" + money(t.off) + " ارزان‌تر" : "قیمت پایه") + "</span></button>"
      )
      .join("") +
    "</div></div>" +
    '<div class="buy-row">' +
    '<div class="qty" data-qty-box><button type="button" data-q="-1" aria-label="کمتر">−</button><span data-qty>۱</span><button type="button" data-q="1" aria-label="بیشتر">+</button></div>' +
    '<button class="btn btn--yellow" type="button" data-buy>' + icon("cart") + " افزودن به سبد</button>" +
    '<button class="icon-btn" style="width:46px;height:46px" type="button" data-wish="' + product.slug + '" aria-label="علاقه‌مندی">' + icon("heart") + "</button>" +
    "</div>" +
    '<div class="assurance"><span>' + icon("package") + " بستهٔ بی‌نام</span><span>" + icon("shield") +
    " ضمانت اصالت</span><span>" + icon("refresh") + " بازگشت ۷ روزه</span><span>" + icon("lock") + " پرداخت خصوصی</span></div>" +
    '<div class="accordion">' +
    accHTML("مشخصات فنی", specHTML(), true) +
    accHTML("راهنمای استفاده", "<p>" + product.usage + "</p>") +
    accHTML("نگهداری و بهداشت", "<p>" + product.care + "</p>") +
    accHTML("ارسال، بازگشت و حریم خصوصی", shipHTML()) +
    "</div>";

  function accHTML(title, body, open) {
    return (
      '<div class="acc' + (open ? " is-open" : "") + '">' +
      '<button class="acc__btn" type="button" aria-expanded="' + (open ? "true" : "false") + '">' + title + icon("chevronDown") + "</button>" +
      '<div class="acc__panel"><div><div class="acc__inner">' + body + "</div></div></div></div>"
    );
  }

  function specHTML() {
    return (
      '<table class="spec-table"><tbody>' +
      product.specs.map((row) => "<tr><th>" + row[0] + "</th><td>" + row[1] + "</td></tr>").join("") +
      "</tbody></table>"
    );
  }

  function shipHTML() {
    return (
      "<ul style='display:grid;gap:8px'>" +
      "<li>تهران ۲۴ ساعته، شهرستان ۲ تا ۴ روز کاری.</li>" +
      "<li>سفارش بالای " + money(STAR.config.freeShipFrom) + " تومان ارسال رایگان دارد.</li>" +
      "<li>روی جعبه و فاکتور هیچ نامی از فروشگاه نیست؛ فقط کد تحویل.</li>" +
      "<li>بازگشت تا ۷ روز، فقط برای بستهٔ پلمب‌نشده (به‌دلیل بهداشت).</li>" +
      "<li>اطلاعات سفارش برای هیچ تبلیغ یا فهرست دیگری استفاده نمی‌شود.</li></ul>"
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
      qty = Math.max(1, Math.min(20, qty + Number(q.dataset.q)));
      info.querySelector("[data-qty]").textContent = money(qty);
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
    rev.innerHTML =
      '<div class="reviews__score">' +
      "<strong>" + product.rating.toFixed(1) + "</strong>" +
      '<div class="quote__stars" style="justify-content:center;margin:8px 0">' + icon("star").repeat(5) + "</div>" +
      '<div class="muted small">' + money(product.reviews) + " نظر ثبت‌شده</div>" +
      '<button class="btn btn--dark btn--sm btn--block" style="margin-top:14px" type="button" data-write-review>نوشتن نظر</button>' +
      "</div>" +
      '<div class="reviews__list">' +
      STAR.reviewsPool
        .slice(0, 3)
        .map(
          (r) =>
            '<article class="review"><div class="review__head"><span class="avatar">' + r.name.charAt(0) + "</span>" +
            '<span class="review__name">' + r.name + "</span>" +
            '<span class="quote__stars" style="margin-inline-start:auto">' + icon("star").repeat(r.stars) + "</span></div>" +
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
