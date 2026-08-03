import type { MetadataRoute } from "next";
import { site } from "@/config/site";
import { resumePath, roomPath } from "@/lib/mode";
import { LOCALES } from "@/types/content";

export const dynamic = "force-static";

/**
 * По дві сторінки на мову: класичне résumé і кімната.
 * Розділи всередині кожної з них — якорі або оверлеї, окремих URL не мають.
 *
 * Найвищий пріоритет у résumé: воно в корені й саме його має
 * показувати пошук, а кімната — додатковий спосіб подивитися те саме.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return LOCALES.flatMap((locale) => [
    {
      url: `${site.url}${resumePath(locale)}`,
      changeFrequency: "monthly" as const,
      priority: locale === "uk" ? 1 : 0.9,
    },
    {
      url: `${site.url}${roomPath(locale)}`,
      changeFrequency: "monthly" as const,
      priority: locale === "uk" ? 0.7 : 0.6,
    },
  ]);
}
