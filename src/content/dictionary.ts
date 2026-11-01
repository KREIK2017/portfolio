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
  },

  trivia: {
    title: { uk: "Попільничка", en: "The ashtray" },
    subtitle: {
      uk: "Кілька фактів без вигаданих легенд.",
      en: "A few facts, without invented stories.",
    },
    items: {
      uk: [
        "Понад рік комерційно підтримую WordPress-сайти й адмініструю їх.",
        "Маю диплом бакалавра з інженерії програмного забезпечення й продовжую навчання в магістратурі.",
        "Власні проєкти — бот для моніторингу сайтів і fullstack-панель для тікетів та обліку часу.",
        "FilmCraft вивчаю як відкритий проєкт: розбираю його код і шукаю, що можна поліпшити.",
      ],
      en: [
        "I have over a year of commercial experience supporting and administering WordPress sites.",
        "I hold a bachelor's degree in software engineering and am continuing with a master's degree.",
        "My own projects include a website monitoring bot and a fullstack dashboard for tickets and time tracking.",
        "I study FilmCraft as an open-source project: reading its code and exploring what could be improved.",
      ],
    } satisfies Localized<string[]>,
  },

  /** Тексти класичного режиму («Швидкий перегляд / Résumé»). */
  resume: {
    toResume: { uk: "На головну", en: "Home" },
    toRoom: { uk: "Увійти в кімнату", en: "Enter the room" },

    nav: {
      home: { uk: "Головна", en: "Home" },
      about: { uk: "Про мене", en: "About" },
      work: { uk: "Роботи", en: "Work" },
      stack: { uk: "Стек", en: "Stack" },
      contact: { uk: "Контакти", en: "Contact" },
    },

    hero: {
      eyebrow: { uk: "// Розробник", en: "// Developer" },
      photoAlt: {
        uk: "Максим Мичко на природі, показує в камеру",
        en: "Maksim Mychko outdoors, pointing at the camera",
      },
      cta: { uk: "Дивитись роботи", en: "Explore my work" },
    },

    stackSection: {
      eyebrow: { uk: "// Навички та технології", en: "// Skills & technologies" },
      title: { uk: "Мій стек", en: "My stack" },
      intro: {
        uk: "Інструменти, якими я будую продукти й розвʼязую задачі. Постійно вчусь, постійно будую.",
        en: "The tools I use to build digital experiences and solve complex problems. Always learning. Always building.",
      },
      points: { uk: "Очки навичок", en: "Skill points" },
    },

    workSection: {
      eyebrow: { uk: "// Вибрані роботи", en: "// Selected work" },
      title: { uk: "Роботи", en: "Work" },
      cta: { uk: "Усі роботи", en: "View my work" },
      dossier: { uk: "Досьє KREIK — вибрані справи", en: "KREIK dossier — selected work" },
      heading: { uk: "Роботи, за які відповідаю.", en: "Work I stand behind." },
      introduction: {
        uk: "Три різні задачі. У кожній — моя роль, рішення й те, що можна побачити самому.",
        en: "Three different challenges. Each one shows my role, the solution and something you can inspect yourself.",
      },
      commercial: { uk: "Комерційна робота", en: "Commercial work" },
      ownProject: { uk: "Власний проєкт", en: "Personal project" },
      otherCases: { uk: "Інші справи", en: "Other cases" },
      contribution: { uk: "Мій внесок", en: "My contribution" },
      solution: { uk: "Технічне рішення", en: "Technical solution" },
      openSite: { uk: "Відкрити сайт", en: "Visit site" },
      openBot: { uk: "Відкрити бота", en: "Open bot" },
      viewCode: { uk: "Переглянути код", en: "View code" },
      botPreview: { uk: "Приклад сповіщення", en: "Sample notification" },
      botPrice: { uk: "Ціна змінилася", en: "Price changed" },
      botStatus: { uk: "Сайт доступний", en: "Website is online" },
    },

    aboutSection: {
      eyebrow: { uk: "// Хто я", en: "// Who I am" },
      title: { uk: "Про мене", en: "About" },
      voices: { uk: "Голоси", en: "Voices" },
    },

    contactSection: {
      eyebrow: { uk: "// Звʼязок", en: "// Get in touch" },
      title: { uk: "Контакти", en: "Contact" },
    },
  },

  check: {
    title: { uk: "Перевірка навички", en: "Skill check" },
    success: { uk: "Успіх", en: "Success" },
    failure: { uk: "Провал", en: "Failure" },
    roll: { uk: "Кинути кубики", en: "Roll the dice" },
    difficulty: { uk: "Складність", en: "Difficulty" },
  },
} as const;
