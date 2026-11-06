# Storefront Studio — طراحی سایت فروشگاهی در سطح حرفه‌ای

پوشهٔ `storefronts/` استاندارد مشترک همهٔ فروشگاه‌های پوریا است: یک سیستم طراحی، یک قرارداد صفحه،
یک فهرست سایت زنده و یک موتور بررسی. هر سایت جدید **از همین‌جا** شروع می‌شود تا کیفیت بصری و فنی
به‌جای تکرارِ سلیقه، تکرارِ استاندارد باشد.

| بخش | مسیر | چه چیزی را قفل می‌کند |
|---|---|---|
| سیستم طراحی | [`design-system/MASTER.md`](design-system/MASTER.md) | هفت ستون، توکن برند، تایپوگرافی فارسی، کامپوننت‌های اجباری، بودجهٔ کارایی، ضدِّ اسلپ |
| قرارداد صفحه‌ها | [`design-system/pages/`](design-system/pages/) | `home` · `shop` · `product` · `content-and-contact` |
| حرکت و ۳D | [`design-system/motion-3d.md`](design-system/motion-3d.md) | چهار لایهٔ مجاز، الگوهای سینمایی، کاهش حرکت، اندازه‌گیری |
| گیت‌های انتشار | [`checklist/release-gates.md`](checklist/release-gates.md) | ۷ گیت با مدرک اجباری |
| فهرست سایت‌ها | [`sites.json`](sites.json) | برند، پالت، ماژول‌های امضا، وضعیت گیت‌های NAFAS / NIGHTLAB / LIFESTAR / CHAM |
| موتور بررسی | [`scripts/storefront-check.mjs`](scripts/storefront-check.mjs) | RTL، توکن، یک `h1`، فوکوس، reduced-motion، لینک مرده، schema، وزن تصویر |
| مهارت مسیریاب | `library/skills/storefront-design-system/SKILL.md` | همان استاندارد، در دسترس هر جلسهٔ Claude |

## سایت‌های زندهٔ این استاندارد

| برند | دسته | لینک | وضعیت |
|---|---|---|---|
| NAFAS · نفس | اکسسوری دخترانه | <https://nafas-accessories.vercel.app/> | زنده |
| NIGHTLAB · نایت‌لب (۱۸+) | بوتیک بزرگسالان | <https://nightlab-boutique.vercel.app/> | زنده |
| LIFE STAR · لایف استار | نوشیدنی انرژی‌زا | <https://lifestar-shop.vercel.app/> | زنده |
| CHAM · چام | پنل فروش (`fjcod/`) | در مخزن | کد + سیستم طراحی |

این سه سایت زنده در همین مخزن نیستند؛ منبع حقیقت طراحی‌شان بعد از کلون‌شدن، پوشهٔ خودشان زیر
`storefronts/<id>/` خواهد بود. تا آن زمان بایت‌هایشان با `checkout: ""` در `sites.json` علامت خورده‌اند
و هیچ ادعایی دربارهٔ اندازه، Lighthouse یا تجربهٔ موبایلشان تأییدنشده ثبت نمی‌شود.

## فرمان‌ها

```bash
# بررسی ایستای سایت‌های داخل مخزن (بدون وابستگی، بدون شبکه)
node storefronts/scripts/storefront-check.mjs --all
node storefronts/scripts/storefront-check.mjs --dir fjcod
node storefronts/scripts/storefront-check.mjs --dir path/to/site --json

# مسیریابی درخواست طراحی به مهارت
python3 .claude/skills/mega-skills-router/scripts/route.py "طراحی صفحه محصول فروشگاه سه بعدی"
```

`doctor` شناسهٔ `storefronts` دارد و همین اسکریپت را اجرا می‌کند.

## قاعدهٔ سه‌خطی (خلاصهٔ MASTER)

1. **یک وعده، یک قهرمان، یک اقدام.** صفحه‌ای که همه‌چیز می‌گوید، هیچ‌چیز نمی‌فروشد.
2. **سه‌بعدی فقط وقتی انتخاب را ساده کند**، با fallback استاتیک و خاموشی روی `prefers-reduced-motion`.
3. **فارسی اصیل، عدد واقعی، لینک واقعی.** هیچ آمار جعلی، هیچ `href="#"` برای خرید، هیچ فرم دکوراتیو.

## افزودن سایت جدید

1. `storefronts/<id>/` را از قرارداد صفحه‌ها بساز (یا از `fjcod` الگو بگیر).
2. توکن برند را در `sites.json` ثبت کن (۳ رنگ، فونت، محصول قهرمان، مسیر خرید).
3. `node storefronts/scripts/storefront-check.mjs --dir storefronts/<id>` را تا سبزبودن خطاها بگذران.
4. گیت‌های `release-gates.md` را اجرا و نتیجهٔ واقعی را در [`PROGRESS.md`](PROGRESS.md) ثبت کن.
5. Vercel: Root Directory = همان پوشه، سپس لینک زنده را در `sites.json` بنویس.
