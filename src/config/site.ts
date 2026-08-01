/**
 * Єдине джерело правди для всіх текстів «про сайт».
 * Міняєш тут — міняється в <title>, футері, sitemap і Open Graph.
 */
export const site = {
  name: "Maksim Mychko",
  role: "Software Engineer",
  title: "Portfolio — Maksim Mychko",
  description:
    "Software Engineer Portfolio: web applications, Shopify themes and WordPress projects.",
  url: "https://kreik.pp.ua",
  email: "maksimkamychko@gmail.com",
  locale: "en",

  socials: {
    github: "https://github.com/KREIK2017",
  },

  nav: [
    { href: "/projects", label: "Projects" },
    { href: "/about", label: "About me" },
    { href: "/contact", label: "Contact" },
  ],
} as const;
