/** Категорія проєкту — використовується для фільтрів і бейджів. */
export type ProjectKind = "shopify" | "wordpress" | "web" | "design" | "other";

export const PROJECT_KIND_LABELS: Record<ProjectKind, string> = {
  shopify: "Shopify",
  wordpress: "WordPress",
  web: "Вебсайт",
  design: "Дизайн",
  other: "Інше",
};

export interface GalleryImage {
  src: string;
  alt: string;
}

export interface AudioTrack {
  title: string;
  src: string;
}

/**
 * Frontmatter файлу src/content/projects/<slug>.md
 * Опційні поля можна не вказувати — UI просто не покаже відповідний блок.
 */
export interface ProjectMeta {
  title: string;
  summary: string;
  kind: ProjectKind;
  /** ISO-дата, напр. "2026-03-14". Визначає порядок сортування. */
  date: string;
  stack: string[];
  cover?: string;
  liveUrl?: string;
  repoUrl?: string;
  gallery?: GalleryImage[];
  audio?: AudioTrack[];
  /** Показувати на головній. */
  featured?: boolean;
  /** true — файл існує, але на сайт не потрапляє. */
  draft?: boolean;
}

/** Проєкт у списку: тільки метадані, без тіла статті. */
export interface ProjectSummary extends ProjectMeta {
  slug: string;
}

/** Повний проєкт для сторінки деталей. */
export interface Project extends ProjectSummary {
  /** Тіло markdown, уже відрендерене в HTML. */
  html: string;
}
