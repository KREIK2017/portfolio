"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { createPortal } from "react-dom";
import { ui } from "@/content/dictionary";
import { PROJECTS } from "@/content/projects";
import { usePrefersReducedMotion } from "@/lib/hooks";
import type { Locale } from "@/types/content";

const DIFFICULTY = 7;
const PIPS: Record<number, number[]> = {
  1: [5],
  2: [1, 9],
  3: [1, 5, 9],
  4: [1, 3, 7, 9],
  5: [1, 3, 5, 7, 9],
  6: [1, 3, 4, 6, 7, 9],
};

const FACING: Record<number, [number, number]> = {
  1: [0, 0],
  2: [0, 180],
  3: [0, -90],
  4: [0, 90],
  5: [-90, 0],
  6: [90, 0],
};

/** Результат відділений від анімації: рівно два незалежні чесні d6. */
export function rollTwoDice(random: () => number = Math.random): [number, number] {
  return [1 + Math.floor(random() * 6), 1 + Math.floor(random() * 6)];
}

function Die({ value, rolling, round }: { value: number; rolling: boolean; round: number }) {
  const [x, y] = FACING[value];
  return (
    <div className="dice-stage" aria-hidden="true">
      <div
        key={round}
        className={`dice-cube ${rolling ? "dice-cube--rolling" : ""}`}
        style={{ "--die-end": `rotateX(${720 + x}deg) rotateY(${720 + y}deg)` } as CSSProperties}
      >
        {([1, 2, 3, 4, 5, 6] as const).map((face) => (
          <div key={face} className={`dice-face dice-face--${face}`}>
            {PIPS[face].map((pip) => (
              <span key={pip} className="dice-pip" style={{ gridArea: `${Math.ceil(pip / 3)} / ${((pip - 1) % 3) + 1}` }} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export function DiceChallenge({
  locale,
  onClose,
  onOpenProject,
}: {
  locale: Locale;
  onClose: () => void;
  onOpenProject: (slug: string) => void;
}) {
  const reduced = usePrefersReducedMotion();
  const timer = useRef<number | null>(null);
  const [dice, setDice] = useState<[number, number]>([1, 1]);
  const [round, setRound] = useState(0);
  const [phase, setPhase] = useState<"idle" | "rolling" | "done">("idle");

  useEffect(() => () => {
    if (timer.current !== null) window.clearTimeout(timer.current);
  }, []);

  const roll = () => {
    if (phase === "rolling") return;
    const result = rollTwoDice();
    setDice(result);
    setRound((current) => current + 1);
    if (reduced) {
      setPhase("done");
      return;
    }
    setPhase("rolling");
    timer.current = window.setTimeout(() => {
      setPhase("done");
      timer.current = null;
    }, 1100);
  };

  const total = dice[0] + dice[1];
  const success = total >= DIFFICULTY;
  const suggested = PROJECTS[(total - 2) % PROJECTS.length];
  const uk = locale === "uk";

  return createPortal(
    <div className="dice-overlay" role="dialog" aria-modal="true" aria-label={uk ? "Перевірка удачі" : "Luck check"}>
      <button type="button" className="dice-overlay__backdrop" onClick={onClose} aria-label={ui.close[locale]} />
      <div className="dice-overlay__card">
        <button
          type="button"
          className="dice-overlay__close label"
          onClick={onClose}
          aria-label={ui.close[locale]}
        >
          ✕
        </button>
        <p className="label text-[#9b6145]">{uk ? "МІНІГРА · 2D6" : "MINIGAME · 2D6"}</p>
        <h3 className="mt-3 text-3xl text-[#2a241c] sm:text-4xl">{uk ? "Кинь кубики" : "Roll the dice"}</h3>
        <p className="mt-3 max-w-md text-sm leading-relaxed text-[#4a4032] sm:text-base">
          {uk
            ? "Дві кістки по шість граней. Сума 7 або більше — успіх. Результат підкаже, яку справу дослідити; усі проєкти доступні незалежно від кидка."
            : "Two six-sided dice. A total of 7 or more is a success. The roll suggests a case to explore; every project remains available either way."}
        </p>

        <div className="dice-table" aria-label={phase === "done" ? `${dice[0]} + ${dice[1]} = ${total}` : undefined}>
          <Die value={dice[0]} rolling={phase === "rolling"} round={round} />
          <Die value={dice[1]} rolling={phase === "rolling"} round={round} />
        </div>

        <div className="min-h-20 text-center" aria-live="polite">
          {phase === "done" && (
            <>
              <p className={`text-xl ${success ? "text-[#3e6945]" : "text-[#853d32]"}`}>
                {success ? ui.check.success[locale] : ui.check.failure[locale]} · {dice[0]} + {dice[1]} = {total}
              </p>
              <p className="mt-2 text-sm text-[#4a4032]">
                {uk ? "Спробуй справу:" : "Try this case:"} {suggested.title[locale]}
              </p>
            </>
          )}
          {phase === "rolling" && <p className="text-[#5c4f3a]">{uk ? "Кубики котяться…" : "The dice are rolling…"}</p>}
        </div>

        <div className="mt-4 flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={roll}
            disabled={phase === "rolling"}
            autoFocus
            className="label min-h-11 border border-[#7a2e2e]/60 bg-[#7a2e2e] px-5 py-3 text-[#f2e8d5] transition-colors hover:bg-[#592525] disabled:opacity-50"
          >
            {phase === "done" ? (uk ? "Кинути ще раз" : "Roll again") : ui.check.roll[locale]}
          </button>
          {phase === "done" && (
            <button
              type="button"
              onClick={() => onOpenProject(suggested.slug)}
              className="label min-h-11 border border-[#5c4f3a]/50 px-5 py-3 text-[#3c3327] hover:bg-[#5c4f3a]/10"
            >
              {uk ? "Відкрити справу" : "Open the case"} →
            </button>
          )}
        </div>
      </div>
    </div>,
    document.body,
  );
}
