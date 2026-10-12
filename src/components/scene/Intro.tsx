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
      <div className="relative mx-auto flex min-h-full w-full max-w-5xl flex-col justify-center py-10 sm:py-16">
        <p className="label text-sm tracking-[0.22em] text-terracotta sm:text-base">
          {locale === "uk" ? "ПРОЛОГ · ІНТЕРАКТИВНЕ ПОРТФОЛІО" : "PROLOGUE · INTERACTIVE PORTFOLIO"}
        </p>
        <h1 className="mt-4 font-display text-5xl leading-none text-light sm:text-7xl">
          {locale === "uk" ? "Майстерня KREIK" : "KREIK's Workshop"}
        </h1>
        <p className="mt-5 max-w-3xl text-lg leading-relaxed text-light/70 sm:text-xl">
          {locale === "uk"
            ? "Короткий пролог перед кімнатою. Там предмети відкривають мої роботи, досвід і контакти."
            : "A short prologue before the room. Its objects reveal my work, experience and contacts."}
        </p>

        <div className="mt-9 w-full space-y-6 border-y border-light/15 py-8 sm:mt-12 sm:space-y-7 sm:py-10">
          {INTRO_LINES.slice(0, visible).map((line, index) => {
            const skill = SKILL_BY_ID[line.skill];
            const isLast = index === INTRO_LINES.length - 1;

            return (
              <p key={line.skill} className="anim-fade-in grid gap-2 sm:grid-cols-[10rem_1fr] sm:gap-7">
                <span className="label pt-1 text-base tracking-wider sm:text-lg" style={{ color: skill.color }}>
                  {skill.name[locale]}
                </span>
                <Typewriter
                  text={line.text[locale]}
                  speed={24}
                  showCaret={!isLast}
                  className="text-lg leading-relaxed text-light/90 sm:text-2xl"
                  onDone={() =>
                    setVisible((current) =>
                      current === index + 1 ? current + 1 : current,
                    )
                  }
                />
              </p>
            );
          })}
        </div>

        <div className="mt-8 flex min-h-14 items-center">
          {allShown ? (
            <button
              type="button"
              onClick={onEnter}
              autoFocus
              className="anim-fade-in min-h-14 border border-amber/60 px-7 py-3 font-display text-xl text-amber transition-colors hover:bg-amber/10 sm:text-2xl"
            >
              {ui.introHint[locale]} →
            </button>
          ) : (
            <button
              type="button"
              onClick={onEnter}
              className="min-h-12 text-base text-light/65 underline decoration-light/30 underline-offset-4 transition-colors hover:text-light sm:text-lg"
            >
              {ui.introSkip[locale]} →
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
