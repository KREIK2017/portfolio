import type { MetadataRoute } from "next";
import { site } from "@/config/site";
import { localePath } from "@/lib/i18n";
import { LOCALES } from "@/types/content";

export const dynamic = "force-static";

/**
 * Сайт складається з однієї сцени на кожну мову — розділи
 * відкриваються оверлеями, окремих URL у них немає.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return LOCALES.map((locale) => ({
    url: `${site.url}${localePath(locale)}`,
    changeFrequency: "monthly" as const,
    priority: locale === "uk" ? 1 : 0.9,
  }));
}
