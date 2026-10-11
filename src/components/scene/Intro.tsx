"use client";

import { useState } from "react";
import { Typewriter } from "@/components/ui/Typewriter";
import { INTRO_LINES } from "@/content/intro";
import { ui } from "@/content/dictionary";
import { SKILL_BY_ID } from "@/content/skills";
import { usePrefersReducedMotion } from "@/lib/hooks";
import type { Locale } from "@/types/content";

/**
 * Чорний екран, на якому проступають розрізнені репліки.
 * Наступний рядок починається лише коли добіг попередній —
 * так тримається ритм внутрішнього монологу.
 */
export function Intro({
  locale,
  onEnter,
}: {
  locale: Locale;
  onEnter: () => void;
}) {
  const reduced = usePrefersReducedMotion();
  const [visible, setVisible] = useState(reduced ? INTRO_LINES.length : 1);

  const allShown = visible >= INTRO_LINES.length;

  return (
    <div className="intro-screen fixed inset-0 z-50 overflow-y-auto bg-ink px-5 py-8 sm:px-10">
      <div className="relative mx-auto grid min-h-full w-full max-w-6xl items-center gap-10 lg:grid-cols-[15rem_1fr]">
        <aside className="hidden border-r border-light/10 pr-8 lg:block">
          <p className="label text-terracotta">CASE / KREIK</p>
          <p className="mt-4 font-display text-5xl leading-[0.88] text-light/90">
            04<br />17<br />26
          </p>
          <p className="label mt-6 text-light/25">INNER ROOM<br />SESSION ACTIVE</p>
        </aside>

        <div>
          <div className="mb-8 flex items-center gap-3">
            <span className="block h-px w-10 bg-terracotta" />
            <p className="label text-terracotta">
              {locale === "uk" ? "ПРОТОКОЛ ПРОБУДЖЕННЯ" : "WAKE PROTOCOL"}
            </p>
          </div>

          <div className="w-full max-w-3xl space-y-5 border-y border-light/10 py-7">
        {INTRO_LINES.slice(0, visible).map((line, index) => {
          const skill = SKILL_BY_ID[line.skill];
          const isLast = index === INTRO_LINES.length - 1;

          return (
            <p key={line.skill} className="anim-fade-in grid gap-1 sm:grid-cols-[9rem_1fr] sm:gap-5">
              <span className="label" style={{ color: skill.color }}>
                {skill.name[locale]}
              </span>
              <Typewriter
                text={line.text[locale]}
                speed={24}
                showCaret={!isLast}
                className="text-base leading-relaxed text-light/85 sm:text-lg"
                onDone={() =>
                  setVisible((current) =>
                    // Нарощуємо тільки з поточного рядка, інакше швидкі
                    // повторні onDone перескочать через репліку.
                    current === index + 1 ? current + 1 : current,
                  )
                }
              />
            </p>
          );
        })}
          </div>

          <div className="mt-8 flex min-h-12 items-center gap-6">
        {allShown ? (
          <button
            type="button"
            onClick={onEnter}
            autoFocus
            className="label anim-fade-in min-h-12 border border-amber/50 px-6 py-3 text-amber transition-colors hover:bg-amber/10"
          >
            {ui.introHint[locale]}
          </button>
        ) : (
          <button
            type="button"
            onClick={onEnter}
            className="label min-h-11 text-light/45 transition-colors hover:text-light/75"
          >
            {ui.introSkip[locale]}
          </button>
        )}
          </div>
        </div>
      </div>
    </div>
  );
}
