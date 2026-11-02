/* ==========================================================================
   LIFE STAR — catalog & brand data
   ========================================================================== */
(function () {
  const config = {
    brandFa: "لایف استار",
    brandEn: "LIFE STAR",
    phone: "۰۲۱-۹۱۰۰۴۴۵۵",
    phoneRaw: "02191004455",
    email: "hello@lifestar.energy",
    instagram: "@lifestar.energy",
    address: "تهران، خیابان ولیعصر، برج نگین، طبقهٔ ۳، واحد ۳۰۲",
    freeShipFrom: 1200000,
    shipCost: 45000,
    codCost: 30000,
    currency: "تومان",
  };

  const categories = [
    { id: "classic", name: "انرژی کلاسیک", en: "CLASSIC", icon: "bolt", glow: "rgba(255,43,61,.45)" },
    { id: "zero", name: "زیرو شکر", en: "ZERO SUGAR", icon: "leaf", glow: "rgba(70,211,255,.38)" },
    { id: "coffee", name: "کافئین غلیظ", en: "HARD KICK", icon: "coffee", glow: "rgba(255,122,26,.42)" },
    { id: "recovery", name: "بازیابی", en: "RECOVERY", icon: "drop", glow: "rgba(216,255,62,.38)" },
  ];

  /* pack tiers — multiplier applied to the single-can price */
  const packTiers = [
    { size: 1, label: "۱ عدد", off: 0, mult: 1 },
    { size: 6, label: "۶ عدد", off: 8, mult: 0.92 },
    { size: 12, label: "۱۲ عدد", off: 15, mult: 0.85 },
    { size: 24, label: "۲۴ عدد", off: 22, mult: 0.78 },
  ];

  const products = [
    {
      id: "p01",
      slug: "sour-cherry",
      name: "گیلاس ترش",
      nameEn: "SOUR CHERRY",
      cat: "classic",
      colors: { c1: "#e4122a", c2: "#8a0714", ink: "#ffffff", accent: "#ffd7db" },
      caffeine: 150,
      sugar: 24,
      kcal: 118,
      volume: 250,
      price: 68000,
      oldPrice: null,
      rating: 4.9,
      reviews: 412,
      tags: ["bestseller"],
      stock: 48,
      notes: ["گیلاس سیاه", "لیموی ترش", "تارت پایانی"],
      desc: "همان قوطی قرمزی که همه می‌شناسن؛ گیلاس ترش با یک پایان تارت و کافئین ۱۵۰ میلی‌گرمی که در ۱۰ دقیقه اول حسش می‌کنی. برای روزهای سنگین و شب‌های تمرین.",
      ingredients: "آب گازدار، شربت گلوکز، کنسانترهٔ گیلاس، تورین، کافئین، ویتامین B6 و B12، طعم‌دهندهٔ طبیعی، رنگ طبیعی",
    },
    {
      id: "p02",
      slug: "tropical-mango",
      name: "انبهٔ استوایی",
      nameEn: "TROPICAL MANGO",
      cat: "classic",
      colors: { c1: "#ff8a1e", c2: "#b64a00", ink: "#1a0d00", accent: "#ffe0b8" },
      caffeine: 140,
      sugar: 22,
      kcal: 112,
      volume: 250,
      price: 68000,
      oldPrice: null,
      rating: 4.7,
      reviews: 268,
      tags: [],
      stock: 36,
      notes: ["انبهٔ رسیده", "آناناس", "مرکبات"],
      desc: "انبهٔ آبدار با ته‌مایهٔ آناناس؛ شیرین، خنک و بدون سنگینی. انتخاب کسانی که انرژی می‌خوان ولی طعم تلخ قهوه را دوست ندارن.",
      ingredients: "آب گازدار، کنسانترهٔ انبه، شربت فروکتوز، تورین، کافئین، ویتامین‌های گروه B، اسید سیتریک",
    },
    {
      id: "p03",
      slug: "blue-raspberry",
      name: "تمشک آبی",
      nameEn: "BLUE RASPBERRY",
      cat: "classic",
      colors: { c1: "#2f7bff", c2: "#0d2f8a", ink: "#ffffff", accent: "#bfe0ff" },
      caffeine: 160,
      sugar: 26,
      kcal: 124,
      volume: 250,
      price: 72000,
      oldPrice: null,
      rating: 4.8,
      reviews: 311,
      tags: ["bestseller"],
      stock: 22,
      notes: ["تمشک آبی", "آب‌نبات", "خنکای منتول"],
      desc: "طعم آب‌نباتی و خنک تمشک آبی با ۱۶۰ میلی‌گرم کافئین — قوی‌ترین عضو کالکشن کلاسیک. برای قبل از تمرین‌های سنگین یا شیفت‌های شب.",
      ingredients: "آب گازدار، شربت گلوکز، طعم‌دهندهٔ تمشک آبی، تورین، کافئین، نیاسین، ویتامین B6، B12",
    },
    {
      id: "p04",
      slug: "citrus-burst",
      name: "انفجار مرکبات",
      nameEn: "CITRUS BURST",
      cat: "classic",
      colors: { c1: "#ffd21a", c2: "#c08a00", ink: "#1a1200", accent: "#fff4bf" },
      caffeine: 130,
      sugar: 21,
      kcal: 104,
      volume: 250,
      price: 65000,
      oldPrice: 78000,
      rating: 4.6,
      reviews: 189,
      tags: ["sale"],
      stock: 54,
      notes: ["لیمو", "گریپ‌فروت", "پوست پرتقال"],
      desc: "ترکیب لیمو و گریپ‌فروت با پوست پرتقال؛ سبک‌ترین طعم کالکشن برای صبح‌ها و تمرین‌های هوازی.",
      ingredients: "آب گازدار، کنسانترهٔ مرکبات، تورین، کافئین، ویتامین C، طعم‌دهندهٔ طبیعی",
    },
    {
      id: "p05",
      slug: "watermelon-wave",
      name: "موج هندوانه",
      nameEn: "WATERMELON WAVE",
      cat: "classic",
      colors: { c1: "#ff5d8f", c2: "#0f7a4f", ink: "#ffffff", accent: "#d9ffe9" },
      caffeine: 140,
      sugar: 23,
      kcal: 116,
      volume: 250,
      price: 68000,
      oldPrice: null,
      rating: 4.8,
      reviews: 97,
      tags: ["new"],
      stock: 40,
      notes: ["هندوانه", "خیار", "نعنا"],
      desc: "هندوانهٔ خنک با ته‌مایهٔ خیار و نعنا؛ سبک، تابستانی و بی‌نهایت نوشیدنی‌پذیر.",
      ingredients: "آب گازدار، کنسانترهٔ هندوانه، عصارهٔ نعنا، تورین، کافئین، ویتامین‌های B",
    },
    {
      id: "p06",
      slug: "zero-grape",
      name: "انگور زیرو",
      nameEn: "ZERO GRAPE",
      cat: "zero",
      colors: { c1: "#7b3cff", c2: "#2a0a63", ink: "#ffffff", accent: "#e0d1ff" },
      caffeine: 150,
      sugar: 0,
      kcal: 8,
      volume: 250,
      price: 75000,
      oldPrice: null,
      rating: 4.7,
      reviews: 204,
      tags: ["bestseller"],
      stock: 30,
      notes: ["انگور سیاه", "بلوبری", "بدون شکر"],
      desc: "انگور سیاه پررنگ، صفر شکر و فقط ۸ کیلوکالری. برای کسانی که کافئین می‌خوان ولی کالری را می‌شمارن.",
      ingredients: "آب گازدار، طعم‌دهندهٔ انگور، سوکرالوز، تورین، کافئین، ویتامین B12",
    },
    {
      id: "p07",
      slug: "peach-rush",
      name: "هلو راش",
      nameEn: "PEACH RUSH",
      cat: "zero",
      colors: { c1: "#ff9d5c", c2: "#c2410c", ink: "#2a1000", accent: "#ffe6d1" },
      caffeine: 120,
      sugar: 0,
      kcal: 6,
      volume: 250,
      price: 72000,
      oldPrice: null,
      rating: 4.5,
      reviews: 143,
      tags: [],
      stock: 33,
      notes: ["هلو", "زردآلو", "گل‌محمدی"],
      desc: "هلوی رسیده با رایحهٔ گل‌محمدی؛ نرم و معطر، بدون شکر و بدون حس شیرینی مصنوعی.",
      ingredients: "آب گازدار، کنسانترهٔ هلو، عصارهٔ گل‌محمدی، سوکرالوز، کافئین، تورین",
    },
    {
      id: "p08",
      slug: "cola-charge",
      name: "کولا چارج",
      nameEn: "COLA CHARGE",
      cat: "classic",
      colors: { c1: "#8b1d1d", c2: "#2b0a0a", ink: "#ffe4a8", accent: "#ffcf6b" },
      caffeine: 170,
      sugar: 27,
      kcal: 128,
      volume: 250,
      price: 62000,
      oldPrice: 74000,
      rating: 4.4,
      reviews: 176,
      tags: ["sale"],
      stock: 60,
      notes: ["کولا", "کاراملا", "وانیل"],
      desc: "کولای کلاسیک با کافئین ۱۷۰ میلی‌گرم؛ بیشترین کافئین کالکشن و طعمی که همه می‌شناسن.",
      ingredients: "آب گازدار، شربت گلوکز، کارامل، اسید فسفریک، تورین، کافئین، طعم‌دهندهٔ طبیعی",
    },
    {
      id: "p09",
      slug: "mint-storm",
      name: "نعنا استورم",
      nameEn: "MINT STORM",
      cat: "zero",
      colors: { c1: "#22d3a5", c2: "#04624a", ink: "#06221b", accent: "#c7fff0" },
      caffeine: 140,
      sugar: 0,
      kcal: 4,
      volume: 250,
      price: 72000,
      oldPrice: null,
      rating: 4.6,
      reviews: 88,
      tags: ["new"],
      stock: 26,
      notes: ["نعنا", "لیموی سبز", "منتول"],
      desc: "انفجار نعنا با لیموی سبز؛ سردترین حسی که می‌تونی از یک قوطی بگیری. صفر شکر.",
      ingredients: "آب گازدار، عصارهٔ نعنا، آب لیمو، سوکرالوز، کافئین، تورین، ویتامین B6",
    },
    {
      id: "p10",
      slug: "lychee-light",
      name: "لیچی لایت",
      nameEn: "LYCHEE LIGHT",
      cat: "zero",
      colors: { c1: "#ff77b0", c2: "#a31b5b", ink: "#ffffff", accent: "#ffe0ee" },
      caffeine: 110,
      sugar: 0,
      kcal: 5,
      volume: 250,
      price: 75000,
      oldPrice: null,
      rating: 4.5,
      reviews: 121,
      tags: [],
      stock: 18,
      notes: ["لیچی", "گل رز", "مرکبات"],
      desc: "لیچی معطر با رایحهٔ گل رز؛ کافئین ملایم ۱۱۰ میلی‌گرم برای عصرهای کاری.",
      ingredients: "آب گازدار، کنسانترهٔ لیچی، عصارهٔ گل رز، سوکرالوز، کافئین، تورین",
    },
    {
      id: "p11",
      slug: "caramel-coffee",
      name: "کارامل کافی",
      nameEn: "CARAMEL COFFEE",
      cat: "coffee",
      colors: { c1: "#b4703a", c2: "#3a1c0b", ink: "#fff1df", accent: "#ffd9a8" },
      caffeine: 200,
      sugar: 18,
      kcal: 96,
      volume: 250,
      price: 78000,
      oldPrice: null,
      rating: 4.9,
      reviews: 156,
      tags: ["bestseller"],
      stock: 24,
      notes: ["اسپرسو", "کارامل", "شیر"],
      desc: "اسپرسوی دم‌آوری سرد با کارامل و شیر؛ ۲۰۰ میلی‌گرم کافئین — جایگزین قهوهٔ صبح، در یک قوطی سرد.",
      ingredients: "آب، عصارهٔ قهوهٔ عربیکا، شیر کم‌چرب، شربت کارامل، کافئین، تورین",
    },
    {
      id: "p12",
      slug: "salt-lime",
      name: "نمک و لیمو",
      nameEn: "SALT LIME",
      cat: "recovery",
      colors: { c1: "#a3e635", c2: "#3f6212", ink: "#12200a", accent: "#e9ffc2" },
      caffeine: 90,
      sugar: 9,
      kcal: 42,
      volume: 250,
      price: 70000,
      oldPrice: null,
      rating: 4.7,
      reviews: 134,
      tags: ["new"],
      stock: 44,
      notes: ["لیمو", "نمک دریایی", "الکترولیت"],
      desc: "آب‌نمک ورزشی با لیمو؛ سدیم، پتاسیم و منیزیم برای بعد از تمرین. کافئین کم، بازیابی سریع.",
      ingredients: "آب، آب لیمو، نمک دریایی، کلرید پتاسیم، منیزیم سیترات، کافئین سبز",
    },
  ];

  const coupons = {
    STAR10: { type: "percent", value: 10, min: 0, label: "۱۰٪ تخفیف" },
    NIGHTOWL15: { type: "percent", value: 15, min: 1500000, label: "۱۵٪ تخفیف بالای ۱٫۵ میلیون" },
    FREESHIP: { type: "ship", value: 100, min: 0, label: "ارسال رایگان" },
  };

  const reviewsPool = [
    { name: "نیلوفر", text: "بعد از تمرین کیک‌باکس خوردم، واقعاً پام شد. طعم گیلاسش هم مصنوعی نیست.", stars: 5 },
    { name: "سارا", text: "قوطی‌ها رو برای باشگاه سفارش دادم؛ بسته‌بندی خیلی تمیز و سریع رسید.", stars: 5 },
    { name: "آیدا", text: "زیرو انگور بهترین جایگزین نوشابه شد برام. بدون شکر و بدون افت انرژی.", stars: 5 },
    { name: "امیرحسین", text: "کارامل کافی جای قهوهٔ صبحم رو گرفته. برای شیفت شب عالیه.", stars: 4 },
    { name: "مهدی", text: "نعنا استورم بعد از دوش گرفتن حس بیداری کامل می‌ده. فقط حیف که زود تموم می‌شه.", stars: 5 },
    { name: "رها", text: "برای تیم فوتسال ۲۴تایی گرفتیم، قیمت پک واقعاً منطقی بود.", stars: 5 },
  ];

  /* ---------- helpers ---------- */
  const money = (n) => Math.round(n).toLocaleString("fa-IR");

  function priceFor(product, tierIndex) {
    const tier = packTiers[tierIndex] || packTiers[0];
    const unit = Math.round((product.price * tier.mult) / 1000) * 1000;
    return { unit, total: unit * tier.size, off: tier.off };
  }

  function bySlug(slug) {
    return products.find((p) => p.slug === slug) || null;
  }

  function related(product, limit) {
    const same = products.filter((p) => p.slug !== product.slug && p.cat === product.cat);
    const rest = products.filter((p) => p.slug !== product.slug && p.cat !== product.cat);
    return same.concat(rest).slice(0, limit || 4);
  }

  /**
   * Inline SVG can artwork — one unique gradient id per product so several
   * cans can live on the same page.
   */
  function canSvg(p, opts) {
    const o = opts || {};
    const id = "can-" + p.slug;
    const c = p.colors;
    const label = o.label === false ? "" : p.nameEn;
    const w = o.width ? ' width="' + o.width + '"' : "";
    return (
      '<svg class="can-svg" viewBox="0 0 220 390" role="img" aria-label="' +
      p.name +
      ' — ' +
      p.nameEn +
      '"' +
      w +
      ">" +
      "<defs>" +
      '<linearGradient id="' + id + '-b" x1="0" y1="0" x2="1" y2="0">' +
      '<stop offset="0" stop-color="' + c.c2 + '"/>' +
      '<stop offset="0.18" stop-color="' + c.c1 + '"/>' +
      '<stop offset="0.55" stop-color="' + c.c1 + '"/>' +
      '<stop offset="0.86" stop-color="' + c.c2 + '"/>' +
      "</linearGradient>" +
      '<linearGradient id="' + id + '-t" x1="0" y1="0" x2="0" y2="1">' +
      '<stop offset="0" stop-color="#e9ecf2"/>' +
      '<stop offset="1" stop-color="#9aa2b1"/>' +
      "</linearGradient>" +
      '<linearGradient id="' + id + '-s" x1="0" y1="0" x2="1" y2="0">' +
      '<stop offset="0" stop-color="#fff" stop-opacity="0"/>' +
      '<stop offset="0.42" stop-color="#fff" stop-opacity="0.34"/>' +
      '<stop offset="0.5" stop-color="#fff" stop-opacity="0.42"/>' +
      '<stop offset="0.62" stop-color="#fff" stop-opacity="0"/>' +
      "</linearGradient>" +
      "</defs>" +
      /* body */
      '<rect x="30" y="26" width="160" height="338" rx="26" fill="url(#' + id + '-b)"/>' +
      '<rect x="30" y="26" width="160" height="338" rx="26" fill="url(#' + id + '-s)"/>' +
      /* top + bottom caps */
      '<rect x="30" y="26" width="160" height="26" rx="13" fill="url(#' + id + '-t)"/>' +
      '<ellipse cx="110" cy="27" rx="80" ry="10" fill="#d7dbe4"/>' +
      '<ellipse cx="110" cy="27" rx="62" ry="6.5" fill="#a9b0bd"/>' +
      '<rect x="96" y="21" width="28" height="5" rx="2.5" fill="#7f8797"/>' +
      '<rect x="30" y="340" width="160" height="24" rx="12" fill="' + c.c2 + '"/>' +
      /* brand block */
      '<text x="110" y="120" text-anchor="middle" font-family="Anton, Impact, sans-serif" font-size="19" letter-spacing="7" fill="' + c.ink + '" opacity="0.85">LIFE</text>' +
      '<text x="110" y="176" text-anchor="middle" font-family="Anton, Impact, sans-serif" font-size="56" letter-spacing="1" fill="' + c.ink + '">STAR</text>' +
      '<path d="M110 188l2.6 5.4 5.9.9-4.3 4.1 1 5.9-5.2-2.8-5.2 2.8 1-5.9-4.3-4.1 5.9-.9z" fill="' + c.accent + '" opacity="0.85"/>' +
      /* flavor band */
      '<rect x="30" y="214" width="160" height="34" fill="' + c.c2 + '" opacity="0.55"/>' +
      '<text x="110" y="236" text-anchor="middle" font-family="Anton, Impact, sans-serif" font-size="15" letter-spacing="0.8" textLength="138" lengthAdjust="spacingAndGlyphs" fill="' + c.accent + '">' + label + "</text>" +
      /* bottom details */
      '<text x="110" y="296" text-anchor="middle" font-family="Anton, Impact, sans-serif" font-size="11" letter-spacing="3.4" fill="' + c.ink + '" opacity="0.72">ENERGY DRINK</text>' +
      '<text x="110" y="318" text-anchor="middle" font-family="Vazirmatn, sans-serif" font-size="10.5" fill="' + c.ink + '" opacity="0.72">۲۵۰ میلی‌لیتر · ' + p.caffeine + "mg</text>" +
      "</svg>"
    );
  }

  window.STAR = {
    config,
    categories,
    products,
    coupons,
    packTiers,
    reviewsPool,
    money,
    priceFor,
    bySlug,
    related,
    canSvg,
    catName: (id) => (categories.find((c) => c.id === id) || {}).name || "",
  };
})();
