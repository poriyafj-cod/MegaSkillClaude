/* ==========================================================================
   NAFAS — contact page: FAQ accordion + validated demo form
   ========================================================================== */
(function () {
  "use strict";

  const D = window.NAFAS;
  const UI = window.NAFAS_UI;
  const qs = UI.qs;

  const toLatin = (s) =>
    String(s || "").replace(/[۰-۹]/g, (d) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(d)));

  function renderFaq() {
    const box = qs("#faqList");
    if (!box) return;
    box.innerHTML = D.faqs
      .map(
        (f, i) =>
          '<div class="accordion__item' + (i === 0 ? " is-open" : "") + '">' +
          '<button class="accordion__btn" type="button" aria-expanded="' + (i === 0 ? "true" : "false") + '">' +
          UI.esc(f.q) + '<span class="accordion__icon"></span></button>' +
          '<div class="accordion__panel"><div><p>' + UI.esc(f.a) + "</p></div></div></div>"
      )
      .join("");

    box.addEventListener("click", (e) => {
      const btn = e.target.closest(".accordion__btn");
      if (!btn) return;
      const item = btn.parentElement;
      const open = item.classList.contains("is-open");
      box.querySelectorAll(".accordion__item").forEach((it) => {
        it.classList.remove("is-open");
        const b = it.querySelector(".accordion__btn");
        if (b) b.setAttribute("aria-expanded", "false");
      });
      if (!open) {
        item.classList.add("is-open");
        btn.setAttribute("aria-expanded", "true");
      }
    });
  }

  function setError(id, message) {
    const holder = qs('[data-error-for="' + id + '"]');
    if (holder) holder.textContent = message || "";
    const field = qs("#" + id);
    if (field && field.closest(".field")) field.closest(".field").classList.toggle("has-error", Boolean(message));
  }

  function initForm() {
    const form = qs("#contactForm");
    if (!form) return;

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      let ok = true;

      const name = form.querySelector("#cName").value.trim();
      const phone = toLatin(form.querySelector("#cPhone").value).replace(/[\s-]/g, "");
      const email = form.querySelector("#cEmail").value.trim();
      const subject = form.querySelector("#cSubject").value;
      const message = form.querySelector("#cMessage").value.trim();
      const consent = form.querySelector("#cConsent").checked;

      if (name.length < 3) {
        setError("cName", "نامت را کامل بنویس.");
        ok = false;
      } else setError("cName", "");

      if (!/^09\d{9}$/.test(phone)) {
        setError("cPhone", "شمارهٔ موبایل ۱۱ رقمی و با ۰۹ شروع شود.");
        ok = false;
      } else setError("cPhone", "");

      if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
        setError("cEmail", "ایمیل معتبر نیست.");
        ok = false;
      } else setError("cEmail", "");

      if (!subject) {
        setError("cSubject", "موضوع پیام را انتخاب کن.");
        ok = false;
      } else setError("cSubject", "");

      if (message.length < 10) {
        setError("cMessage", "پیامت را کمی کامل‌تر بنویس (حداقل ۱۰ حرف).");
        ok = false;
      } else setError("cMessage", "");

      if (!consent) {
        setError("cConsent", "برای ارسال باید موافقت کنی.");
        ok = false;
      } else setError("cConsent", "");

      if (!ok) {
        UI.toast("چند فیلد نیاز به اصلاح دارد", "error");
        return;
      }

      form.innerHTML =
        '<div class="success-card" style="border:0; box-shadow:none; padding: 20px">' +
        '<div class="success-card__icon">' + window.svgIcon("check") + "</div>" +
        '<h2 class="h-2">پیامت رسید!</h2>' +
        '<p class="lead">ممنون ' + UI.esc(name) + " جان؛ تا کمتر از یک روز کاری از طریق شمارهٔ " +
        UI.esc(phone) + " یا ایمیل پاسخ می‌دهیم.</p>" +
        '<a class="btn btn--ghost" href="shop.html">دیدن محصولات</a></div>';

      UI.toast("پیام با موفقیت ثبت شد (نسخهٔ نمایشی)");
    });
  }

  function init() {
    renderFaq();
    initForm();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
