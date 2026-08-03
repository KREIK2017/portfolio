"use client";

import { ui } from "@/content/dictionary";
import { useEscape } from "@/lib/hooks";
import type { Locale } from "@/types/content";

/**
 * Спільна оболонка всіх розділів: аркуш паперу поверх кімнати.
 * Закривається кліком по тлу, кнопкою й Escape — три звичні шляхи.
 */
export function Panel({
  title,
  subtitle,
  locale,
  onClose,
  wide = false,
  children,
}: {
  title: string;
  subtitle?: string;
  locale: Locale;
  onClose: () => void;
  /** Character sheet потребує трьох колонок, тому ширший аркуш. */
  wide?: boolean;
  children: React.ReactNode;
}) {
  useEscape(onClose);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-8"
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <button
        type="button"
        aria-hidden="true"
        tabIndex={-1}
        onClick={onClose}
        className="anim-fade-in absolute inset-0 cursor-default bg-ink/85 backdrop-blur-sm"
      />

      <article
        className={`paper paper-edge anim-fade-up relative flex max-h-full w-full flex-col ${
          wide ? "max-w-6xl" : "max-w-3xl"
        }`}
      >
        <header className="flex items-start justify-between gap-6 px-7 pt-7 sm:px-10 sm:pt-9">
          <div>
            <h2 className="text-3xl leading-tight text-[#2a241c] sm:text-4xl">
              {title}
            </h2>
            {subtitle && (
              <p className="mt-2 max-w-md text-sm italic text-[#5c4f3a]">
                {subtitle}
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            autoFocus
            className="label shrink-0 border border-[#7a2e2e]/40 px-3 py-2 text-[#7a2e2e] transition-colors hover:bg-[#7a2e2e]/10"
          >
            ← {ui.back[locale]}
          </button>
        </header>

        <div className="thin-scroll overflow-y-auto px-7 pb-8 pt-6 sm:px-10 sm:pb-10">
          {children}
        </div>
      </article>
    </div>
  );
}

/** Орнаментальний розділювач у дусі ар-нуво. */
export function Divider() {
  return (
    <div className="my-7 flex items-center gap-3" aria-hidden="true">
      <span className="h-px flex-1 bg-[#5c4f3a]/30" />
      <svg width="26" height="8" viewBox="0 0 26 8" className="text-[#7a2e2e]">
        <path
          d="M0 4 H8 M18 4 H26"
          stroke="currentColor"
          strokeWidth="1"
          opacity="0.5"
        />
        <path
          d="M13 0.5 L16 4 L13 7.5 L10 4 Z"
          fill="currentColor"
          opacity="0.65"
        />
      </svg>
      <span className="h-px flex-1 bg-[#5c4f3a]/30" />
    </div>
  );
}
