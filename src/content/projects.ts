import type { Project } from "@/types/content";

/**
 * Проєкти в порядку показу: першим іде комерційний, далі власні.
 *
 * Щоб додати роботу — допиши обʼєкт і поклади зображення в
 * public/projects/<slug>/. Обкладинки тримаємо в пропорції 1200×750:
 * розміри в компонентах задані фіксовано, інакше при завантаженні
 * буде стрибок верстки.
 *
 * Поле `year` поки проставлене приблизно — вивір і заміни.
 */
export const PROJECTS: Project[] = [
  {
    slug: "codeunity",
    year: "2025",
    title: {
      uk: "CodeUnity",
      en: "CodeUnity",
    },
    summary: {
      uk: "Сайт-портфоліо агентства, зроблений як інтерактивна 3D-сцена: замість сторінок — віртуальний острів, яким користувач ходить сам.",
      en: "An agency portfolio built as an interactive 3D scene: instead of pages, a virtual island the visitor walks around.",
    },
    role: {
      uk: "Комерційний проєкт у TuiSpace: підтримка WordPress та адміністрування сайтів",
      en: "Commercial project at TuiSpace: WordPress support and site administration",
    },
    stack: ["Three.js", "WordPress", "JavaScript"],
    result: {
      uk: "Low-poly острів на Three.js із геймплейною навігацією, жовтим акцентом і фоновою музикою — сайт запамʼятовується як місце, а не як сторінка.",
      en: "A low-poly Three.js island with gameplay-style navigation, a yellow accent and background music — the site is remembered as a place rather than a page.",
    },
    liveUrl: "https://codeunity.io/",
    image: "/projects/codeunity/cover.webp",
  },
  {
    slug: "kreik-gaming-merch",
    year: "2026",
    title: {
      uk: "KREIK Gaming Merch",
      en: "KREIK Gaming Merch",
    },
    summary: {
      uk: "Магазин ігрового мерчу: WordPress як вітрина, товари й кошик — із Shopify через Buy Button SDK.",
      en: "A gaming merch store: WordPress as the storefront, products and cart pulled from Shopify via the Buy Button SDK.",
    },
    role: {
      uk: "Власний проєкт, усе сам: плагін, тема, інтеграція, оточення",
      en: "Personal project, all of it mine: plugin, theme, integration, environment",
    },
    stack: ["WordPress", "PHP", "Shopify", "Liquid", "SCSS", "Gulp", "Docker"],
    result: {
      uk: "Власний плагін my-first-plugin 0.4.0 — Settings API, шорткоди, ACF-блоки та інтеграція з Shopify. Власна тема mfp-theme на SCSS і Gulp з лендінгом і блогом. Плюс окрема тема на Liquid для dev-стору через Shopify CLI. Усе оточення піднімається в Docker.",
      en: "My own plugin, my-first-plugin 0.4.0 — Settings API, shortcodes, ACF blocks and the Shopify integration. A custom mfp-theme built on SCSS and Gulp, with a landing page and a blog. Plus a separate Liquid theme for the dev store via Shopify CLI. The whole environment runs in Docker.",
    },
    image: "/projects/kreik-gaming-merch/cover.svg",
    skillCheck: {
      skill: "logic",
      difficulty: 8,
      label: {
        uk: "Зшити WordPress і Shopify замість того, щоб вибрати одне",
        en: "Stitch WordPress and Shopify together instead of picking one",
      },
    },
  },
  {
    slug: "aio-dashboard",
    year: "2026",
    title: {
      uk: "AIO Dashboard",
      en: "AIO Dashboard",
    },
    summary: {
      uk: "Внутрішній інструмент для IT-компанії: тікети, облік часу й білінг в одному вікні.",
      en: "An internal tool for an IT company: tickets, time tracking and billing in a single window.",
    },
    role: {
      uk: "Власний проєкт, fullstack: фронтенд, бекенд, база, оточення",
      en: "Personal project, fullstack: frontend, backend, database, environment",
    },
    stack: [
      "React",
      "Vite",
      "Express 5",
      "TypeScript",
      "Sequelize",
      "MariaDB",
      "Docker",
    ],
    result: {
      uk: "Тікети, таймер, білінг, авторизація через JWT, аватари та згадки через @. Інтерфейс у темній темі з glassmorphism. Бекенд і база піднімаються в Docker однією командою.",
      en: "Tickets, a timer, billing, JWT auth, avatars and @mentions. A dark-themed interface with glassmorphism. Backend and database come up in Docker with a single command.",
    },
    repoUrl: "https://github.com/KREIK2017/all-in-one-project",
    image: "/projects/aio-dashboard/cover.svg",
  },
];

export function getProject(slug: string): Project | undefined {
  return PROJECTS.find((project) => project.slug === slug);
}
