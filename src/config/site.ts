import type { Localized } from "@/types/content";

interface Contacts {
  email: string;
  github: string;
  /** Порожній рядок — пункт просто не з'явиться в панелі «Радіо». */
  linkedin: string;
  telegram: string;
}

// Окремо від site і з явним типом: інакше `as const` нижче звузив би
// порожні рядки до типу "" і TypeScript вважав би гілку недосяжною.
const contacts: Contacts = {
  email: "maksimkamychko@gmail.com",
  github: "https://github.com/KREIK2017",
  // TODO: додати справжні посилання
  linkedin: "",
  telegram: "",
};

/**
 * Єдине джерело правди для всіх текстів «про сайт».
 * Міняєш тут — міняється в <title>, Open Graph, sitemap і панелях.
 */
export const site = {
  name: "Maksim Mychko",
  url: "https://kreik.pp.ua",

  role: {
    uk: "Software Engineer",
    en: "Software Engineer",
  } satisfies Localized,

  title: {
    uk: "Maksim Mychko — Software Engineer",
    en: "Maksim Mychko — Software Engineer",
  } satisfies Localized,

  description: {
    uk: "Портфоліо як ізометрична кімната. Вебзастосунки, Shopify-теми та WordPress-проєкти.",
    en: "A portfolio you walk into. Web applications, Shopify themes and WordPress projects.",
  } satisfies Localized,

  // TODO: замінити на власне біо, 3–5 речень від першої особи
  bio: {
    uk: [
      "Я роблю сайти вже кілька років — від магазинів на Shopify до кастомних тем WordPress і застосунків на React.",
      "Найбільше люблю задачі, де треба спершу зрозуміти, що людині насправді потрібно, а вже потім писати код.",
      "Вважаю, що інтерфейс має бути не просто зручним, а таким, щоб його хотілося відкрити ще раз.",
    ],
    en: [
      "I have been building for the web for several years — Shopify stores, custom WordPress themes, React applications.",
      "The work I like most starts with figuring out what someone actually needs, and only then writing code.",
      "I think an interface should be more than usable. It should make you want to open it again.",
    ],
  } satisfies Localized<string[]>,

  contacts,

  /** TODO: покласти файл у public/cv.pdf */
  cvPath: "/cv.pdf",
} as const;
