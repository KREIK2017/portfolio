import type { Project } from "@/types/content";

/**
 * Дані проєктів. Щоб додати роботу — допиши об'єкт і поклади
 * зображення в public/projects/<slug>/cover.svg (або .webp).
 *
 * TODO: замінити ці три заглушки на реальні кейси.
 */
export const PROJECTS: Project[] = [
  {
    slug: "shopify-theme",
    year: "2026",
    title: {
      uk: "Кастомна тема Shopify",
      en: "Custom Shopify theme",
    },
    summary: {
      uk: "Тема для магазину одягу з нуля. Клієнт міг змінювати структуру головної сторінки сам, без розробника.",
      en: "A clothing store theme built from scratch. The client could restructure the home page without a developer.",
    },
    role: {
      uk: "Єдиний розробник: верстка, Liquid, налаштування редактора",
      en: "Sole developer: markup, Liquid, theme editor setup",
    },
    stack: ["Shopify", "Liquid", "JavaScript", "SCSS"],
    result: {
      uk: "Завантаження з 8 с до 1.4 с, Lighthouse Performance 96. Клієнт перестав звертатися за дрібними правками контенту.",
      en: "Load time from 8 s to 1.4 s, Lighthouse Performance 96. The client stopped filing tickets for small content edits.",
    },
    liveUrl: "https://example.com",
    image: "/projects/shopify-theme/cover.svg",
    skillCheck: {
      skill: "logic",
      difficulty: 8,
      label: {
        uk: "Переписати тему з нуля замість латання чужої",
        en: "Rewrite the theme from scratch instead of patching someone else's",
      },
    },
  },
  {
    slug: "wordpress-corporate",
    year: "2026",
    title: {
      uk: "Корпоративний сайт на WordPress",
      en: "WordPress corporate site",
    },
    summary: {
      uk: "Сайт послуг із кастомною темою й адмінкою, зрозумілою нетехнічному клієнту. Без візуальних білдерів.",
      en: "A services site with a custom theme and an admin panel a non-technical client can actually use. No page builders.",
    },
    role: {
      uk: "Розробка теми, налаштування ACF, двомовність",
      en: "Theme development, ACF setup, localisation",
    },
    stack: ["WordPress", "PHP", "ACF", "Tailwind CSS"],
    result: {
      uk: "Клієнт публікує новини й кейси самостійно. Сторінки важать утричі менше, ніж на попередній збірці з білдером.",
      en: "The client publishes news and cases unaided. Pages weigh a third of the previous builder-based setup.",
    },
    liveUrl: "https://example.com",
    image: "/projects/wordpress-corporate/cover.svg",
  },
  {
    slug: "this-portfolio",
    year: "2026",
    title: {
      uk: "Цей сайт",
      en: "This very site",
    },
    summary: {
      uk: "Портфоліо як інтерактивна сцена, а не стрічка блоків. Ізометрична кімната намальована векторами прямо в браузері.",
      en: "A portfolio as an interactive scene rather than a stack of sections. The isometric room is drawn in vectors, in the browser.",
    },
    role: {
      uk: "Концепція, дизайн, розробка, інфраструктура",
      en: "Concept, design, development, infrastructure",
    },
    stack: ["Next.js", "TypeScript", "SVG", "Cloudflare Workers"],
    result: {
      uk: "Повністю статичний сайт: жодного сервера, жодної бази. Хостинг безкоштовний, деплой автоматичний з кожного пуша.",
      en: "Fully static: no server, no database. Free hosting, automatic deploy on every push.",
    },
    repoUrl: "https://github.com/KREIK2017/portfolio",
    image: "/projects/this-portfolio/cover.svg",
  },
];

export function getProject(slug: string): Project | undefined {
  return PROJECTS.find((project) => project.slug === slug);
}
