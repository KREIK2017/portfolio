"use client";

import { useEffect, useRef, useState } from "react";
import { ui } from "@/content/dictionary";
import { SKILL_BY_ID } from "@/content/skills";
import { usePrefersReducedMotion } from "@/lib/hooks";
import type { Locale, SkillCheck as SkillCheckData } from "@/types/content";

/** Одна кістка d6 з класичним розташуванням точок. */
function Die({ value, color }: { value: number; color: string }) {
  const pips: Record<number, Array<[number, number]>> = {
    1: [[50, 50]],
    2: [
      [30, 30],
      [70, 70],
    ],
    3: [
      [30, 30],
      [50, 50],
      [70, 70],
    ],
    4: [
      [30, 30],
      [70, 30],
      [30, 70],
      [70, 70],
    ],
    5: [
      [30, 30],
      [70, 30],
      [50, 50],
      [30, 70],
      [70, 70],
    ],
    6: [
      [30, 25],
      [70, 25],
      [30, 50],
      [70, 50],
      [30, 75],
      [70, 75],
    ],
  };

  return (
    <svg viewBox="0 0 100 100" className="size-14 sm:size-16">
      <rect
        x="4"
        y="4"
        width="92"
        height="92"
        rx="14"
        fill="#e8ddc4"
        stroke={color}
        strokeWidth="4"
      />
      {pips[value].map(([cx, cy], index) => (
        <circle key={index} cx={cx} cy={cy} r="8" fill={color} />
      ))}
    </svg>
  );
}

/**
 * Перевірка навички перед відкриттям кейсу.
 * Провал нічого не блокує — це портфоліо, а не гра: результат
 * лише змінює репліку, доступ до справи лишається.
 */
export function SkillCheck({
  check,
  locale,
  onResolved,
}: {
  check: SkillCheckData;
  locale: Locale;
  onResolved: () => void;
}) {
  const skill = SKILL_BY_ID[check.skill];
  const reduced = usePrefersReducedMotion();

  const [dice, setDice] = useState<[number, number]>([1, 1]);
  const [state, setState] = useState<"idle" | "rolling" | "done">("idle");

  // Інтервал і таймаут тримаємо окремо: у них різні функції зупинки,
  // і клас ідентифікатора змішувати не варто.
  const spinRef = useRef<number | null>(null);
  const stopRef = useRef<number | null>(null);

  useEffect(() => {
    // Якщо панель закрили посеред кидка — прибираємо обидва таймери.
    return () => {
      if (spinRef.current !== null) window.clearInterval(spinRef.current);
      if (stopRef.current !== null) window.clearTimeout(stopRef.current);
    };
  }, []);

  const roll = () => {
    const final: [number, number] = [
      1 + Math.floor(Math.random() * 6),
      1 + Math.floor(Math.random() * 6),
    ];

    if (reduced) {
      setDice(final);
      setState("done");
      return;
    }

    setState("rolling");

    // Кістки «крутяться»: підмінюємо значення, поки не зупинимо.
    const spin = window.setInterval(() => {
      setDice([
        1 + Math.floor(Math.random() * 6),
        1 + Math.floor(Math.random() * 6),
      ]);
    }, 90);

    const stop = window.setTimeout(() => {
      window.clearInterval(spin);
      setDice(final);
      setState("done");
    }, 950);

    spinRef.current = spin;
    stopRef.current = stop;
  };

  const total = dice[0] + dice[1];
  const success = total >= check.difficulty;
  const resultColor = success ? "#4a6b4a" : "#7a2e2e";

  return (
    <div className="py-4 text-center">
      <p className="label text-[#5c4f3a]">{ui.check.title[locale]}</p>

      <p className="mt-3 text-2xl" style={{ color: skill.color }}>
        <span className="label mr-2">{skill.name[locale]}</span>
      </p>

      <p className="mx-auto mt-3 max-w-md text-[#3c3327]">
        {check.label[locale]}
      </p>

      <p className="mt-2 text-sm italic text-[#5c4f3a]">
        {ui.check.difficulty[locale]}: {check.difficulty}
      </p>

      <div className="mt-6 flex items-center justify-center gap-4">
        <Die value={dice[0]} color={state === "done" ? resultColor : "#5c4f3a"} />
        <Die value={dice[1]} color={state === "done" ? resultColor : "#5c4f3a"} />
      </div>

      {state === "done" ? (
        <div className="anim-fade-in mt-5">
          <p
            className="label text-lg"
            style={{ color: resultColor }}
            role="status"
          >
            {success ? ui.check.success[locale] : ui.check.failure[locale]} —{" "}
            {total}
          </p>
          <button
            type="button"
            onClick={onResolved}
            autoFocus
            className="label mt-5 border border-[#5c4f3a]/50 px-5 py-2.5 text-[#3c3327] transition-colors hover:bg-[#5c4f3a]/10"
          >
            {locale === "uk" ? "Відкрити справу" : "Open the case file"}
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={roll}
          disabled={state === "rolling"}
          className="label mt-6 border border-[#7a2e2e]/50 px-5 py-2.5 text-[#7a2e2e] transition-colors hover:bg-[#7a2e2e]/10 disabled:opacity-50"
        >
          {ui.check.roll[locale]}
        </button>
      )}
    </div>
  );
}
