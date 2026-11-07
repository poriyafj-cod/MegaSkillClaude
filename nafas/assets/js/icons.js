/* ==========================================================================
   NAFAS — inline SVG icon set (stroke based, 24×24 grid)
   Usage: NAFAS_ICONS.heart  →  <svg …>
   ========================================================================== */
(function () {
  "use strict";

  const s = (body, extra) =>
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" ' +
    'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"' +
    (extra || "") +
    ">" +
    body +
    "</svg>";

  window.NAFAS_ICONS = {
    search: s('<circle cx="11" cy="11" r="7"/><path d="M16.5 16.5 21 21"/>'),
    heart: s(
      '<path d="M20.8 4.7a5.4 5.4 0 0 0-7.6 0L12 5.9l-1.2-1.2a5.4 5.4 0 0 0-7.6 7.6L12 21l8.8-8.7a5.4 5.4 0 0 0 0-7.6z"/>'
    ),
    bag: s(
      '<path d="M5.5 7.5h13l1.3 12.2a1 1 0 0 1-1 1.1H5.2a1 1 0 0 1-1-1.1z"/><path d="M9 7.5V6a3 3 0 0 1 6 0v1.5"/>'
    ),
    menu: s('<path d="M4 7h16M4 12h16M4 17h16"/>'),
    close: s('<path d="M6 6l12 12M18 6 6 18"/>'),
    user: s('<circle cx="12" cy="8.5" r="3.7"/><path d="M4.8 20a7.3 7.3 0 0 1 14.4 0"/>'),
    "arrow-left": s('<path d="M20 12H5"/><path d="m11 6-6 6 6 6"/>'),
    "arrow-right": s('<path d="M4 12h15"/><path d="m13 6 6 6-6 6"/>'),
    "arrow-up-left": s('<path d="M17 17 7 7"/><path d="M7 15V7h8"/>'),
    plus: s('<path d="M12 5v14M5 12h14"/>'),
    minus: s('<path d="M5 12h14"/>'),
    trash: s('<path d="M4 7h16"/><path d="M9 7V5h6v2"/><path d="M6 7l1 13h10l1-13"/>'),
    check: s('<path d="m5 13 4.5 4.5L19 7"/>'),
    star: s(
      '<path d="M12 3.6l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 17l-5.2 2.7 1-5.8L3.5 9.8l5.9-.9z" fill="currentColor" stroke="none"/>'
    ),
    sparkle: s(
      '<path d="M12 2.5l1.9 5.1 5.1 1.9-5.1 1.9L12 16.5l-1.9-5.1L5 9.5l5.1-1.9z" fill="currentColor" stroke="none"/><path d="M19 15l.9 2.1 2.1.9-2.1.9L19 21l-.9-2.1-2.1-.9 2.1-.9z" fill="currentColor" stroke="none"/>'
    ),
    truck: s(
      '<path d="M2.5 7.5h10v9h-10z"/><path d="M12.5 10.5H17l3.5 3.2v2.8h-8z"/><circle cx="6.5" cy="18.5" r="1.6"/><circle cx="16.8" cy="18.5" r="1.6"/>'
    ),
    shield: s('<path d="M12 3l7 2.5v5.7c0 4.3-2.9 7.6-7 9.3-4.1-1.7-7-5-7-9.3V5.5z"/><path d="m9 12 2 2 4-4"/>'),
    refresh: s('<path d="M20 11a8 8 0 1 0-2.6 6"/><path d="M20 5v6h-6"/>'),
    gift: s(
      '<path d="M3.5 11.5h17v8.5h-17z"/><path d="M2.5 7.5h19v4h-19z"/><path d="M12 7.5V20"/><path d="M12 7.5S10.8 3.5 8.4 3.5a2.2 2.2 0 0 0 0 4.4z"/><path d="M12 7.5s1.2-4 3.6-4a2.2 2.2 0 0 1 0 4.4z"/>'
    ),
    instagram: s(
      '<rect x="3.5" y="3.5" width="17" height="17" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17" cy="7" r="1" fill="currentColor" stroke="none"/>'
    ),
    telegram: s('<path d="M21 4 2.8 11.2l5.4 1.7L10 19l3.2-3.5 4.6 3.2z"/><path d="m8.2 12.9 8-6.4-4.9 8.2"/>'),
    whatsapp: s(
      '<path d="M20.5 11.8a8.4 8.4 0 0 1-12.3 7.5L3.5 20.5l1.3-4.6a8.4 8.4 0 1 1 15.7-4.1z"/><path d="M9 9.5c0 3 2.4 5.4 5.4 5.4"/>'
    ),
    mail: s('<rect x="3" y="5" width="18" height="14" rx="2.5"/><path d="m4 7 8 6 8-6"/>'),
    phone: s('<path d="M7 3.5h3l1.6 4-2 1.6a11.5 11.5 0 0 0 5.3 5.3l1.6-2 4 1.6v3a2 2 0 0 1-2.2 2A16.5 16.5 0 0 1 5 5.7a2 2 0 0 1 2-2.2z"/>'),
    pin: s('<path d="M12 21s7-5.6 7-11a7 7 0 1 0-14 0c0 5.4 7 11 7 11z"/><circle cx="12" cy="10" r="2.6"/>'),
    zoom: s('<circle cx="11" cy="11" r="7"/><path d="M16.5 16.5 21 21"/><path d="M11 8.5v5M8.5 11h5"/>'),
    filter: s('<path d="M4 6h16M7 12h10M10 18h4"/>'),
    "chevron-down": s('<path d="m6 9 6 6 6-6"/>'),
    "chevron-left": s('<path d="m14 6-6 6 6 6"/>'),
    copy: s('<rect x="9" y="9" width="11" height="11" rx="2.5"/><path d="M15 6.5V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h.5"/>'),
    lock: s('<rect x="4.5" y="10.5" width="15" height="10" rx="2.5"/><path d="M8 10.5V8a4 4 0 0 1 8 0v2.5"/>'),
    card: s('<rect x="2.5" y="5.5" width="19" height="13" rx="2.5"/><path d="M2.5 10h19"/><path d="M6 15h3"/>'),
    wallet: s('<path d="M3.5 8.5A2.5 2.5 0 0 1 6 6h12.5v12H6a2.5 2.5 0 0 1-2.5-2.5z"/><path d="M16 11h4v4h-4z"/>'),
    home: s('<path d="m3.5 11 8.5-7 8.5 7"/><path d="M6 10v10h12V10"/>'),
    box: s('<path d="m12 3 8 4.5v9L12 21l-8-4.5v-9z"/><path d="m4 7.5 8 4.5 8-4.5M12 12v9"/>'),
    /* category icons */
    necklace: s('<path d="M5 3.5v4.2a7 7 0 0 0 14 0V3.5"/><path d="M12 14.7v2.8"/><circle cx="12" cy="19.4" r="2.1"/>'),
    earring: s('<circle cx="9" cy="14" r="5"/><path d="M15.5 3.5v3.6"/><circle cx="15.5" cy="9.6" r="2.5"/>'),
    ring: s('<circle cx="12" cy="15" r="5.6"/><path d="m9.4 6.6 2.6-3 2.6 3-2.6 2.6z"/>'),
    bracelet: s('<ellipse cx="12" cy="12" rx="8" ry="5.2" transform="rotate(-18 12 12)"/><circle cx="17.5" cy="7.4" r="1.8"/>'),
    hair: s('<path d="M12 3c-3 0-4.6 2-4.6 3.6 0 1.4.9 2.3 2.1 2.8L12 10l2.5-.6c1.2-.5 2.1-1.4 2.1-2.8C16.6 5 15 3 12 3z"/><path d="M9.5 10.4 8 20.6M14.5 10.4 16 20.6"/><path d="M7.8 15.6h8.4"/>'),
  };

  window.svgIcon = function (name, cls) {
    const raw = window.NAFAS_ICONS[name] || "";
    return cls ? raw.replace("<svg", '<svg class="' + cls + '"') : raw;
  };
})();
