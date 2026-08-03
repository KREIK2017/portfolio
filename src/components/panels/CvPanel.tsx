"use client";

import { Panel } from "./Panel";
import { ui } from "@/content/dictionary";
import { site } from "@/config/site";
import type { Locale } from "@/types/content";

export function CvPanel({
  locale,
  onClose,
}: {
  locale: Locale;
  onClose: () => void;
}) {
  return (
    <Panel
      title={ui.cv.title[locale]}
      subtitle={ui.cv.subtitle[locale]}
      locale={locale}
      onClose={onClose}
    >
      <a
        href={site.cvPath}
        download
        className="label inline-block border border-[#7a2e2e]/50 px-6 py-3.5 text-[#7a2e2e] transition-colors hover:bg-[#7a2e2e]/10"
      >
        ↓ {ui.cv.download[locale]}
      </a>

      {/*
        Наявність файлу в статичному експорті перевірити з клієнта
        неможливо, тому підказку показуємо завжди — прибереш її,
        коли покладеш cv.pdf.
      */}
      <p className="mt-5 text-sm italic text-[#5c4f3a]">
        {ui.cv.missing[locale]}
      </p>
    </Panel>
  );
}
