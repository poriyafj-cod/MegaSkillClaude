/* ==========================================================================
   LIFE STAR — cart & 3-step checkout
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
  let step = 1;
  let payment = "online";

  const form = document.querySelector("[data-form]");
  const payWrap = document.querySelector("[data-pays]");
  const successBox = document.querySelector("[data-success]");

  const STEPS = ["سبد خرید", "اطلاعات ارسال", "پرداخت و ثبت"];

  /* ---------- steps indicator ---------- */
  function renderSteps() {
    stepsWrap.innerHTML = STEPS.map(
      (label, i) => {
        const n = i + 1;
        const cls = n === step ? "is-active" : n < step ? "is-done" : "";
        return (
          (i ? '<span class="step__line"></span>' : "") +
          '<span class="step ' + cls + '"><span class="step__num">' + (n < step ? "✓" : n) + "</span>" + label + "</span>"
        );
      }
    ).join("");
  }

  /* ---------- items ---------- */
  function renderItems() {
    const items = Store.cartItems();
    if (!items.length) {
      wrap.innerHTML =
        '<div class="empty-state">' + icon("cart") +
        "<h2 class='h-3' style=\"margin:8px 0\">سبد خریدت خالیه</h2>" +
        '<p class="muted small" style="margin-bottom:18px">از کالکشن پاییز یکی بردار و با انرژی برگرد.</p>' +
        '<a class="btn" href="shop.html">دیدن نوشیدنی‌ها ' + icon("arrowLeft") + "</a></div>";
      return false;
    }

    wrap.innerHTML = items
      .map((i) => {
        const p = STAR.bySlug(i.slug);
        if (!p) return "";
        return (
          '<div class="line-item" style="grid-template-columns:78px 1fr auto;padding-block:16px">' +
          '<div class="line-item__art" style="width:78px;height:96px">' + STAR.canSvg(p, { label: false }) + "</div>" +
          "<div>" +
          '<a class="line-item__name" href="product.html?p=' + p.slug + '">' + p.name + " — " + p.nameEn + "</a>" +
          '<div class="line-item__meta">پک ' + i.size + " عددی · " + p.caffeine + "mg کافئین</div>" +
          '<div class="cluster" style="margin-top:8px">' +
          '<div class="qty"><button type="button" data-qty="' + i.key + '" data-delta="-1" aria-label="کمتر">−</button>' +
          "<span>" + i.qty + '</span><button type="button" data-qty="' + i.key + '" data-delta="1" aria-label="بیشتر">+</button></div>' +
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
        ? '<div class="summary__row" style="color:var(--volt)"><span>تخفیف ' + (coupon ? coupon.code : "") + "</span><strong style='color:var(--volt)'>−" + money(t.discount) + " تومان</strong></div>"
        : "") +
      '<div class="summary__row"><span>هزینهٔ ارسال</span><strong>' + (t.shipping === 0 ? "رایگان" : money(t.shipping) + " تومان") + "</strong></div>" +
      '<div class="summary__total"><span>مبلغ نهایی</span><span>' + money(t.total) + " تومان</span></div>" +
      '<div class="coupon"><input class="input" type="text" placeholder="کد تخفیف" data-coupon-input aria-label="کد تخفیف" value="' + (coupon ? coupon.code : "") + '" />' +
      '<button class="btn btn--dark btn--sm" type="button" data-coupon>' + (coupon ? "تغییر" : "اعمال") + "</button></div>" +
      (coupon
        ? '<button class="chip-btn" style="margin-top:8px" type="button" data-coupon-remove">' + icon("close") + " حذف کد " + coupon.code + "</button>"
        : '<p class="small muted" style="margin-top:8px">کدهای فعال: STAR10 · NIGHTOWL15 · FREESHIP</p>') +
      '<div class="ship-hint">' +
      (t.afterDiscount >= STAR.config.freeShipFrom
        ? "ارسال سفارشت رایگان شد 🎉"
        : money(remaining) + " تومان تا ارسال رایگان") +
      '<div class="ship-hint__bar"><div class="ship-hint__fill" style="--w:' +
      Math.min(100, (t.afterDiscount / STAR.config.freeShipFrom) * 100) +
      '%"></div></div></div>';
  }

  /* ---------- step navigation ---------- */
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
    if (phone && phone.value && !/^09\d{9}$/.test(phone.value.replace(/\s/g, ""))) {
      phone.setAttribute("aria-invalid", "true");
      const err = form.querySelector('[data-err="phone"]');
      if (err) err.textContent = "شمارهٔ موبایل باید با ۰۹ شروع و ۱۱ رقم باشد.";
      ok = false;
    }
    return ok;
  }

  /* ---------- events ---------- */
  document.addEventListener("click", (e) => {
    const t = e.target;

    const qty = t.closest("[data-qty]");
    if (qty && wrap.contains(qty)) {
      const item = Store.cartItems().find((i) => i.key === qty.dataset.qty);
      if (item) Store.setQty(qty.dataset.qty, item.qty + Number(qty.dataset.delta));
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
        UI.toast("اول یک نوشیدنی به سبد اضافه کن", "error");
        return;
      }
      goStep(step + 1);
      return;
    }

    if (t.closest("[data-prev]")) {
      goStep(step - 1);
      return;
    }

    const pay = t.closest("[data-pay]");
    if (pay) {
      payment = pay.dataset.pay;
      payWrap.querySelectorAll(".pay").forEach((p) => p.classList.toggle("is-active", p === pay));
      const radio = pay.querySelector("input");
      if (radio) radio.checked = true;
      return;
    }

    if (t.closest("[data-place]")) {
      if (!validateShip()) {
        UI.toast("فرم ارسال را کامل کن", "error");
        goStep(2);
        return;
      }
      const terms = form.querySelector('[name="terms"]');
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
    document.querySelector("[data-checkout]").hidden = true;
    summary.hidden = true;
    successBox.hidden = false;
    const payLabel = { online: "پرداخت آنلاین", card: "کارت‌به‌کارت", cod: "پرداخت در محل" }[order.customer.payment] || "پرداخت آنلاین";
    successBox.innerHTML =
      '<div class="success">' +
      '<div class="success__icon">' + icon("checkCircle") + "</div>" +
      '<h1 class="h-2">سفارشت ثبت شد!</h1>' +
      '<p class="muted" style="margin-top:8px">کد رهگیری سفارش را نگه دار؛ با همین کد می‌تونی پیگیری کنی.</p>' +
      '<div class="success__code">' + order.code + "</div>" +
      '<div class="summary" style="text-align:start;position:static;max-width:420px;margin:0 auto 20px">' +
      '<div class="summary__row"><span>مبلغ</span><strong>' + money(order.totals.total) + " تومان</strong></div>" +
      '<div class="summary__row"><span>روش پرداخت</span><strong>' + payLabel + "</strong></div>" +
      '<div class="summary__row"><span>تحویل</span><strong>' + order.customer.city + " — " + order.customer.address.slice(0, 24) + "…</strong></div>" +
      '<div class="summary__row"><span>تعداد اقلام</span><strong>' + order.items.reduce((n, i) => n + i.qty, 0) + " پک</strong></div>" +
      "</div>" +
      '<p class="small muted">این یک فروشگاه نمایشی است؛ سفارش فقط در همین مرورگر ذخیره شده و پرداخت واقعی انجام نشده.</p>' +
      '<div class="cluster" style="justify-content:center;margin-top:18px">' +
      '<a class="btn btn--volt" href="shop.html">ادامهٔ خرید ' + icon("arrowLeft") + "</a>" +
      '<a class="btn btn--ghost" href="contact.html">پیگیری سفارش</a></div>' +
      "</div>";
  }

  /* ---------- boot ---------- */
  renderSteps();
  if (!renderItems()) {
    summary.innerHTML = "";
    document.querySelector("[data-checkout]").hidden = true;
    return;
  }
  renderSummary();
  goStep(1);
  UI.bindAccordions(document);

  window.addEventListener("star:change", () => {
    const checkout = document.querySelector("[data-checkout]");
    if (checkout.hidden || !successBox.hidden) return;
    if (renderItems()) renderSummary();
  });
})();
