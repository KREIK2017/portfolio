"use client";

import Image from "next/image";
import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
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

const OBJECT_LAYERS = [
  {
    name: "mirror",
    panel: "about",
    src: "/img/room/mirror.webp",
    x: 35.3, y: 8.7, width: 8.08, height: 27.42,
    imageWidth: 135, imageHeight: 258,
  },
  {
    name: "pinboard",
    panel: "projects",
    src: "/img/room/pinboard.webp",
    x: 63.6, y: 15.8, width: 19.75, height: 40.9,
    imageWidth: 330, imageHeight: 385,
  },
  {
    name: "radio",
    panel: "contact",
    src: "/img/room/radio.webp",
    x: 36.6, y: 36.9, width: 6.76, height: 8.6,
    imageWidth: 113, imageHeight: 81,
  },
  {
    name: "suitcase",
    panel: "cv",
    src: "/img/room/suitcase.webp",
    x: 49.95, y: 67.16, width: 16.93, height: 19.45,
    imageWidth: 283, imageHeight: 183,
  },
  {
    name: "bottle",
    panel: "trivia",
    src: "/img/room/bottle-ashtray.webp",
    x: 40.9, y: 64.5, width: 6.88, height: 15.94,
    imageWidth: 115, imageHeight: 150,
  },
] as const;

const OBJECT_HIT_AREAS = Object.fromEntries(
  OBJECT_LAYERS.map(({ panel, x, y, width, height }) => [
    panel,
    { x, y, width, height },
  ]),
) as Partial<Record<PanelId, { x: number; y: number; width: number; height: number }>>;

interface RoomProps {
  locale: Locale;
  onHover: (hotspot: Hotspot | null) => void;
  onSelect: (panel: PanelId) => void;
  onToggleTime: () => void;
  timeLabel: string;
  lampOn: boolean;
  onToggleLamp: () => void;
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
  const area = OBJECT_HIT_AREAS[hotspot.id];

  return (
    <button
      type="button"
      aria-label={hotspot.label[locale]}
      onPointerDown={onSelect}
      onClick={(event) => {
        // Pointer selects on press; detail === 0 is a keyboard click.
        if (event.detail === 0) onSelect();
      }}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      onFocus={onEnter}
      onBlur={onLeave}
      className={area
        ? "room-art-hotspot room-art-hotspot--object"
        : "room-art-hotspot"}
      style={area
        ? {
            left: `${area.x}%`,
            top: `${area.y}%`,
            width: `${area.width}%`,
            height: `${area.height}%`,
            "--marker-x": `${((position.x - area.x) / area.width) * 100}%`,
            "--marker-y": `${((position.y - area.y) / area.height) * 100}%`,
          } as CSSProperties
        : { left: `${position.x}%`, top: `${position.y}%` }}
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
  lampOn,
  onToggleLamp,
}: RoomProps) {
  const [hoveredId, setHoveredId] = useState<PanelId | null>(null);
  const [selectedId, setSelectedId] = useState<PanelId | null>(null);
  const selectTimerRef = useRef<number | null>(null);

  useEffect(
    () => () => {
      if (selectTimerRef.current !== null) {
        window.clearTimeout(selectTimerRef.current);
      }
    },
    [],
  );

  const enter = (hotspot: Hotspot) => {
    setHoveredId(hotspot.id);
    onHover(hotspot);
  };

  const leave = () => {
    setHoveredId(null);
    onHover(null);
  };

  const selectObject = (id: PanelId) => {
    if (selectTimerRef.current !== null) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      onSelect(id);
      return;
    }

    setSelectedId(id);
    selectTimerRef.current = window.setTimeout(() => {
      onSelect(id);
      setSelectedId(null);
      selectTimerRef.current = null;
    }, 380);
  };

  const focusPosition = selectedId ? POSITIONS[selectedId] : null;

  return (
    <div
      className="room-art-shell"
      role="group"
      aria-label={
        locale === "uk"
          ? "Ізометрична кімната-майстерня з інтерактивними предметами"
          : "An isometric workshop room with interactive objects"
      }
    >
      <div
        className={`room-art ${selectedId ? "room-art--focus" : ""}`}
        style={focusPosition
          ? {
              "--focus-x": `${focusPosition.x}%`,
              "--focus-y": `${focusPosition.y}%`,
            } as CSSProperties
          : undefined}
      >
        <Image
          src="/img/room/workshop-empty.webp"
          alt=""
          width={1672}
          height={941}
          priority
          draggable={false}
          sizes="(max-width: 1024px) 100vw, 72vw"
          className="room-art__image room-art__base"
        />

        <div className="room-art__depth-map" aria-hidden="true">
          {OBJECT_LAYERS.map((layer) => (
            <Image
              key={layer.name}
              src={layer.src}
              alt=""
              width={layer.imageWidth}
              height={layer.imageHeight}
              draggable={false}
              className="room-art__object"
              data-layer={layer.name}
              data-active={layer.panel === hoveredId || undefined}
              style={{
                left: `${layer.x}%`,
                top: `${layer.y}%`,
                width: `${layer.width}%`,
              } as CSSProperties}
            />
          ))}
        </div>

        <div className="room-art__light" aria-hidden="true" />
        <div className="room-art__lamp-glow" aria-hidden="true" />
        <div className="room-art__window-glow" aria-hidden="true" />
        <div className="room-art__lamp-shade" aria-hidden="true" />
        <div className="room-art__dust" aria-hidden="true" />

        <button
          type="button"
          onClick={onToggleLamp}
          aria-label={locale === "uk"
            ? `Лампа: ${lampOn ? "вимкнути" : "увімкнути"}`
            : `Lamp: turn ${lampOn ? "off" : "on"}`}
          aria-pressed={lampOn}
          className="room-art-lamp"
          title={locale === "uk" ? "Увімкнути / вимкнути лампу" : "Toggle lamp"}
        >
          <span className="room-art-lamp__marker" aria-hidden="true" />
        </button>

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
            active={hoveredId === hotspot.id || selectedId === hotspot.id}
            onEnter={() => enter(hotspot)}
            onLeave={leave}
            onSelect={() => selectObject(hotspot.id)}
          />
        ))}
      </div>
    </div>
  );
}
