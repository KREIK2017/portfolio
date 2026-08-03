"use client";

import { Panel } from "./Panel";
import { ui } from "@/content/dictionary";
import type { Locale } from "@/types/content";

export function TriviaPanel({
  locale,
  onClose,
}: {
  locale: Locale;
  onClose: () => void;
}) {
  return (
    <Panel
      title={ui.trivia.title[locale]}
      subtitle={ui.trivia.subtitle[locale]}
      locale={locale}
      onClose={onClose}
    >
      <ul className="space-y-5">
        {ui.trivia.items[locale].map((item, index) => (
          <li key={item} className="flex gap-4">
            <span className="label shrink-0 text-[#7a2e2e]">
              {String(index + 1).padStart(2, "0")}
            </span>
            <p className="leading-relaxed text-[#3c3327]">{item}</p>
          </li>
        ))}
      </ul>
    </Panel>
  );
}
