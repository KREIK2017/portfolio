import { DEFAULT_LOCALE } from "./i18n";
import type { Locale } from "@/types/content";

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
