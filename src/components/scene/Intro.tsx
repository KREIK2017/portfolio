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
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-ink px-6">
      <div className="w-full max-w-xl space-y-5">
        {INTRO_LINES.slice(0, visible).map((line, index) => {
          const skill = SKILL_BY_ID[line.skill];
          const isLast = index === INTRO_LINES.length - 1;

          return (
            <p key={line.skill} className="anim-fade-in">
              <span className="label mr-2" style={{ color: skill.color }}>
                {skill.name[locale]}
              </span>
              <Typewriter
                text={line.text[locale]}
                speed={24}
                showCaret={!isLast}
                className="text-light/85"
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

      <div className="mt-12 flex h-12 items-center gap-6">
        {allShown ? (
          <button
            type="button"
            onClick={onEnter}
            autoFocus
            className="label anim-fade-in border border-amber/50 px-6 py-3 text-amber transition-colors hover:bg-amber/10"
          >
            {ui.introHint[locale]}
          </button>
        ) : (
          <button
            type="button"
            onClick={onEnter}
            className="label text-light/40 transition-colors hover:text-light/70"
          >
            {ui.introSkip[locale]}
          </button>
        )}
      </div>
    </div>
  );
}
