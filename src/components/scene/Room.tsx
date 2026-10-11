"use client";

import Image from "next/image";
import { useState } from "react";
import { HOTSPOTS } from "@/content/hotspots";
import type { Hotspot, Locale, PanelId } from "@/types/content";

const POSITIONS: Record<PanelId, { x: number; y: number }> = {
  projects: { x: 77.2, y: 34.5 },
  about: { x: 40.5, y: 25.5 },
  contact: { x: 38.2, y: 42.3 },
  trivia: { x: 46.8, y: 73.2 },
  cv: { x: 61.2, y: 72.2 },
};

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
      onClick={onSelect}
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
      className="room-art"
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
        className="room-art__image"
      />

      <div className="room-art__light" aria-hidden="true" />

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
