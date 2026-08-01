/**
 * Єдине джерело правди для всіх текстів «про сайт».
 * Міняєш тут — міняється в <title>, футері, sitemap і Open Graph.
 */
export const site = {
  // TODO: заміни на своє справжнє ім'я
  name: "KREIK",
  role: "Веб-розробник",
  title: "KREIK — веб-розробник",
  description:
    "Портфоліо веб-розробника: вебсайти, Shopify-теми та WordPress-проєкти.",
  url: "https://kreik.pp.ua",
  email: "claude.e-commerce@alpenpharma.com",
  locale: "uk_UA",

  socials: {
    github: "https://github.com/KREIK2017",
  },

  nav: [
    { href: "/projects", label: "Проєкти" },
    { href: "/about", label: "Про мене" },
    { href: "/contact", label: "Контакти" },
  ],
} as const;
