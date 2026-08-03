import Image from "next/image";
import type { Skill } from "@/types/content";

/**
 * Емблема навички — заміна painterly-портретів з оригіналу.
 *
 * Це власний арт, намальований вектором, а не запозичені зображення.
 * Коли зʼявиться фінальний арт, достатньо вписати шлях у поле `art`
 * навички в content/skills.ts — компонент сам віддасть картинку
 * замість емблеми, нічого більше правити не треба.
 *
 * Батьківський елемент має бути position: relative.
 */
export function SkillEmblem({ skill }: { skill: Skill }) {
  if (skill.art) {
    return (
      <Image
        src={skill.art}
        alt=""
        fill
        sizes="200px"
        className="object-cover"
      />
    );
  }

  const c = skill.color;

  return (
    <svg
      viewBox="0 0 100 100"
      className="absolute inset-0 size-full"
      aria-hidden="true"
    >
      {/* Олійна підкладка: два розмиті плями замість рівного фону */}
      <rect width="100" height="100" fill="#191713" />
      <circle cx="34" cy="30" r="40" fill={c} opacity="0.1" />
      <circle cx="70" cy="74" r="34" fill={c} opacity="0.07" />

      <g stroke={c} fill="none" strokeWidth="2" strokeLinecap="round">
        {skill.id === "logic" && (
          <>
            <rect x="26" y="26" width="48" height="48" opacity="0.85" />
            <rect x="38" y="38" width="24" height="24" opacity="0.5" />
            <path d="M50 14 V26 M50 74 V86 M14 50 H26 M74 50 H86" opacity="0.7" />
          </>
        )}

        {skill.id === "encyclopedia" && (
          <>
            <path d="M50 28 V76" opacity="0.8" />
            <path d="M50 28 C40 22 28 24 20 30 V74 C28 68 40 70 50 76" opacity="0.85" />
            <path d="M50 28 C60 22 72 24 80 30 V74 C72 68 60 70 50 76" opacity="0.85" />
            <path
              d="M28 40 H42 M28 50 H42 M58 40 H72 M58 50 H72"
              strokeWidth="1.4"
              opacity="0.45"
            />
          </>
        )}

        {skill.id === "empathy" && (
          <>
            <circle cx="40" cy="50" r="22" opacity="0.8" />
            <circle cx="60" cy="50" r="22" opacity="0.8" />
            <path d="M50 34 V66" strokeWidth="1.4" opacity="0.4" />
          </>
        )}

        {skill.id === "drama" && (
          <>
            <path d="M26 30 C26 66 38 82 50 82 C62 82 74 66 74 30 Z" opacity="0.85" />
            <path d="M36 44 C40 40 44 40 48 44" opacity="0.7" />
            <path d="M52 44 C56 40 60 40 64 44" opacity="0.7" />
            <path d="M40 64 C46 70 54 70 60 64" opacity="0.6" />
          </>
        )}

        {skill.id === "visual" && (
          <>
            <path
              d="M16 50 C30 32 70 32 84 50 C70 68 30 68 16 50 Z"
              opacity="0.85"
            />
            <circle cx="50" cy="50" r="11" opacity="0.9" />
            <circle cx="50" cy="50" r="3.5" fill={c} stroke="none" />
            <path d="M50 24 V16 M24 34 L18 28 M76 34 L82 28" strokeWidth="1.4" opacity="0.4" />
          </>
        )}

        {skill.id === "kinesthetics" && (
          <>
            <path d="M20 66 C34 66 40 54 44 42" opacity="0.8" />
            <path d="M32 74 C48 74 56 58 60 40" opacity="0.65" />
            <path d="M46 80 C64 80 72 60 76 36" opacity="0.5" />
            <circle cx="44" cy="34" r="5" fill={c} stroke="none" opacity="0.9" />
          </>
        )}
      </g>
    </svg>
  );
}
