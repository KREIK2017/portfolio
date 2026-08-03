"use client";

import { Typewriter } from "@/components/ui/Typewriter";
import { SKILL_BY_ID } from "@/content/skills";
import type { Locale, SkillId } from "@/types/content";

export interface Voice {
  id: number;
  skill: SkillId;
  text: string;
}

/**
 * Стрічка внутрішнього монологу. На десктопі — колонка справа,
 * на мобільному переїжджає під сцену, щоб не накривати кімнату.
 */
export function SkillVoices({
  voices,
  locale,
}: {
  voices: Voice[];
  locale: Locale;
}) {
  if (voices.length === 0) return null;

  return (
    <div
      className="pointer-events-none fixed inset-x-4 bottom-4 z-40 space-y-3 sm:inset-x-auto sm:right-6 sm:bottom-auto sm:top-24 sm:w-72 lg:w-80"
      aria-label={locale === "uk" ? "Голоси навичок" : "Skill voices"}
    >
      {voices.map((voice) => {
        const skill = SKILL_BY_ID[voice.skill];

        return (
          <figure
            key={voice.id}
            className="anim-fade-up border-l-2 bg-[#14120f]/85 py-2 pl-3 pr-2 backdrop-blur-sm"
            style={{ borderColor: skill.color }}
          >
            <figcaption
              className="label mb-1"
              style={{ color: skill.color }}
            >
              {skill.name[locale]}
            </figcaption>
            <Typewriter
              text={voice.text}
              speed={18}
              className="text-[0.86rem] leading-relaxed text-light/85"
            />
          </figure>
        );
      })}
    </div>
  );
}
