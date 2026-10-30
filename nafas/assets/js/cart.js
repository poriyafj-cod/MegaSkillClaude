/* ==========================================================================
   NAFAS — cart page: line items, coupon, checkout form, order confirmation
   ========================================================================== */
(function () {
  "use strict";

  const D = window.NAFAS;
  const S = window.NAFAS_STORE;
  const UI = window.NAFAS_UI;
  const icon = window.svgIcon;
  const qs = UI.qs;

  const el = (id) => document.getElementById(id);
  let step = 1;
  let codFee = 0;

  const toLatinDigits = (str) =>
    String(str || "")
      .replace(/[۰-۹]/g, (d) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(d)))
      .replace(/[٠-٩]/g, (d) => String("٠١٢٣٤٥٦٧٨٩".indexOf(d)));

  /* ------------------------------------------------------------------ */
  /* Rendering                                                          */
  /* ------------------------------------------------------------------ */
  function render() {
    if (step === 3) return;
    const lines = S.lines();
    const wrap = el("cartWrap");
    const empty = el("cartEmpty");

    if (!lines.length && step !== 3) {
      if (wrap) wrap.hidden = true;
      if (empty) empty.hidden = false;
      return;
    }
    if (empty) empty.hidden = true;
    if (wrap) wrap.hidden = false;

    renderLines(lines);
    renderSummary();
    setStep(step);
  }

  function renderLines(lines) {
    const list = el("cartList");
    if (!list) return;
    list.innerHTML = lines
      .map(
        (l) =>
          '<div class="cart-row">' +
          '<a class="cart-row__media" href="product.html?p=' + l.product.slug + '">' +
          '<img src="assets/img/products/' + l.product.slug + '.jpg" alt="' + UI.esc(l.product.name) + '" loading="lazy"></a>' +
          '<div class="cart-row__main">' +
          '<a href="product.html?p=' + l.product.slug + '"><b>' + UI.esc(l.product.name) + "</b></a>" +
          '<span class="small muted">' + UI.esc(S.categoryOf(l.product.cat).name) +
          (l.opts ? " · " + UI.esc(l.opts) : "") + "</span>" +
          '<div class="cart-row__ctrl">' +
          '<span class="qty"><button type="button" data-cart-dec="' + l.product.id + '" data-opts="' + UI.esc(l.opts) +
          '" aria-label="کاهش">−</button><span>' + S.fmtNum(l.qty) + "</span>" +
          '<button type="button" data-cart-inc="' + l.product.id + '" data-opts="' + UI.esc(l.opts) +
          '" aria-label="افزایش">+</button></span>' +
          '<button type="button" class="line-item__remove" data-cart-remove="' + l.product.id + '" data-opts="' +
          UI.esc(l.opts) + '">حذف</button>' +
          "</div></div>" +
          '<div class="cart-row__price">' + S.money(l.line_total) + ' <span class="small muted">تومان</span></div>' +
          "</div>"
      )
      .join("");
  }

  function renderSummary() {
    const box = el("summary");
    if (!box) return;
    const t = S.totals();
    const totalWithCod = t.total + codFee;

    box.innerHTML =
      "<h2>خلاصهٔ سفارش</h2>" +
      '<div class="summary__row"><span>جمع کالاها (' + S.fmtNum(S.count()) + " عدد)</span><b>" +
      S.money(t.subtotal) + " تومان</b></div>" +
      (t.discount
        ? '<div class="summary__row"><span>تخفیف کد ' + UI.esc(t.coupon) + "</span><b>−" +
          S.money(t.discount) + " تومان</b></div>"
        : "") +
      '<div class="summary__row"><span>هزینهٔ ارسال</span><b>' +
      (t.shipping === 0 ? "رایگان" : S.money(t.shipping) + " تومان") + "</b></div>" +
      (codFee ? '<div class="summary__row"><span>پرداخت در محل</span><b>' + S.money(codFee) + " تومان</b></div>" : "") +
      '<div class="summary__row summary__row--total"><span>مبلغ قابل پرداخت</span><b>' +
      S.money(totalWithCod) + " تومان</b></div>" +
      (t.freeShippingGap > 0
        ? '<div class="ship-progress"><div class="ship-progress__bar"><div class="ship-progress__fill" style="width:' +
          Math.min(100, Math.round((t.subtotal / D.freeShippingThreshold) * 100)) +
          '%"></div></div><span>' + S.money(t.freeShippingGap) + " تومان تا ارسال رایگان</span></div>"
        : '<div class="pill pill--lime" style="justify-content:center">🎉 ارسال این سفارش رایگان است</div>') +
      '<hr class="divider" />' +
      '<div class="coupon"><input class="input" id="couponInput" placeholder="کد تخفیف" aria-label="کد تخفیف" value="' +
      (t.coupon || "") + '"><button class="btn btn--sm" type="button" id="applyCoupon">اعمال</button></div>' +
      '<p class="coupon-msg" id="couponMsg"></p>' +
      (!t.coupon && step === 1 ? "" : "") +
      '<button class="btn btn--block" type="button" id="checkoutBtn">' +
      (step === 1 ? "ادامه و ثبت اطلاعات" : "بازگشت به مرحلهٔ ارسال") +
      " " + icon("arrow-left") + "</button>" +
      '<ul class="tick-list small">' +
      "<li>" + icon("shield") + " ضمانت اصالت و آبکاری چندلایه</li>" +
      "<li>" + icon("refresh") + " ۷ روز مهلت مرجوعی</li>" +
      "<li>" + icon("gift") + " بستهٔ هدیه رایگان</li>" +
      "</ul>";

    const applyBtn = el("applyCoupon");
    if (applyBtn) {
      applyBtn.addEventListener("click", () => {
        const code = el("couponInput").value;
        const result = S.applyCoupon(code);
        render();
        const msg = el("couponMsg");
        if (msg) {
          msg.textContent = result.message;
          msg.classList.toggle("is-error", !result.ok);
        }
      });
    }
    const couponInput = el("couponInput");
    if (couponInput) {
      couponInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          applyBtn.click();
        }
      });
    }

    const checkoutBtn = el("checkoutBtn");
    if (checkoutBtn) {
      checkoutBtn.addEventListener("click", () => {
        if (step === 1) goToCheckout();
        else goToCart();
      });
    }
  }

  /* ------------------------------------------------------------------ */
  /* Steps                                                              */
  /* ------------------------------------------------------------------ */
  function setStep(next) {
    step = next;
    ["1", "2", "3"].forEach((n) => {
      const pill = qs('[data-step-pill="' + n + '"]');
      if (!pill) return;
      pill.classList.toggle("is-active", Number(n) === step);
      pill.classList.toggle("is-done", Number(n) < step);
    });
  }

  function goToCart() {
    const summaryAside = el("summary");
    if (summaryAside) summaryAside.hidden = false;
    el("checkoutPanel").hidden = true;
    el("orderSuccess").hidden = true;
    el("cartPanel").hidden = false;
    setStep(1);
    renderSummary();
    if (window.scrollTo) window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function goToCheckout() {
    if (!S.lines().length) return;
    el("cartPanel").hidden = true;
    el("checkoutPanel").hidden = false;
    el("orderSuccess").hidden = true;
    setStep(2);
    renderSummary();
    const panel = el("checkoutPanel");
    if (panel.scrollIntoView) panel.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  /* ------------------------------------------------------------------ */
  /* Validation & submit                                                */
  /* ------------------------------------------------------------------ */
  function setError(name, message) {
    const holder = qs('[data-error-for="' + name + '"]');
    if (holder) holder.textContent = message || "";
    const field = qs("#f" + name.charAt(0).toUpperCase() + name.slice(1));
    const wrapper = field ? field.closest(".field") : null;
    if (wrapper) wrapper.classList.toggle("has-error", Boolean(message));
  }

  function validate() {
    let ok = true;
    const g = (id) => (el(id) ? el(id).value.trim() : "");

    if (toLatinDigits(g("fName")).length < 3) {
      setError("name", "نام و نام خانوادگی را کامل بنویس.");
      ok = false;
    } else setError("name", "");

    const phone = toLatinDigits(g("fPhone")).replace(/[\s-]/g, "");
    if (!/^09\d{9}$/.test(phone)) {
      setError("phone", "شمارهٔ موبایل باید ۱۱ رقم و با ۰۹ شروع شود.");
      ok = false;
    } else setError("phone", "");

    if (!g("fProvince")) {
      setError("province", "استان را انتخاب کن.");
      ok = false;
    } else setError("province", "");

    if (g("fCity").length < 2) {
      setError("city", "نام شهر را بنویس.");
      ok = false;
    } else setError("city", "");

    if (g("fAddress").length < 10) {
      setError("address", "نشانی را کامل بنویس (خیابان، کوچه، پلاک).");
      ok = false;
    } else setError("address", "");

    const postal = toLatinDigits(g("fPostal")).replace(/\s/g, "");
    if (!/^\d{10}$/.test(postal)) {
      setError("postal", "کد پستی باید ۱۰ رقم باشد.");
      ok = false;
    } else setError("postal", "");

    if (!el("fTerms").checked) {
      setError("terms", "برای ادامه باید قوانین فروش را بپذیری.");
      ok = false;
    } else setError("terms", "");

    return ok;
  }

  function submitOrder(e) {
    e.preventDefault();
    if (!validate()) {
      UI.toast("چند فیلد نیاز به اصلاح دارد", "error");
      const firstError = qs(".field.has-error .input, .field.has-error .select, .field.has-error .textarea");
      if (firstError) firstError.focus();
      return;
    }

    const data = new FormData(el("checkoutForm"));
    const payment = `input[name="pay"]:checked`;
    const payValue = (el("checkoutForm").querySelector(payment) || {}).value || "gateway";
    const payLabels = { gateway: "پرداخت آنلاین", card: "کارت‌به‌کارت", cod: "پرداخت در محل" };

    const order = S.saveOrder({
      customer: {
        name: data.get("name"),
        phone: toLatinDigits(data.get("phone")),
        province: data.get("province"),
        city: data.get("city"),
        address: data.get("address"),
        postal: toLatinDigits(data.get("postal")),
        note: data.get("note"),
      },
      payment: payLabels[payValue],
      codFee: payValue === "cod" ? codFee : 0,
    });

    renderSuccess(order);
    setStep(3);
    codFee = 0;
    S.clear();
  }

  function renderSuccess(order) {
    const box = el("orderSuccess");
    if (!box) return;
    el("checkoutPanel").hidden = true;
    el("cartPanel").hidden = true;
    box.hidden = false;
    const summaryAside = el("summary");
    if (summaryAside) summaryAside.hidden = true;

    const lines = order.items
      .map(
        (l) =>
          "<div><span>" + UI.esc(l.product.name) + " × " + S.fmtNum(l.qty) + "</span><b>" +
          S.money(l.line_total) + " تومان</b></div>"
      )
      .join("");

    const total = order.totals.total + (order.codFee || 0);

    box.innerHTML =
      '<div class="success-card">' +
      '<div class="success-card__icon">' + icon("check") + "</div>" +
      '<h2 class="h-1">سفارشت ثبت شد!</h2>' +
      '<p class="lead" style="max-width: 46ch">' + UI.esc(order.customer.name) + " عزیز، سفارش تو با موفقیت ثبت شد. " +
      "همکاران ما تا چند ساعت آینده برای تأیید نهایی با شمارهٔ " + UI.esc(order.customer.phone) + " تماس می‌گیرند.</p>" +
      '<div class="order-code">' + icon("box") + "کد سفارش: " + UI.esc(order.code) + "</div>" +
      '<div class="order-lines">' + lines +
      "<div><span>روش پرداخت</span><b>" + UI.esc(order.payment) + "</b></div>" +
      "<div><span>هزینهٔ ارسال</span><b>" + (order.totals.shipping === 0 ? "رایگان" : S.money(order.totals.shipping) + " تومان") + "</b></div>" +
      "<div><span>مبلغ نهایی</span><b>" + S.money(total) + " تومان</b></div>" +
      '<div><span>نشانی</span><b style="font-weight:600;max-width:60%;text-align:end">' +
      UI.esc(order.customer.province + "، " + order.customer.city + "، " + order.customer.address) + "</b></div>" +
      "</div>" +
      '<p class="small muted">این یک فروشگاه نمایشی است؛ سفارش در حافظهٔ همین مرورگر ذخیره شد و پرداختی انجام نشد.</p>' +
      '<div class="cluster" style="justify-content: center">' +
      '<a class="btn" href="shop.html">ادامهٔ خرید</a>' +
      '<a class="btn btn--ghost" href="index.html">صفحهٔ اصلی</a>' +
      "</div></div>";
  }

  /* ------------------------------------------------------------------ */
  /* Events                                                             */
  /* ------------------------------------------------------------------ */
  function bind() {
    document.addEventListener("click", (e) => {
      const inc = e.target.closest("[data-cart-inc]");
      const dec = e.target.closest("[data-cart-dec]");
      const rem = e.target.closest("[data-cart-remove]");

      if (inc || dec || rem) {
        const btn = inc || dec || rem;
        const id = btn.getAttribute("data-cart-inc") || btn.getAttribute("data-cart-dec") || btn.getAttribute("data-cart-remove");
        const opts = btn.getAttribute("data-opts") || "";
        const line = S.lines().find((l) => l.product.id === id && l.opts === opts);
        if (!line) return;
        if (inc) S.setQty(id, opts, line.qty + 1);
        if (dec) S.setQty(id, opts, line.qty - 1);
        if (rem) {
          S.remove(id, opts);
          UI.toast("محصول از سبد حذف شد");
        }
        return;
      }
    });

    document.addEventListener("change", (e) => {
      if (e.target.name === "pay") {
        codFee = e.target.value === "cod" ? 30000 : 0;
        renderSummary();
      }
    });
  }

  function init() {
    bind();

    const toCheckout = el("toCheckout");
    if (toCheckout) toCheckout.addEventListener("click", goToCheckout);

    const back = el("backToCart");
    if (back) back.addEventListener("click", goToCart);

    const form = el("checkoutForm");
    if (form) form.addEventListener("submit", submitOrder);

    document.addEventListener("nafas:change", () => {
      if (step !== 3) render();
    });

    render();
    setStep(1);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
