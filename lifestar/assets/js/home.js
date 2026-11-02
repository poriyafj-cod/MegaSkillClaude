/* ==========================================================================
   LIFE STAR — home page
   ========================================================================== */
(function () {
  const STAR = window.STAR;
  const Store = window.Store;
  const UI = window.UI;
  const icon = window.icon;
  const money = STAR.money;

  UI.mountChrome();

  /* ---------- hero can + price card ---------- */
  const heroCan = document.querySelector("[data-hero-can]");
  const hero = STAR.products[0];
  if (heroCan) heroCan.innerHTML = STAR.canSvg(hero);

  const heroCard = document.querySelector("[data-hero-card]");
  if (heroCard) {
    heroCard.innerHTML =
      '<strong>' + hero.name + " — " + hero.nameEn + "</strong>" +
      '<span class="price" style="margin-top:4px"><span class="price__now">' + money(hero.price) + " <small>تومان</small></span></span>" +
      '<span>' + hero.caffeine + "mg کافئین · " + hero.volume + "ml</span>";
  }

  /* ---------- categories ---------- */
  const catRail = document.querySelector("[data-cats]");
  if (catRail) {
    catRail.innerHTML = STAR.categories
      .map((c) => {
        const count = STAR.products.filter((p) => p.cat === c.id).length;
        return (
          '<a class="cat" href="shop.html?cat=' + c.id + '" style="--cat-glow:' + c.glow + '" data-reveal>' +
          '<div class="cat__top"><span class="cat__count">' + count + " محصول</span>" +
          '<span class="cat__icon">' + icon(c.icon) + "</span></div>" +
          '<div><div class="cat__name">' + c.name + '</div><div class="cat__en">' + c.en + "</div></div></a>"
        );
      })
      .join("");
  }

  /* ---------- bestsellers / new ---------- */
  const best = document.querySelector("[data-bestsellers]");
  if (best) {
    best.innerHTML = STAR.products
      .filter((p) => p.tags.includes("bestseller"))
      .concat(STAR.products.filter((p) => !p.tags.includes("bestseller")))
      .slice(0, 4)
      .map((p, i) => UI.productCard(p, { delay: i * 60 }))
      .join("");
  }

  const fresh = document.querySelector("[data-new]");
  if (fresh) {
    fresh.innerHTML = STAR.products
      .slice()
      .sort((a, b) => (b.tags.includes("new") ? 1 : 0) - (a.tags.includes("new") ? 1 : 0))
      .slice(0, 4)
      .map((p) => UI.productCard(p))
      .join("");
  }

  /* ---------- hero mini gallery of sport shots ---------- */
  const shots = document.querySelector("[data-shots]");
  if (shots) {
    const data = [
      { src: "assets/img/sport/boxer-hero.jpg", label: "BOXING · 05:40 AM", cls: "look--tall" },
      { src: "assets/img/sport/gym-lights.jpg", label: "IRON · TEHRAN", cls: "look--wide" },
      { src: "assets/img/sport/dumbbells-25.jpg", label: "STRENGTH · 25LB" },
      { src: "assets/img/sport/punching-bag.jpg", label: "ROUND 03" },
      { src: "assets/img/sport/gym-bench.jpg", label: "NIGHT SHIFT", cls: "look--tall" },
      { src: "assets/img/sport/boxer-stance.jpg", label: "STANCE" },
      { src: "assets/img/sport/boxer-portrait.jpg", label: "RECOVERY" },
    ];
    shots.innerHTML = data
      .map(
        (s) =>
          '<figure class="look ' + (s.cls || "") + '" data-reveal>' +
          '<img src="' + s.src + '" alt="' + s.label + '" loading="lazy" />' +
          '<figcaption class="look__label">' + s.label + "</figcaption></figure>"
      )
      .join("");
  }

  /* ---------- testimonials ---------- */
  const quotes = document.querySelector("[data-quotes]");
  if (quotes) {
    const people = [
      { name: "نیما راد", role: "بوکسور، ۶ سال تمرین", text: "قبل از اسپارینگ گیلاس ترش می‌خورم؛ دقیقاً همون بیدی هست که لازم دارم بدون اینکه سنگین شم.", initial: "ن" },
      { name: "سارا محبی", role: "مربی فیتنس", text: "برای شاگردهام پک ۲۴تایی می‌گیرم. زیرو انگور محبوب‌ترینه چون کالری نداره و طعمش واقعیه.", initial: "س" },
      { name: "آرش کاویانی", role: "دوچرخه‌سوار کوهستان", text: "نمک و لیمو بعد از مسیرهای طولانی معجزه می‌کنه؛ الکترولیتش واقعاً حس می‌شه.", initial: "آ" },
    ];
    quotes.innerHTML = people
      .map(
        (p) =>
          '<figure class="quote" data-reveal>' +
          '<div class="quote__stars">' + icon("star").repeat(5) + "</div>" +
          "<p>«" + p.text + "»</p>" +
          '<figcaption class="quote__by"><span class="avatar">' + p.initial + "</span>" +
          "<span><strong>" + p.name + "</strong><span>" + p.role + "</span></span></figcaption></figure>"
      )
      .join("");
  }

  /* ---------- pack builder ---------- */
  const packBox = document.querySelector("[data-pack]");
  if (packBox) {
    const tierWrap = packBox.querySelector("[data-tiers]");
    const priceEl = packBox.querySelector("[data-pack-price]");
    const noteEl = packBox.querySelector("[data-pack-note]");
    const cta = packBox.querySelector("[data-pack-cta]");
    const cans = packBox.querySelector("[data-pack-cans]");
    const base = STAR.products[0];
    let tier = 1;

    tierWrap.innerHTML = STAR.packTiers
      .map(
        (t, i) =>
          '<button class="tier' + (i === 1 ? " is-active" : "") + '" type="button" data-tier="' + i + '">' +
          "<strong>" + t.label + "</strong><span>" + (t.off ? "٪" + t.off + " تخفیف" : "قیمت پایه") + "</span></button>"
      )
      .join("");

    const renderCans = (n) => {
      const count = n >= 2 ? 3 : 1;
      cans.innerHTML = new Array(count).fill(0).map(() => STAR.canSvg(base, { label: false })).join("");
    };

    const update = () => {
      const pr = STAR.priceFor(base, tier);
      priceEl.textContent = money(pr.total);
      noteEl.textContent =
        pr.off > 0
          ? "هر قوطی " + money(pr.unit) + " تومان — " + pr.off + "٪ ارزان‌تر از خرید تکی"
          : "قیمت تک‌قوطی، بدون تعهد";
      renderCans(STAR.packTiers[tier].size);
      cta.dataset.add = base.slug;
      cta.dataset.pack = String(tier);
    };

    tierWrap.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-tier]");
      if (!btn) return;
      tier = Number(btn.dataset.tier);
      tierWrap.querySelectorAll(".tier").forEach((t) => t.classList.toggle("is-active", t === btn));
      update();
    });

    cta.addEventListener("click", (e) => {
      e.preventDefault();
      const p = Store.addToCart(base.slug, tier, 1);
      if (p) {
        UI.toast(p.name + " — " + STAR.packTiers[tier].label + " به سبد اضافه شد");
        UI.openDrawer();
      }
    });

    update();
  }

  /* ---------- countdown ---------- */
  const cd = document.querySelector("[data-countdown]");
  if (cd) {
    const target = new Date();
    target.setHours(target.getHours() + 29, 40, 0, 0);
    UI.countdown(cd, target.getTime());
  }

  /* ---------- newsletter ---------- */
  const news = document.querySelector("[data-newsletter]");
  if (news) {
    news.addEventListener("submit", (e) => {
      e.preventDefault();
      const input = news.querySelector("input[type=email]");
      if (!input || !input.value.includes("@")) {
        UI.toast("یک ایمیل معتبر وارد کن", "error");
        return;
      }
      UI.toast("ثبت شد! کد تخفیف اولین خرید: STAR10");
      news.reset();
    });
  }

  /* ---------- caffeine compare ---------- */
  const compare = document.querySelector("[data-compare]");
  if (compare) {
    const rows = [
      { label: "لایف استار (گیلاس)", value: 150, max: 240, cls: "" },
      { label: "قهوهٔ اسپرسو دوبل", value: 128, max: 240, cls: "nutri__fill--ice" },
      { label: "چای پررنگ", value: 60, max: 240, cls: "nutri__fill--volt" },
      { label: "نوشابهٔ کولا", value: 34, max: 240, cls: "" },
    ];
    compare.innerHTML = rows
      .map(
        (r) =>
          '<div class="nutri__row"><span class="muted">' + r.label + "</span>" +
          '<span class="nutri__bar"><span class="nutri__fill ' + r.cls + '" style="--w:' + (r.value / r.max) * 100 + '%"></span></span>' +
          "<strong>" + r.value + "mg</strong></div>"
      )
      .join("");
  }

  UI.observeReveals();

  window.addEventListener("star:change", () => {
    document.querySelectorAll(".pc__wish").forEach((b) => {
      const on = Store.inWish(b.dataset.wish);
      b.classList.toggle("is-active", on);
      b.setAttribute("aria-pressed", String(on));
    });
  });
})();
