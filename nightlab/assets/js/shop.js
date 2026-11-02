/* ==========================================================================
   NIGHTLAB — shop: filters, sorting, URL sync, load more
   ========================================================================== */
(function () {
  const STAR = window.STAR;
  const UI = window.UI;
  const icon = window.icon;
  const money = STAR.money;

  UI.mountChrome();

  const grid = document.querySelector("[data-grid]");
  const countEl = document.querySelector("[data-count]");
  const emptyEl = document.querySelector("[data-empty]");
  const chipsEl = document.querySelector("[data-chips]");
  const moreBtn = document.querySelector("[data-more]");
  const sortEl = document.querySelector("[data-sort]");
  const rangeEl = document.querySelector("[data-filter-price]");
  const priceLabel = document.querySelector("[data-price-label]");
  const filters = document.getElementById("filters");

  const MAX_PRICE = 3000000;
  const state = {
    cat: "all",
    max: MAX_PRICE,
    sale: false,
    instock: false,
    isNew: false,
  };
  let visible = 8;

  /* ---------------- filter UI ---------------- */
  const catWrap = document.querySelector("[data-filter-cats]");
  catWrap.innerHTML =
    '<label><input type="radio" name="cat" value="all" checked /> همهٔ محصولات <small>' + money(STAR.products.length) + "</small></label>" +
    STAR.categories
      .map((c) => {
        const n = STAR.products.filter((p) => p.cat === c.id).length;
        return '<label><input type="radio" name="cat" value="' + c.id + '" /> ' + c.name + " <small>" + money(n) + "</small></label>";
      })
      .join("");

  document.querySelector("[data-count-sale]").textContent = money(STAR.products.filter((p) => p.oldPrice).length);
  document.querySelector("[data-count-stock]").textContent = money(STAR.products.filter((p) => p.stock > 0).length);
  document.querySelector("[data-count-new]").textContent = money(STAR.products.filter((p) => p.tags.includes("new")).length);

  /* ---------------- URL in ---------------- */
  const params = new URLSearchParams(location.search);
  if (params.get("cat")) {
    const input = catWrap.querySelector('input[value="' + params.get("cat") + '"]');
    if (input) input.checked = true;
  }
  if (params.get("tag") === "sale") {
    state.sale = true;
    document.querySelector('[data-filter="sale"]').checked = true;
  }
  if (params.get("tag") === "new") {
    state.isNew = true;
    document.querySelector('[data-filter="new"]').checked = true;
  }
  if (params.get("sort")) sortEl.value = params.get("sort");

  /* ---------------- core ---------------- */
  function active() {
    return STAR.products.filter((p) => {
      if (state.cat !== "all" && p.cat !== state.cat) return false;
      if (p.price > state.max) return false;
      if (state.sale && !p.oldPrice) return false;
      if (state.instock && p.stock <= 0) return false;
      if (state.isNew && !p.tags.includes("new")) return false;
      return true;
    });
  }

  function sorted(list) {
    const l = list.slice();
    switch (sortEl.value) {
      case "price-asc":
        return l.sort((a, b) => a.price - b.price);
      case "price-desc":
        return l.sort((a, b) => b.price - a.price);
      case "rating":
        return l.sort((a, b) => b.rating - a.rating);
      case "new":
        return l.sort((a, b) => (b.tags.includes("new") ? 1 : 0) - (a.tags.includes("new") ? 1 : 0));
      default:
        return l.sort((a, b) => b.reviews - a.reviews);
    }
  }

  function chip(label, key) {
    return (
      '<button class="chip-btn" type="button" data-chip="' + key + '">' + label + icon("close") + "</button>"
    );
  }

  function renderChips() {
    const out = [];
    if (state.cat !== "all") out.push(chip(STAR.catName(state.cat), "cat"));
    if (state.max < MAX_PRICE) out.push(chip("تا " + money(state.max) + " تومان", "max"));
    if (state.sale) out.push(chip("تخفیف‌دار", "sale"));
    if (state.instock) out.push(chip("موجود", "instock"));
    if (state.isNew) out.push(chip("تازه‌ها", "new"));
    chipsEl.innerHTML = out.join("");
  }

  function syncURL() {
    const q = new URLSearchParams();
    if (state.cat !== "all") q.set("cat", state.cat);
    if (state.max < MAX_PRICE) q.set("max", state.max);
    if (state.sale) q.set("tag", "sale");
    if (state.isNew) q.set("tag", "new");
    if (sortEl.value !== "popular") q.set("sort", sortEl.value);
    const qs = q.toString();
    history.replaceState(null, "", qs ? "?" + qs : location.pathname);
  }

  function render() {
    const list = sorted(active());
    countEl.textContent = money(list.length);
    const pageItems = list.slice(0, visible);
    grid.innerHTML = pageItems.map((p, i) => UI.productCard(p, { delay: i * 40 })).join("");
    emptyEl.hidden = list.length > 0;
    moreBtn.hidden = list.length <= visible;
    renderChips();
    syncURL();
    UI.observeReveals(grid);
  }

  /* ---------------- events ---------------- */
  catWrap.addEventListener("change", (e) => {
    if (e.target.name !== "cat") return;
    state.cat = e.target.value;
    visible = 8;
    render();
  });

  rangeEl.addEventListener("input", () => {
    state.max = Number(rangeEl.value);
    priceLabel.textContent = money(state.max) + " تومان";
    visible = 8;
    render();
  });

  document.querySelectorAll("[data-filter]").forEach((input) => {
    input.addEventListener("change", () => {
      const key = input.dataset.filter;
      if (key === "sale") state.sale = input.checked;
      if (key === "instock") state.instock = input.checked;
      if (key === "new") state.isNew = input.checked;
      visible = 8;
      render();
    });
  });

  sortEl.addEventListener("change", render);

  chipsEl.addEventListener("click", (e) => {
    const b = e.target.closest("[data-chip]");
    if (!b) return;
    const key = b.dataset.chip;
    if (key === "cat") {
      state.cat = "all";
      catWrap.querySelector('input[value="all"]').checked = true;
    }
    if (key === "max") {
      state.max = MAX_PRICE;
      rangeEl.value = MAX_PRICE;
      priceLabel.textContent = money(MAX_PRICE) + " تومان";
    }
    if (key === "sale") {
      state.sale = false;
      document.querySelector('[data-filter="sale"]').checked = false;
    }
    if (key === "instock") {
      state.instock = false;
      document.querySelector('[data-filter="instock"]').checked = false;
    }
    if (key === "new") {
      state.isNew = false;
      document.querySelector('[data-filter="new"]').checked = false;
    }
    render();
  });

  document.querySelectorAll("[data-reset]").forEach((btn) =>
    btn.addEventListener("click", () => {
      state.cat = "all";
      state.max = MAX_PRICE;
      state.sale = state.instock = state.isNew = false;
      visible = 8;
      catWrap.querySelector('input[value="all"]').checked = true;
      document.querySelectorAll("[data-filter]").forEach((i) => (i.checked = false));
      rangeEl.value = MAX_PRICE;
      priceLabel.textContent = money(MAX_PRICE) + " تومان";
      sortEl.value = "popular";
      render();
    })
  );

  moreBtn.addEventListener("click", () => {
    visible += 4;
    render();
    UI.toast("۴ محصول دیگر نمایش داده شد");
  });

  document.querySelectorAll("[data-open-filters]").forEach((b) =>
    b.addEventListener("click", () => filters.classList.add("is-open"))
  );
  document.querySelectorAll("[data-close-filters]").forEach((b) =>
    b.addEventListener("click", () => filters.classList.remove("is-open"))
  );

  /* ---------------- boot ---------------- */
  state.max = Number(rangeEl.value) || MAX_PRICE;
  priceLabel.textContent = money(state.max) + " تومان";
  render();
  UI.observeReveals();
})();
