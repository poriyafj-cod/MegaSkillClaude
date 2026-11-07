/* ==========================================================================
   NAFAS — wishlist page
   ========================================================================== */
(function () {
  "use strict";

  const S = window.NAFAS_STORE;
  const UI = window.NAFAS_UI;
  const qs = UI.qs;

  function render() {
    const items = S.wishItems();
    const grid = qs("#wishGrid");
    const empty = qs("#wishEmpty");
    const pill = qs("#wishCount");

    if (pill) pill.textContent = S.fmtNum(items.length) + " محصول";

    if (!items.length) {
      if (empty) empty.hidden = false;
      if (grid) grid.innerHTML = "";
      return;
    }

    if (empty) empty.hidden = true;
    if (grid) {
      grid.innerHTML = items.map((p, i) => UI.productCard(p, { delay: Math.min(i, 3) * 60 })).join("");
      UI.initReveal();
    }
  }

  function init() {
    render();
    document.addEventListener("nafas:change", (e) => {
      if (e.detail && e.detail.type === "wish") render();
    });

    const form = qs("[data-newsletter]");
    if (form) {
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        const input = form.querySelector("input");
        const value = input ? input.value.trim() : "";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value)) {
          UI.toast("یه ایمیل درست بنویس", "error");
          return;
        }
        form.reset();
        UI.toast("ثبت شد! کد تخفیف NAFAS10 برات فعال شد");
      });
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
