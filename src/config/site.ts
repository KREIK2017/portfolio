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
  linkedin: "https://www.linkedin.com/in/kreik2017/",
  telegram: "https://t.me/kreik2017",
};

/**
 * Єдине джерело правди для всіх текстів «про сайт».
 * Міняєш тут — міняється в <title>, Open Graph, sitemap і панелях.
 */
export const site = {
  /** Імʼя двомовне: українська сторінка не має показувати транслітерацію. */
  name: {
    uk: "Максим Мичко",
    en: "Maksim Mychko",
  } satisfies Localized,

  /** Нік, під яким мене знають і яким названо домен. */
  handle: "KREIK",

  url: "https://kreik.pp.ua",

  role: {
    uk: "WordPress-розробник / Fullstack (junior+)",
    en: "WordPress Developer / Fullstack (junior+)",
  } satisfies Localized,

  title: {
    uk: "Максим Мичко — WordPress-розробник",
    en: "Maksim Mychko — WordPress Developer",
  } satisfies Localized,

  description: {
    uk: "Портфоліо WordPress- і fullstack-розробника: теми й плагіни WordPress, інтеграції з Shopify, застосунки на React і Next.js.",
    en: "Portfolio of a WordPress and fullstack developer: WordPress themes and plugins, Shopify integrations, React and Next.js applications.",
  } satisfies Localized,

  /**
   * Текст у шапці. Свідомо окремо від description: той іде в
   * <meta name="description"> і Open Graph, тому мусить лишатися
   * діловим — жарт у сніпеті пошуку виглядав би недоречно.
   */
  tagline: {
    uk: "Пишу код, який працює і не падає (майже). Будую сайти на WordPress, збираю застосунки на React і Next.js — усе в одних руках.",
    en: "I write code that works and doesn't fall over (mostly). I build WordPress sites and assemble React and Next.js apps — all in one pair of hands.",
  } satisfies Localized,

  /** Жарт у шапці. Автор і текст окремо, щоб підпис можна було притишити. */
  quip: {
    text: {
      uk: "Якщо працює — не трогай. Якщо зламав — зроби вигляд, що так і було.",
      en: "If it works, don't touch it. If you broke it, act like it was always that way.",
    } satisfies Localized,
    author: {
      uk: "© Інженер",
      en: "© An engineer",
    } satisfies Localized,
  },

  bio: {
    uk: [
      "WordPress-розробник з комерційним досвідом понад рік — підтримка та розробка вебрішень для бізнесу.",
      "За освітою інженер програмного забезпечення: маю диплом бакалавра й продовжую навчання в магістратурі за тією ж спеціальністю. Завдяки базі у C# та C++ підходжу до архітектури коду системно.",
      "Активно впроваджую AI-інструменти у робочий процес — це помітно прискорює розробку та підвищує якість результату.",
      "Паралельно веду власні проєкти, де закриваю весь цикл: від плагіна й теми до бази на MySQL в Docker.",
      "Найцікавіше мені там, де WordPress треба з чимось зшити — із Shopify, із власним API або з інструментом, якого ще не існує.",
    ],
    en: [
      "A WordPress developer with over a year of commercial experience — support and development of web solutions for business.",
      "I'm a software engineer by training: I hold a bachelor's degree and am continuing with a master's in the same field. A grounding in C# and C++ means I approach code architecture systematically.",
      "I bring AI tools into my workflow every day — it speeds up development noticeably and raises the quality of the result.",
      "Alongside that I run my own projects, covering the whole cycle: from a plugin and a theme to a MySQL database in Docker.",
      "The work I find most interesting is where WordPress has to be stitched to something else — Shopify, my own API, or a tool that doesn't exist yet.",
    ],
  } satisfies Localized<string[]>,

  /**
   * Цифри мають збігатися з біо. Раніше тут стояли значення з мокапу
   * (6+ років, 40+ проєктів, 25+ клієнтів) — поруч із «junior+, рік
   * досвіду» вони читалися б як неправда.
   */
  stats: [
    {
      value: "1+",
      label: { uk: "Досвід", en: "Experience" },
      note: { uk: "рік комерційно", en: "year commercially" },
    },
    {
      value: "3",
      label: { uk: "Проєкти", en: "Projects" },
      note: { uk: "у портфоліо", en: "in the portfolio" },
    },
    {
      value: "",
      label: { uk: "Освіта", en: "Education" },
      note: {
        uk: "Бакалавр, триває магістратура",
        en: "BSc, MSc in progress",
      },
    },
    {
      value: "",
      label: { uk: "Статус", en: "Status" },
      note: { uk: "ФОП, 3 група", en: "Registered sole proprietor" },
    },
  ] satisfies Array<{
    value: string;
    label: Localized;
    note: Localized;
  }>,

  motto: {
    uk: "Інструменти не роблять розробника. Це робить цікавість. Я будую. Я ламаю. Я вчуся. І знову.",
    en: "Tools don't make the developer. Curiosity does. I build. I break. I learn. I repeat.",
  } satisfies Localized,

  contacts,

  cvPath: "/cv.pdf",
} as const;
