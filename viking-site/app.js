/* ==========================================================================
   وایکینگ آفرود — interactions
   Vanilla JS, no dependencies. Progressive enhancement: every section is
   readable and every link works without this file.
   ========================================================================== */
(function () {
  'use strict';

  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));

  const FA_DIGITS = '۰۱۲۳۴۵۶۷۸۹';
  const toFa = (value) => String(value).replace(/\d/g, (digit) => FA_DIGITS[Number(digit)]);
  const toEn = (value) =>
    String(value)
      .replace(/[۰-۹]/g, (digit) => String(FA_DIGITS.indexOf(digit)))
      .replace(/[٠-٩]/g, (digit) => String('٠١٢٣٤٥٦٧٨٩'.indexOf(digit)));

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const isReduced = () => prefersReducedMotion.matches;

  /* ----------------------------------------------------------------------
     Scroll state: header, progress bar, parallax, back-to-top
     ---------------------------------------------------------------------- */
  const header = $('#site-header');
  const progressBar = $('#scroll-progress-bar');
  const toTop = $('#to-top');
  const heroMedia = $('.hero__media');

  let ticking = false;

  function updateScrollUI() {
    const scrolled = window.scrollY;
    if (header) header.classList.toggle('is-scrolled', scrolled > 32);

    if (progressBar) {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      const ratio = scrollable > 0 ? Math.min(1, Math.max(0, scrolled / scrollable)) : 0;
      progressBar.style.width = `${(ratio * 100).toFixed(2)}%`;
    }

    if (toTop) toTop.hidden = scrolled < 640;

    if (heroMedia && !isReduced() && window.innerWidth > 900) {
      heroMedia.style.setProperty('--parallax', `${(scrolled * 0.16).toFixed(1)}px`);
    }

    ticking = false;
  }

  function onScroll() {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(updateScrollUI);
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
  updateScrollUI();

  if (toTop) {
    toTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: isReduced() ? 'auto' : 'smooth' });
    });
  }

  /* ----------------------------------------------------------------------
     Reveal on scroll
     ---------------------------------------------------------------------- */
  const revealItems = $$('[data-reveal]');
  const supportsObserver = 'IntersectionObserver' in window;

  if (!supportsObserver || isReduced()) {
    revealItems.forEach((item) => item.classList.add('is-in'));
  } else {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-in');
          revealObserver.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -6% 0px' }
    );
    revealItems.forEach((item) => revealObserver.observe(item));
  }

  /* ----------------------------------------------------------------------
     Active navigation link
     ---------------------------------------------------------------------- */
  const navLinks = $$('.site-nav__link');
  const watchedSections = navLinks
    .map((link) => {
      const id = link.getAttribute('href');
      return id && id.startsWith('#') ? document.querySelector(id) : null;
    })
    .filter(Boolean);

  if (supportsObserver && watchedSections.length) {
    const navObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const id = `#${entry.target.id}`;
          navLinks.forEach((link) => {
            link.classList.toggle('is-active', link.getAttribute('href') === id);
          });
        });
      },
      { rootMargin: '-45% 0px -50% 0px', threshold: 0 }
    );
    watchedSections.forEach((section) => navObserver.observe(section));
  }

  /* ----------------------------------------------------------------------
     Mobile navigation
     ---------------------------------------------------------------------- */
  const mobileNav = $('#mobile-nav');
  const menuToggle = $('#menu-toggle');
  const menuClose = $('#menu-close');
  let lastFocused = null;

  if (mobileNav && menuToggle && menuClose) {
    mobileNav.hidden = false;
    mobileNav.inert = true;

    const focusableSelector =
      'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])';

    function openNav() {
      lastFocused = document.activeElement;
      mobileNav.inert = false;
      mobileNav.classList.add('is-open');
      menuToggle.setAttribute('aria-expanded', 'true');
      menuToggle.setAttribute('aria-label', 'بستن منو');
      document.body.classList.add('nav-open');
      window.setTimeout(() => menuClose.focus(), 60);
    }

    function closeNav({ restoreFocus = true } = {}) {
      mobileNav.classList.remove('is-open');
      mobileNav.inert = true;
      menuToggle.setAttribute('aria-expanded', 'false');
      menuToggle.setAttribute('aria-label', 'باز کردن منو');
      document.body.classList.remove('nav-open');
      if (restoreFocus && lastFocused instanceof HTMLElement) lastFocused.focus();
    }

    menuToggle.addEventListener('click', () => {
      if (mobileNav.classList.contains('is-open')) closeNav();
      else openNav();
    });
    menuClose.addEventListener('click', () => closeNav());

    $$('a', mobileNav).forEach((link) => {
      link.addEventListener('click', () => closeNav({ restoreFocus: false }));
    });

    document.addEventListener('keydown', (event) => {
      if (!mobileNav.classList.contains('is-open')) return;
      if (event.key === 'Escape') {
        event.preventDefault();
        closeNav();
        return;
      }
      if (event.key !== 'Tab') return;
      const focusables = $$(focusableSelector, mobileNav).filter(
        (element) => element.offsetParent !== null
      );
      if (!focusables.length) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth > 1080 && mobileNav.classList.contains('is-open')) {
        closeNav({ restoreFocus: false });
      }
    });
  }

  /* ----------------------------------------------------------------------
     Tour filters
     ---------------------------------------------------------------------- */
  const filterButtons = $$('.filter');
  const tourCards = $$('.tour');
  const toursCount = $('#tours-count');

  function applyFilter(category) {
    let visible = 0;
    tourCards.forEach((card) => {
      const show = category === 'all' || card.dataset.category === category;
      card.classList.toggle('is-filtered', !show);
      card.classList.remove('card-in');
      if (show) {
        visible += 1;
        card.classList.add('is-in');
        // restart the entrance animation on the next frame
        void card.offsetWidth;
        card.classList.add('card-in');
      }
    });

    if (toursCount) {
      const label = visible === 1 ? '۱ تجربه' : `${toFa(visible)} تجربه`;
      toursCount.replaceChildren(document.createTextNode(label));
    }

    filterButtons.forEach((button) => {
      const active = button.dataset.filter === category;
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-pressed', String(active));
    });
  }

  filterButtons.forEach((button) => {
    button.addEventListener('click', () => applyFilter(button.dataset.filter || 'all'));
  });

  /* ----------------------------------------------------------------------
     Pre-select a tour from any "رزرو" / tour link
     ---------------------------------------------------------------------- */
  const tourSelect = $('#tour');

  $$('[data-book]').forEach((link) => {
    link.addEventListener('click', () => {
      if (!tourSelect) return;
      const wanted = link.dataset.book;
      const option = $$('option', tourSelect).find((item) => item.value === wanted);
      if (option) {
        tourSelect.value = wanted;
        tourSelect.removeAttribute('aria-invalid');
        const error = $('#tour-error');
        if (error) error.textContent = '';
        tourSelect.classList.add('is-prefilled');
        window.setTimeout(() => tourSelect.classList.remove('is-prefilled'), 1600);
      }
    });
  });

  /* ----------------------------------------------------------------------
     Gallery lightbox
     ---------------------------------------------------------------------- */
  const lightbox = $('#lightbox');
  const galleryItems = $$('.gallery__item');
  const lightboxImg = $('#lightbox-img');
  const lightboxCaption = $('#lightbox-caption');
  const lightboxCounter = $('#lightbox-counter');
  let galleryIndex = 0;

  function renderLightbox(index) {
    const item = galleryItems[index];
    if (!item) return;
    galleryIndex = index;
    if (lightboxImg) {
      lightboxImg.src = item.dataset.full || '';
      lightboxImg.alt = item.dataset.alt || '';
    }
    if (lightboxCaption) lightboxCaption.textContent = item.dataset.caption || '';
    if (lightboxCounter) {
      // keep "current / total" reading left-to-right inside an RTL layout
      const current = document.createElement('span');
      const total = document.createElement('span');
      current.textContent = toFa(index + 1);
      total.textContent = toFa(galleryItems.length);
      lightboxCounter.replaceChildren(current, document.createTextNode(' / '), total);
      lightboxCounter.setAttribute('dir', 'ltr');
    }
  }

  function stepLightbox(direction) {
    const next = (galleryIndex + direction + galleryItems.length) % galleryItems.length;
    renderLightbox(next);
  }

  if (lightbox && galleryItems.length && typeof lightbox.showModal === 'function') {
    galleryItems.forEach((item, index) => {
      item.addEventListener('click', () => {
        renderLightbox(index);
        lightbox.showModal();
        document.body.classList.add('nav-open');
      });
    });

    const closeLightbox = () => lightbox.close();
    $('#lightbox-close')?.addEventListener('click', closeLightbox);
    $('#lightbox-next')?.addEventListener('click', () => stepLightbox(1));
    $('#lightbox-prev')?.addEventListener('click', () => stepLightbox(-1));

    lightbox.addEventListener('click', (event) => {
      if (event.target === lightbox) lightbox.close();
    });
    lightbox.addEventListener('keydown', (event) => {
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        stepLightbox(1);
      } else if (event.key === 'ArrowRight') {
        event.preventDefault();
        stepLightbox(-1);
      }
    });
    lightbox.addEventListener('close', () => {
      document.body.classList.remove('nav-open');
      galleryItems[galleryIndex]?.focus();
    });
  }

  /* ----------------------------------------------------------------------
     FAQ accordion
     ---------------------------------------------------------------------- */
  const faqTriggers = $$('.faq__trigger');

  function setFaqState(trigger, expanded) {
    const panel = document.getElementById(trigger.getAttribute('aria-controls'));
    trigger.setAttribute('aria-expanded', String(expanded));
    if (panel) {
      panel.inert = !expanded;
      panel.classList.toggle('is-open', expanded);
    }
  }

  faqTriggers.forEach((trigger) => {
    setFaqState(trigger, trigger.getAttribute('aria-expanded') === 'true');
    trigger.addEventListener('click', () => {
      const isOpen = trigger.getAttribute('aria-expanded') === 'true';
      faqTriggers.forEach((other) => {
        if (other !== trigger) setFaqState(other, false);
      });
      setFaqState(trigger, !isOpen);
    });
  });

  /* ----------------------------------------------------------------------
     Booking form
     ---------------------------------------------------------------------- */
  const form = $('#booking-form');
  const successPanel = $('#booking-success');
  const successText = $('#booking-success-text');

  function setFieldError(field, message) {
    if (!field) return;
    const errorId = field.getAttribute('aria-describedby');
    const errorEl = errorId ? document.getElementById(errorId) : null;
    if (errorEl) errorEl.textContent = message;
    if (message) field.setAttribute('aria-invalid', 'true');
    else field.removeAttribute('aria-invalid');
  }

  function normalizePhone(raw) {
    let value = toEn(raw).replace(/[^\d+]/g, '');
    if (value.startsWith('+98')) value = `0${value.slice(3)}`;
    else if (value.startsWith('98') && value.length === 12) value = `0${value.slice(2)}`;
    else if (value.startsWith('9') && value.length === 10) value = `0${value}`;
    return value;
  }

  if (form && successPanel) {
    const nameField = $('#name', form);
    const phoneField = $('#phone', form);
    const consentField = $('#consent', form);

    [nameField, phoneField, tourSelect, consentField].forEach((field) => {
      if (!field) return;
      const clear = () => setFieldError(field, '');
      field.addEventListener('input', clear);
      field.addEventListener('change', clear);
    });

    form.addEventListener('submit', (event) => {
      event.preventDefault();
      let firstInvalid = null;
      const errors = [];

      const name = (nameField?.value || '').trim();
      if (name.length < 2) {
        setFieldError(nameField, 'نام را کامل بنویس.');
        errors.push(nameField);
      }

      const phone = normalizePhone(phoneField?.value || '');
      if (!/^09\d{9}$/.test(phone)) {
        setFieldError(phoneField, 'شمارهٔ موبایل را با ۰۹ شروع کن؛ مثلاً ۰۹۱۲۱۲۳۴۵۶۷.');
        errors.push(phoneField);
      }

      if (!tourSelect || !tourSelect.value) {
        setFieldError(tourSelect, 'یک تور یا تجربه انتخاب کن.');
        errors.push(tourSelect);
      }

      if (!consentField?.checked) {
        setFieldError(consentField, 'برای ادامه، تأیید تماس تیم لازم است.');
        errors.push(consentField);
      }

      firstInvalid = errors.find(Boolean);
      if (firstInvalid) {
        firstInvalid.focus({ preventScroll: false });
        return;
      }

      const submitButton = $('button[type="submit"]', form);
      const tourName = tourSelect.value;
      const contact = toFa(phone);

      const showSuccess = () => {
        form.hidden = true;
        successPanel.hidden = false;
        if (successText) {
          successText.textContent = `${name} عزیز، درخواست «${tourName}» ثبت شد. تیم وایکینگ در ۲۴ ساعت آینده با شمارهٔ ${contact} تماس می‌گیرد.`;
        }
        successPanel.focus?.();
        successPanel.setAttribute('tabindex', '-1');
        successPanel.focus();
      };

      const endpoint = form.dataset.endpoint;
      if (endpoint) {
        if (submitButton) {
          submitButton.disabled = true;
          submitButton.dataset.label = submitButton.textContent;
          submitButton.textContent = 'در حال ارسال…';
        }
        fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify({
            name,
            phone,
            tour: tourName,
            window: $('#window', form)?.value || '',
            message: $('#message', form)?.value || '',
          }),
        })
          .then((response) => {
            if (!response.ok) throw new Error('request failed');
            showSuccess();
          })
          .catch(() => {
            const note = $('.booking-form__note', form);
            if (note) {
              note.textContent = 'ارسال فرم انجام نشد. لطفاً دوباره تلاش کن یا در اینستاگرام پیام بده.';
              note.classList.add('is-error');
            }
          })
          .finally(() => {
            if (submitButton) {
              submitButton.disabled = false;
              if (submitButton.dataset.label) submitButton.textContent = submitButton.dataset.label;
            }
          });
        return;
      }

      showSuccess();
    });

    $('#booking-reset')?.addEventListener('click', () => {
      form.reset();
      [nameField, phoneField, tourSelect, consentField].forEach((field) =>
        setFieldError(field, '')
      );
      successPanel.hidden = true;
      form.hidden = false;
      nameField?.focus();
    });
  }

  /* ----------------------------------------------------------------------
     Policy dialogs
     ---------------------------------------------------------------------- */
  const policyDialog = $('#policy-dialog');
  const policyTitle = $('#policy-title');
  const policyBody = $('#policy-body');
  const policyTitles = {
    terms: 'شرایط و قوانین',
    privacy: 'حریم خصوصی',
    cancellation: 'لغو و تغییر رزرو',
  };

  if (policyDialog && policyBody && typeof policyDialog.showModal === 'function') {
    $$('[data-policy]').forEach((button) => {
      button.addEventListener('click', () => {
        const key = button.dataset.policy;
        const template = document.getElementById(`policy-${key}`);
        if (!template) return;
        if (policyTitle) policyTitle.textContent = policyTitles[key] || 'وایکینگ آفرود';
        policyBody.replaceChildren(template.content.cloneNode(true));
        policyDialog.showModal();
        document.body.classList.add('nav-open');
      });
    });

    $('#policy-close')?.addEventListener('click', () => policyDialog.close());
    policyDialog.addEventListener('click', (event) => {
      if (event.target === policyDialog) policyDialog.close();
    });
    policyDialog.addEventListener('close', () => {
      document.body.classList.remove('nav-open');
    });
  }

  /* ----------------------------------------------------------------------
     Anchor focus management (nice for keyboard users)
     ---------------------------------------------------------------------- */
  $$('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', () => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) target.setAttribute('tabindex', '-1');
    });
  });
})();
