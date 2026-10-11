export const LOCALES = ["uk", "en"] as const;

export type Locale = (typeof LOCALES)[number];

/** Значення, що існує в обох мовах. */
export type Localized<T = string> = Record<Locale, T>;

export type SkillId =
  | "logic"
  | "visual"
  | "empathy"
  | "drama"
  | "encyclopedia"
  | "kinesthetics";

/** Групи навичок у character sheet — як атрибути в грі. */
export type AttributeId = "intellect" | "psyche" | "motorics";

export interface Attribute {
  id: AttributeId;
  name: Localized;
  color: string;
  /** Що ця група означає в термінах роботи. */
  blurb: Localized;
}

export interface Skill {
  id: SkillId;
  name: Localized;
  /** Група, до якої належить навичка. */
  attribute: AttributeId;
  /** Самооцінка 1–6 для character sheet. */
  level: number;
  /**
   * Шлях до фінального арту навички. Поки порожній — замість нього
   * малюється процедурна емблема в SkillEmblem.tsx.
   */
  art?: string;
  /**
   * Колір репліки. Усі значення підібрані так, щоб контраст до
   * фону --de-ink був не нижче 4.5:1 — інакше приглушена палітра
   * швидко стає нечитабельною.
   */
  color: string;
  /** Що навичка означає в термінах роботи — для character sheet. */
  blurb: Localized;
  /** Репліки внутрішнього монологу. */
  lines: Localized<string[]>;
}

/** Перевірка навички перед відкриттям сильного кейсу. */
export interface SkillCheck {
  skill: SkillId;
  /** Сума 2d6 має бути не менше цього значення. */
  difficulty: number;
  label: Localized;
}

export interface Project {
  slug: string;
  title: Localized;
  summary: Localized;
  role: Localized;
  stack: string[];
  result: Localized;
  year: string;
  liveUrl?: string;
  repoUrl?: string;
  image?: string;
  /** Реальний розмір обкладинки — потрібен Next/Image для стабільного layout. */
  imageWidth?: number;
  imageHeight?: number;
  skillCheck?: SkillCheck;
}

/** Група технології — для сортування й кольорових акцентів у сітці. */
export type StackGroup =
  | "frontend"
  | "backend"
  | "commerce"
  | "tools"
  | "ai";

export interface StackItem {
  id: string;
  /** Назви технологій не перекладаються. */
  name: string;
  summary: Localized;
  /** Володіння за шкалою 1–6. */
  level: number;
  group: StackGroup;
  /** Підмальовок картки — найтемніший тон, на якому лежать мазки. */
  base: string;
  /** Кольори мазків. Що більше відтінків, то живіша поверхня. */
  accents: string[];
}

/** Розділи сайту, до яких ведуть предмети в кімнаті. */
export type PanelId = "projects" | "about" | "contact" | "cv" | "trivia";

export interface Hotspot {
  id: PanelId;
  /** Назва предмета, яку бачить користувач. */
  label: Localized;
  /** Голос, що промовляє при наведенні. */
  voice: SkillId;
  line: Localized;
}
