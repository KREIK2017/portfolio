# kreik.pp.ua — портфоліо

Статичний сайт на Next.js 16 (App Router) + Tailwind CSS 4.
Хостинг — Cloudflare Pages, домен і DNS — Cloudflare.

## Запуск

```bash
npm run dev     # http://localhost:3000
npm run build   # збірка статики в out/
npm run lint
```

## Структура

```
src/
├── app/                    маршрути й нічого крім них
│   ├── page.tsx            головна
│   ├── projects/           список і сторінка проєкту
│   ├── about/  contact/
│   ├── sitemap.ts  robots.ts
│   └── globals.css         палітра, темна тема, стилі .prose
├── components/
│   ├── ui/                 примітиви: Container, Badge, SectionHeading
│   ├── layout/             Header, Footer
│   └── projects/           ProjectCard, ProjectGrid, Gallery, AudioPlayer
├── config/site.ts          ім'я, опис, email, навігація
├── content/projects/       ← сюди додаються проєкти (.md)
├── lib/                    projects.ts (читання контенту), utils.ts
└── types/project.ts        типи + підписи категорій

public/projects/<slug>/     медіа конкретного проєкту
```

Принцип: у `app/` — тільки маршрути, верстка в `components/`, робота з даними
в `lib/`. Контент відокремлений від коду, тому додавання проєкту не змушує
лізти в компоненти.

## Як додати проєкт

1. Створи папку для медіа: `public/projects/my-project/`
   і поклади туди `cover.webp`, картинки галереї та аудіо.

2. Створи `src/content/projects/my-project.md`. Назва файлу стає URL:
   `/projects/my-project/`.

```markdown
---
title: Назва проєкту
summary: Одне-два речення для картки в списку.
kind: shopify # shopify | wordpress | web | design | other
date: "2026-07-15" # визначає порядок сортування
featured: true # показати на головній
stack:
  - Shopify
  - Liquid
cover: /projects/my-project/cover.webp
liveUrl: https://example.com
repoUrl: https://github.com/user/repo
gallery:
  - src: /projects/my-project/gallery/01.webp
    alt: Головна сторінка
audio:
  - title: Озвучка для промо-ролика
    src: /projects/my-project/audio/promo.mp3
---

## Задача

Звичайний markdown. Заголовки, списки, **жирний**, посилання.
```

3. `git push` — Cloudflare Pages перезбирає сайт автоматично.

Поля `cover`, `gallery`, `audio`, `liveUrl`, `repoUrl` необов'язкові —
відповідні блоки просто не з'являться. `draft: true` приховує проєкт,
не видаляючи файл.

## Деплой на Cloudflare Pages

**Workers & Pages** → **Create** → вкладка **Pages** → **Connect to Git**:

| Параметр               | Значення                       |
| ---------------------- | ------------------------------ |
| Framework preset       | `Next.js (Static HTML Export)` |
| Build command          | `npm run build`                |
| Build output directory | `out`                          |
| Env var                | `NODE_VERSION` = `22`          |

Далі **Custom domains** → `kreik.pp.ua` і `www.kreik.pp.ua`.
DNS-записи Cloudflare створить сам, бо зона вже в його керуванні.

## Технічні рішення

**Чому статичний експорт.** `output: "export"` у `next.config.ts` — Next
генерує готовий HTML, серверна частина не потрібна. Наслідок: не працюють
API routes, серверні екшени й ISR. Для портфоліо вони не потрібні.

**Чому `images.unoptimized: true`.** Вбудований оптимізатор `next/image`
вимагає Node-сервера, якого в статиці немає. Тому картинки треба готувати
самому: конвертувати в WebP і не завантажувати файли по 4000px. Ліміт
Cloudflare Pages — 25 MiB на файл.

**Чому markdown, а не БД.** Кожен проєкт — файл у git. Немає бази, яку
треба підтримувати й бекапити; історія змін ведеться сама.

**Чому Inter, а не Geist.** Geist зі скаффолду не має кириличного набору —
український текст падав би на системний шрифт.

## Якщо знадобиться WordPress

Cloudflare Pages роздає лише статику й не вміє PHP/MySQL. WordPress
ставиться на окремий хостинг і підключається піддоменом
(`blog.kreik.pp.ua`) через DNS-запис у Cloudflare. Основний сайт це не
торкається.
