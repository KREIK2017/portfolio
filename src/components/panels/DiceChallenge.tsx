"use client";

import dynamic from "next/dynamic";
import { useCallback, useState } from "react";
import { createPortal } from "react-dom";
import { ui } from "@/content/dictionary";
import { usePrefersReducedMotion } from "@/lib/hooks";
import type { Locale, Project } from "@/types/content";

const DicePhysicsCanvas = dynamic(() => import("./DicePhysicsCanvas"), { ssr: false });
const DEFAULT_DIFFICULTY = 7;

export function DiceChallenge({
  locale,
  project,
  onClose,
  onOpenProject,
}: {
  locale: Locale;
  project: Project;
  onClose: () => void;
  onOpenProject: () => void;
}) {
  const reducedMotion = usePrefersReducedMotion();
  const [ready, setReady] = useState(false);
  const [unavailable, setUnavailable] = useState(false);
  const [rollToken, setRollToken] = useState(0);
  const [dice, setDice] = useState<[number, number] | null>(null);
  const [phase, setPhase] = useState<"idle" | "rolling" | "done">("idle");

  const onReady = useCallback(() => setReady(true), []);
  const onUnavailable = useCallback(() => setUnavailable(true), []);
  const onSettled = useCallback((result: [number, number]) => {
    setDice(result);
    setPhase("done");
  }, []);

  const roll = () => {
    if ((!ready && !unavailable) || phase === "rolling") return;
    if (unavailable) {
      setDice([
        1 + Math.floor(Math.random() * 6),
        1 + Math.floor(Math.random() * 6),
      ]);
      setPhase("done");
      return;
    }
    setDice(null);
    setPhase("rolling");
    setRollToken((value) => value + 1);
  };

  const total = dice ? dice[0] + dice[1] : null;
  const difficulty = project.skillCheck?.difficulty ?? DEFAULT_DIFFICULTY;
  const success = total !== null && total >= difficulty;
  const uk = locale === "uk";

  return createPortal(
    <div className="dice-overlay" role="dialog" aria-modal="true" aria-label={uk ? "Перевірка навички" : "Skill check"}>
      <button type="button" className="dice-overlay__backdrop" onClick={onClose} aria-label={ui.close[locale]} />
      <div className="dice-overlay__card">
        <button type="button" className="dice-overlay__close label" onClick={onClose} aria-label={ui.close[locale]}>
          ✕
        </button>
        <p className="label dice-overlay__eyebrow">✦ &nbsp; {ui.check.title[locale]} · 2D6 &nbsp; ✦</p>
        <h3 className="mt-3 text-3xl text-[#2a241c] sm:text-4xl">{project.title[locale]}</h3>
        <p className="mt-3 text-sm leading-relaxed text-[#4a4032] sm:text-base">
          {uk
            ? `Кинь два кубики, щоб відкрити справу. Потрібно ${difficulty} або більше; навіть провал не приховає роботу.`
            : `Roll two dice to open this case. You need ${difficulty} or more; even a failed check won't hide the work.`}
        </p>

        <div className="dice-overlay__rule" aria-hidden="true"><span>◆</span></div>

        <div className="dice-table">
          {!unavailable && (
            <DicePhysicsCanvas
              rollToken={rollToken}
              reducedMotion={reducedMotion}
              onReady={onReady}
              onSettled={onSettled}
              onUnavailable={onUnavailable}
            />
          )}
          {unavailable && (
            <p className="px-6 text-sm text-[#7a2e2e]" role="alert">
              {uk
                ? "3D недоступне в цьому браузері. Можна кинути текстові кубики й відкрити справу."
                : "3D is unavailable in this browser. You can roll text dice and open the case."}
            </p>
          )}
        </div>

        <p className="dice-overlay__threshold label">{uk ? "ПОРОГ УСПІХУ" : "SUCCESS THRESHOLD"} <span>{difficulty} / 12</span></p>

        <div className="dice-overlay__result min-h-16 text-center" aria-live="polite">
          {phase === "rolling" && <p className="text-[#5c4f3a]">{uk ? "Кубики падають…" : "The dice are falling…"}</p>}
          {phase === "done" && dice && (
            <p className={`text-xl ${success ? "text-[#3e6945]" : "text-[#853d32]"}`} role="status">
              {success ? ui.check.success[locale] : ui.check.failure[locale]} · {dice[0]} + {dice[1]} = {total}
            </p>
          )}
        </div>

        <div className="mt-4 flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={roll}
            disabled={(!ready && !unavailable) || phase === "rolling"}
            autoFocus
            className="label min-h-11 border border-[#7a2e2e]/60 bg-[#7a2e2e] px-5 py-3 text-[#f2e8d5] transition-colors hover:bg-[#592525] disabled:opacity-50"
          >
            {!ready && !unavailable
              ? (uk ? "Завантаження 3D…" : "Loading 3D…")
              : phase === "done"
                ? (uk ? "Кинути ще раз" : "Roll again")
                : ui.check.roll[locale]}
          </button>
          {phase === "done" && (
            <button
              type="button"
              onClick={onOpenProject}
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
