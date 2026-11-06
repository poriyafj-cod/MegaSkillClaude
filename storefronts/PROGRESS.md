# Storefront Studio — دفتر جریان

> دفتر اختصاصی استاندارد طراحی فروشگاه‌ها. آخرین به‌روزرسانی: **۲۰۲۶-۱۱-۰۶**.

## ۱) در یک نگاه
- یک سیستم طراحی canonical برای همهٔ سایت‌های فروشگاهی فارسی/RTL: `storefronts/design-system/`.
- فهرست سایت‌های زنده و پالت/ماژول امضای هرکدام: `storefronts/sites.json`.
- موتور بررسی ایستا: `storefronts/scripts/storefront-check.mjs` (بدون وابستگی، بدون شبکه).
- مهارت مسیریاب: `library/skills/storefront-design-system` (در دسترس هر جلسه از طریق router).

## ۲) دستور دقیق
```bash
node storefronts/scripts/storefront-check.mjs --all          # همهٔ سایت‌های داخل مخزن
node storefronts/scripts/storefront-check.mjs --dir fjcod    # یک سایت
python3 scripts/sync_skill_library.py && python3 mobile/build-index.py   # پس از تغییر مهارت
python3 -m unittest discover -s tests -p "test_*.py"
node scripts/doctor.mjs storefronts router repo
```

## ۳) وضعیت تأییدشده (۲۰۲۶-۱۱-۰۶)
| بررسی | نتیجه | مرز |
|---|---|---|
| محتوای سه سایت زنده (NAFAS، NIGHTLAB، LIFESTAR) | ✅ با خواندن صفحات واقعی `index / product / about` استخراج شد | فقط شواهد محتوا؛ کد و Lighthouse آن‌ها هنوز در مخزن نیست |
| `storefront-check.mjs` روی `fjcod` | ✅ اجرا شد؛ خروجی در لاگ جریان پایین | بررسی ایستا، نه رندر مرورگری |
| گیت‌های سه سایت زنده | ⚠ `pending-clone` — بدون کلون‌شدن پوشه، هیچ بررسی‌ای تأییدشده نیست | نیازمند انتقال ریپو یا افزودن پوشه |
| `node --test storefronts/tests/storefront-check.test.mjs` | ✅ ۵/۵ (fixture سالم سبز، fixture شکسته قرمز: صفحهٔ گم‌شده، `dir=ltr`، `href="#"`، فونت ریموت، دو `h1`، JSON-LD نامعتبر) | اثبات اینکه گیت «سبز کاذب» نیست |
| `python3 -m unittest tests.test_storefront_studio` | ✅ ۱۰/۱۰ | قرارداد مستندات ↔ `sites.json` ↔ router |
| تست‌های ریشه | ✅ ۶۶/۶۶ | `python3 -m unittest discover -s tests -p "test_*.py"` |
| doctor | ✅ `repo` (۳/۳) · `storefronts` (۳/۳) · `router` (۳/۳) · `mobile` (۳/۳) — ۲۴٫۷ ثانیه | اجرای واقعی همین محیط، ۲۰۲۶-۱۱-۰۶ |
| CHAM (`fjcod`, kind=app) | ✅ گیت ایستا: توکن‌ها، `:focus-visible`، `prefers-reduced-motion`، فونت self-host، هدرهای `vercel.json` | بررسی ایستا؛ رندر/UX پنل با `doctor fjcod` سنجیده می‌شود |

### یافته‌های واقعی از صفحات زنده (۲۰۲۶-۱۱-۰۶، فقط مشاهده)
- **NAFAS:** لینک‌های محصول در HTML با `/product.html?p=...` نوشته شده‌اند ولی مرور روی سایت به
  `/product?p=...` می‌رسد (rewrite ورسل). یعنی canonical باید `/product?p=` باشد، وگرنه دو آدرس
  برای یک محصول ایندکس می‌شود → بند باز گیت ۵.
- **NAFAS — باگ واقعی ۴۰۴:** صفحهٔ ۴۰۴ لینک‌هایش را **نسبی** می‌سازد؛ در آدرس تودرتو مثل
  `/assets/css/main.css` لینک «خانه» به `/assets/css/index.html` تبدیل می‌شود (بازگشت به خانه می‌شکند).
  راه‌حل: مسیرهای مطلق با `/` در قالب ۴۰۴. تا اصلاح، این بند در پروفایل `nafas` باز است.
- **NIGHTLAB:** دروازهٔ سن با `localStorage` و پیام «ذخیره نمی‌شود» — با قاعدهٔ حریم در MASTER هم‌خوان است.
- **LIFESTAR:** مقایسهٔ کافئین و پک پله‌ای ۶/۱۲/۲۴ الگوی خوبی برای `bundle-builder` و بخش «مقایسه» است.

## ۴) کارهای باز
- [ ] کلون/انتقال یکی از سه سایت (اولویت NAFAS) به `storefronts/nafas/` و سبزکردن گیت ایستا.
- [ ] اصلاح ۴۰۴ نسبی NAFAS و canonical محصولات (`/product?p=`).
- [ ] ساخت `storefronts/starter/` (توکن + پوستهٔ RTL + سبد localStorage) تا سایت جدید از صفر شروع نشود.
- [ ] افزودن بررسی لینک داخلی و `sitemap/robots` به گیت ۵؛ سپس اجرای Chromium برای سبد/drawer.

## ۵) لاگ جریان (فقط اضافه می‌شود)
- **۲۰۲۶-۱۱-۰۶** — «Storefront Studio» ساخته شد: `MASTER.md` (هفت ستون، توکن برند، تایپوگرافی فارسی،
  ۱۷ کامپوننت اجباری، بودجهٔ کارایی، ضدِّ اسلپ، DoD)، چهار قرارداد صفحه (`home`، `shop`، `product`،
  `content-and-contact`)، `motion-3d.md` (چهار لایهٔ ۳D + reveal + reduced-motion + اندازه‌گیری)،
  هفت گیت انتشار، `sites.json` با پروفایل سه سایت زنده و `cham`، موتور بررسی `storefront-check.mjs`،
  و مهارت `storefront-design-system` در کتابخانه و مسیریاب. دلیل: سه سایت قبلی هرکدام سلیقهٔ جدا داشتند؛
  از این پس یک قرارداد مشترک دارند.
- **۲۰۲۶-۱۱-۰۶ (اجرا و گیت)** — `storefronts` به `scripts/doctor.mjs` (شناسهٔ `storefronts`)، جدول پروژه‌های
  `README.md`، `docs/directives/13-storefront-studio.md`، `ROADMAP.md` و کارت‌های کنسول آیفون اضافه شد.
  سه گیت CI (fixture، بررسی ایستا، تست مستندات) به job ریشه اضافه شد. شمارنده‌های router به
  ۶٬۰۲۰ / ۵٬۷۳۹ / ۳۰٬۰۸۶ هم‌گام و ایندکس PWA بازتولید شد. نتیجه: ۶۶ تست ریشه، ۵ تست fixture و
  doctor `repo`+`storefronts`+`router`+`mobile` سبز. رندر مرورگری، Lighthouse و دیپلوی زنده انجام **نشده** است.
