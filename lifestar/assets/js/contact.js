/* ==========================================================================
   LIFE STAR — contact page: validated form + FAQ accordion
   ========================================================================== */
(function () {
  const UI = window.UI;
  const icon = window.icon;
  UI.mountChrome();

  const form = document.querySelector("[data-contact-form]");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const data = new FormData(form);
      const name = String(data.get("name") || "").trim();
      const phone = String(data.get("phone") || "").replace(/\s/g, "");
      const email = String(data.get("email") || "").trim();
      const message = String(data.get("message") || "").trim();
      const topic = String(data.get("topic") || "");
      let ok = true;

      const setErr = (field, text) => {
        const err = form.querySelector('[data-err="' + field + '"]');
        const input = form.querySelector('[name="' + field + '"]');
        if (err) err.textContent = text;
        if (input) input.setAttribute("aria-invalid", String(Boolean(text)));
        if (text) ok = false;
      };

      setErr("name", name.length < 3 ? "نام را کامل بنویس." : "");
      setErr("phone", /^09\d{9}$/.test(phone) ? "" : "موبایل باید با ۰۹ شروع شود و ۱۱ رقم باشد.");
      setErr("email", email && !email.includes("@") ? "ایمیل معتبر نیست." : "");
      setErr("topic", !topic ? "موضوع پیام را انتخاب کن." : "");
      setErr("message", message.length < 12 ? "متن پیام حداقل ۱۲ کاراکتر باشد." : "");

      if (!ok) {
        UI.toast("لطفاً خطاهای فرم را برطرف کن", "error");
        return;
      }

      try {
        const box = JSON.parse(localStorage.getItem("lifestar.messages.v1") || "[]");
        box.unshift({ name, phone, email, topic, message, at: Date.now() });
        localStorage.setItem("lifestar.messages.v1", JSON.stringify(box.slice(0, 20)));
      } catch (err) {}

      form.reset();
      form.querySelectorAll("[data-err]").forEach((e) => (e.textContent = ""));
      UI.toast("پیامت ثبت شد — کمتر از یک روز کاری جواب می‌دهیم");
      const done = document.querySelector("[data-contact-done]");
      if (done) {
        done.hidden = false;
        done.innerHTML = icon("checkCircle") + " پیام شما ثبت شد. کد پیگیری: LS-" + Math.random().toString(36).slice(2, 7).toUpperCase();
      }
    });
  }

  UI.bindAccordions(document);
  UI.observeReveals();
})();
