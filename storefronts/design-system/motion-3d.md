# حرکت، سه‌بعدی و اثربخشی (Motion & 3D)

سه‌بعدی در این پروژه‌ها **ابزار سلسله‌مراتب** است، نه نمایش توانایی. قاعدهٔ کلی:
اگر با حذف یک افکت، تصمیم خرید ساده‌تر می‌شود، همان نسخهٔ ساده درست است.

## ۱) لایه‌های مجاز (از ارزان به گران)

| لایه | فناوری | کاربرد درست | بودجه |
|---|---|---|---|
| L1 پارالاکس | CSS `transform: translate3d` + `requestAnimationFrame` یا `scroll()` timeline | عمق هیرو، جدایی متن از تصویر | ≤ ۸٪ جابه‌جایی، بدون jank |
| L2 تیلت/عمق کارت | `perspective` + `preserve-3d` + متغیرهای CSS | کارت محصول قهرمان، بنر کمپین | ≤ ۸° چرخش، برگشت فنری ≤ ۳۰۰ms |
| L3 چرخش ۳۶۰° محصول | توالی تصویر (۸–۳۶ فریم) یا `<model-viewer>`/three.js سبک | بررسی واقعی محصول (کفش، عینک، اکسسوری) | JS ≤ ۱۲۰KB gzip، فریم‌ها ≤ ۵۰KB هرکدام |
| L4 صحنهٔ WebGL | three.js + مدل فشرده | فقط یک نقطهٔ قهرمان در کل سایت | ۶۰fps روی موبایل میان‌رده، تست‌شده |

**ممنوع:** ذرات پرنده در سراسر صفحه، cursor سفارشی اجباری، scroll-jacking کامل، WebGL در هدر sticky،
و هر افکتی که روی `prefers-reduced-motion` خاموش نشود.

## ۲) قرارداد پیاده‌سازی سه‌بعدی

```js
// همهٔ افکت‌ها پشت یک پرچم و یک آبزرور؛ بدون JS، تصویر استاتیک همان محصول دیده می‌شود.
const motionOK = matchMedia('(prefers-reduced-motion: no-preference)').matches
              && !navigator.connection?.saveData;
if (motionOK) { /* IntersectionObserver + rAF */ }
```

- هر صحنهٔ ۳D یک **fallback استاتیک** (`<picture>` یا pinn) دارد؛ اگر canvas شکست خورد، همان می‌ماند.
- ورودی‌ها: `pointermove` روی دسکتاپ، `deviceorientation` هرگز بدون اجازهٔ صریح؛ روی لمسی دکمهٔ «بچرخان».
- فقط `transform` و `opacity` انیمیت شوند؛ هرگز `top/left/width/height`.
- توقف رندر وقتی صحنه خارج از viewport است (`IntersectionObserver` → `cancelAnimationFrame`).
- WebGL: `powerPreference:'low-power'`، `antialias:false` در موبایل، DPR سقف ۲، رهاسازی context در `pagehide`.
- هیچ مدل/تکسچر خارجی بدون لایسنس؛ فایل‌های `.glb` در `assets/3d/` و ≤ ۱٫۵MB.

## ۳) الگوهای سینمایی (Reveal)

| الگو | جزئیات | کاربرد |
|---|---|---|
| Reveal ملایم | `opacity 0→1`, `translateY(12px→0)`, ۴۵۰ms, `--ease` | عنوان بخش‌ها |
| تصویر شطرنجی | کلون با `scale(1.06)`، بدون افکت «پرده» طولانی | هیرو/لوک‌بوک |
| چسبیدن + متن پله‌ای | بخش `sticky` با ۲–۳ قدم متن و تغییر تصویر | داستان محصول |
| کارت خروج از قاب | تصویر محصول با سایه که کمی از کادر بیرون می‌زند | بنر کمپین |
| شمارندهٔ عدد | فقط اعداد واقعی؛ شمارش ۶۰۰ms از صفر | آمار برند |

**زمان‌بندی:** ورود ۳۵۰–۵۵۰ms، خروج ۲۰۰–۲۵۰ms، تأخیر پله‌ای ۶۰ms و حداکثر ۵ آیتم. هرگز بیش از یک
انیمیشن هم‌زمان روی یک ناحیه.

## ۴) حالت‌های کاهش حرکت

```css
@media (prefers-reduced-motion: reduce){
  *,*::before,*::after{animation-duration:.01ms !important;animation-iteration-count:1 !important;
  transition-duration:.01ms !important;scroll-behavior:auto !important}
  .parallax,.tilt{transform:none !important}
}
```

- ویدیوی هیرو در این حالت به پوستر تبدیل می‌شود و کنتر‌ل پخش نمی‌گیرد.
- `a11y` لینک «توقف انیمیشن‌ها» در فوتر برای هر سایت (کلاس `motion-off` روی `html`).

## ۵) اندازه‌گیری (بدون حدس)

- DevTools Performance: ۶ ثانیه اسکرول هیرو؛ Long Task > ۵۰ms = نقص.
- `Lighthouse` موبایل: TBT < ۲۰۰ms، CLS ≤ ۰٫۰۵.
- روی دستگاه واقعی: یک اندروید میان‌رده (نه فقط شبیه‌ساز) و ۴G throttle.
- شواهد (تاریخ، دستگاه، عدد) در `storefronts/PROGRESS.md` ثبت شود؛ «روان است» بدون عدد پذیرفته نیست.
