import type { Localized } from "@/types/content";

/** Усі службові тексти інтерфейсу. Контент проєктів — у projects.ts. */
export const ui = {
  introHint: {
    uk: "розплющити очі",
    en: "open your eyes",
  },
  introSkip: {
    uk: "пропустити",
    en: "skip",
  },
  roomHint: {
    uk: "Озирнись. Клікай на предмети — світлі кружечки позначають, де можна.",
    en: "Look around. Click the objects — the pale rings mark what responds.",
  },

  /**
   * Прямі назви розділів для міні-навігації. Свідомо буденніші за
   * атмосферні заголовки панелей: це швидкий шлях для того, хто не
   * хоче розбиратися в метафорах кімнати.
   */
  nav: {
    projects: { uk: "Проєкти", en: "Projects" },
    about: { uk: "Про мене", en: "About" },
    contact: { uk: "Контакти", en: "Contact" },
    cv: { uk: "Résumé", en: "Résumé" },
  },
  back: {
    uk: "Піти геть",
    en: "Walk away",
  },
  close: {
    uk: "Закрити",
    en: "Close",
  },
  langSwitch: {
    uk: "English",
    en: "Українська",
  },
  dayNight: {
    uk: "Змінити час доби",
    en: "Change time of day",
  },

  projects: {
    title: { uk: "Справи", en: "Case files" },
    subtitle: {
      uk: "Кожна папка — окрема робота. Відкрий будь-яку.",
      en: "Each folder is a separate job. Open any of them.",
    },
    role: { uk: "Роль", en: "Role" },
    stack: { uk: "Стек", en: "Stack" },
    result: { uk: "Результат", en: "Outcome" },
    live: { uk: "Відкрити сайт", en: "Visit site" },
    repo: { uk: "Код", en: "Source" },
    empty: {
      uk: "Дошка поки порожня. Проєкти додаються в src/content/projects.ts.",
      en: "The board is empty for now. Projects live in src/content/projects.ts.",
    },
  },

  about: {
    title: { uk: "Хто ти", en: "Who you are" },
    subtitle: {
      uk: "Шість голосів, і кожен тягне у свій бік.",
      en: "Six voices, each pulling its own way.",
    },
    skills: { uk: "Навички", en: "Skills" },
  },

  contact: {
    title: { uk: "Радіо", en: "Radio" },
    subtitle: {
      uk: "Частоти, на яких мене можна знайти.",
      en: "Frequencies I can be reached on.",
    },
    copied: { uk: "Скопійовано", en: "Copied" },
    copy: { uk: "Скопіювати адресу", en: "Copy address" },
  },

  cv: {
    title: { uk: "Валіза", en: "The suitcase" },
    subtitle: {
      uk: "Усе те саме, але сухою мовою і на одній сторінці.",
      en: "The same thing, in dry language, on a single page.",
    },
    download: { uk: "Завантажити CV (PDF)", en: "Download CV (PDF)" },
    missing: {
      uk: "Файл ще не додано. Поклади cv.pdf у папку public/.",
      en: "The file isn't there yet. Drop cv.pdf into the public/ folder.",
    },
  },

  trivia: {
    title: { uk: "Попільничка", en: "The ashtray" },
    subtitle: {
      uk: "Те, що не входить у резюме.",
      en: "The parts that don't belong on a CV.",
    },
    // TODO: замінити на свої факти
    items: {
      uk: [
        "Перший сайт зробив на таблицях. Тоді це вважалося нормою.",
        "Досі вважаю, що CSS складніший за бекенд, і не жартую.",
        "Ця кімната намальована кодом. Жодного зображення, тільки вектори й математика.",
        "Найдовший баг у моєму житті виявився зайвою комою.",
      ],
      en: [
        "My first website used table layouts. At the time that was considered correct.",
        "I still maintain CSS is harder than backend, and I am not joking.",
        "This room is drawn in code. Not a single image — just vectors and arithmetic.",
        "The longest bug of my life turned out to be one extra comma.",
      ],
    } satisfies Localized<string[]>,
  },

  check: {
    title: { uk: "Перевірка навички", en: "Skill check" },
    success: { uk: "Успіх", en: "Success" },
    failure: { uk: "Провал", en: "Failure" },
    roll: { uk: "Кинути кубики", en: "Roll the dice" },
    difficulty: { uk: "Складність", en: "Difficulty" },
  },
} as const;
