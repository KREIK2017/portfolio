import type { StackItem } from "@/types/content";

/**
 * Технологічний стек — з мокапу «MY STACK».
 * Шкала тут 1–5, а не 1–6 як у голосів навичок: це різні речі.
 * Голоси — риси характеру, стек — інструменти.
 *
 * Тони взяті з мокапу — це свідомий відступ від заборони насичених
 * кольорів у розділі 4 ТЗ: класичний режим оформлюється за мокапом,
 * а не за темною палітрою кімнати.
 */
export const STACK: StackItem[] = [
  {
    id: "wordpress",
    name: "WordPress",
    group: "backend",
    level: 4,
    tone: "#2f5a86",
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
    tone: "#6b4a86",
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
    tone: "#2e7a72",
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
    tone: "#c9932c",
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
    tone: "#2f5138",
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
    tone: "#4a5fa8",
    summary: {
      uk: "Типізація, інтерфейси, дженерики, надійний та масштабований код",
      en: "Typing, interfaces, generics, reliable and scalable code",
    },
  },
  {
    id: "databases",
    name: "Databases",
    group: "backend",
    level: 4,
    tone: "#2a5f5a",
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
    tone: "#5a7d33",
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
    tone: "#c25a2a",
    summary: {
      uk: "Адміністрування, керування магазинами, підтримка, налаштування",
      en: "Administration, store management, support, configuration",
    },
  },
  {
    id: "git",
    name: "Git",
    group: "tools",
    level: 4,
    tone: "#3a63a8",
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
    tone: "#2b7fa8",
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
    tone: "#a8402e",
    summary: {
      uk: "Автоматизація збірки, оптимізація, workflow, швидкий dev-сервер",
      en: "Build automation, optimisation, workflow, fast dev server",
    },
  },
  {
    id: "ai-tools",
    name: "AI Tools",
    group: "ai",
    level: 5,
    // Світла картка, як у мокапі — рендериться з темним текстом.
    tone: "#ded3bd",
    summary: {
      uk: "Claude, Gemini, Midjourney, Sora. Щодня використовую AI для прискорення розробки, генерації ідей та креативу.",
      en: "Claude, Gemini, Midjourney, Sora. Daily AI use to speed up development, generate ideas and creative work.",
    },
  },
];

/** Шкала стеку — п'ять поділок, як у мокапі. */
export const STACK_MAX_LEVEL = 5;

/**
 * Підпис SKILL POINTS у мокапі показував 12 — це кількість технологій
 * у сітці, без картки AI Tools, яка стоїть окремим рядком. Рахуємо так
 * само, щоб число не розходилося з макетом при додаванні позицій.
 */
export const STACK_POINTS = STACK.filter((item) => item.group !== "ai").length;
