/* ==========================================================================
   NIGHTLAB — wishlist page
   ========================================================================== */
(function () {
  const STAR = window.STAR;
  const Store = window.Store;
  const UI = window.UI;
  const icon = window.icon;

  UI.mountChrome();

  const grid = document.querySelector("[data-wish-grid]");
  const countEl = document.querySelector("[data-wish-count-label]");
  const bulk = document.querySelector("[data-wish-bulk]");

  function render() {
    const slugs = Store.wishList();
    const items = slugs.map((s) => STAR.bySlug(s)).filter(Boolean);
    countEl.textContent = items.length + " قلم";

    if (!items.length) {
      grid.innerHTML =
        '<div class="empty-state" style="grid-column:1/-1">' + icon("heart") +
        "<h2 class='h-3' style=\"margin:10px 0 6px\">هنوز چیزی ذخیره نکردی</h2>" +
        '<p class="muted small" style="margin-bottom:18px">روی قلب کنار هر محصول بزن تا بعداً راحت پیدایش کنی — هیچ‌کس جز تو این فهرست را نمی‌بیند.</p>' +
        '<a class="btn" href="shop.html">دیدن محصولات ' + icon("arrowLeft") + "</a></div>";
      bulk.hidden = true;
      return;
    }

    bulk.hidden = false;
    grid.innerHTML = items.map((p) => UI.productCard(p)).join("");
  }

  bulk.addEventListener("click", () => {
    const slugs = Store.wishList();
    slugs.forEach((s) => Store.addToCart(s, 0, 1));
    UI.toast(slugs.length + " قلم به سبد اضافه شد");
    UI.openDrawer();
  });

  window.addEventListener("lab:change", render);
  render();
  UI.observeReveals();
})();
