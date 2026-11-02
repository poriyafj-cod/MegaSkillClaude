/* ==========================================================================
   NIGHTLAB — cart & 3-step checkout
   ========================================================================== */
(function () {
  const STAR = window.STAR;
  const Store = window.Store;
  const UI = window.UI;
  const icon = window.icon;
  const money = STAR.money;

  UI.mountChrome();

  const wrap = document.querySelector("[data-cart]");
  const summary = document.querySelector("[data-summary]");
  const stepsWrap = document.querySelector("[data-steps]");
  const form = document.querySelector("[data-form]");
  const payWrap = document.querySelector("[data-pays]");
  const successBox = document.querySelector("[data-success]");
  const checkoutBar = document.querySelector("[data-checkout]");

  let step = 1;
  let payment = "online";

  const STEPS = ["سبد خرید", "اطلاعات تحویل", "پرداخت و ثبت"];

  /* ---------- steps indicator ---------- */
  function renderSteps() {
    stepsWrap.innerHTML = STEPS.map((label, i) => {
      const n = i + 1;
      const cls = n === step ? "is-active" : n < step ? "is-done" : "";
      return (
        (i ? '<span class="step__line"></span>' : "") +
        '<span class="step ' + cls + '"><span class="step__num">' + (n < step ? "✓" : n) + "</span>" + label + "</span>"
      );
    }).join("");
  }

  /* ---------- line items ---------- */
  function renderItems() {
    const items = Store.cartItems();
    if (!items.length) {
      wrap.innerHTML =
        '<div class="empty-state">' + icon("cart") +
        '<h2 class="h-3" style="margin:8px 0">سبد خریدت خالیه</h2>' +
        '<p class="muted small" style="margin-bottom:16px">از کالکشن یکی انتخاب کن — همه با بسته‌بندی بی‌نام می‌رسند.</p>' +
        '<a class="btn btn--yellow btn--sm" href="shop.html">دیدن محصولات ' + icon("arrowLeft") + "</a></div>";
      return false;
    }

    wrap.innerHTML = items
      .map((i) => {
        const p = STAR.bySlug(i.slug);
        if (!p) return "";
        return (
          '<div class="line-item">' +
          '<div class="line-item__art">' + STAR.art(p) + "</div>" +
          "<div>" +
          '<a class="line-item__name" href="product.html?p=' + p.slug + '">' + p.name + " — " + p.nameEn + "</a>" +
          '<div class="line-item__meta">' + (i.size > 1 ? "بستهٔ " + money(i.size) + " عددی" : "تک عدد") + " · " + p.code + "</div>" +
          '<div class="cluster" style="margin-top:8px">' +
          '<div class="qty qty--sm"><button type="button" data-qty-inc="' + i.key + '" data-delta="-1" aria-label="کمتر">−</button>' +
          "<span>" + money(i.qty) + '</span><button type="button" data-qty-inc="' + i.key + '" data-delta="1" aria-label="بیشتر">+</button></div>' +
          '<button class="chip-btn" type="button" data-remove="' + i.key + '">' + icon("trash") + " حذف</button>" +
          "</div></div>" +
          '<div class="line-item__price">' + money(i.unit * i.size * i.qty) + ' <span class="small muted">تومان</span></div>' +
          "</div>"
        );
      })
      .join("");

    return true;
  }

  /* ---------- summary ---------- */
  function renderSummary() {
    const t = Store.totals();
    const coupon = Store.getCoupon();
    const remaining = Math.max(0, STAR.config.freeShipFrom - t.afterDiscount);

    summary.innerHTML =
      '<h2 class="card__title">' + icon("package") + "خلاصهٔ سفارش</h2>" +
      '<div class="summary__row"><span>جمع کالاها</span><strong>' + money(t.subtotal) + " تومان</strong></div>" +
      (t.discount
        ? '<div class="summary__row"><span>تخفیف ' + (coupon ? coupon.code : "") + "</span><strong style='color:var(--crystal)'>−" + money(t.discount) + " تومان</strong></div>"
        : "") +
      '<div class="summary__row"><span>ارسال بی‌نام</span><strong>' + (t.shipping === 0 ? "رایگان" : money(t.shipping) + " تومان") + "</strong></div>" +
      '<div class="summary__total"><span>مبلغ نهایی</span><span>' + money(t.total) + "</span></div>" +
      '<div class="coupon"><input class="input" type="text" placeholder="کد تخفیف" data-coupon-input aria-label="کد تخفیف" value="' + (coupon ? coupon.code : "") + '" />' +
      '<button class="btn btn--dark btn--sm" type="button" data-coupon>' + (coupon ? "تغییر" : "اعمال") + "</button></div>" +
      (coupon
        ? '<button class="chip-btn" style="margin-top:8px" type="button" data-coupon-remove>' + icon("close") + " حذف کد " + coupon.code + "</button>"
        : '<p class="small muted" style="margin-top:8px">کدهای فعال: LAB10 · NIGHT20 · DISCREET</p>') +
      '<div class="ship-hint">' +
      (t.afterDiscount >= STAR.config.freeShipFrom
        ? "ارسال سفارشت رایگان شد 🎉"
        : money(remaining) + " تومان تا ارسال رایگان") +
      '<div class="ship-hint__bar"><div class="ship-hint__fill" style="--w:' +
      Math.min(100, (t.afterDiscount / STAR.config.freeShipFrom) * 100) +
      '%"></div></div></div>' +
      '<p class="small muted" style="margin-top:14px">' + icon("lock") + " پرداخت امن · بستهٔ بی‌نام · بازگشت ۷ روزه</p>";
  }

  function renderEmptySummary() {
    summary.innerHTML =
      '<h2 class="card__title">' + icon("package") + "خلاصهٔ سفارش</h2>" +
      '<p class="muted small" style="margin:10px 0 16px">هنوز چیزی انتخاب نکرده‌ای. اگر تازه شروع می‌کنی، ' +
      "کیت شروع زوج یا لوبریکانت پایه آب کم‌ریسک‌ترین انتخاب‌ها هستند.</p>" +
      '<div class="summary__row"><span>ارسال رایگان</span><strong>از ' + money(STAR.config.freeShipFrom) + " تومان</strong></div>" +
      '<div class="summary__row"><span>کد تخفیف</span><strong>LAB10</strong></div>' +
      '<a class="btn btn--yellow" style="width:100%;margin-top:14px" href="shop.html">دیدن محصولات ' + icon("arrowLeft") + "</a>" +
      '<a class="chip-btn" style="margin-top:10px" href="guide.html">' + icon("info") + " راهنمای انتخاب</a>";
  }

  /* ---------- navigation ---------- */
  function goStep(n) {
    step = Math.max(1, Math.min(3, n));
    document.querySelectorAll("[data-step-panel]").forEach((p) => {
      p.hidden = Number(p.dataset.stepPanel) !== step;
    });
    renderSteps();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  /* ---------- validation ---------- */
  function validateShip() {
    const required = [
      ["name", "نام و نام خانوادگی"],
      ["phone", "شمارهٔ موبایل"],
      ["province", "استان"],
      ["city", "شهر"],
      ["address", "نشانی"],
      ["postal", "کد پستی"],
    ];
    let ok = true;
    required.forEach(([field, label]) => {
      const el = form.querySelector('[name="' + field + '"]');
      if (!el) return;
      const empty = !String(el.value).trim();
      el.setAttribute("aria-invalid", String(empty));
      const err = form.querySelector('[data-err="' + field + '"]');
      if (err) err.textContent = empty ? label + " را کامل وارد کن." : "";
      if (empty) ok = false;
    });

    const phone = form.querySelector('[name="phone"]');
    if (phone && phone.value && !/^09\d{9}$/.test(phone.value.replace(/[\s-]/g, "").replace(/[۰-۹]/g, (d) => "۰۱۲۳۴۵۶۷۸۹".indexOf(d)))) {
      phone.setAttribute("aria-invalid", "true");
      const err = form.querySelector('[data-err="phone"]');
      if (err) err.textContent = "شماره باید با ۰۹ شروع شود و ۱۱ رقم باشد.";
      ok = false;
    }

    const postal = form.querySelector('[name="postal"]');
    if (postal && postal.value && postal.value.replace(/\D/g, "").length !== 10) {
      const err = form.querySelector('[data-err="postal"]');
      if (err) err.textContent = "کد پستی باید ۱۰ رقم باشد.";
      ok = false;
    }
    return ok;
  }

  /* ---------- events ---------- */
  document.addEventListener("click", (e) => {
    const t = e.target;

    const inc = t.closest("[data-qty-inc]");
    if (inc && wrap.contains(inc)) {
      const item = Store.cartItems().find((i) => i.key === inc.dataset.qtyInc);
      if (item) Store.setQty(item.key, item.qty + Number(inc.dataset.delta));
      return;
    }

    const rm = t.closest("[data-remove]");
    if (rm && wrap.contains(rm)) {
      Store.removeItem(rm.dataset.remove);
      UI.toast("از سبد حذف شد");
      return;
    }

    if (t.closest("[data-coupon]")) {
      const input = summary.querySelector("[data-coupon-input]");
      const res = Store.applyCoupon(input ? input.value : "");
      UI.toast(res.message, res.ok ? "" : "error");
      return;
    }

    if (t.closest("[data-coupon-remove]")) {
      Store.removeCoupon();
      UI.toast("کد تخفیف حذف شد");
      return;
    }

    if (t.closest("[data-next]")) {
      if (!Store.cartItems().length) {
        UI.toast("اول یک محصول به سبد اضافه کن", "error");
        return;
      }
      if (step === 2 && !validateShip()) {
        UI.toast("فرم را کامل کن", "error");
        return;
      }
      goStep(step + 1);
      return;
    }

    if (t.closest("[data-prev]")) {
      goStep(step - 1);
      return;
    }

    const pay = t.closest("[data-pay], .pay");
    if (pay && payWrap.contains(pay)) {
      const radio = pay.querySelector("input");
      if (radio) {
        radio.checked = true;
        payment = radio.value;
        payWrap.querySelectorAll(".pay").forEach((p) => p.classList.toggle("is-active", p === pay));
      }
      return;
    }

    if (t.closest("[data-place]")) {
      if (!validateShip()) {
        UI.toast("فرم تحویل را کامل کن", "error");
        goStep(2);
        return;
      }
      const terms = document.querySelector('[name="terms"]');
      if (terms && !terms.checked) {
        UI.toast("برای ثبت سفارش، قوانین را بپذیر", "error");
        return;
      }
      if (!Store.cartItems().length) {
        UI.toast("سبد خالی است", "error");
        return;
      }
      const data = new FormData(form);
      const order = Store.saveOrder({
        name: data.get("name"),
        phone: data.get("phone"),
        province: data.get("province"),
        city: data.get("city"),
        address: data.get("address"),
        postal: data.get("postal"),
        note: data.get("note") || "",
        payment,
      });
      showSuccess(order);
    }
  });

  function showSuccess(order) {
    checkoutBar.hidden = true;
    summary.hidden = true;
    successBox.hidden = false;
    const payLabel = { online: "پرداخت آنلاین", card: "کارت‌به‌کارت", cod: "پرداخت در محل" }[order.customer.payment] || "پرداخت آنلاین";

    successBox.innerHTML =
      '<div class="card" style="text-align:center">' +
      '<div class="feature__icon" style="justify-content:center;display:flex">' + icon("checkCircle") + "</div>" +
      '<h1 class="h-1" style="margin-top:10px">سفارشت ثبت شد</h1>' +
      "<p class=\"lead\" style=\"margin:10px auto 16px;max-width:46ch\">کد رهگیری را نگه دار. بسته بدون هیچ نامی ارسال می‌شود و پیامک فقط همین کد را دارد.</p>" +
      '<div class="mono" style="font-size:1.4rem;color:var(--yellow);letter-spacing:.2em">' + order.code + "</div>" +
      '<div style="max-width:420px;margin:20px auto 0;text-align:start">' +
      '<div class="summary__row"><span>مبلغ</span><strong>' + money(order.totals.total) + " تومان</strong></div>" +
      '<div class="summary__row"><span>روش پرداخت</span><strong>' + payLabel + "</strong></div>" +
      '<div class="summary__row"><span>تحویل</span><strong>' + order.customer.city + " — " + String(order.customer.address).slice(0, 26) + "…</strong></div>" +
      '<div class="summary__row"><span>تعداد بسته</span><strong>' + money(order.items.reduce((n, i) => n + i.qty, 0)) + " بسته</strong></div>" +
      "</div>" +
      '<p class="small muted" style="margin-top:16px">این یک فروشگاه نمایشی است؛ سفارش فقط در همین مرورگر ذخیره شده و پرداخت واقعی انجام نشده.</p>' +
      '<div class="cluster" style="justify-content:center;margin-top:18px">' +
      '<a class="btn btn--yellow" href="shop.html">ادامهٔ خرید ' + icon("arrowLeft") + "</a>" +
      '<a class="btn btn--ghost" href="contact.html">پیگیری سفارش</a></div></div>';
  }

  /* ---------- boot ---------- */
  function paint() {
    const has = renderItems();
    if (checkoutBar) checkoutBar.hidden = !has;
    if (has) renderSummary();
    else renderEmptySummary();
    return has;
  }

  renderSteps();
  paint();
  goStep(1);
  UI.bindAccordions(document);

  window.addEventListener("lab:change", () => {
    if (!successBox.hidden) return;
    paint();
  });
})();
