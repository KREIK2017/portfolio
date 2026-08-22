import type { Metadata } from "next";
import { site } from "@/config/site";
import { OG_LOCALE, localePath } from "@/lib/i18n";
import type { Locale } from "@/types/content";

/** Спільні метадані для обох мовних версій. */
export function buildMetadata(locale: Locale): Metadata {
  return {
    metadataBase: new URL(site.url),
    title: site.title[locale],
    description: site.description[locale],

    // hreflang-звʼязка між версіями: без неї пошуковик вважає їх дублями.
    alternates: {
      canonical: localePath(locale),
      languages: {
        uk: "/",
        en: "/en/",
      },
    },

    openGraph: {
      type: "website",
      locale: OG_LOCALE[locale],
      url: `${site.url}${localePath(locale)}`,
      siteName: site.name[locale],
      title: site.title[locale],
      description: site.description[locale],
    },

    twitter: {
      card: "summary_large_image",
      title: site.title[locale],
      description: site.description[locale],
    },
  };
}
