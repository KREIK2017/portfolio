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
        <div className="dice-overlay__scene">
          <div className="dice-overlay__lamp" aria-hidden="true" />
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
              <p className="dice-overlay__fallback" role="alert">
                {uk
                  ? "3D недоступне в цьому браузері. Можна кинути текстові кубики й відкрити справу."
                  : "3D is unavailable in this browser. You can roll text dice and open the case."}
              </p>
            )}
          </div>
          <span className="dice-overlay__scene-caption label" aria-hidden="true">KREIK / 2D6</span>
        </div>
        <div className="dice-overlay__intro">
          <p className="label dice-overlay__eyebrow">{uk ? "СПРАВА" : "CASE FILE"} · {project.year}</p>
          <h3 className="dice-overlay__title">{project.title[locale]}</h3>
          <p className="dice-overlay__summary">{project.summary[locale]}</p>
        </div>
        <div className="dice-overlay__dossier">
          <div className="dice-overlay__stats">
            <div><span className="label">{ui.check.title[locale]}</span><strong>2D6</strong></div>
            <div><span className="label">{uk ? "СКЛАДНІСТЬ" : "DIFFICULTY"}</span><strong>{difficulty} / 12</strong></div>
          </div>
          <div className="dice-overlay__result" aria-live="polite">
            {phase === "idle" && <p className="dice-overlay__instruction">{uk ? "Кинь кубики, щоб відкрити справу. Навіть провал не приховає роботу." : "Roll to open the case. Even a failed check won't hide the work."}</p>}
            {phase === "rolling" && <p className="dice-overlay__instruction">{uk ? "Кубики падають…" : "The dice are falling…"}</p>}
            {phase === "done" && dice && (
              <div className={`dice-overlay__stamp ${success ? "dice-overlay__stamp--success" : "dice-overlay__stamp--failure"}`} role="status">
                <span className="dice-overlay__stamp-label">{success ? ui.check.success[locale] : ui.check.failure[locale]}</span>
                <span className="dice-overlay__stamp-score"> · {dice[0]} + {dice[1]} = {total}</span>
              </div>
            )}
          </div>
          <div className="dice-overlay__actions">
            <button
              type="button"
              onClick={roll}
              disabled={(!ready && !unavailable) || phase === "rolling"}
              autoFocus
              className="dice-overlay__roll label"
            >
              {!ready && !unavailable
                ? (uk ? "Завантаження 3D…" : "Loading 3D…")
                : phase === "done"
                  ? (uk ? "Кинути ще раз" : "Roll again")
                  : ui.check.roll[locale]}
            </button>
            {phase === "done" && (
              <button type="button" onClick={onOpenProject} className="dice-overlay__open label">
                {uk ? "Відкрити справу" : "Open the case"} →
              </button>
            )}
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
