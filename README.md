# ОТ ДОНЕР — онлайн тапсырыс сайты

Кухня на углях · Ақтау · 24/7. Статикалық сайт: HTML + CSS + vanilla JS, backend жоқ.

## Беттер

| Файл | Не бар |
|---|---|
| `index.html` | Hero, «Неге otdoner?», мәзір (табтар), корзина + тапсырыс формасы → WhatsApp, пікір қалдыру, байланыс |
| `reviews.html` | Барлық клиент пікірлері (Supabase) |
| `qr.html` | Кафеге ілетін QR постер (басып шығару / PNG) |

## Жиі өзгертілетін нәрселер

- **Баға, тағам, сипаттама** — `js/data.js` (`MENU`). Сурет: `img/menu/<img>.webp` және `<img>-s.webp`.
- **Филиалдар мен жұмыс уақыты** — `js/data.js` (`BRANCHES`).
- **Мәтіндер (KZ/RU)** — `js/i18n.js`.
- **WhatsApp нөмірі, Supabase** — `js/config.js`.

## Пікірлерді қосу (Supabase, бір рет)

1. [supabase.com](https://supabase.com) → New project.
2. SQL Editor → `supabase/setup.sql` мазмұнын қойып → **Run**.
3. Project Settings → API: `Project URL` пен `anon public` кілтін `js/config.js` ішіне қойыңыз:
   ```js
   supabaseUrl: "https://xxxx.supabase.co",
   supabaseAnonKey: "eyJ...",
   ```
4. Commit + push — Vercel өзі жаңартады.

Жаман пікірді жасыру: Table Editor → `otdoner_reviews` → `published` = `false`.

## Деплой

GitHub-қа push → Vercel автоматты түрде жариялайды. Жергілікті тексеру:

```bash
python -m http.server 5173
```
