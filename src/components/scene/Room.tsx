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
  {
    name: "mirror",
    panel: "about",
    depth: 0.7,
    clip: "polygon(32% 13%, 46% 10%, 47% 47%, 34% 49%)",
    mask: "radial-gradient(ellipse 10% 23% at 39% 30%, #000 42%, transparent 78%)",
  },
  {
    name: "bottle",
    panel: "trivia",
    depth: 1.65,
    clip: "polygon(39% 63%, 52% 65%, 52% 89%, 39% 89%)",
    mask: "radial-gradient(ellipse 8% 16% at 45.5% 76%, #000 35%, transparent 78%)",
  },
] as const;

const OBJECT_LAYERS = [
  {
    name: "pinboard",
    panel: "projects",
    src: "/img/room/pinboard.webp",
    x: 63.6, y: 15.8, width: 19.75, height: 40.9,
    imageWidth: 330, imageHeight: 385, depth: 0.8,
  },
  {
    name: "radio",
    panel: "contact",
    src: "/img/room/radio.webp",
    x: 36.6, y: 36.9, width: 6.76, height: 8.6,
    imageWidth: 113, imageHeight: 81, depth: 1.15,
  },
  {
    name: "suitcase",
    panel: "cv",
    src: "/img/room/suitcase.webp",
    x: 49.95, y: 67.16, width: 16.93, height: 19.45,
    imageWidth: 283, imageHeight: 183, depth: 1.45,
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
}: RoomProps) {
  const [hoveredId, setHoveredId] = useState<PanelId | null>(null);
  const [selectedId, setSelectedId] = useState<PanelId | null>(null);
  const roomRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<number | null>(null);
  const selectTimerRef = useRef<number | null>(null);

  useEffect(
    () => () => {
      if (frameRef.current !== null) {
        window.cancelAnimationFrame(frameRef.current);
      }
      if (selectTimerRef.current !== null) {
        window.clearTimeout(selectTimerRef.current);
      }
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
      ref={roomRef}
      className="room-art-shell"
      onPointerMove={moveScene}
      onPointerLeave={centerScene}
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
          src="/img/room/workshop-clean.webp"
          alt=""
          width={1672}
          height={941}
          priority
          draggable={false}
          sizes="(max-width: 1024px) 100vw, 72vw"
          className="room-art__image room-art__base"
        />

        <div className="room-art__depth-map" aria-hidden="true">
          {DEPTH_LAYERS.map((layer) => (
            <span
              key={layer.name}
              className="room-art__depth-layer"
              data-layer={layer.name}
              data-active={layer.panel === hoveredId || undefined}
              style={{
                "--depth": layer.depth,
                "--layer-clip": layer.clip,
                "--layer-mask": layer.mask,
              } as CSSProperties}
            />
          ))}
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
                "--depth": layer.depth,
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
