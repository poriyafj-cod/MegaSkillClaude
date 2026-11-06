# 13 — Storefront Studio (استاندارد طراحی سایت فروشگاهی)

## مأموریت و مرزها
یک منبع حقیقت برای طراحی و بازبینی **همهٔ** سایت‌های فروشگاهی فارسی/RTL (ویترین، نه پنل): سیستم طراحی،
قرارداد صفحه‌ها، قواعد سه‌بعدی/حرکت، گیت‌های انتشار و فهرست سایت‌های زنده. پوشهٔ `storefronts/` فقط
استاندارد و ابزار را دارد؛ کد هر سایت یا در پوشهٔ خودش زیر `storefronts/<id>/` (بعد از کلون) یا در
پروژهٔ Vercel خودش (با `checkout: ""` در `sites.json`) زندگی می‌کند.

**مرز با `fjcod/`:** چام پنل مدیریت فروش است (SPA)، نه ویترین؛ سیستم طراحی‌اش در
`fjcod/design-system/cham/MASTER.md` می‌ماند و با kind=`app` در `sites.json` ثبت شده است.

## وضعیت فعلی (۲۰۲۶-۱۱-۰۶)
- ✅ `design-system/MASTER.md` — هفت ستون، توکن برند (۳ رنگ + وضعیت)، تایپوگرافی فارسی قفل‌شده،
  ۱۷ کامپوننت اجباری، سه‌لایهٔ ۳D، سئو، بودجهٔ کارایی، ضدِّ اسلپ، DoD.
- ✅ چهار قرارداد صفحه: `home`، `shop`، `product`، `content-and-contact` (به‌همراه وضعیت‌های خطا/خالی).
- ✅ `motion-3d.md` — لایه‌های L1–L4، قرارداد پیاده‌سازی، الگوهای reveal، کاهش حرکت، اندازه‌گیری.
- ✅ `checklist/release-gates.md` — ۷ گیت با شواهد اجباری و قالب ثبت.
- ✅ `sites.json` — NAFAS، NIGHTLAB، LIFESTAR (زنده، محتوا از صفحات واقعی خوانده‌شده)، CHAM (داخل مخزن).
- ✅ `scripts/storefront-check.mjs` + `tests/storefront-check.test.mjs` — گیت ایستا با اثبات سبز/قرمز.
- ✅ مهارت `library/skills/storefront-design-system` در router ثبت شد (router اکنون ۶٬۰۲۰ مهارت).
- ⚠ سه سایت زنده در این مخزن کلون نیستند (`checkout: ""`): هیچ تست، Lighthouse یا تجربهٔ موبایل‌شان
  تأیید نشده است. تا انتقال، فقط پروفایل طراحی (پالت/ماژول امضا) ثبت شده.

## اجرا و تست
```bash
node storefronts/scripts/storefront-check.mjs --all
node storefronts/scripts/storefront-check.mjs --dir fjcod
node --test storefronts/tests/storefront-check.test.mjs
python3 -m unittest tests.test_storefront_studio
node scripts/doctor.mjs storefronts
```

## پروتکل دیباگ حرفه‌ای
- **گیت قرمز شد:** اول `--json` بگیر؛ خطاهای `missing required page` / `dir="rtl" missing` /
  `dead href="#"` شکست قرارداد هستند، نه سلیقه. هشدارها را با عدد (KB، تعداد) در PROGRESS ثبت کن.
- **سایت جدید سبز نشد:** ترتیب رفع: توکن در CSS → پوستهٔ RTL `lang/dir` → یک `h1` → فوکوس و
  reduced-motion → لینک‌های واقعی → schema. افکت را تا وقتی ساختار سبز نشده اضافه نکن.
- **سه‌بعدی کند شد:** اول `IntersectionObserver` و توقف رندر؛ بعد DPR ≤ ۲؛ بعد حذف canvas و
  بازگشت به تصویر استاتیک. «کند است» بدون عدد Long Task پذیرفته نیست.
- **ادعای سئو:** فقط با خروجی Rich Results Test و لینک زنده؛ JSON-LD نامعتبر خطاست، نه هشدار.

## گسترش (اولویت‌بندی)
- **P0:** انتقال یکی از سه سایت زنده (پیشنهاد: NAFAS) به `storefronts/nafas/` در همین مخزن، سپس
  اجرای گیت ایستا + بازدید واقعی موبایل + Lighthouse و ثبت نتیجه.
- **P1:** یک `storefronts/starter/` با فایل‌های واقعی (توکن، پوسته، سبد localStorage) تا سایت جدید
  از صفر نوشته نشود.
- **P1:** اسکریپت بررسی لینک داخلی + `sitemap.xml`/`robots.txt` در گیت ۵.
- **P2:** تست مرورگری (Chromium/pw) برای سبد و drawer، و اسکرین‌شات ۳۲۰/۷۵۰/۱۴۴۰ به‌عنوان artifact.

## Definition of Done
`doctor storefronts` سبز · تست‌های fixture سبز · هیچ سایت ثبت‌شده‌ای بدون مدرک گیت نباشد ·
پروفایل سه سایت زنده با صفحات واقعی هم‌خوان · مهارت در router قابل مسیریابی و شمارنده‌ها هم‌گام.
