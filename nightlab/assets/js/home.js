/* ==========================================================================
   NIGHTLAB — home page
   ========================================================================== */
(function () {
  const STAR = window.STAR;
  const Store = window.Store;
  const UI = window.UI;
  const icon = window.icon;
  const money = STAR.money;

  UI.mountChrome();

  /* ---------------- categories ---------------- */
  const catsWrap = document.querySelector("[data-cats]");
  if (catsWrap) {
    catsWrap.innerHTML = STAR.categories
      .map((c) => {
        const count = STAR.products.filter((p) => p.cat === c.id).length;
        return (
          '<a class="cat" href="shop.html?cat=' + c.id + '" style="--cat-glow:' + c.glow + '" data-reveal>' +
          '<span class="cat__count mono">' + money(count) + "</span>" +
          '<span class="cat__icon">' + icon(c.icon) + "</span>" +
          '<span class="cat__body"><h3>' + c.name + "</h3><span>" + c.en + "</span>" +
          '<span class="small muted" style="display:block;margin-top:6px;font-family:var(--font-fa);letter-spacing:0">' + c.blurb + "</span></span></a>"
        );
      })
      .join("");
  }

  /* ---------------- bestsellers ---------------- */
  const best = document.querySelector("[data-bestsellers]");
  if (best) {
    best.innerHTML = STAR.products
      .filter((p) => p.tags.includes("bestseller"))
      .concat(STAR.products.filter((p) => !p.tags.includes("bestseller")))
      .slice(0, 4)
      .map((p, i) => UI.productCard(p, { delay: i * 70 }))
      .join("");
  }

  /* ---------------- new arrivals ---------------- */
  const fresh = document.querySelector("[data-new]");
  if (fresh) {
    fresh.innerHTML = STAR.products
      .slice()
      .sort((a, b) => (b.tags.includes("new") ? 1 : 0) - (a.tags.includes("new") ? 1 : 0))
      .slice(0, 4)
      .map((p) => UI.productCard(p))
      .join("");
  }

  /* ---------------- quotes ---------------- */
  const quotes = document.querySelector("[data-quotes]");
  if (quotes) {
    quotes.innerHTML = STAR.reviewsPool
      .slice(0, 3)
      .map(
        (r) =>
          '<article class="quote" data-reveal><p>«' + r.text + '»</p>' +
          '<div class="quote__foot"><span class="avatar">' + r.name.charAt(0) + "</span>" +
          "<span><span class=\"quote__name\">" + r.name + "</span>" +
          '<span class="quote__role">خرید تأییدشده · ' + "۱۸+" + "</span></span>" +
          '<span class="quote__stars" style="margin-inline-start:auto">' + icon("star").repeat(r.stars) + "</span></div></article>"
      )
      .join("");
  }

  /* ---------------- kit builder ---------------- */
  const kitGrid = document.querySelector("[data-kit-grid]");
  if (kitGrid) {
    const pool = STAR.products.slice(0, 6);
    const chosen = new Set();

    const paint = () => {
      kitGrid.innerHTML = pool
        .map(
          (p) =>
            '<button type="button" class="kit__item' + (chosen.has(p.slug) ? " is-on" : "") + '" data-kit="' + p.slug + '" aria-pressed="' + chosen.has(p.slug) + '">' +
            '<span class="kit__thumb">' + STAR.art(p) + "</span>" +
            "<span><b>" + p.name + "</b><span>" + p.code + " · " + money(p.price) + "</span></span>" +
            '<span class="kit__check">' + icon("check") + "</span></button>"
        )
        .join("");

      const items = pool.filter((p) => chosen.has(p.slug));
      const sub = items.reduce((n, p) => n + p.price, 0);
      const off = chosen.size >= 3 ? Math.round(sub * 0.15) : 0;
      const total = sub - off;

      document.querySelector("[data-kit-count]").textContent = money(chosen.size);
      document.querySelector("[data-kit-sub]").textContent = sub ? money(sub) + " تومان" : "—";
      document.querySelector("[data-kit-off]").textContent = off ? "−" + money(off) + " تومان" : "۳ قلم انتخاب کن";
      document.querySelector("[data-kit-total]").textContent = total ? money(total) + " تومان" : "—";

      const btn = document.querySelector("[data-kit-add]");
      btn.disabled = chosen.size === 0;
      btn.firstChild.textContent = chosen.size >= 3 ? "افزودن کیت با ۱۵٪ تخفیف " : "افزودن کیت به سبد ";
    };

    kitGrid.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-kit]");
      if (!btn) return;
      const slug = btn.dataset.kit;
      if (chosen.has(slug)) chosen.delete(slug);
      else if (chosen.size >= 5) {
        UI.toast("بیشتر از ۵ قلم در یک کیت جا نمی‌شود", "error");
        return;
      } else chosen.add(slug);
      paint();
    });

    document.querySelector("[data-kit-add]").addEventListener("click", () => {
      if (!chosen.size) return;
      chosen.forEach((slug) => Store.addToCart(slug, 0, 1));
      if (chosen.size >= 3) {
        const res = Store.applyCoupon("KIT15");
        UI.toast(res.ok ? "کیت با ۱۵٪ تخفیف به سبد اضافه شد" : "کیت به سبد اضافه شد");
      } else {
        UI.toast("کیت به سبد اضافه شد — با ۳ قلم، ۱۵٪ تخفیف فعال می‌شود");
      }
      UI.openDrawer();
    });

    paint();
  }

  /* ---------------- newsletter ---------------- */
  const news = document.querySelector("[data-newsletter]");
  if (news) {
    news.addEventListener("submit", (e) => {
      e.preventDefault();
      const input = news.querySelector("input");
      const ok = /^[^@\s]+@[^@\s]+\.[a-z]{2,}$/i.test(input.value.trim());
      if (!ok) {
        UI.toast("ایمیل را درست وارد کن", "error");
        input.focus();
        return;
      }
      try {
        localStorage.setItem("nightlab.news.v1", input.value.trim());
      } catch (err) {}
      input.value = "";
      UI.toast("ثبت شد. اولین ایمیل آخر همین ماه می‌رسد.");
    });
  }

  UI.observeReveals();
})();
