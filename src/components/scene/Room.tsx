"use client";

import Image from "next/image";
import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent,
} from "react";
import { HOTSPOTS } from "@/content/hotspots";
import type { Hotspot, Locale, PanelId } from "@/types/content";

const POSITIONS: Record<PanelId, { x: number; y: number }> = {
  projects: { x: 77.2, y: 34.5 },
  about: { x: 40.5, y: 25.5 },
  contact: { x: 38.2, y: 42.3 },
  trivia: { x: 46.8, y: 73.2 },
  cv: { x: 61.2, y: 72.2 },
};

const DEPTH_LAYERS = [
  { name: "mirror", panel: "about", depth: 0.7, clip: "polygon(32% 13%, 46% 10%, 47% 47%, 34% 49%)" },
  { name: "radio", panel: "contact", depth: 1.15, clip: "polygon(32% 34%, 45% 35%, 46% 55%, 32% 57%)" },
  { name: "pinboard", panel: "projects", depth: 0.8, clip: "polygon(64% 13%, 91% 22%, 91% 59%, 64% 51%)" },
  { name: "bottle", panel: "trivia", depth: 1.65, clip: "polygon(39% 63%, 52% 65%, 52% 89%, 39% 89%)" },
  { name: "suitcase", panel: "cv", depth: 1.45, clip: "polygon(51% 61%, 74% 61%, 76% 88%, 53% 94%)" },
  { name: "foreground", depth: 2, clip: "polygon(13% 61%, 89% 60%, 90% 100%, 11% 100%)" },
] as const;

interface RoomProps {
  locale: Locale;
  onHover: (hotspot: Hotspot | null) => void;
  onSelect: (panel: PanelId) => void;
  onToggleTime: () => void;
  timeLabel: string;
}

function HotspotButton({
  hotspot,
  locale,
  active,
  onEnter,
  onLeave,
  onSelect,
}: {
  hotspot: Hotspot;
  locale: Locale;
  active: boolean;
  onEnter: () => void;
  onLeave: () => void;
  onSelect: () => void;
}) {
  const position = POSITIONS[hotspot.id];

  return (
    <button
      type="button"
      aria-label={hotspot.label[locale]}
      onPointerDown={onSelect}
      onClick={(event) => {
        // Pointer already selects on release; detail === 0 is a keyboard click.
        if (event.detail === 0) onSelect();
      }}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      onFocus={onEnter}
      onBlur={onLeave}
      className="room-art-hotspot"
      style={{ left: `${position.x}%`, top: `${position.y}%` }}
    >
      <span className="room-art-hotspot__ring" aria-hidden="true">
        <span className="room-art-hotspot__diamond" />
      </span>
      <span
        className={`room-art-hotspot__label ${active ? "is-visible" : ""}`}
        aria-hidden="true"
      >
        {hotspot.label[locale]}
      </span>
    </button>
  );
}

/**
 * Painterly-фон і доступний HTML-шар живуть окремо: арт залишається
 * цілісним, а старі голоси, панелі, клавіатура та мобільний фолбек
 * продовжують працювати без привʼязки до SVG-геометрії.
 */
export function Room({
  locale,
  onHover,
  onSelect,
  onToggleTime,
  timeLabel,
}: RoomProps) {
  const [hoveredId, setHoveredId] = useState<PanelId | null>(null);
  const roomRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<number | null>(null);

  useEffect(
    () => () => {
      if (frameRef.current !== null) window.cancelAnimationFrame(frameRef.current);
    },
    [],
  );

  const moveScene = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "touch") return;
    const room = roomRef.current;
    if (!room) return;

    const bounds = room.getBoundingClientRect();
    const x = ((event.clientX - bounds.left) / bounds.width - 0.5) * 2;
    const y = ((event.clientY - bounds.top) / bounds.height - 0.5) * 2;

    if (frameRef.current !== null) window.cancelAnimationFrame(frameRef.current);
    frameRef.current = window.requestAnimationFrame(() => {
      room.style.setProperty("--room-x", x.toFixed(3));
      room.style.setProperty("--room-y", y.toFixed(3));
    });
  };

  const centerScene = () => {
    roomRef.current?.style.setProperty("--room-x", "0");
    roomRef.current?.style.setProperty("--room-y", "0");
  };

  const enter = (hotspot: Hotspot) => {
    setHoveredId(hotspot.id);
    onHover(hotspot);
  };

  const leave = () => {
    setHoveredId(null);
    onHover(null);
  };

  return (
    <div
      ref={roomRef}
      className="room-art"
      onPointerMove={moveScene}
      onPointerLeave={centerScene}
      role="group"
      aria-label={
        locale === "uk"
          ? "Ізометрична кімната-майстерня з інтерактивними предметами"
          : "An isometric workshop room with interactive objects"
      }
    >
      <Image
        src="/img/room/workshop.webp"
        alt=""
        width={1672}
        height={941}
        priority
        sizes="(max-width: 1024px) 100vw, 72vw"
        className="room-art__image room-art__base"
      />

      <div className="room-art__depth-map" aria-hidden="true">
        {DEPTH_LAYERS.map((layer) => (
          <span
            key={layer.name}
            className="room-art__depth-layer"
            data-layer={layer.name}
            data-active={
              ("panel" in layer && layer.panel === hoveredId) || undefined
            }
            style={{
              "--depth": layer.depth,
              "--layer-clip": layer.clip,
            } as CSSProperties}
          />
        ))}
      </div>

      <div className="room-art__light" aria-hidden="true" />
      <div className="room-art__lamp-glow" aria-hidden="true" />
      <div className="room-art__dust" aria-hidden="true" />

      <button
        type="button"
        aria-label={timeLabel}
        onClick={onToggleTime}
        className="room-art-window"
        title={timeLabel}
      />

      {HOTSPOTS.map((hotspot) => (
        <HotspotButton
          key={hotspot.id}
          hotspot={hotspot}
          locale={locale}
          active={hoveredId === hotspot.id}
          onEnter={() => enter(hotspot)}
          onLeave={leave}
          onSelect={() => onSelect(hotspot.id)}
        />
      ))}
    </div>
  );
}
