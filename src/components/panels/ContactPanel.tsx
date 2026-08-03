"use client";

import { useState } from "react";
import { Panel } from "./Panel";
import { ui } from "@/content/dictionary";
import { site } from "@/config/site";
import type { Locale } from "@/types/content";

interface Station {
  freq: string;
  label: string;
  value: string;
  href: string;
  copyable?: boolean;
}

export function ContactPanel({
  locale,
  onClose,
}: {
  locale: Locale;
  onClose: () => void;
}) {
  const [copied, setCopied] = useState(false);

  const { email, github, linkedin, telegram } = site.contacts;

  // Порожні посилання просто не показуємо — краще ніж мертвий пункт меню.
  const stations: Station[] = [
    {
      freq: "88.3",
      label: "Email",
      value: email,
      href: `mailto:${email}`,
      copyable: true,
    },
    { freq: "94.7", label: "GitHub", value: "@KREIK2017", href: github },
    linkedin && {
      freq: "101.1",
      label: "LinkedIn",
      value: linkedin.replace(/^https?:\/\/(www\.)?/, ""),
      href: linkedin,
    },
    telegram && {
      freq: "107.9",
      label: "Telegram",
      value: telegram.replace(/^https?:\/\/(www\.)?/, ""),
      href: telegram,
    },
  ].filter(Boolean) as Station[];

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard може бути заблокований політикою — тоді лишається
      // звичайне посилання mailto, тож нічого не робимо.
    }
  };

  return (
    <Panel
      title={ui.contact.title[locale]}
      subtitle={ui.contact.subtitle[locale]}
      locale={locale}
      onClose={onClose}
    >
      {/* Шкала налаштування */}
      <div className="mb-7 flex items-end gap-[3px]" aria-hidden="true">
        {Array.from({ length: 48 }, (_, index) => (
          <span
            key={index}
            className="flex-1 bg-[#5c4f3a]"
            style={{
              height: index % 8 === 0 ? 18 : index % 4 === 0 ? 12 : 7,
              opacity: index % 8 === 0 ? 0.6 : 0.3,
            }}
          />
        ))}
      </div>

      <ul className="divide-y divide-[#5c4f3a]/25">
        {stations.map((station) => (
          <li
            key={station.label}
            className="flex flex-wrap items-center justify-between gap-3 py-4"
          >
            <div className="flex items-baseline gap-4">
              <span className="label w-14 text-[#7a2e2e]">{station.freq}</span>
              <div>
                <p className="label text-[#5c4f3a]">{station.label}</p>
                <a
                  href={station.href}
                  target={station.href.startsWith("http") ? "_blank" : undefined}
                  rel="noreferrer noopener"
                  className="text-[#2a241c] underline decoration-[#7a2e2e]/40 underline-offset-4 transition-colors hover:text-[#7a2e2e]"
                >
                  {station.value}
                </a>
              </div>
            </div>

            {station.copyable && (
              <button
                type="button"
                onClick={copyEmail}
                className="label border border-[#5c4f3a]/40 px-3 py-2 text-[#4a4032] transition-colors hover:bg-[#5c4f3a]/10"
              >
                {copied ? ui.contact.copied[locale] : ui.contact.copy[locale]}
              </button>
            )}
          </li>
        ))}
      </ul>
    </Panel>
  );
}
