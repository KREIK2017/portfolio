"use client";

import Image from "next/image";
import { useRef, useState, type PointerEvent } from "react";
import type { Locale } from "@/types/content";

export type SuitcaseItem = "photo" | "passport" | "cv";
type Position = { x: number; y: number };
type Positions = Record<SuitcaseItem, Position>;

const INITIAL: Positions = {
  photo: { x: 16, y: 55 },
  passport: { x: 43, y: 54 },
  cv: { x: 69, y: 57 },
};
const ITEMS: SuitcaseItem[] = ["photo", "passport", "cv"];

const LABELS = {
  photo: { uk: "Фотокартка", en: "Photo card" },
  passport: { uk: "Паспорт навичок", en: "Skills passport" },
  cv: { uk: "Складений CV", en: "Folded CV" },
} as const;

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export function SuitcaseScene({
  locale,
  onInspect,
}: {
  locale: Locale;
  onInspect: (item: SuitcaseItem) => void;
}) {
  const stageRef = useRef<HTMLDivElement>(null);
  const gesture = useRef<{
    item: SuitcaseItem;
    pointerId: number;
    startX: number;
    startY: number;
    from: Position;
    moved: boolean;
  } | null>(null);
  const [positions, setPositions] = useState<Positions>(INITIAL);
  const [front, setFront] = useState<SuitcaseItem | null>(null);
  const [dragging, setDragging] = useState<SuitcaseItem | null>(null);

  const down = (event: PointerEvent<HTMLButtonElement>, item: SuitcaseItem) => {
    if (!stageRef.current) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    gesture.current = {
      item,
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      from: positions[item],
      moved: false,
    };
    setFront(item);
  };

  const move = (event: PointerEvent<HTMLButtonElement>) => {
    const current = gesture.current;
    const stage = stageRef.current;
    if (!current || !stage || current.pointerId !== event.pointerId) return;
    const dx = event.clientX - current.startX;
    const dy = event.clientY - current.startY;
    if (!current.moved && Math.hypot(dx, dy) < 6) return;
    current.moved = true;
    setDragging(current.item);
    const bounds = stage.getBoundingClientRect();
    setPositions((previous) => ({
      ...previous,
      [current.item]: {
        x: clamp(current.from.x + (dx / bounds.width) * 100, 9, 73),
        y: clamp(current.from.y + (dy / bounds.height) * 100, 49, 72),
      },
    }));
  };

  const up = (event: PointerEvent<HTMLButtonElement>) => {
    const current = gesture.current;
    if (!current || current.pointerId !== event.pointerId) return;
    gesture.current = null;
    setDragging(null);
    if (!current.moved) onInspect(current.item);
  };

  const keyboardMove = (event: React.KeyboardEvent<HTMLButtonElement>, item: SuitcaseItem) => {
    const shifts: Record<string, [number, number]> = {
      ArrowLeft: [-2, 0], ArrowRight: [2, 0], ArrowUp: [0, -2], ArrowDown: [0, 2],
    };
    const shift = shifts[event.key];
    if (!shift) return;
    event.preventDefault();
    setFront(item);
    setPositions((previous) => ({
      ...previous,
      [item]: {
        x: clamp(previous[item].x + shift[0], 9, 73),
        y: clamp(previous[item].y + shift[1], 49, 72),
      },
    }));
  };

  return (
    <>
      <div ref={stageRef} className="suitcase-stage" role="group" aria-label={locale === "uk" ? "Відкрита валіза з предметами" : "Open suitcase with objects"}>
        <Image
          src="/img/room/suitcase-open.webp"
          alt=""
          width={1312}
          height={1199}
          draggable={false}
          className="suitcase-stage__art"
        />
        <p id="suitcase-controls" className="sr-only">
          {locale === "uk"
            ? "Натисни, щоб оглянути; перетягни або скористайся стрілками, щоб пересунути"
            : "Activate to inspect; drag or use arrow keys to move"}
        </p>
        {ITEMS.map((item, index) => (
          <button
            key={item}
            type="button"
            data-suitcase-item={item}
            aria-label={LABELS[item][locale]}
            aria-describedby="suitcase-controls"
            className={`suitcase-item suitcase-item--${item} ${dragging === item ? "is-dragging" : ""}`}
            style={{ left: `${positions[item].x}%`, top: `${positions[item].y}%`, zIndex: front === item ? 9 : index + 3 }}
            onPointerDown={(event) => down(event, item)}
            onPointerMove={move}
            onPointerUp={up}
            onPointerCancel={() => { gesture.current = null; setDragging(null); }}
            onClick={(event) => { if (event.detail === 0) onInspect(item); }}
            onKeyDown={(event) => keyboardMove(event, item)}
          >
            {item === "photo" && (
              <span className="suitcase-photo">
                <span className="suitcase-photo__emulsion">
                  <Image src="/img/suitcase-photo.webp" alt="" width={720} height={1009} draggable={false} />
                </span>
                <span className="suitcase-photo__caption">{locale === "uk" ? "Максим Мичко" : "Maksim Mychko"}</span>
                <span className="suitcase-photo__serial">KREIK · 01</span>
              </span>
            )}
            {item === "passport" && (
              <span className="suitcase-passport">
                <span className="suitcase-passport__crest" aria-hidden="true">✦</span>
                <span>KREIK</span>
                <small>{locale === "uk" ? "ПАСПОРТ НАВИЧОК" : "SKILLS PASSPORT"}</small>
              </span>
            )}
            {item === "cv" && (
              <span className="suitcase-cv">
                <span className="suitcase-cv__fold" aria-hidden="true" />
                <strong>CURRICULUM<br />VITAE</strong>
                <small>МАКСИМ МИЧКО</small>
                <span className="suitcase-cv__lines" aria-hidden="true" />
              </span>
            )}
          </button>
        ))}
      </div>
      <div className="suitcase-controls mt-3 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm">
          {locale === "uk"
            ? "Бери предмети, пересувай і відкривай. Стрілки теж працюють."
            : "Pick up, move and open the objects. Arrow keys work too."}
        </p>
        <button
          type="button"
          onClick={() => { setPositions(INITIAL); setFront(null); }}
          className="label min-h-11 border px-3"
        >
          {locale === "uk" ? "Скласти назад" : "Put things back"}
        </button>
      </div>
      <nav className="suitcase-shortcuts mt-4 grid grid-cols-3 gap-2 lg:hidden" aria-label={locale === "uk" ? "Предмети валізи" : "Suitcase objects"}>
        {ITEMS.map((item) => (
          <button key={item} type="button" onClick={() => onInspect(item)} className="min-h-12 border px-2 text-xs">
            {LABELS[item][locale]}
          </button>
        ))}
      </nav>
    </>
  );
}
