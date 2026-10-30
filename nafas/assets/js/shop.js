/* ==========================================================================
   NAFAS — shop page: filtering, sorting, pagination, URL sync
   ========================================================================== */
(function () {
  "use strict";

  const D = window.NAFAS;
  const S = window.NAFAS_STORE;
  const UI = window.NAFAS_UI;
  const icon = window.svgIcon;
  const qs = UI.qs;
  const qsa = UI.qsa;

  const PAGE_SIZE = 8;

  const state = {
    cats: [],
    maxPrice: 1400000,
    color: null,
    onlySale: false,
    onlyNew: false,
    onlyStock: false,
    sort: "popular",
    q: "",
    tag: null,
    shown: PAGE_SIZE,
  };

  /* ---------- build colour palette ---------- */
  const colors = (() => {
    const map = new Map();
    D.products.forEach((p) =>
      p.colors.forEach((c) => {
        if (!map.has(c.name)) map.set(c.name, c.hex);
      })
    );
    return Array.from(map, ([name, hex]) => ({ name: name, hex: hex }));
  })();

  /* ---------- read URL ---------- */
  function readURL() {
    const params = new URLSearchParams(window.location.search);
    const cat = params.get("cat");
    if (cat) state.cats = cat.split(",").filter(Boolean);
    const tag = params.get("tag");
    if (tag) state.tag = tag;
    const q = params.get("q");
    if (q) state.q = q;
    const sort = params.get("sort");
    if (sort) state.sort = sort;
  }

  function writeURL() {
    const params = new URLSearchParams();
    if (state.cats.length) params.set("cat", state.cats.join(","));
    if (state.tag) params.set("tag", state.tag);
    if (state.q) params.set("q", state.q);
    if (state.sort !== "popular") params.set("sort", state.sort);
    const qsStr = params.toString();
    const url = window.location.pathname + (qsStr ? "?" + qsStr : "");
    window.history.replaceState({}, "", url);
  }

  /* ---------- filter UI ---------- */
  function renderFilterCats() {
    const box = qs("#filterCats");
    if (!box) return;
    box.innerHTML = D.categories
      .map((c) => {
        const count = D.products.filter((p) => p.cat === c.id).length;
        const checked = state.cats.indexOf(c.id) !== -1 ? " checked" : "";
        return (
          '<label class="filter-opt"><input type="checkbox" value="' + c.id + '" data-cat' + checked + " />" +
          UI.esc(c.name) +
          '<span class="filter-opt__count">' + S.fmtNum(count) + "</span></label>"
        );
      })
      .join("");
  }

  function renderFilterColors() {
    const box = qs("#filterColors");
    if (!box) return;
    box.innerHTML = colors
      .map(
        (c) =>
          '<button type="button" class="swatch' + (state.color === c.name ? " is-active" : "") +
          '" data-color="' + UI.esc(c.name) + '" style="background:' + c.hex +
          '" aria-label="' + UI.esc(c.name) + '" title="' + UI.esc(c.name) + '"></button>'
      )
      .join("");
  }

  /* ---------- filtering ---------- */
  function filtered() {
    let list = D.products.slice();

    if (state.cats.length) list = list.filter((p) => state.cats.indexOf(p.cat) !== -1);
    if (state.tag) {
      list = list.filter((p) => {
        if (state.tag === "sale") return Boolean(p.oldPrice);
        return p.tags.indexOf(state.tag) !== -1;
      });
    }
    if (state.q) {
      const q = state.q.toLowerCase();
      list = list.filter((p) =>
        (p.name + " " + p.nameEn + " " + p.short).toLowerCase().indexOf(q) !== -1
      );
    }
    list = list.filter((p) => p.price <= state.maxPrice);
    if (state.color) list = list.filter((p) => p.colors.some((c) => c.name === state.color));
    if (state.onlySale) list = list.filter((p) => Boolean(p.oldPrice));
    if (state.onlyNew) list = list.filter((p) => p.tags.indexOf("new") !== -1);
    if (state.onlyStock) list = list.filter((p) => p.stock > 0);

    switch (state.sort) {
      case "newest":
        list.sort((a, b) => b.added - a.added);
        break;
      case "price-asc":
        list.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        list.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        list.sort((a, b) => b.rating - a.rating);
        break;
      default:
        list.sort((a, b) => b.popularity - a.popularity);
    }
    return list;
  }

  /* ---------- active filter chips ---------- */
  function renderActive() {
    const box = qs("#activeFilters");
    if (!box) return;
    const chips = [];

    state.cats.forEach((id) => {
      const c = S.categoryOf(id);
      if (c) chips.push({ label: c.name, type: "cat", value: id });
    });
    if (state.color) chips.push({ label: "رنگ: " + state.color, type: "color", value: state.color });
    if (state.maxPrice < 1400000)
      chips.push({ label: "تا " + S.money(state.maxPrice) + " تومان", type: "price", value: "" });
    if (state.onlySale) chips.push({ label: "تخفیف‌دار", type: "sale", value: "" });
    if (state.onlyNew) chips.push({ label: "جدید", type: "new", value: "" });
    if (state.onlyStock) chips.push({ label: "موجود", type: "stock", value: "" });
    if (state.q) chips.push({ label: 'جست‌وجو: «' + state.q + '»', type: "q", value: "" });
    if (state.tag) {
      const labels = { new: "تازه رسیده", bestseller: "پرفروش", sale: "تخفیف‌دار" };
      chips.push({ label: labels[state.tag] || state.tag, type: "tag", value: state.tag });
    }

    box.innerHTML = chips
      .map(
        (c) =>
          '<button class="chip-btn is-active" type="button" data-chip-type="' + c.type + '" data-chip-value="' +
          UI.esc(c.value) + '">' + UI.esc(c.label) + '<span class="chip-btn__x">✕</span></button>'
      )
      .join("");
  }

  /* ---------- main render ---------- */
  function render() {
    const list = filtered();
    const grid = qs("#shopGrid");
    const countEl = qs("#resultCount");
    const pill = qs("#shopCountPill");
    const moreWrap = qs("#loadMoreWrap");

    if (countEl) countEl.innerHTML = "<b>" + S.fmtNum(list.length) + "</b> محصول پیدا شد";
    if (pill) pill.textContent = S.fmtNum(list.length) + " محصول";

    const staleEmpty = qs("#shopEmpty");
    if (staleEmpty) staleEmpty.remove();

    if (grid) {
      if (!list.length) {
        grid.innerHTML = "";
        grid.insertAdjacentHTML(
          "afterend",
          '<div class="shop-empty" id="shopEmpty"><p><b>هیچ محصولی با این فیلترها پیدا نشد.</b></p>' +
            '<p class="small" style="margin-top:6px">فیلترها را پاک کن یا دستهٔ دیگری را امتحان کن.</p>' +
            '<button class="btn btn--sm" type="button" data-clear-filters style="margin-top:14px">پاک کردن فیلترها</button></div>'
        );
      } else {
        grid.innerHTML = list
          .slice(0, state.shown)
          .map((p, i) => UI.productCard(p, { delay: Math.min(i, 3) * 60 }))
          .join("");
      }
    }

    if (moreWrap) moreWrap.hidden = list.length <= state.shown;
    renderActive();
    if (window.NAFAS_UI) UI.initReveal();
  }

  /* ---------- page title ---------- */
  function renderHeading() {
    const title = qs("#shopTitle");
    const sub = qs("#shopSubtitle");
    if (!title) return;
    if (state.cats.length === 1) {
      const c = S.categoryOf(state.cats[0]);
      if (c) {
        title.textContent = c.name;
        if (sub) sub.textContent = c.blurb + " — " + c.nameEn;
        document.title = c.name + " | نفس";
      }
    } else if (state.tag) {
      const map = {
        new: ["تازه رسیده‌ها", "جدیدترین قطعه‌هایی که به کالکشن اضافه شده‌اند."],
        bestseller: ["پرفروش‌ترین‌ها", "محصولاتی که بیشتر از همه سفارش داده شده‌اند."],
        sale: ["تخفیف‌دارها", "قیمت ویژه، فقط تا پایان موجودی."],
      };
      const conf = map[state.tag];
      if (conf) {
        title.textContent = conf[0];
        if (sub) sub.textContent = conf[1];
      }
    } else if (state.q) {
      title.textContent = "نتیجهٔ جست‌وجو";
      if (sub) sub.textContent = "برای «" + state.q + "» این محصولات پیدا شد.";
    }
  }

  /* ---------- events ---------- */
  function bind() {
    document.addEventListener("change", (e) => {
      const t = e.target;
      if (t.matches("[data-cat]")) {
        const id = t.value;
        if (t.checked) {
          if (state.cats.indexOf(id) === -1) state.cats.push(id);
        } else {
          state.cats = state.cats.filter((c) => c !== id);
        }
        state.shown = PAGE_SIZE;
        writeURL();
        renderHeading();
        render();
      }
      if (t.id === "onlySale") {
        state.onlySale = t.checked;
        render();
      }
      if (t.id === "onlyNew") {
        state.onlyNew = t.checked;
        render();
      }
      if (t.id === "onlyStock") {
        state.onlyStock = t.checked;
        render();
      }
      if (t.id === "sortSelect") {
        state.sort = t.value;
        state.shown = PAGE_SIZE;
        writeURL();
        render();
      }
    });

    document.addEventListener("input", (e) => {
      if (e.target.id === "priceRange") {
        state.maxPrice = Number(e.target.value);
        const label = qs("#priceRangeValue");
        if (label) label.textContent = S.money(state.maxPrice) + " تومان";
        state.shown = PAGE_SIZE;
        render();
      }
    });

    document.addEventListener("click", (e) => {
      const swatch = e.target.closest("[data-color]");
      if (swatch) {
        const name = swatch.getAttribute("data-color");
        state.color = state.color === name ? null : name;
        state.shown = PAGE_SIZE;
        renderFilterColors();
        render();
        return;
      }

      const chip = e.target.closest("[data-chip-type]");
      if (chip) {
        const type = chip.getAttribute("data-chip-type");
        const value = chip.getAttribute("data-chip-value");
        if (type === "cat") state.cats = state.cats.filter((c) => c !== value);
        if (type === "color") {
          state.color = null;
          renderFilterColors();
        }
        if (type === "price") {
          state.maxPrice = 1400000;
          const range = qs("#priceRange");
          if (range) range.value = 1400000;
          const label = qs("#priceRangeValue");
          if (label) label.textContent = "۱٬۴۰۰٬۰۰۰ تومان";
        }
        if (type === "sale") {
          state.onlySale = false;
          const cb = qs("#onlySale");
          if (cb) cb.checked = false;
        }
        if (type === "new") {
          state.onlyNew = false;
          const cb = qs("#onlyNew");
          if (cb) cb.checked = false;
        }
        if (type === "stock") {
          state.onlyStock = false;
          const cb = qs("#onlyStock");
          if (cb) cb.checked = false;
        }
        if (type === "q") state.q = "";
        if (type === "tag") state.tag = null;
        state.shown = PAGE_SIZE;
        renderFilterCats();
        writeURL();
        renderHeading();
        render();
        return;
      }

      if (e.target.closest("[data-clear-filters]")) {
        state.cats = [];
        state.color = null;
        state.maxPrice = 1400000;
        state.onlySale = state.onlyNew = state.onlyStock = false;
        state.q = "";
        state.tag = null;
        state.shown = PAGE_SIZE;
        ["#onlySale", "#onlyNew", "#onlyStock"].forEach((sel) => {
          const el = qs(sel);
          if (el) el.checked = false;
        });
        const range = qs("#priceRange");
        if (range) range.value = 1400000;
        const label = qs("#priceRangeValue");
        if (label) label.textContent = "۱٬۴۰۰٬۰۰۰ تومان";
        renderFilterCats();
        renderFilterColors();
        writeURL();
        renderHeading();
        render();
        return;
      }

      if (e.target.closest("#loadMore")) {
        state.shown += PAGE_SIZE;
        render();
        return;
      }

      if (e.target.closest("[data-open-filters]")) {
        UI.openLayer(qs("#filters"));
        return;
      }

      if (e.target.closest("[data-close-filters]")) {
        const f = qs("#filters");
        if (f) {
          f.classList.remove("is-open");
          document.body.classList.remove("is-locked");
        }
        return;
      }
    });
  }

  function init() {
    readURL();
    renderFilterCats();
    renderFilterColors();
    bind();

    const sort = qs("#sortSelect");
    if (sort) sort.value = state.sort;

    /* mobile-only bits (visibility of the close button is handled in CSS) */
    qsa("[data-filter-close-icon]").forEach((el) => {
      el.outerHTML = icon("close");
    });
    qsa("[data-filter-icon]").forEach((el) => {
      el.outerHTML = icon("filter");
    });
    const apply = qs("[data-apply-filters]");
    const isMobile = window.matchMedia
      ? window.matchMedia("(max-width: 1023px)").matches
      : window.innerWidth <= 1023;
    if (apply && isMobile) apply.style.display = "flex";

    /* features strip */
    const strip = qs("#featureStrip");
    if (strip) {
      strip.innerHTML = D.features
        .map(
          (f) =>
            '<div class="feature"><span class="feature__icon">' + icon(f.icon) + "</span>" +
            "<div><h3>" + UI.esc(f.title) + "</h3><p>" + UI.esc(f.text) + "</p></div></div>"
        )
        .join("");
    }

    renderHeading();
    render();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
