/* ==========================================================================
   NAFAS — home page controller
   ========================================================================== */
(function () {
  "use strict";

  const D = window.NAFAS;
  const S = window.NAFAS_STORE;
  const UI = window.NAFAS_UI;
  const icon = window.svgIcon;
  const qs = UI.qs;

  const byPopularity = D.products.slice().sort((a, b) => b.popularity - a.popularity);
  const byNewest = D.products.slice().sort((a, b) => b.added - a.added);

  /* ---------- categories ---------- */
  function renderCategories() {
    const grid = qs("#catGrid");
    if (!grid) return;
    grid.innerHTML = D.categories
      .map((c) => {
        const count = D.products.filter((p) => p.cat === c.id).length;
        return (
          '<a class="cat-card" href="shop.html?cat=' + c.id + '" data-reveal>' +
          '<span class="cat-card__icon">' + icon(c.icon) + "</span>" +
          '<span class="cat-card__name">' + UI.esc(c.name) + "</span>" +
          '<span class="cat-card__count">' + S.fmtNum(count) + " محصول</span></a>"
        );
      })
      .join("");
  }

  /* ---------- product grids ---------- */
  function renderGrid(sel, items) {
    const grid = qs(sel);
    if (!grid) return;
    grid.innerHTML = items
      .map((p, i) => UI.productCard(p, { delay: Math.min(i, 3) * 70 }))
      .join("");
  }

  /* ---------- features ---------- */
  function renderFeatures() {
    const strip = qs("#featureStrip");
    if (!strip) return;
    strip.innerHTML = D.features
      .map(
        (f) =>
          '<div class="feature" data-reveal>' +
          '<span class="feature__icon">' + icon(f.icon) + "</span>" +
          "<div><h3>" + UI.esc(f.title) + "</h3><p>" + UI.esc(f.text) + "</p></div></div>"
      )
      .join("");
  }

  /* ---------- testimonials ---------- */
  function renderTestimonials() {
    const wrap = qs("#testimonials");
    if (!wrap) return;
    wrap.innerHTML = D.testimonials
      .map(
        (t, i) =>
          '<figure class="testimonial" data-reveal style="--reveal-delay:' + i * 90 + 'ms">' +
          '<div class="rating">' + UI.stars(t.rating) + "<span>" + S.fmtNum(t.rating) + " از ۵</span></div>" +
          '<blockquote class="testimonial__text">«' + UI.esc(t.text) + "»</blockquote>" +
          '<figcaption class="testimonial__who"><span class="avatar">' + UI.esc(t.initial) + "</span>" +
          "<span><b>" + UI.esc(t.name) + "</b><span>" + UI.esc(t.meta) + "</span></span></figcaption></figure>"
      )
      .join("");
  }

  /* ---------- style grid ---------- */
  function renderStyle() {
    const grid = qs("#styleGrid");
    if (!grid) return;
    const picks = ["butterfly-clip", "chain-bracelet", "gold-hoops", "pearl-carabiner"];
    grid.innerHTML = picks
      .map((slug) => {
        const p = S.bySlug(slug);
        return (
          '<a class="style-tile" href="product.html?p=' + slug + '">' +
          '<img src="assets/img/products/' + slug + '-detail.jpg" alt="' + UI.esc(p ? p.name : slug) + '" loading="lazy">' +
          '<span class="style-tile__tag">#nafasstyle</span></a>'
        );
      })
      .join("");
  }

  /* ---------- countdown ---------- */
  function startCountdown() {
    const root = qs("[data-countdown]");
    if (!root) return;
    const KEY = "nafas.cd.end.v1";
    let end = 0;
    try {
      end = Number(localStorage.getItem(KEY)) || 0;
    } catch (e) {}
    if (!end || end < Date.now()) {
      end = Date.now() + 5 * 24 * 60 * 60 * 1000 + 13 * 60 * 60 * 1000 + 36 * 60 * 1000;
      try {
        localStorage.setItem(KEY, String(end));
      } catch (e) {}
    }

    const pad = (n) => {
      const fa = new Intl.NumberFormat("fa-IR", { minimumIntegerDigits: 2, useGrouping: false });
      return fa.format(n);
    };

    const tick = () => {
      let diff = Math.max(0, end - Date.now());
      const days = Math.floor(diff / 86400000);
      diff -= days * 86400000;
      const hours = Math.floor(diff / 3600000);
      diff -= hours * 3600000;
      const minutes = Math.floor(diff / 60000);
      diff -= minutes * 60000;
      const seconds = Math.floor(diff / 1000);

      const map = { days: days, hours: hours, minutes: minutes, seconds: seconds };
      Object.keys(map).forEach((k) => {
        const el = qs('[data-cd="' + k + '"]', root);
        if (el) el.textContent = pad(map[k]);
      });
    };

    tick();
    setInterval(tick, 1000);
  }

  /* ---------- newsletter ---------- */
  function initNewsletter() {
    const form = qs("[data-newsletter]");
    if (!form) return;
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const input = form.querySelector("input[type='email']");
      const value = input ? input.value.trim() : "";
      const valid = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value);
      if (!valid) {
        UI.toast("یه ایمیل درست بنویس تا عضو بشی", "error");
        if (input) input.focus();
        return;
      }
      form.reset();
      UI.toast("خوش اومدی! کد تخفیف NAFAS10 برات فعال شد");
    });
  }

  function init() {
    renderCategories();
    renderGrid("#bestsellerGrid", byPopularity.slice(0, 8));
    renderGrid("#newGrid", byNewest.slice(0, 4));
    renderFeatures();
    renderTestimonials();
    renderStyle();
    startCountdown();
    initNewsletter();
    UI.initReveal();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
