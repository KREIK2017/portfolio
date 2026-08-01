/**
 * Мінімальний склеювач класів. Свідомо без clsx/tailwind-merge —
 * для цього проєкту достатньо відфільтрувати falsy значення.
 */
export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

/** "2026-03-14" → "березень 2026" */
export function formatDate(iso: string) {
  return new Intl.DateTimeFormat("uk-UA", {
    month: "long",
    year: "numeric",
  }).format(new Date(iso));
}
