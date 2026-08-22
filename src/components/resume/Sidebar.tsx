"use client";

import Image from "next/image";
import { ui } from "@/content/dictionary";
import { site } from "@/config/site";
import { cn } from "@/lib/utils";
import type { Locale } from "@/types/content";

export const SECTIONS = ["home", "about", "work", "stack", "contact"] as const;

export type SectionId = (typeof SECTIONS)[number];

/** Прості лінійні іконки: важать нічого й не тягнуть залежність. */
function Icon({ id }: { id: SectionId }) {
  const common = {
    width: 20,
    height: 20,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.6,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };

  switch (id) {
    case "home":
      return (
        <svg {...common}>
          <path d="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-4v-6H9v6H5a1 1 0 0 1-1-1z" />
        </svg>
      );
    case "about":
      return (
        <svg {...common}>
          <circle cx="12" cy="8" r="3.6" />
          <path d="M4.5 20c1.2-3.8 4-5.6 7.5-5.6s6.3 1.8 7.5 5.6" />
        </svg>
      );
    case "work":
      return (
        <svg {...common}>
          <rect x="3" y="7" width="18" height="13" rx="1.5" />
          <path d="M9 7V5.5A1.5 1.5 0 0 1 10.5 4h3A1.5 1.5 0 0 1 15 5.5V7" />
        </svg>
      );
    case "stack":
      return (
        <svg {...common}>
          <path d="M4 20V12M10 20V6M16 20v-6M22 20V9" />
        </svg>
      );
    case "contact":
      return (
        <svg {...common}>
          <rect x="3" y="5.5" width="18" height="13" rx="1.5" />
          <path d="m3.5 7 8.5 6 8.5-6" />
        </svg>
      );
  }
}

export function Sidebar({
  locale,
  active,
}: {
  locale: Locale;
  active: SectionId | string;
}) {
  return (
    <nav
      className={cn(
        // Мобільний: горизонтальна панель знизу з великими тач-таргетами.
        "bg-rs-sidebar fixed inset-x-0 bottom-0 z-40 border-t border-white/10",
        // Десктоп: вертикальна колонка ліворуч, як у мокапі.
        "sm:inset-x-auto sm:left-0 sm:top-0 sm:h-dvh sm:w-20 sm:border-r sm:border-t-0",
      )}
      aria-label={ui.resume.nav.home[locale]}
    >
      {/*
        Портрет обрізаний окремим файлом, а не через next/image:
        у статичному експорті оптимізатор вимкнений, тому повне фото
        тягнулося б цілим — 183 КБ на слот шириною 44 пікселі.
      */}
      <div className="hidden justify-center pt-5 sm:flex">
        <span className="block h-14 w-11 overflow-hidden border border-white/15">
          <Image
            src="/img/avatar.webp"
            alt={site.name[locale]}
            width={176}
            height={224}
            className="size-full object-cover"
          />
        </span>
      </div>

      <ul className="flex items-stretch justify-around sm:mt-8 sm:flex-col sm:justify-start sm:gap-1">
        {SECTIONS.map((id) => {
          const isActive = active === id;

          return (
            <li key={id} className="flex-1 sm:flex-none">
              <a
                href={`#${id}`}
                aria-current={isActive ? "true" : undefined}
                className={cn(
                  "relative flex flex-col items-center gap-1.5 px-1 py-3 transition-colors sm:py-4",
                  isActive
                    ? "text-rs-accent"
                    : "text-white/45 hover:text-white/80",
                )}
              >
                <Icon id={id} />
                <span className="rs-label text-[0.58rem]">
                  {ui.resume.nav[id][locale]}
                </span>

                {isActive && (
                  <span
                    aria-hidden="true"
                    className="bg-rs-accent absolute inset-x-3 top-0 h-0.5 sm:inset-x-auto sm:left-0 sm:top-3 sm:h-[calc(100%-1.5rem)] sm:w-0.5"
                  />
                )}
              </a>
            </li>
          );
        })}
      </ul>

      <p className="rs-label hidden px-2 pb-4 text-center text-[0.5rem] text-white/25 sm:absolute sm:bottom-0 sm:block">
        {site.handle}
      </p>
    </nav>
  );
}
