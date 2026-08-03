import type { StackItem } from "@/types/content";

/**
 * Технологічний стек.
 *
 * Палітри — по дві на технологію: `base` це підмальовок, `accents` —
 * кольори мазків, які генератор розкладає по картці. Кожна пара
 * підібрана під фірмовий колір технології, але приглушена, щоб сітка з
 * дванадцяти карток не перетворилась на веселку.
 *
 * Шкала тут 1–6, як і в голосів навичок, але це різні речі: голоси —
 * риси характеру, стек — інструменти.
 */
export const STACK: StackItem[] = [
  {
    id: "wordpress",
    name: "WordPress",
    group: "backend",
    level: 4,
    base: "#1f333d",
    accents: ["#3d6b8a", "#5a86a3", "#22384a", "#b7c9d4"],
    summary: {
      uk: "Теми, плагіни, ACF, Gutenberg, Settings API, шорткоди",
      en: "Themes, plugins, ACF, Gutenberg, Settings API, shortcodes",
    },
  },
  {
    id: "php",
    name: "PHP",
    group: "backend",
    level: 4,
    base: "#3a2540",
    accents: ["#8a5a1f", "#3e6157", "#5a3a5f", "#b5654a"],
    summary: {
      uk: "Серверна розробка, OOP, архітектура, інтеграції",
      en: "Server-side development, OOP, architecture, integrations",
    },
  },
  {
    id: "frontend-core",
    name: "Frontend Core",
    group: "frontend",
    level: 4,
    base: "#173534",
    accents: ["#c9973f", "#3a6ea5", "#e0a63e", "#2f5c52"],
    summary: {
      uk: "HTML5, CSS3/SCSS, JavaScript (ES6+), jQuery",
      en: "HTML5, CSS3/SCSS, JavaScript (ES6+), jQuery",
    },
  },
  {
    id: "react-next",
    name: "React & Next.js",
    group: "frontend",
    level: 4,
    base: "#5a3d14",
    accents: ["#c9973f", "#2e7d8a", "#e0a63e", "#7a4f1c"],
    summary: {
      uk: "Компоненти, хуки, SSR/SSG, маршрутизація, оптимізація",
      en: "Components, hooks, SSR/SSG, routing, optimisation",
    },
  },
  {
    id: "nodejs",
    name: "Node.js",
    group: "backend",
    level: 4,
    base: "#233522",
    accents: ["#3f6b3a", "#5a8a4a", "#264024", "#8ea86a"],
    summary: {
      uk: "Node.js, Express 5, REST API, Middlewares, TypeScript",
      en: "Node.js, Express 5, REST API, middleware, TypeScript",
    },
  },
  {
    id: "typescript",
    name: "TypeScript",
    group: "frontend",
    level: 4,
    base: "#222835",
    accents: ["#3a5a9e", "#5b7bc4", "#22283f", "#7f9cd8"],
    summary: {
      uk: "Типізація, інтерфейси, дженерики, надійний код",
      en: "Typing, interfaces, generics, reliable code",
    },
  },
  {
    id: "databases",
    name: "Databases",
    group: "backend",
    level: 4,
    base: "#1c2e2e",
    accents: ["#2e4a48", "#4a706c", "#1a2a2a", "#6f938e"],
    summary: {
      uk: "Sequelize ORM, MariaDB/MySQL, міграції, зв'язки",
      en: "Sequelize ORM, MariaDB/MySQL, migrations, relations",
    },
  },
  {
    id: "shopify",
    name: "Shopify",
    group: "commerce",
    level: 3,
    base: "#2e3a1e",
    accents: ["#5a7d3a", "#95b23f", "#3c4d24", "#c5d97a"],
    summary: {
      uk: "Buy Button SDK, Shopify CLI, Liquid, кастомізація тем",
      en: "Buy Button SDK, Shopify CLI, Liquid, theme customisation",
    },
  },
  {
    id: "upgates",
    name: "Upgates",
    group: "commerce",
    level: 3,
    base: "#5c3016",
    accents: ["#a85a22", "#c97a3e", "#7a3f1c", "#e0a35c"],
    summary: {
      uk: "Адміністрування, керування магазинами, підтримка",
      en: "Administration, store management, support",
    },
  },
  {
    id: "git",
    name: "Git",
    group: "tools",
    level: 4,
    base: "#5c2418",
    accents: ["#b5432a", "#d9603f", "#7a2e1c", "#e88a5c"],
    summary: {
      uk: "Версійний контроль, робота з командою, Git Flow",
      en: "Version control, working in a team, Git Flow",
    },
  },
  {
    id: "docker",
    name: "Docker",
    group: "tools",
    level: 4,
    base: "#12324a",
    accents: ["#1f6fa8", "#3a8fc9", "#0f2a3f", "#7ec3e8"],
    summary: {
      uk: "Контейнери, ізоляція, Docker Compose, середовища",
      en: "Containers, isolation, Docker Compose, environments",
    },
  },
  {
    id: "build-tools",
    name: "Gulp & Vite",
    group: "tools",
    level: 3,
    base: "#4a2414",
    accents: ["#a8461f", "#d97a3e", "#6b2e16", "#e8a35c"],
    summary: {
      uk: "Автоматизація збірки, оптимізація, workflow",
      en: "Build automation, optimisation, workflow",
    },
  },
  {
    id: "ai-tools",
    name: "AI Tools",
    group: "ai",
    level: 5,
    // Світла картка: у макеті AI Tools стоїть окремим рядком на папері.
    base: "#c4b189",
    accents: ["#d9c9a3", "#b8a67e", "#a89670", "#c9973f"],
    summary: {
      uk: "Claude, Gemini, Midjourney, Sora — щодня використовую AI для прискорення розробки, генерації ідей та креативу.",
      en: "Claude, Gemini, Midjourney, Sora — daily AI use to speed up development, generate ideas and creative work.",
    },
  },
];

/** Шість поділок, як у прикладі дизайнера. */
export const STACK_MAX_LEVEL = 6;

/**
 * Підпис SKILL POINTS у макеті показував 12 — це кількість технологій
 * у сітці, без картки AI Tools, яка стоїть окремим рядком.
 */
export const STACK_POINTS = STACK.filter((item) => item.group !== "ai").length;
