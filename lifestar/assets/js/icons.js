/* ==========================================================================
   LIFE STAR — inline icon set (no external requests)
   ========================================================================== */
(function () {
  const P = {
    cart: '<circle cx="9" cy="20" r="1.6"/><circle cx="18" cy="20" r="1.6"/><path d="M2.5 3h2.2l2.4 11.2a2 2 0 0 0 2 1.6h8.7a2 2 0 0 0 2-1.5L21.5 7H6"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="M20 20l-3.6-3.6"/>',
    heart: '<path d="M20.8 5.6a5.4 5.4 0 0 0-7.6 0L12 6.8l-1.2-1.2a5.4 5.4 0 0 0-7.6 7.6l1.2 1.2L12 21.6l7.6-7.2 1.2-1.2a5.4 5.4 0 0 0 0-7.6z"/>',
    menu: '<path d="M3 6h18M3 12h18M3 18h18"/>',
    close: '<path d="M6 6l12 12M18 6L6 18"/>',
    chevronDown: '<path d="M6 9l6 6 6-6"/>',
    chevronLeft: '<path d="M15 18l-6-6 6-6"/>',
    arrowLeft: '<path d="M19 12H5M11 18l-6-6 6-6"/>',
    arrowRight: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    star: '<path d="M12 2.6l2.9 5.9 6.5.9-4.7 4.6 1.1 6.4-5.8-3-5.8 3 1.1-6.4L2.6 9.4l6.5-.9z"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    minus: '<path d="M5 12h14"/>',
    trash: '<path d="M4 7h16M9 7V4.5h6V7M6.5 7l.9 12.2a1.8 1.8 0 0 0 1.8 1.8h5.6a1.8 1.8 0 0 0 1.8-1.8L17.5 7"/>',
    check: '<path d="M20 6L9 17l-5-5"/>',
    checkCircle: '<circle cx="12" cy="12" r="9"/><path d="M8.5 12.5l2.5 2.5 4.5-5"/>',
    truck: '<path d="M3 6h11v9H3zM14 9h4l3 3.2V15h-7"/><circle cx="7" cy="18" r="1.7"/><circle cx="17.5" cy="18" r="1.7"/>',
    shield: '<path d="M12 3l7.5 3v5.4c0 4.4-3 8.3-7.5 9.6-4.5-1.3-7.5-5.2-7.5-9.6V6z"/><path d="M9 12l2 2 4-4"/>',
    bolt: '<path d="M13.5 2.5L4 14h6.5L10 21.5 20 10h-6.5z"/>',
    leaf: '<path d="M20 4C11 4 4 8 4 15.5A4.5 4.5 0 0 0 8.5 20C16 20 20 13 20 4z"/><path d="M4.5 19.5C7 15 11 12 16 10"/>',
    clock: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>',
    fire: '<path d="M12 3s5 4.2 5 9a5 5 0 0 1-10 0c0-2 1-3.4 2-4.5.4 1.6 1.2 2.4 2.2 2.9C11 8 12 5.5 12 3z"/>',
    phone: '<path d="M6.5 3.5h3l1.6 4-2 1.5a12 12 0 0 0 6 6l1.5-2 4 1.6v3a2 2 0 0 1-2.2 2A17 17 0 0 1 4.5 5.7 2 2 0 0 1 6.5 3.5z"/>',
    mail: '<rect x="3" y="5" width="18" height="14" rx="2.5"/><path d="M3.5 7l8.5 6 8.5-6"/>',
    instagram: '<rect x="3.5" y="3.5" width="17" height="17" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17" cy="7" r="1" fill="currentColor" stroke="none"/>',
    telegram: '<path d="M21 4L2.8 11.2l5 1.7L20 6.5l-8.6 8.2.3 5 3-3.4 4 2.6z"/>',
    whatsapp: '<path d="M12 3a9 9 0 0 0-7.6 13.8L3 21l4.3-1.3A9 9 0 1 0 12 3z"/><path d="M8.8 8.3c-.3 0-.8.1-1.1.5-.4.5-.9 1.2-.5 2.4.5 1.4 1.9 3.4 4.2 4.4 1.6.7 2.4.4 2.9.1.5-.3 1-.9 1.1-1.4.1-.4 0-.8-.2-.9l-1.6-.8c-.3-.1-.5 0-.7.2l-.5.6c-.1.2-.3.2-.5.1-.6-.2-2.4-1.2-2.9-2.2-.1-.2 0-.4.1-.5l.5-.5c.2-.2.2-.4.1-.6l-.6-1.4c-.1-.3-.3-.4-.5-.4z"/>',
    pin: '<path d="M12 21s7-5.5 7-11a7 7 0 1 0-14 0c0 5.5 7 11 7 11z"/><circle cx="12" cy="10" r="2.6"/>',
    filter: '<path d="M4 6h16M7 12h10M10 18h4"/>',
    sparkles: '<path d="M12 3l1.6 4.4L18 9l-4.4 1.6L12 15l-1.6-4.4L6 9l4.4-1.6z"/><path d="M18.5 15.5l.8 2 2 .8-2 .8-.8 2-.8-2-2-.8 2-.8z"/>',
    can: '<rect x="6" y="3.5" width="12" height="17" rx="3"/><path d="M6.6 8h10.8M6.6 16h10.8"/>',
    dumbbell: '<path d="M4 9v6M7 7v10M17 7v10M20 9v6M7 12h10"/>',
    drop: '<path d="M12 3s6 6.2 6 10.4A6 6 0 0 1 6 13.4C6 9.2 12 3 12 3z"/>',
    coffee: '<path d="M4 8h13v6a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5z"/><path d="M17 9h2.2a2.6 2.6 0 0 1 0 5.2H17"/><path d="M4 22h14"/>',
    snow: '<path d="M12 2.5v19M4 7l16 10M20 7L4 17"/>',
    tag: '<path d="M20.5 12.5l-8 8a2 2 0 0 1-2.8 0l-6.2-6.2a2 2 0 0 1-.6-1.6l.4-5.4a2 2 0 0 1 1.8-1.8l5.4-.4a2 2 0 0 1 1.6.6l6.4 6.4a2 2 0 0 1 0 2.4z"/><circle cx="8.5" cy="8.5" r="1.2" fill="currentColor" stroke="none"/>',
    gift: '<rect x="3.5" y="8.5" width="17" height="12" rx="2"/><path d="M3.5 12.5h17M12 8.5V20.5"/><path d="M12 8.5S10.5 4 8 4a2.5 2.5 0 0 0 0 4.5zM12 8.5S13.5 4 16 4a2.5 2.5 0 0 1 0 4.5z"/>',
    zoom: '<circle cx="11" cy="11" r="7"/><path d="M20 20l-3.6-3.6M11 8.5v5M8.5 11h5"/>',
    info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5.5M12 7.8v.4"/>',
    package: '<path d="M12 3l8 4.2v9.6L12 21l-8-4.2V7.2z"/><path d="M4 7.2l8 4.3 8-4.3M12 11.5V21"/>',
    card: '<rect x="3" y="5" width="18" height="14" rx="3"/><path d="M3 10h18M6.5 15h3"/>',
    user: '<circle cx="12" cy="8" r="3.6"/><path d="M4.5 20.5a7.5 7.5 0 0 1 15 0"/>',
    router: '<path d="M3 12h18"/>',
    refresh: '<path d="M20 12a8 8 0 1 1-2.4-5.7"/><path d="M20 4v4h-4"/>',
    play: '<path d="M8 5l11 7-11 7z"/>',
    flash: '<path d="M6 3h9l-3 6h6l-9 12 2-8H5z"/>',
  };

  function icon(name, cls) {
    const p = P[name] || P.info;
    return (
      '<svg class="ic ' +
      (cls || "") +
      '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" ' +
      'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">' +
      p +
      "</svg>"
    );
  }

  window.icon = icon;
  window.ICON_NAMES = Object.keys(P);
})();
