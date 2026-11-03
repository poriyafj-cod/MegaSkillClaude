# وایکینگ آفرود — وب‌سایت عمومی

صفحهٔ فرود فارسی/راست‌به‌چپ برای برند **وایکینگ آفرود** (تور، کمپ و طبیعت‌گردی حرفه‌ای). این پروژه یک سایت ایستای بدون وابستگی است: HTML، CSS و JavaScript خالص، فونت و تصویر محلی، بدون build، بدون بک‌اند و بدون سرویس شخص ثالث.

| مورد | مقدار |
|---|---|
| ورودی | `index.html` |
| استایل | `styles.css` |
| رفتار | `app.js` |
| دارایی‌ها | `assets/fonts/`, `assets/img/`, `assets/og.jpg` |
| تست | `tests/test_static.py` (Python، بدون وابستگی) — ۱۹ تست |
| متادیتای خزش | `robots.txt`, `sitemap.xml`, `manifest.webmanifest` |
| انتشار | Vercel — پروژهٔ `viking-offroad` با **Root Directory = `viking-site`** و `vercel.json` همین پوشه |
| آدرس زنده | https://viking-offroad.vercel.app/ |
| CI | داخل job موجود `repo-health` از طریق `scripts/repo_health_check.sh` (بدون تغییر فایل‌های workflow) |

## اجرا و تست

```bash
# پیش‌نمایش محلی (هیچ نصبی لازم نیست)
cd viking-site && python3 -m http.server 8080

# قراردادهای ایستا: دارایی‌های محلی، ARIA، فرم، پالت، JSON-LD، امنیت
cd viking-site && python3 -m unittest discover -s tests -v

# نحو JavaScript
node --check viking-site/app.js
```

## جریان توسعه

```bash
node scripts/doctor.mjs viking-site        # از ریشهٔ مخزن
```

## ساختار صفحه

1. **قهرمان (Hero):** عکس تمام‌عرض دریاچه، نوار نارنجی مورب و متحرک برند، تیتر Lalezar و دو CTA.
2. **چرا وایکینگ:** شش کارت خدمات روی سطح کرم/کتانی؛ کارت‌ها در هاور به سطح تیره تبدیل می‌شوند.
3. **تقویم سفرها:** چهار تور با فیلتر دسته (همه/کمپ/آفرود/طبیعت‌گردی)؛ هر کارت تور را در فرم رزرو پیش‌انتخاب می‌کند.
4. **تجربهٔ سفر:** تصویر شبانهٔ کمپ + چهار گام سفر.
5. **گالری:** چیدمان بنتوی پنج‌قابه با لایت‌باکس `<dialog>` (فلش‌ها، Esc، شمارندهٔ فارسی).
6. **روایت همراهان:** سه نقل‌قول کوتاه.
7. **رزرو:** فرم اعتبارسنجی‌شدهٔ سمت مرورگر با اعداد فارسی، پیام موفقیت شخصی‌سازی‌شده و راه‌های تماس.
8. **سؤالات متداول:** آکاردئون دسترس‌پذیر (`aria-expanded` + `inert`).
9. **فوتر:** برند، لینک‌های سریع، تورها، تماس و دیالوگ‌های شرایط/حریم خصوصی.

## هویت بصری

- پالت برند: نارنجی `#F39A2B`، مشکی `#141414`، کرم `#FFD9A8`، قرمز هشدار `#FF4D3D` — مطابق `brand/viking/ART_DIRECTION.md`.
- سطح روشن مکمل: کتان `#F3EADC` و کاغذی `#FBF5EA` برای تنفس بین بخش‌های تیره.
- فونت نمایشی: **Lalezar**؛ متن: **Vazirmatn** (Regular/Medium/Bold). هر دو محلی سرو می‌شوند؛ مجوز فونت در `assets/fonts/OFL.txt` است.
- لوگو: کپی رسمی `brand/viking/assets/logo.png`، بدون بازسازی.
- عکس‌ها: تولیدشده با مدل تصویر در همان زبان بصری (طلوع کهربایی، مه، سبز عمیق، سوژهٔ کوچک در منظرهٔ بزرگ) و سپس به WebP/JPEG بهینه‌شده در دو عرض.

## دسترس‌پذیری و حرکت

- HTML معنایی (`header`, `main`, `section`, `nav`, `figure`, `form`)، یک `h1`، `lang="fa" dir="rtl"`.
- پرش به محتوا، فوکوس مرئی، تلهٔ فوکوس و Esc در منوی موبایل و دیالوگ‌ها.
- تمام ورودی‌های فرم برچسب دارند؛ خطاها با `role="alert"` و `aria-invalid` اعلام می‌شوند.
- `prefers-reduced-motion: reduce` انیمیشن‌ها، پارالاکس و اسکرول نرم را خاموش می‌کند؛ محتوا بدون JavaScript هم خوانا است.

## یکپارچه‌سازی فرم رزرو

فرم به‌صورت پیش‌فرض هیچ درخواستی به سرور نمی‌فرستد؛ فقط اعتبارسنجی و تأیید محلی نشان می‌دهد. برای اتصال واقعی، `data-endpoint` را روی `<form id="booking-form">` بگذارید تا همان داده به‌صورت JSON به آن آدرس `POST` شود.

```html
<form class="booking-form" id="booking-form" data-endpoint="https://example.com/api/booking" novalidate>
```

پاسخ غیرموفق یا خطای شبکه، پیام قابل‌فهم نشان می‌دهد و دکمه را برمی‌گرداند. برای داده‌های واقعی، اعتبارسنجی سمت سرور، محدودیت نرخ و سیاست حریم خصوصی الزامی است.

## وضعیت صادقانه (چه چیزی تأیید شده و چه چیزی نه)

✅ تأییدشده در همین محیط:

- `python3 -m unittest discover -s tests` → **۱۹/۱۹ سبز** (شامل تطبیق هش CSP با اسکریپت درون‌خطی، اعتبار manifest و فایل‌های خزش).
- `node --check app.js` و `node scripts/doctor.mjs viking-site` → سبز.
- رندر واقعی با Chromium headless در عرض‌های ۱۹۲۰/۱۴۴۰/۸۳۴/۳۹۰/۳۲۰: بدون خطای page/console، `scrollWidth == clientWidth`، تصاویر و فونت‌ها لود می‌شوند؛ صفحه با JavaScript خاموش هم کامل و خواناست.
- رفتار تعاملی با همان مرورگر: فیلتر تورها («آفرود» → «۱ تجربه»)، پیش‌انتخاب تور از هر لینک رزرو، آکاردئون FAQ، اعتبارسنجی و موفقیت فرم، لایت‌باکس، دیالوگ شرایط، تلهٔ فوکوس منوی موبایل و وضعیت هدر پس از اسکرول.
- **axe-core** با تگ‌های WCAG 2.0/2.1 A+AA و best-practice در حالت‌های دسکتاپ، موبایل، منوی موبایل باز، بخش روشن، فرم با خطا، لایت‌باکس و دیالوگ حقوقی → **صفر ایراد**.
- اعمال واقعی همان CSP از `vercel.json` با هدر آزمایشی → اسکریپت درون‌خطی با هش اجرا می‌شود، فونت/تصویر/استایل لود می‌شوند و خطای CSP وجود ندارد.

⚠️ تأییدنشده:

- تست روی Safari/iOS واقعی و Firefox.
- دامنهٔ اختصاصی برند: آدرس فعلی `viking-offroad.vercel.app` است و قبل از کمپین باید به دامنهٔ نهایی منتقل شود.
- اتصال فرم به بک‌اند واقعی، ایمیل/شمارهٔ تماس و ساعت پاسخ‌گویی (مقادیر جای‌نگهدار هستند و باید توسط مالک برند تأیید شوند).
- متن حقوقی نهایی (شرایط، حریم خصوصی، لغو رزرو) — محتوای فعلی نمونه است.
- قیمت‌ها، تاریخ‌های حرکت و ظرفیت‌ها عمداً در صفحه نیامده‌اند؛ باید از brief تأییدشده اضافه شوند.

## چک‌لیست پیش از انتشار

1. `python3 -m unittest discover -s tests -v` و `node --check app.js`.
2. تأیید ایمیل، ساعت پاسخ‌گویی و متن حقوقی توسط مالک برند.
3. تنظیم `data-endpoint` فرم (در صورت نیاز) و تست ارسال واقعی.
4. انتقال به دامنهٔ برند: با افزودن دامنهٔ اختصاصی، `canonical`، `og:url`، JSON-LD و `robots.txt`/`sitemap.xml` را از `viking-offroad.vercel.app` به دامنهٔ نهایی تغییر بده.
5. بازبینی تصویری روی موبایل/تبلت/دسکتاپ و یک Safari واقعی.
6. تأیید deployment زنده پس از هر push (پروژهٔ `viking-offroad`، برنچ `arena/3a9f2a5d-megaskillclaude`) و بازبینی همان آدرس.

## انتشار روی Vercel

پروژهٔ `viking-offroad` در تیم `fj-cod` به مخزن `poriyafj-cod/MegaSkillClaude` وصل است و از برنچ `arena/3a9f2a5d-megaskillclaude` منتشر می‌شود.

| تنظیم | مقدار |
|---|---|
| Root Directory | `viking-site` |
| Framework Preset | Vite (فقط برای دور زدن تشخیص خودکار؛ خروجی در واقع ایستا است) |
| Install Command | `echo no-install` |
| Build Command | `mkdir -p dist && cp -R index.html styles.css app.js manifest.webmanifest robots.txt sitemap.xml assets dist/` |
| Output Directory | `dist` |

- خروجی، همان فایل‌های استاتیک همین پوشه است؛ هیچ باندل یا مرحلهٔ کامپایلی اجرا نمی‌شود.
- هدرهای امنیتی/CSP و کش دارایی‌ها از `vercel.json` اعمال می‌شوند (در جدول routeهای deployment قابل بررسی است).
- آدرس تولیدی (Production): https://viking-offroad.vercel.app/ — نسخهٔ شاخه‌ای: `viking-offroad-git-arena-3a9f2a5d-megaskillclaude-fj-cod.vercel.app`.
- اتصال Git این پروژه deployment خودکار روی push ندارد (`gitProviderOptions.createDeployments: disabled`)؛ پس از هر تغییر، یک deployment تولیدی جدید از برنچ `arena/3a9f2a5d-megaskillclaude` ساخته می‌شود و نسخهٔ زنده همان کامیت آخرین deployment است، نه آخرین کامیت مخزن.
- دامنهٔ `viking.offroad` هنوز به این پروژه وصل نشده است.

دفتر جریان این پروژه در [PROGRESS.md](PROGRESS.md) و دستور کامل توسعه در [`docs/directives/13-viking-site.md`](../docs/directives/13-viking-site.md) است.
