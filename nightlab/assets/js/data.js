/* ==========================================================================
   NIGHTLAB — catalog, brand data & specimen artwork
   Discrete adult boutique · Persian RTL
   ========================================================================== */
(function () {
  const config = {
    brandFa: "نایت‌لب",
    brandEn: "NIGHTLAB",
    tagline: "فرمول ۹۹٫۱٪ خالص",
    phone: "۰۲۱-۹۱۰۰۷۳۱۱",
    phoneRaw: "02191007311",
    email: "care@nightlab.shop",
    instagram: "@nightlab.shop",
    address: "تهران، خیابان مطهری، پلاک ۹۱، طبقهٔ دوم",
    freeShipFrom: 2500000,
    shipCost: 65000,
    codCost: 45000,
    currency: "تومان",
    minAge: 18,
  };

  const categories = [
    { id: "vibrators", name: "ویبراتور و ماساژور", en: "VIBRATORS", icon: "sparkle", glow: "rgba(245,197,24,.42)", blurb: "ارتعاش دقیق، بی‌صدا و بدن‌سازگار" },
    { id: "couples", name: "زوج", en: "COUPLES", icon: "heart", glow: "rgba(87,224,255,.34)", blurb: "برای تجربهٔ مشترک، بدون فشار" },
    { id: "lube", name: "لوبریکانت", en: "LUBRICANT", icon: "drop", glow: "rgba(169,236,255,.34)", blurb: "پایه آب، سیلیکون و ژل گرم" },
    { id: "bond", name: "بستن و نقش", en: "BONDAGE", icon: "eyeOff", glow: "rgba(255,138,0,.34)", blurb: "نرم، ایمن و کاملاً قابل باز شدن" },
    { id: "care", name: "بهداشت", en: "CARE", icon: "shield", glow: "rgba(255,255,255,.22)", blurb: "تمیز کردن، نگهداری و اطمینان" },
  ];

  /* bundle sizes — multiplier applied to the single-unit price */
  const packTiers = [
    { size: 1, label: "۱ عدد", off: 0, mult: 1 },
    { size: 2, label: "۲ عدد", off: 5, mult: 0.95 },
    { size: 3, label: "۳ عدد", off: 10, mult: 0.9 },
    { size: 5, label: "۵ عدد", off: 18, mult: 0.82 },
  ];

  const products = [
    {
      id: "p01",
      code: "NL-01",
      slug: "silicone-wand",
      name: "واند سیلیکونی",
      nameEn: "SILICONE WAND",
      cat: "vibrators",
      form: "wand",
      colors: { c1: "#57e0ff", c2: "#0d5b74", accent: "#d8f7ff" },
      price: 2850000,
      oldPrice: null,
      rating: 4.9,
      reviews: 318,
      stock: 24,
      tags: ["bestseller"],
      features: ["سیلیکون پزشکی", "۱۰ حالت ارتعاش", "ضدآب IPX7", "زیر ۴۵ دسی‌بل"],
      desc: "واند سیلیکونی با سرِ انعطاف‌پذیر و ۱۰ حالت ارتعاش؛ برای ماساژ بدن، آرام‌سازی عضلات و تجربهٔ شخصی. بی‌صدا ساخته شده تا حریم خصوصی‌ات حفظ شود.",
      usage: "روی پوست تمیز و خشک استفاده کن، مقدار کمی لوبریکانت پایه آب اضافه کن و از شارژ کامل باتری مطمئن شو. بعد از هر بار، با پاک‌کنندهٔ مخصوص بشوی و کامل خشک کن.",
      care: "فقط با لوبریکانت پایه آب استفاده شود؛ لوبریکانت سیلیکونی سطح سیلیکون را کدر می‌کند. نگهداری در پوشش پارچه‌ای، دور از آفتاب.",
      specs: [
        ["جنس", "سیلیکون پزشکی بدون فتالات"],
        ["طول", "۲۲ سانتی‌متر"],
        ["قطر سر", "۴٫۲ سانتی‌متر"],
        ["باتری", "لیتیوم‌یون، ۹۰ دقیقه کارکرد"],
        ["شارژ", "USB-C مغناطیسی"],
        ["ضدآب", "IPX7 — قابل شست‌وشو"],
        ["نویز", "کمتر از ۴۵ دسی‌بل"],
        ["گارانتی", "۱۲ ماه تعویض"],
      ],
    },
    {
      id: "p02",
      code: "NL-02",
      slug: "silent-bullet",
      name: "بولت بی‌صدا",
      nameEn: "SILENT BULLET",
      cat: "vibrators",
      form: "bullet",
      colors: { c1: "#f5c518", c2: "#7a5f00", accent: "#fff8d9" },
      price: 980000,
      oldPrice: 1250000,
      rating: 4.8,
      reviews: 542,
      stock: 60,
      tags: ["bestseller", "sale"],
      features: ["جیبی و بی‌صدا", "۳ سرعت", "فلز و سیلیکون", "سبک ۶۵ گرم"],
      desc: "کوچک‌ترین عضو کالکشن: به اندازهٔ یک رژ لب، با ارتعاش تمرکزیافته. برای شروع، سفر یا هدیه — بی‌دردسر و بی‌صدا.",
      usage: "با دکمهٔ بالای بدنه بین سه سرعت جابه‌جا شو. برای مدت طولانی روشن نگذار؛ بعد از هر بار تمیز و خشک کن.",
      care: "بدنهٔ فلزی را با الکل ایزوپروپیل ۷۰٪ پاک کن. از خیس شدن بخش دکمه و درگاه شارژ پرهیز کن.",
      specs: [
        ["جنس", "آلومینیوم آنودایز + سیلیکون"],
        ["طول", "۹ سانتی‌متر"],
        ["وزن", "۶۵ گرم"],
        ["باتری", "۸۰ دقیقه کارکرد"],
        ["سرعت", "۳ حالت"],
        ["ضدآب", "IPX6"],
        ["نویز", "کمتر از ۴۰ دسی‌بل"],
        ["گارانتی", "۶ ماه"],
      ],
    },
    {
      id: "p03",
      code: "NL-03",
      slug: "duo-ring",
      name: "رینگ زوج",
      nameEn: "DUO RING",
      cat: "couples",
      form: "ring",
      colors: { c1: "#57e0ff", c2: "#123c52", accent: "#d8f7ff" },
      price: 1240000,
      oldPrice: null,
      rating: 4.7,
      reviews: 226,
      stock: 38,
      tags: ["bestseller"],
      features: ["سیلیکون کشسان", "۹ حالت", "قابل استفادهٔ مشترک", "ضدآب"],
      desc: "رینگ ارتعاشی کشسان که برای هر دو طرف کار می‌کند؛ ساده، بی‌صدا و بدون نیاز به تنظیم. اولین انتخاب برای زوج‌هایی که تازه شروع می‌کنند.",
      usage: "رینگ را روی بدنه قرار بده و با دکمهٔ کناری حالت را انتخاب کن. قبل از استفاده از سازگاری اندازه مطمئن شو.",
      care: "بعد از هر بار با آب ولرم و صابون ملایم بشوی، کامل خشک کن و در جعبه نگه دار.",
      specs: [
        ["جنس", "سیلیکون پزشکی کشسان"],
        ["قطر داخلی", "۳۲ تا ۵۵ میلی‌متر"],
        ["حالت", "۹ حالت ارتعاش"],
        ["باتری", "۶۰ دقیقه کارکرد"],
        ["ضدآب", "IPX7"],
        ["گارانتی", "۶ ماه"],
      ],
    },
    {
      id: "p04",
      code: "NL-04",
      slug: "hand-massager",
      name: "ماساژور دستی",
      nameEn: "HAND MASSAGER",
      cat: "vibrators",
      form: "massager",
      colors: { c1: "#ff8a00", c2: "#7a3c00", accent: "#ffe3bf" },
      price: 1650000,
      oldPrice: null,
      rating: 4.6,
      reviews: 184,
      stock: 31,
      tags: [],
      features: ["ارگونومیک", "۶ سر قابل تعویض", "دو موتور", "شارژ سریع"],
      desc: "ماساژور دستی با دو موتور مستقل و شش سری مختلف؛ از گردن و شانه تا کمر و پا. اگر دنبال آرامش عضلانی هستی، از این شروع کن.",
      usage: "هر سر را روی نقطهٔ دلخواه بگذار و از شدت کم شروع کن. هر ناحیه را بیشتر از ۱۰ دقیقه ماساژ نده.",
      care: "سطح را با پارچهٔ نمدار تمیز کن. باتری را هر سه ماه یک‌بار کامل شارژ کن.",
      specs: [
        ["جنس", "ABS + سیلیکون"],
        ["سرها", "۶ عدد قابل تعویض"],
        ["موتور", "۲ موتور مستقل"],
        ["باتری", "۱۲۰ دقیقه کارکرد"],
        ["شارژ", "USB-C، ۲ ساعت"],
        ["گارانتی", "۱۲ ماه"],
      ],
    },
    {
      id: "p05",
      code: "NL-05",
      slug: "water-lube",
      name: "لوبریکانت پایه آب",
      nameEn: "WATER BASE",
      cat: "lube",
      form: "bottle",
      colors: { c1: "#9fe8ff", c2: "#1d6d86", accent: "#ffffff" },
      price: 320000,
      oldPrice: null,
      rating: 4.9,
      reviews: 861,
      stock: 120,
      tags: ["bestseller"],
      features: ["۱۵۰ میلی‌لیتر", "بدون گلیسیرین", "سازگار با کاندوم", "بی‌رنگ و بی‌بو"],
      desc: "پایه آب، بدون گلیسیرین و بدون چسبندگی؛ با همهٔ جنس‌ها و همهٔ اسباب‌بازی‌ها سازگار است. ساده‌ترین کاری که می‌توانی برای راحتی خودت بکنی.",
      usage: "مقدار کمی روی پوست یا سطح اسباب‌بازی بریز. در صورت نیاز دوباره اضافه کن؛ آب اضافه نکن.",
      care: "درب را محکم ببند و دور از نور مستقیم نگه دار. تا ۲۴ ماه پس از تولید قابل استفاده است.",
      specs: [
        ["حجم", "۱۵۰ میلی‌لیتر"],
        ["پایه", "آب"],
        ["گلیسیرین", "ندارد"],
        ["pH", "متعادل با پوست"],
        ["سازگاری", "کاندوم لاتکس و سیلیکون"],
        ["تاریخ انقضا", "۲۴ ماه"],
      ],
    },
    {
      id: "p06",
      code: "NL-06",
      slug: "warm-gel",
      name: "ژل گرم‌کننده",
      nameEn: "WARM GEL",
      cat: "lube",
      form: "bottle",
      colors: { c1: "#ff8a00", c2: "#8a3f00", accent: "#fff1de" },
      price: 380000,
      oldPrice: null,
      rating: 4.5,
      reviews: 342,
      stock: 74,
      tags: [],
      features: ["گرمای ملایم", "پایه آب", "۱۰۰ میلی‌لیتر", "بدون پارابن"],
      desc: "ژلی با گرمای ملایم و ماندگار که حس را عمیق‌تر می‌کند. برای شروع با مقدار کم امتحانش کن؛ گرمایش بعد از چند دقیقه بیشتر می‌شود.",
      usage: "مقدار کم روی پوست بزن و ۳۰ ثانیه صبر کن تا گرم شود. اگر حس سوزش داشت، فوراً با آب بشوی.",
      care: "دور از چشم و مخاط حساس. دور از دسترس کودکان نگه دار.",
      specs: [
        ["حجم", "۱۰۰ میلی‌لیتر"],
        ["پایه", "آب"],
        ["اثر", "گرمای ملایم تا ۱۰ دقیقه"],
        ["پارابن", "ندارد"],
        ["تاریخ انقضا", "۲۴ ماه"],
      ],
    },
    {
      id: "p07",
      code: "NL-07",
      slug: "silicone-gel",
      name: "ژل سیلیکونی",
      nameEn: "SILICONE GEL",
      cat: "lube",
      form: "bottle",
      colors: { c1: "#cfd6e2", c2: "#4a5568", accent: "#ffffff" },
      price: 450000,
      oldPrice: null,
      rating: 4.7,
      reviews: 254,
      stock: 58,
      tags: [],
      features: ["ماندگاری بالا", "چند قطره کافی است", "ضدآب", "بدون عطر"],
      desc: "برای حمام و دوش، یا هر موقعی که به ماندگاری بیشتری نیاز داری. چند قطره کافی است و با آب شسته نمی‌شود — با اسباب‌بازی سیلیکونی استفاده نکن.",
      usage: "۲ تا ۳ قطره کافی است. روی پوست خیس هم قابل استفاده است.",
      care: "با اسباب‌بازی سیلیکونی استفاده نکن. در ظرف اصلی و در دمای اتاق نگه دار.",
      specs: [
        ["حجم", "۱۰۰ میلی‌لیتر"],
        ["پایه", "سیلیکون دایمتیکون"],
        ["ماندگاری", "تا ۴ ساعت"],
        ["عطر", "ندارد"],
        ["سازگاری", "کاندوم، شیشه، فلز"],
        ["تاریخ انقضا", "۳۶ ماه"],
      ],
    },
    {
      id: "p08",
      code: "NL-08",
      slug: "satin-blindfold",
      name: "چشم‌بند ساتن",
      nameEn: "SATIN BLINDFOLD",
      cat: "bond",
      form: "blindfold",
      colors: { c1: "#f5c518", c2: "#1a1a1a", accent: "#fff8d9" },
      price: 290000,
      oldPrice: null,
      rating: 4.6,
      reviews: 198,
      stock: 85,
      tags: ["new"],
      features: ["ساتن نرم", "بند قابل تنظیم", "بدون فشار روی چشم", "قابل شست‌وشو"],
      desc: "ساده‌ترین راه برای تغییر تجربه: نور را کم کن. ساتن نرم با بند کشی، بدون فشار روی چشم و بدون رد گذاشتن.",
      usage: "بند را طوری تنظیم کن که فشار حس نشود. هر زمان خواستی، خودت می‌توانی در یک حرکت بازش کنی.",
      care: "شست‌وشوی دستی با آب سرد، خشک کردن در سایه.",
      specs: [
        ["جنس", "ساتن پلی‌استر درجه یک"],
        ["عرض", "۹ سانتی‌متر"],
        ["بند", "کشی، قابل تنظیم"],
        ["رنگ", "طلایی شب"],
        ["شست‌وشو", "دستی، آب سرد"],
      ],
    },
    {
      id: "p09",
      code: "NL-09",
      slug: "soft-cuffs",
      name: "دستبند نرم",
      nameEn: "SOFT CUFFS",
      cat: "bond",
      form: "cuff",
      colors: { c1: "#57e0ff", c2: "#123c52", accent: "#d8f7ff" },
      price: 640000,
      oldPrice: 780000,
      rating: 4.8,
      reviews: 276,
      stock: 42,
      tags: ["sale"],
      features: ["قفل ایمنی سریع", "پارچهٔ مخملی", "قابل تنظیم", "باز شدن اضطراری"],
      desc: "دستبندهای نرم با قفل ایمنی که با یک حرکت باز می‌شود. برای بازی نقش ملایم، با کمترین ریسک و بیشترین کنترل.",
      usage: "قبل از شروع، کلمهٔ امن را مشخص کنید. قفل ایمنی باید همیشه در دسترس باشد.",
      care: "با دستمال نمدار تمیز کن. از خیس شدن کامل پرهیز کن.",
      specs: [
        ["جنس", "مخمل + بند نایلونی"],
        ["محدودهٔ اندازه", "۱۶ تا ۲۷ سانتی‌متر"],
        ["قفل", "ایمنی، باز شدن سریع"],
        ["تعداد", "۲ عدد در بسته"],
        ["گارانتی", "۶ ماه"],
      ],
    },
    {
      id: "p10",
      code: "NL-10",
      slug: "toy-cleanser",
      name: "پاک‌کنندهٔ اسباب‌بازی",
      nameEn: "TOY CLEANSER",
      cat: "care",
      form: "spray",
      colors: { c1: "#a9ecff", c2: "#1d6d86", accent: "#ffffff" },
      price: 260000,
      oldPrice: null,
      rating: 4.9,
      reviews: 412,
      stock: 96,
      tags: [],
      features: ["۲۰۰ میلی‌لیتر", "ضدباکتری", "بدون الکل قوی", "اسپری بدون نیاز به شست‌وشو"],
      desc: "اسپری تمیزکنندهٔ مخصوص سیلیکون و ABS؛ در ۳۰ ثانیه سطح را تمیز می‌کند و باقی نمی‌گذارد. بخشی از روتین، نه یک لوکس.",
      usage: "روی سطح اسپری کن، ۳۰ ثانیه بگذار بماند و با دستمال تمیز پاک کن. برای سطوح حساس با آب بشوی.",
      care: "دور از چشم. در دمای اتاق نگه دار.",
      specs: [
        ["حجم", "۲۰۰ میلی‌لیتر"],
        ["اثر", "ضدباکتری، بدون الکل قوی"],
        ["سازگاری", "سیلیکون، ABS، شیشه، فلز"],
        ["زمان اثر", "۳۰ ثانیه"],
      ],
    },
    {
      id: "p11",
      code: "NL-11",
      slug: "starter-kit",
      name: "کیت شروع زوج",
      nameEn: "STARTER KIT",
      cat: "couples",
      form: "kit",
      colors: { c1: "#f5c518", c2: "#8a6b00", accent: "#fff8d9" },
      price: 1890000,
      oldPrice: 2460000,
      rating: 4.9,
      reviews: 156,
      stock: 18,
      tags: ["bestseller", "new", "sale"],
      features: ["۴ قلم در یک جعبه", "لوبریکانت + رینگ + چشم‌بند + پاک‌کننده", "بسته‌بندی بی‌نام", "راهنمای شروع"],
      desc: "یک جعبه که همه‌چیز را ساده می‌کند: رینگ زوج، لوبریکانت پایه آب، چشم‌بند ساتن و پاک‌کننده؛ با راهنمای کوتاه شروع و بسته‌بندی کامل بی‌نام.",
      usage: "راهنمای شروع داخل جعبه است. با ساده‌ترین قلم شروع کنید و هر مرحله را با گفت‌وگو پیش ببرید.",
      care: "هر قلم را طبق دستور خودش نگهداری کن. جعبه را در جای خنک و خشک نگه دار.",
      specs: [
        ["محتویات", "رینگ زوج، لوبریکانت ۱۵۰ml، چشم‌بند، پاک‌کننده ۱۰۰ml"],
        ["بسته‌بندی", "جعبهٔ بی‌نام، بدون نام فروشگاه"],
        ["راهنما", "دفترچهٔ ۱۲ صفحه‌ای فارسی"],
        ["گارانتی", "۱۲ ماه"],
      ],
    },
    {
      id: "p12",
      code: "NL-12",
      slug: "travel-massager",
      name: "ماساژور سفری",
      nameEn: "TRAVEL MASSAGER",
      cat: "vibrators",
      form: "bullet",
      colors: { c1: "#ffd23f", c2: "#7a5f00", accent: "#fff8d9" },
      price: 1150000,
      oldPrice: null,
      rating: 4.5,
      reviews: 132,
      stock: 47,
      tags: ["new"],
      features: ["کیف حمل", "قفل سفر", "۵ ساعت آماده‌به‌کار", "سبک و بی‌صدا"],
      desc: "نسخهٔ سفری بولت با قفل ضد روشن‌شدن در چمدان و کیف پارچه‌ای مخصوص. برای هتل، سفر کاری یا خانهٔ دوست.",
      usage: "برای فعال‌سازی دکمه را ۳ ثانیه نگه دار. قبل از سفر قفل کن تا در چمدان روشن نشود.",
      care: "قبل از سفر شارژ کن و در کیف مخصوص بگذار. برای شست‌وشو فقط سطح را با دستمال نمدار پاک کن.",
      specs: [
        ["جنس", "آلومینیوم + سیلیکون"],
        ["وزن", "۸۰ گرم"],
        ["باتری", "۵ ساعت آماده‌به‌کار"],
        ["قفل سفر", "دارد"],
        ["ضدآب", "IPX5"],
        ["گارانتی", "۶ ماه"],
      ],
    },
  ];

  const coupons = {
    LAB10: { type: "percent", value: 10, min: 0, label: "۱۰٪ تخفیف اولین خرید" },
    NIGHT20: { type: "percent", value: 20, min: 3000000, label: "۲۰٪ تخفیف بالای ۳ میلیون" },
    DISCREET: { type: "ship", value: 100, min: 0, label: "ارسال بی‌نام رایگان" },
    KIT15: { type: "percent", value: 15, min: 0, label: "۱۵٪ تخفیف کیت" },
  };

  const reviewsPool = [
    { name: "ن.", text: "بسته‌بندی کاملاً بی‌نام بود، حتی روی فاکتور. برای من که مهم‌ترین چیز همین بود.", stars: 5 },
    { name: "س. م.", text: "واند واقعاً بی‌صداست؛ توی خونهٔ مشترک هم بدون استرس استفاده می‌کنم.", stars: 5 },
    { name: "آ.", text: "کیت شروع رو گرفتیم. راهنماش باعث شد راحت‌تر حرف بزنیم و کم‌تر خجالت بکشیم.", stars: 5 },
    { name: "ر.", text: "لوبریکانت پایه آب چسبندگی نداره و با همه‌چیز کار می‌کنه. دوباره سفارش دادم.", stars: 5 },
    { name: "م.", text: "پشتیبانی خیلی محترمانه جواب داد، بدون هیچ سؤالی که آدم خجالت بکشه.", stars: 4 },
    { name: "ک.", text: "ارسال دو روزه رسید و جعبه سالم بود. کیفیت سیلیکون هم واقعاً خوبه.", stars: 5 },
  ];

  /* ---------- helpers ---------- */
  const money = (n) => Math.round(n).toLocaleString("fa-IR");

  function priceFor(product, tierIndex) {
    const tier = packTiers[tierIndex] || packTiers[0];
    const unit = Math.round((product.price * tier.mult) / 10000) * 10000;
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

  function search(q) {
    const t = String(q || "").trim().toLowerCase();
    if (!t) return [];
    return products.filter((p) =>
      (p.name + " " + p.nameEn + " " + p.code + " " + p.features.join(" ")).toLowerCase().includes(t)
    );
  }

  /**
   * Inline specimen artwork — a laboratory vial per product.
   * `variant`: "full" (default) · "detail" (measurement callouts) · "box" (discreet packaging).
   */
  function art(p, opts) {
    const o = opts || {};
    const variant = o.variant || "full";
    const id = "nl-" + p.slug + "-" + variant;
    const c = p.colors;
    const ticks = [0, 1, 2, 3, 4]
      .map((i) => '<line x1="158" y1="' + (160 + i * 20) + '" x2="' + (i % 2 ? 168 : 164) + '" y2="' + (160 + i * 20) + '" stroke="#ffffff" stroke-opacity="0.35" stroke-width="1.4"/>')
      .join("");

    const defs =
      "<defs>" +
      '<linearGradient id="' + id + '-liq" x1="0" y1="0" x2="0.25" y2="1">' +
      '<stop offset="0" stop-color="' + c.accent + '"/>' +
      '<stop offset="0.38" stop-color="' + c.c1 + '"/>' +
      '<stop offset="1" stop-color="' + c.c2 + '"/>' +
      "</linearGradient>" +
      '<linearGradient id="' + id + '-glass" x1="0" y1="0" x2="1" y2="0">' +
      '<stop offset="0" stop-color="#ffffff" stop-opacity="0.16"/>' +
      '<stop offset="0.28" stop-color="#ffffff" stop-opacity="0.04"/>' +
      '<stop offset="0.78" stop-color="#ffffff" stop-opacity="0.02"/>' +
      '<stop offset="1" stop-color="#ffffff" stop-opacity="0.14"/>' +
      "</linearGradient>" +
      '<linearGradient id="' + id + '-cap" x1="0" y1="0" x2="1" y2="0">' +
      '<stop offset="0" stop-color="#3c424f"/>' +
      '<stop offset="0.5" stop-color="#7c8494"/>' +
      '<stop offset="1" stop-color="#2c313b"/>' +
      "</linearGradient>" +
      "</defs>";

    const glow =
      '<circle cx="110" cy="150" r="86" fill="' + c.c1 + '" opacity="0.10"/>' +
      '<circle cx="110" cy="150" r="58" fill="' + c.c1 + '" opacity="0.08"/>';

    if (variant === "box") {
      return (
        '<svg class="lab-art" viewBox="0 0 220 300" role="img" aria-label="' + p.name + " — بسته‌بندی بی‌نام" + '">' +
        defs +
        glow +
        '<rect x="46" y="92" width="128" height="150" rx="10" fill="#15181f" stroke="#2b303c"/>' +
        '<rect x="46" y="92" width="128" height="30" rx="10" fill="#1d222b"/>' +
        '<rect x="46" y="112" width="128" height="10" fill="#f5c518" opacity="0.9"/>' +
        '<rect x="88" y="150" width="44" height="44" rx="6" fill="none" stroke="#3a4150" stroke-width="1.6"/>' +
        '<text x="110" y="177" text-anchor="middle" font-family="monospace" font-size="11" fill="#6f7889">' + p.code + "</text>" +
        '<text x="110" y="220" text-anchor="middle" font-family="monospace" font-size="8" letter-spacing="2.4" fill="#4d5563">DISCREET</text>' +
        '<path d="M46 122h128" stroke="#0b0c10" stroke-width="2" stroke-dasharray="6 6" opacity="0.6"/>' +
        '<text x="110" y="272" text-anchor="middle" font-family="monospace" font-size="8" letter-spacing="3" fill="#4d5563">NIGHTLAB · SEALED</text>' +
        "</svg>"
      );
    }

    return (
      '<svg class="lab-art" viewBox="0 0 220 300" role="img" aria-label="' + p.name + " — " + p.nameEn + '">' +
      defs +
      glow +
      /* measurement frame for the detail view */
      (variant === "detail"
        ? '<line x1="60" y1="52" x2="60" y2="262" stroke="#ffffff" stroke-opacity="0.22" stroke-dasharray="4 6"/>' +
          '<line x1="52" y1="52" x2="68" y2="52" stroke="#ffffff" stroke-opacity="0.22"/>' +
          '<line x1="52" y1="262" x2="68" y2="262" stroke="#ffffff" stroke-opacity="0.22"/>' +
          '<text x="46" y="160" text-anchor="middle" font-family="monospace" font-size="7" fill="#ffffff" fill-opacity="0.45" transform="rotate(-90 46 160)">SIZE</text>'
        : "") +
      /* vial */
      '<rect x="68" y="62" width="84" height="204" rx="26" fill="url(#' + id + '-glass)" stroke="#ffffff" stroke-opacity="0.22"/>' +
      '<rect x="74" y="150" width="72" height="110" rx="20" fill="url(#' + id + '-liq)"/>' +
      '<ellipse cx="110" cy="152" rx="34" ry="6" fill="' + c.accent + '" opacity="0.5"/>' +
      '<circle cx="94" cy="196" r="4" fill="#ffffff" opacity="0.32"/>' +
      '<circle cx="122" cy="224" r="2.6" fill="#ffffff" opacity="0.3"/>' +
      '<circle cx="104" cy="242" r="2" fill="#ffffff" opacity="0.26"/>' +
      /* cap */
      '<rect x="80" y="42" width="60" height="26" rx="8" fill="url(#' + id + '-cap)"/>' +
      '<rect x="80" y="58" width="60" height="6" fill="#f5c518" opacity="0.85"/>' +
      /* label */
      '<rect x="80" y="162" width="60" height="42" rx="6" fill="#0b0c10" opacity="0.62"/>' +
      '<text x="110" y="180" text-anchor="middle" font-family="monospace" font-size="9" letter-spacing="1.4" fill="#f5c518">' + p.code + "</text>" +
      '<text x="110" y="194" text-anchor="middle" font-family="monospace" font-size="6" letter-spacing="1.2" fill="#ffffff" fill-opacity="0.6">NIGHTLAB</text>' +
      /* highlight + ticks */
      '<rect x="78" y="70" width="10" height="186" rx="5" fill="#ffffff" opacity="0.16"/>' +
      ticks +
      /* baseline */
      '<ellipse cx="110" cy="272" rx="52" ry="7" fill="#000" opacity="0.45"/>' +
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
    search,
    art,
    catName: (id) => (categories.find((c) => c.id === id) || {}).name || "",
    catIcon: (id) => (categories.find((c) => c.id === id) || {}).icon || "sparkle",
  };
})();
