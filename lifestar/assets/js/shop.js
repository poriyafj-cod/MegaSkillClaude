/* ==========================================================================
   LIFE STAR — shop page: filters, sorting, URL sync
   ========================================================================== */
(function () {
  const STAR = window.STAR;
  const UI = window.UI;
  const icon = window.icon;
  const money = STAR.money;

  UI.mountChrome();

  const grid = document.querySelector("[data-grid]");
  const countEl = document.querySelector("[data-count]");
  const chipWrap = document.querySelector("[data-chips]");
  const catWrap = document.querySelector("[data-filter-cats]");
  const sortSel = document.querySelector("[data-sort]");
  const priceRange = document.querySelector("[data-price]");
  const priceLabel = document.querySelector("[data-price-label]");
  const zeroOnly = document.querySelector("[data-zero]");
  const stockOnly = document.querySelector("[data-stock]");
  const saleOnly = document.querySelector("[data-sale]");
  const loadWrap = document.querySelector("[data-load-wrap]");
  const loadBtn = document.querySelector("[data-load]");
  const titleEl = document.querySelector("[data-title]");
  const subEl = document.querySelector("[data-sub]");
  const filters = document.querySelector("[data-filters]");

  const MAX_PRICE = 80000;
  const state = { cat: "all", tag: "all", q: "", sort: "popular", price: MAX_PRICE, zero: false, stock: false, sale: false, shown: 8 };

  /* ---------- read url ---------- */
  const params = new URLSearchParams(location.search);
  if (params.get("cat")) state.cat = params.get("cat");
  if (params.get("tag")) state.tag = params.get("tag");
  if (params.get("q")) state.q = params.get("q");
  if (params.get("sort")) state.sort = params.get("sort");
  if (params.get("zero") === "1") state.zero = true;
  if (params.get("sale") === "1") state.sale = true;

  /* ---------- build category filter ---------- */
  if (catWrap) {
    catWrap.innerHTML =
      '<label class="filter-opt"><input type="radio" name="cat" value="all"' + (state.cat === "all" ? " checked" : "") + " /> همهٔ نوشیدنی‌ها" +
      '<span class="filter-opt__count">' + STAR.products.length + "</span></label>" +
      STAR.categories
        .map((c) => {
          const n = STAR.products.filter((p) => p.cat === c.id).length;
          return (
            '<label class="filter-opt"><input type="radio" name="cat" value="' + c.id + '"' + (state.cat === c.id ? " checked" : "") + " />" +
            c.name + '<span class="filter-opt__count">' + n + "</span></label>"
          );
        })
        .join("");
  }

  if (priceRange) {
    priceRange.min = 60000;
    priceRange.max = MAX_PRICE;
    priceRange.step = 1000;
    priceRange.value = state.price;
    priceLabel.textContent = "تا " + money(state.price) + " تومان";
  }

  if (sortSel) sortSel.value = state.sort;
  if (zeroOnly) zeroOnly.checked = state.zero;
  if (saleOnly) saleOnly.checked = state.sale;

  /* ---------- filtering ---------- */
  function filtered() {
    let list = STAR.products.slice();
    if (state.cat !== "all") list = list.filter((p) => p.cat === state.cat);
    if (state.tag !== "all") list = list.filter((p) => p.tags.includes(state.tag));
    if (state.q) {
      const q = state.q.toLowerCase();
      list = list.filter((p) => (p.name + " " + p.nameEn + " " + p.notes.join(" ")).toLowerCase().includes(q));
    }
    if (state.zero) list = list.filter((p) => p.sugar === 0);
    if (state.stock) list = list.filter((p) => p.stock > 0);
    if (state.sale) list = list.filter((p) => p.tags.includes("sale"));
    list = list.filter((p) => p.price <= state.price);

    const sorters = {
      popular: (a, b) => b.rating * b.reviews - a.rating * a.reviews,
      newest: (a, b) => (b.tags.includes("new") ? 1 : 0) - (a.tags.includes("new") ? 1 : 0),
      "price-asc": (a, b) => a.price - b.price,
      "price-desc": (a, b) => b.price - a.price,
      caffeine: (a, b) => b.caffeine - a.caffeine,
    };
    return list.sort(sorters[state.sort] || sorters.popular);
  }

  /* ---------- url ---------- */
  function syncUrl() {
    const p = new URLSearchParams();
    if (state.cat !== "all") p.set("cat", state.cat);
    if (state.tag !== "all") p.set("tag", state.tag);
    if (state.q) p.set("q", state.q);
    if (state.sort !== "popular") p.set("sort", state.sort);
    if (state.zero) p.set("zero", "1");
    if (state.sale) p.set("sale", "1");
    const url = location.pathname + (p.toString() ? "?" + p.toString() : "");
    history.replaceState(null, "", url);
  }

  /* ---------- chips ---------- */
  function chips() {
    const out = [];
    if (state.cat !== "all") out.push({ key: "cat", label: STAR.catName(state.cat) });
    if (state.tag !== "all") {
      const labels = { new: "تازه رسیده", bestseller: "پرفروش", sale: "تخفیف‌دار" };
      out.push({ key: "tag", label: labels[state.tag] || state.tag });
    }
    if (state.q) out.push({ key: "q", label: "«" + state.q + "»" });
    if (state.zero) out.push({ key: "zero", label: "زیرو شکر" });
    if (state.sale) out.push({ key: "sale", label: "فقط تخفیف‌دار" });
    if (state.price < MAX_PRICE) out.push({ key: "price", label: "تا " + money(state.price) + " تومان" });

    chipWrap.innerHTML =
      out
        .map((c) => '<button class="chip-btn" type="button" data-chip="' + c.key + '">' + c.label + icon("close") + "</button>")
        .join("") +
      (out.length ? '<button class="chip-btn" type="button" data-clear>پاک کردن همه</button>' : "");
  }

  /* ---------- render ---------- */
  function render() {
    const list = filtered();
    const shown = list.slice(0, state.shown);

    if (!list.length) {
      grid.innerHTML =
        '<div class="empty-state" style="grid-column:1/-1">' + icon("search") +
        "<h3 class='h-3' style='margin-bottom:6px'>چیزی با این فیلترها پیدا نشد</h3>" +
        '<p class="muted small">فیلترها را ساده‌تر کن یا از دکمهٔ «پاک کردن همه» استفاده کن.</p></div>';
    } else {
      grid.innerHTML = shown.map((p) => UI.productCard(p)).join("");
    }

    countEl.innerHTML = "<strong>" + list.length + "</strong> نوشیدنی پیدا شد";
    loadWrap.hidden = list.length <= state.shown;
    chips();
    syncUrl();

    if (titleEl) {
      const map = { all: "همهٔ نوشیدنی‌های انرژی", zero: "کالکشن زیرو شکر", coffee: "کافئین غلیظ", recovery: "بازیابی و الکترولیت", classic: "انرژی کلاسیک" };
      titleEl.textContent = map[state.cat] || "همهٔ نوشیدنی‌ها";
    }
    if (subEl) {
      subEl.textContent =
        state.cat === "zero"
          ? "صفر شکر، کافئین واقعی. برای کسانی که کالری را می‌شمارند."
          : "از گیلاس ترش تا کارامل کافی — طعمت را انتخاب کن و پک ببند.";
    }
  }

  /* ---------- events ---------- */
  document.addEventListener("change", (e) => {
    const t = e.target;
    if (t.name === "cat") {
      state.cat = t.value;
      state.shown = 8;
      render();
    } else if (t === sortSel) {
      state.sort = t.value;
      render();
    } else if (t === zeroOnly) {
      state.zero = t.checked;
      render();
    } else if (t === stockOnly) {
      state.stock = t.checked;
      render();
    } else if (t === saleOnly) {
      state.sale = t.checked;
      render();
    }
  });

  if (priceRange) {
    priceRange.addEventListener("input", () => {
      state.price = Number(priceRange.value);
      priceLabel.textContent = "تا " + money(state.price) + " تومان";
      state.shown = 8;
      render();
    });
  }

  chipWrap.addEventListener("click", (e) => {
    const chip = e.target.closest("[data-chip]");
    if (e.target.closest("[data-clear]")) {
      state.cat = "all";
      state.tag = "all";
      state.q = "";
      state.zero = false;
      state.sale = false;
      state.stock = false;
      state.price = MAX_PRICE;
      if (priceRange) priceRange.value = MAX_PRICE;
      if (priceLabel) priceLabel.textContent = "تا " + money(MAX_PRICE) + " تومان";
      document.querySelectorAll('input[name="cat"]').forEach((r) => (r.checked = r.value === "all"));
      if (zeroOnly) zeroOnly.checked = false;
      if (saleOnly) saleOnly.checked = false;
      if (stockOnly) stockOnly.checked = false;
      render();
      return;
    }
    if (!chip) return;
    const key = chip.dataset.chip;
    if (key === "cat") {
      state.cat = "all";
      document.querySelectorAll('input[name="cat"]').forEach((r) => (r.checked = r.value === "all"));
    }
    if (key === "tag") state.tag = "all";
    if (key === "q") state.q = "";
    if (key === "zero") {
      state.zero = false;
      if (zeroOnly) zeroOnly.checked = false;
    }
    if (key === "sale") {
      state.sale = false;
      if (saleOnly) saleOnly.checked = false;
    }
    if (key === "price") {
      state.price = MAX_PRICE;
      if (priceRange) priceRange.value = MAX_PRICE;
      if (priceLabel) priceLabel.textContent = "تا " + money(MAX_PRICE) + " تومان";
    }
    render();
  });

  if (loadBtn) {
    loadBtn.addEventListener("click", () => {
      state.shown += 4;
      render();
    });
  }

  /* mobile filter drawer */
  document.addEventListener("click", (e) => {
    if (e.target.closest("[data-open-filters]")) filters.classList.add("is-open");
    if (e.target.closest("[data-close-filters]")) filters.classList.remove("is-open");
  });

  render();
  UI.observeReveals();
})();
