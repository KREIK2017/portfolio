import { DEFAULT_LOCALE } from "./i18n";
import type { Locale } from "@/types/content";

/** Два режими подачі: імерсивна кімната і спокійне résumé. */
export type Mode = "room" | "resume";

const STORAGE_KEY = "kreik-mode";

/**
 * Класичне résumé живе в корені: воно має відкриватися першим, бо
 * саме воно потрібне тому, хто зайшов швидко подивитися роботи.
 * Кімната — за окремим шляхом, як усвідомлений вибір.
 */
export function resumePath(locale: Locale): string {
  return locale === DEFAULT_LOCALE ? "/" : `/${locale}/`;
}

export function roomPath(locale: Locale): string {
  return locale === DEFAULT_LOCALE ? "/room/" : `/${locale}/room/`;
}

export function modePath(mode: Mode, locale: Locale): string {
  return mode === "room" ? roomPath(locale) : resumePath(locale);
}

/**
 * Читання й запис обгорнуті в try/catch: у приватному режимі Safari
 * localStorage кидає виняток на запис, і через це не має падати сайт.
 */
export function readMode(): Mode | null {
  try {
    const value = window.localStorage.getItem(STORAGE_KEY);
    return value === "room" || value === "resume" ? value : null;
  } catch {
    return null;
  }
}

export function writeMode(mode: Mode): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, mode);
  } catch {
    // Немає стореджа — просто не запамʼятаємо вибір.
  }
}
