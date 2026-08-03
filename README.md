# kreik.pp.ua — портфоліо в стилі Disco Elysium

Портфоліо як інтерактивна сцена: ізометрична кімната готелю, де предмети
є навігацією, а «голоси навичок» комментують дії користувача.

Next.js 16 (App Router) + Tailwind CSS 4, статичний експорт.
Хостинг — Cloudflare Workers (static assets), домен і DNS — Cloudflare.

## Запуск

```bash
npm run dev     # http://localhost:3000
npm run build   # збірка статики в out/
npm run lint
```

## Структура

```
src/
├── app/
│   ├── (uk)/                  ← українська версія, URL /
│   │   ├── layout.tsx         <html lang="uk">
│   │   └── page.tsx
│   ├── (en)/en/               ← англійська версія, URL /en/
│   │   └── page.tsx
│   ├── (en)/layout.tsx        <html lang="en">
│   ├── fonts.ts               Cormorant + Lora
│   ├── globals.css            палітра, текстури, анімації
│   └── sitemap.ts  robots.ts
├── components/
│   ├── scene/
│   │   ├── Experience.tsx     оркестратор: інтро → кімната → панелі
│   │   ├── Intro.tsx          пробудження, репліки з typewriter
│   │   ├── Room.tsx           ізометрична кімната й hotspots
│   │   ├── SkillVoices.tsx    стрічка внутрішнього монологу
│   │   └── Grain.tsx          зерно плівки й вінʼєтка
│   ├── panels/
│   │   ├── Panel.tsx          спільна оболонка + Divider
│   │   ├── ProjectsPanel.tsx  список справ і детальна картка
│   │   ├── SkillCheck.tsx     кидок 2d6 перед сильним кейсом
│   │   ├── AboutPanel.tsx     character sheet
│   │   ├── ContactPanel.tsx   контакти як радіочастоти
│   │   ├── CvPanel.tsx  TriviaPanel.tsx
│   └── ui/Typewriter.tsx
├── config/site.ts             імʼя, біо, контакти, шлях до CV
├── content/                   ← увесь контент тут
│   ├── projects.ts            проєкти
│   ├── skills.ts              6 навичок: рівні, кольори, репліки
│   ├── hotspots.ts            предмети кімнати
│   ├── intro.ts               сцена пробудження
│   └── dictionary.ts          службові тексти інтерфейсу
├── lib/
│   ├── iso.ts                 ізометрична проєкція, куби, стіни
│   ├── i18n.ts  metadata.ts  hooks.ts  utils.ts
└── types/content.ts
```

Принцип: у `app/` лише маршрути, вся верстка в `components/`, увесь текст
у `content/`. Щоб змінити наповнення, у компоненти лізти не треба.

## Що і де редагувати

| Хочу змінити              | Файл                          |
| ------------------------- | ----------------------------- |
| Проєкти                   | `src/content/projects.ts`     |
| Рівні й репліки навичок   | `src/content/skills.ts`       |
| Біо, контакти, імʼя       | `src/config/site.ts`          |
| Фан-факти                 | `src/content/dictionary.ts`   |
| Написи на предметах       | `src/content/hotspots.ts`     |
| Палітру й текстури        | `src/app/globals.css`         |
| Геометрію кімнати         | `src/components/scene/Room.tsx` |

### Додати проєкт

Допиши обʼєкт у `PROJECTS` і поклади зображення в
`public/projects/<slug>/`. Поля `image`, `liveUrl`, `repoUrl` і
`skillCheck` необовʼязкові — відповідні блоки просто не зʼявляться.

```ts
{
  slug: "my-project",
  year: "2026",
  title: { uk: "Назва", en: "Title" },
  summary: { uk: "…", en: "…" },
  role: { uk: "…", en: "…" },
  stack: ["Next.js", "TypeScript"],
  result: { uk: "…", en: "…" },
  image: "/projects/my-project/cover.webp",
  liveUrl: "https://example.com",
}
```

## Технічні рішення

**Кімната — не картинка, а геометрія.** `src/lib/iso.ts` рахує паралельну
проєкцію під кутом 30°, `Room.tsx` збирає сцену з кубів і площин. Тому вона
масштабується без втрат і важить кілограми менше за PNG. Замінити на
згенерований арт можна, підставивши зображення замість полігонів у `Room.tsx`.

**Двомовність без middleware.** У статичному експорті middleware не працює,
тому автовизначення мови через редирект неможливе. Замість цього — два
root layout через route groups: `(uk)` віддає `/`, `(en)` віддає `/en/`.
Кожна версія має правильний `lang` уже в статичному HTML і звʼязана з
іншою через `hreflang`.

**Cormorant замість Marcellus.** ТЗ пропонував Marcellus першим варіантом
для заголовків, але в нього немає кириличного набору — український текст
падав би на системний шрифт. Cormorant і Lora є в тому ж списку ТЗ і
підтримують кирилицю.

**`prefers-reduced-motion` вимикається в логіці, а не лише в CSS.**
Медіа-правило не скоротить інтервал typewriter'а і не зупинить кидок
кубиків, тому стан читається через `usePrefersReducedMotion`.

**Мобільний фолбек.** Ізометрія на телефоні лишається, але дрібні предмети
важко влучити пальцем — тому під сценою зʼявляється звичайний список
розділів (`sm:hidden`).

**Чому не БД.** Контент — типізовані TS-обʼєкти в git. Немає бази, яку
треба підтримувати; історія змін ведеться сама.

## Деплой

Сайт розгорнутий як **Cloudflare Worker зі статичними ассетами**.
Конфігурація — у `wrangler.jsonc`: поля `main` немає, тому серверний код
не виконується, Cloudflare роздає вміст `out/` зі свого CDN.

Кожен push у `main` перезбирає сайт через Workers Builds:

| Параметр       | Значення              |
| -------------- | --------------------- |
| Build command  | `npm run build`       |
| Deploy command | `npx wrangler deploy` |
| Root directory | `/`                   |
| Env var        | `NODE_VERSION` = `22` |

### Домен

- `kreik.pp.ua` — custom domain Workerʼа
- `www.kreik.pp.ua` — `A → 192.0.2.1` Proxied плюс Redirect Rule `301`
  на апекс зі збереженням шляху. Адреса зарезервована й нікуди не веде:
  запис існує лише щоб трафік дійшов до Cloudflare, де його перехоплює
  правило

Увімкнено `Always Use HTTPS`, інакше `http://www` не підпадає під правило
редиректу (воно описане як `https://www.kreik.pp.ua/*`) і віддає `522`.

## Що лишилося заповнити

- [ ] Реальні проєкти замість трьох заглушок у `content/projects.ts`
- [ ] Біо в `config/site.ts`
- [ ] Рівні навичок у `content/skills.ts` — зараз проставлені навмання
- [ ] LinkedIn і Telegram у `config/site.ts` (порожні не показуються)
- [ ] `public/cv.pdf`
- [ ] Скриншоти проєктів замість SVG-заглушок у `public/projects/`
