import { LOCALES, type Locale, type Localized } from "@/types/content";

export const DEFAULT_LOCALE: Locale = "uk";

export function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}

/** Дістати значення потрібною мовою. */
export function t<T>(value: Localized<T>, locale: Locale): T {
  return value[locale];
}

/**
 * Шлях до тієї ж сторінки іншою мовою.
 * Українська живе в корені, англійська — під /en/.
 */
export function localePath(locale: Locale): string {
  return locale === DEFAULT_LOCALE ? "/" : `/${locale}/`;
}

/** Значення для атрибута lang і og:locale. */
export const HTML_LANG: Record<Locale, string> = {
  uk: "uk",
  en: "en",
};

export const OG_LOCALE: Record<Locale, string> = {
  uk: "uk_UA",
  en: "en_US",
};
