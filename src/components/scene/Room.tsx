"use client";

import { useState } from "react";
import { HOTSPOTS } from "@/content/hotspots";
import {
  ROOM,
  boxFaces,
  iso,
  onBackWall,
  onFloor,
  onLeftWall,
  poly,
  type BoxSpec,
  type Point,
} from "@/lib/iso";
import type { Hotspot, Locale, PanelId } from "@/types/content";

const HOTSPOT_BY_ID = Object.fromEntries(
  HOTSPOTS.map((spot) => [spot.id, spot]),
) as Record<PanelId, Hotspot>;

/**
 * Точки, до яких кріпляться маркери й тултипи. Тримаємо їх поза
 * розміткою предметів, бо шар маркерів малюється окремо, останнім.
 */
const ANCHORS: Record<PanelId, Point> = {
  projects: iso(7.5, 0, 6.4),
  about: iso(0, 2.5, 6.6),
  contact: iso(1.4, 4.6, 3.1),
  trivia: iso(4.9, 8.4, 2.1),
  cv: iso(7.9, 7.2, 2.0),
};

interface RoomProps {
  locale: Locale;
  onHover: (hotspot: Hotspot | null) => void;
  onSelect: (panel: PanelId) => void;
  onToggleTime: () => void;
  timeLabel: string;
}

/** Куб у трьох видимих гранях. Верх найсвітліший — світло падає згори. */
function Box({
  spec,
  top,
  right,
  left,
  stroke = "rgba(0,0,0,0.35)",
}: {
  spec: BoxSpec;
  top: string;
  right: string;
  left: string;
  stroke?: string;
}) {
  const faces = boxFaces(spec);

  return (
    <g stroke={stroke} strokeWidth={0.7}>
      <polygon points={faces.left} fill={left} />
      <polygon points={faces.right} fill={right} />
      <polygon points={faces.top} fill={top} />
    </g>
  );
}

/**
 * Маркер інтерактивності. Постійно видимий і м'яко пульсує —
 * ТЗ вимагає, щоб користувач за секунду зрозумів, що предмет клікабельний,
 * а не шукав це навпомацки курсором.
 */
function Marker({ at, active }: { at: Point; active: boolean }) {
  const [cx, cy] = at;

  return (
    <g pointerEvents="none">
      <circle
        cx={cx}
        cy={cy}
        r={active ? 11 : 9}
        fill="none"
        stroke="#a9b48d"
        strokeWidth={1.6}
        opacity={active ? 0.95 : 0.6}
        className={active ? undefined : "marker-pulse"}
      />
      <circle cx={cx} cy={cy} r={3} fill="#e8ddc4" opacity={active ? 1 : 0.8} />
    </g>
  );
}

/** Підпис розділу біля предмета. */
function Tooltip({ at, text }: { at: Point; text: string }) {
  const [cx, cy] = at;
  // Ширину рахуємо приблизно з довжини рядка: SVG не вміє
  // обгортати текст, а measureText тут недоступний.
  const width = text.length * 6.4 + 20;

  return (
    <g pointerEvents="none" className="anim-fade-in">
      <rect
        x={cx - width / 2}
        y={cy - 42}
        width={width}
        height={22}
        rx={2}
        fill="#14120f"
        stroke="#a9b48d"
        strokeWidth={0.8}
        opacity={0.94}
      />
      <text
        x={cx}
        y={cy - 27}
        textAnchor="middle"
        fill="#e8ddc4"
        fontSize={10.5}
        letterSpacing={1.6}
        className="label"
      >
        {text.toUpperCase()}
      </text>
    </g>
  );
}

/**
 * Обгортка, що робить із групи доступну кнопку.
 *
 * Маркер і тултип свідомо НЕ всередині: вони розтягували bounding box
 * групи, і браузер малював фокусну рамку по всьому цьому прямокутнику,
 * а не по предмету. Тому вони живуть в окремому шарі поверх сцени.
 */
function Interactive({
  hotspot,
  locale,
  setHoveredId,
  onHover,
  onSelect,
  children,
}: {
  hotspot: Hotspot;
  locale: Locale;
  setHoveredId: (id: PanelId | null) => void;
  onHover: (hotspot: Hotspot | null) => void;
  onSelect: (panel: PanelId) => void;
  children: React.ReactNode;
}) {
  const enter = () => {
    setHoveredId(hotspot.id);
    onHover(hotspot);
  };

  const leave = () => {
    setHoveredId(null);
    onHover(null);
  };

  return (
    <g
      className="hotspot"
      role="button"
      tabIndex={0}
      aria-label={hotspot.label[locale]}
      onClick={() => onSelect(hotspot.id)}
      onKeyDown={(event) => {
        // Пробіл і Enter — стандартна поведінка кнопки, якої <g> не має.
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onSelect(hotspot.id);
        }
      }}
      onMouseEnter={enter}
      onMouseLeave={leave}
      onFocus={enter}
      onBlur={leave}
    >
      {children}
    </g>
  );
}

export function Room({
  locale,
  onHover,
  onSelect,
  onToggleTime,
  timeLabel,
}: RoomProps) {
  const { w, d, h } = ROOM;
  const [hoveredId, setHoveredId] = useState<PanelId | null>(null);

  // Центр абажура. Виніс до центру кімнати: біля вікна він читався
  // як другий предмет на стіні, а не як лампа під стелею.
  const lampX = 5.2;
  const lampY = 5.2;

  const shared = { locale, setHoveredId, onHover, onSelect };

  return (
    <svg
      viewBox="-340 -258 680 656"
      className="mx-auto block h-auto w-full max-w-[52rem]"
      role="group"
      aria-label={
        locale === "uk"
          ? "Ізометрична кімната готелю з інтерактивними предметами"
          : "An isometric hotel room with interactive objects"
      }
    >
      <defs>
        <linearGradient id="floorGrad" x1="0" y1="0" x2="0.4" y2="1">
          <stop offset="0%" stopColor="#4e4234" />
          <stop offset="100%" stopColor="#261f19" />
        </linearGradient>
        <linearGradient id="backWallGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#574b3b" />
          <stop offset="100%" stopColor="#322b23" />
        </linearGradient>
        <linearGradient id="leftWallGrad" x1="1" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#44392c" />
          <stop offset="100%" stopColor="#261f19" />
        </linearGradient>
        <linearGradient id="mirrorGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#7b8880" />
          <stop offset="45%" stopColor="#434e49" />
          <stop offset="100%" stopColor="#616b64" />
        </linearGradient>
        <radialGradient id="glowGrad">
          <stop offset="0%" stopColor="var(--de-glow)" stopOpacity="0.6" />
          <stop offset="60%" stopColor="var(--de-glow)" stopOpacity="0.18" />
          <stop offset="100%" stopColor="var(--de-glow)" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="windowGrad">
          <stop offset="0%" stopColor="var(--de-window)" stopOpacity="1" />
          <stop offset="100%" stopColor="var(--de-window)" stopOpacity="0.5" />
        </radialGradient>
        {/* Пляма світла, що лягає з вікна на підлогу */}
        <linearGradient id="lightPool" x1="0" y1="0" x2="0.3" y2="1">
          <stop offset="0%" stopColor="var(--de-glow)" stopOpacity="0.3" />
          <stop offset="100%" stopColor="var(--de-glow)" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* ── Оболонка кімнати ───────────────────────────────────── */}
      <polygon points={onBackWall(0, w, 0, h)} fill="url(#backWallGrad)" />
      <polygon points={onLeftWall(0, d, 0, h)} fill="url(#leftWallGrad)" />
      <polygon points={onFloor(0, w, 0, d)} fill="url(#floorGrad)" />

      {/* Дошки підлоги */}
      <g stroke="rgba(0,0,0,0.26)" strokeWidth={0.8}>
        {Array.from({ length: d - 1 }, (_, index) => {
          const y = index + 1;
          const [x1, y1] = iso(0, y, 0);
          const [x2, y2] = iso(w, y, 0);
          return <line key={y} x1={x1} y1={y1} x2={x2} y2={y2} />;
        })}
      </g>

      {/* Світло з вікна на підлозі: косий чотирикутник, а не коло —
          так читається напрямок, звідки падає світло. */}
      <polygon
        points={poly(
          iso(1.3, 0.5, 0),
          iso(4.4, 0.5, 0),
          iso(5.4, 5.0, 0),
          iso(2.3, 5.0, 0),
        )}
        fill="url(#lightPool)"
        pointerEvents="none"
      />

      {/* Плінтус */}
      <polygon points={onBackWall(0, w, 0, 0.4)} fill="#221c15" opacity={0.7} />
      <polygon points={onLeftWall(0, d, 0, 0.4)} fill="#1b1611" opacity={0.7} />

      {/* Килим */}
      <polygon
        points={onFloor(3.4, 8.4, 6.4, 10.2)}
        fill="#5e3a30"
        opacity={0.55}
      />
      <polygon
        points={onFloor(3.9, 7.9, 6.9, 9.7)}
        fill="none"
        stroke="#8c6a4a"
        strokeWidth={1.2}
        opacity={0.45}
      />

      {/* ── Вікно: перемикач дня і ночі ────────────────────────── */}
      <g
        className="hotspot"
        role="button"
        tabIndex={0}
        aria-label={timeLabel}
        onClick={onToggleTime}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            onToggleTime();
          }
        }}
      >
        <circle
          cx={iso(2.8, 0, 5)[0]}
          cy={iso(2.8, 0, 5)[1]}
          r={140}
          fill="url(#glowGrad)"
        />
        <polygon
          points={onBackWall(1.3, 4.3, 3.5, 6.4)}
          fill="#2a2419"
          stroke="#100d0a"
          strokeWidth={1}
        />
        <polygon points={onBackWall(1.5, 4.1, 3.7, 6.2)} fill="url(#windowGrad)" />
        <g stroke="#1a1611" strokeWidth={2.2}>
          <line
            x1={iso(2.8, 0, 3.7)[0]}
            y1={iso(2.8, 0, 3.7)[1]}
            x2={iso(2.8, 0, 6.2)[0]}
            y2={iso(2.8, 0, 6.2)[1]}
          />
          <line
            x1={iso(1.5, 0, 4.95)[0]}
            y1={iso(1.5, 0, 4.95)[1]}
            x2={iso(4.1, 0, 4.95)[0]}
            y2={iso(4.1, 0, 4.95)[1]}
          />
        </g>
      </g>

      {/* Підвіконня */}
      <Box
        spec={{ x: 1.2, y: 0, z: 3.35, w: 3.2, d: 0.4, h: 0.18 }}
        top="#544937"
        right="#3b3226"
        left="#2d261d"
      />

      {/* ── Лампа під стелею ───────────────────────────────────── */}
      <g pointerEvents="none">
        <line
          x1={iso(lampX, lampY, h)[0]}
          y1={iso(lampX, lampY, h)[1]}
          x2={iso(lampX, lampY, 5.62)[0]}
          y2={iso(lampX, lampY, 5.62)[1]}
          stroke="#15100b"
          strokeWidth={1.3}
        />
        {/* Абажур — усічена піраміда, ширша донизу */}
        <polygon
          points={poly(
            iso(lampX + 0.22, lampY - 0.22, 5.62),
            iso(lampX + 0.22, lampY + 0.22, 5.62),
            iso(lampX + 0.6, lampY + 0.6, 5.05),
            iso(lampX + 0.6, lampY - 0.6, 5.05),
          )}
          fill="#7d6039"
        />
        <polygon
          points={poly(
            iso(lampX - 0.22, lampY + 0.22, 5.62),
            iso(lampX + 0.22, lampY + 0.22, 5.62),
            iso(lampX + 0.6, lampY + 0.6, 5.05),
            iso(lampX - 0.6, lampY + 0.6, 5.05),
          )}
          fill="#5f482b"
        />
        {/* Світло під абажуром */}
        <ellipse
          cx={iso(lampX, lampY, 5.0)[0]}
          cy={iso(lampX, lampY, 5.0)[1]}
          rx={26}
          ry={13}
          fill="var(--de-glow)"
          opacity={0.55}
        />
        <circle
          cx={iso(lampX, lampY, 4.4)[0]}
          cy={iso(lampX, lampY, 4.4)[1]}
          r={104}
          fill="url(#glowGrad)"
        />
      </g>

      {/* ── Дошка з нотатками → Проєкти ────────────────────────── */}
      <Interactive
        {...shared}
        hotspot={HOTSPOT_BY_ID.projects}
      >
        <polygon
          points={onBackWall(5.2, 9.9, 2.9, 6.0)}
          fill="#3a2c1e"
          stroke="#15100b"
          strokeWidth={1.4}
        />
        <polygon points={onBackWall(5.45, 9.65, 3.1, 5.8)} fill="#8a6e46" />
        {[
          { x1: 5.7, x2: 6.7, z1: 4.6, z2: 5.55, fill: "#d9c9a3" },
          { x1: 6.95, x2: 7.85, z1: 4.75, z2: 5.6, fill: "#c4b189" },
          { x1: 8.1, x2: 9.35, z1: 4.5, z2: 5.5, fill: "#d9c9a3" },
          { x1: 5.6, x2: 6.6, z1: 3.3, z2: 4.25, fill: "#c4b189" },
          { x1: 6.9, x2: 8.1, z1: 3.35, z2: 4.35, fill: "#d9c9a3" },
          { x1: 8.4, x2: 9.4, z1: 3.25, z2: 4.15, fill: "#b8a67e" },
        ].map((note, index) => (
          <polygon
            key={index}
            points={onBackWall(note.x1, note.x2, note.z1, note.z2)}
            fill={note.fill}
            stroke="rgba(40,32,20,0.4)"
            strokeWidth={0.6}
          />
        ))}
        <polyline
          points={poly(
            iso(6.2, 0, 5.1),
            iso(7.4, 0, 4.2),
            iso(8.7, 0, 5.0),
            iso(6.1, 0, 3.8),
          )}
          fill="none"
          stroke="#8c3b32"
          strokeWidth={1.6}
          opacity={0.85}
        />
        {[
          [6.2, 5.1],
          [7.4, 4.2],
          [8.7, 5.0],
          [6.1, 3.8],
        ].map(([x, z]) => {
          const [cx, cy] = iso(x, 0, z);
          return <circle key={`${x}-${z}`} cx={cx} cy={cy} r={2.6} fill="#b5654a" />;
        })}
      </Interactive>

      {/* ── Дзеркало → Про мене ────────────────────────────────── */}
      <Interactive
        {...shared}
        hotspot={HOTSPOT_BY_ID.about}
      >
        <polygon
          points={onLeftWall(1.3, 3.7, 3.2, 6.2)}
          fill="#3f3324"
          stroke="#15100b"
          strokeWidth={1.4}
        />
        <polygon points={onLeftWall(1.55, 3.45, 3.45, 5.95)} fill="url(#mirrorGrad)" />
        <polygon
          points={onLeftWall(1.55, 3.45, 3.45, 5.95)}
          fill="#1c1a17"
          opacity={0.22}
        />
        <polygon
          points={onLeftWall(2.6, 3.4, 4.6, 5.9)}
          fill="#d9c9a3"
          opacity={0.08}
        />
      </Interactive>

      {/* ── Тумбочка з радіо → Контакти ────────────────────────── */}
      <Box
        spec={{ x: 0.6, y: 3.9, w: 1.6, d: 1.6, h: 1.75 }}
        top="#564734"
        right="#3f3428"
        left="#2f271e"
      />
      <Interactive
        {...shared}
        hotspot={HOTSPOT_BY_ID.contact}
      >
        <Box
          spec={{ x: 0.8, y: 4.1, z: 1.75, w: 1.25, d: 1.15, h: 0.8 }}
          top="#a8834f"
          right="#87673c"
          left="#684e2f"
        />
        {[
          [1.05, 4.15],
          [1.05, 4.62],
        ].map(([x, y]) => {
          const [cx, cy] = iso(x, y, 2.35);
          return (
            <circle
              key={`${x}-${y}`}
              cx={cx}
              cy={cy}
              r={4}
              fill="#2b2620"
              stroke="#c9973f"
              strokeWidth={0.9}
            />
          );
        })}
      </Interactive>

      {/* ── Ліжко ──────────────────────────────────────────────── */}
      <g pointerEvents="none">
        <Box
          spec={{ x: 0.5, y: 5.9, w: 3.4, d: 4.5, h: 0.95 }}
          top="#4d4030"
          right="#382f24"
          left="#2a221b"
        />
        <Box
          spec={{ x: 0.5, y: 5.9, z: 0.95, w: 3.4, d: 4.5, h: 0.35 }}
          top="#87734f"
          right="#66563c"
          left="#4f422e"
        />
        <Box
          spec={{ x: 0.5, y: 7.4, z: 1.3, w: 3.4, d: 3.0, h: 0.22 }}
          top="#74483a"
          right="#58362c"
          left="#452b23"
        />
        <Box
          spec={{ x: 0.9, y: 6.15, z: 1.3, w: 2.6, d: 1.0, h: 0.3 }}
          top="#cfbf9a"
          right="#ab9a79"
          left="#8f8065"
        />
      </g>

      {/* ── Пляшка й попільничка → Фан-факти ───────────────────── */}
      <Interactive
        {...shared}
        hotspot={HOTSPOT_BY_ID.trivia}
      >
        <ellipse
          cx={iso(5.5, 8.6, 0)[0]}
          cy={iso(5.5, 8.6, 0)[1]}
          rx={17}
          ry={9}
          fill="#443e36"
          stroke="#15100b"
          strokeWidth={0.8}
        />
        <ellipse
          cx={iso(5.5, 8.6, 0)[0]}
          cy={iso(5.5, 8.6, 0)[1]}
          rx={11}
          ry={5.5}
          fill="#5d5548"
        />
        <Box
          spec={{ x: 4.3, y: 8.2, w: 0.42, d: 0.42, h: 1.05 }}
          top="#50675a"
          right="#3f5347"
          left="#304037"
        />
        <Box
          spec={{ x: 4.4, y: 8.3, z: 1.05, w: 0.22, d: 0.22, h: 0.45 }}
          top="#60796c"
          right="#465b50"
          left="#36483e"
        />
      </Interactive>

      {/* ── Валіза → Резюме ────────────────────────────────────── */}
      <Interactive
        {...shared}
        hotspot={HOTSPOT_BY_ID.cv}
      >
        <Box
          spec={{ x: 6.7, y: 6.3, w: 2.5, d: 1.8, h: 0.8 }}
          top="#83553a"
          right="#65402b"
          left="#4c3121"
        />
        {[7.3, 8.5].map((x) => (
          <polygon
            key={x}
            points={poly(
              iso(x, 6.3, 0.8),
              iso(x + 0.22, 6.3, 0.8),
              iso(x + 0.22, 8.1, 0.8),
              iso(x, 8.1, 0.8),
            )}
            fill="#312015"
            opacity={0.85}
          />
        ))}
        <path
          d={`M ${iso(7.6, 7.2, 0.8).join(" ")} Q ${iso(7.95, 7.2, 1.35).join(" ")} ${iso(8.3, 7.2, 0.8).join(" ")}`}
          fill="none"
          stroke="#312015"
          strokeWidth={3}
          strokeLinecap="round"
        />
      </Interactive>

      {/*
        Загальне затемнення. Вночі --de-ambient менший, тому шар
        густіший — кімната сама «гасне» без дублювання кольорів.
      */}
      <polygon
        points={poly(
          iso(0, 0, h),
          iso(w, 0, h),
          iso(w, d, 0),
          iso(0, d, 0),
          iso(0, 0, 0),
        )}
        fill="#0a0806"
        style={{ opacity: "calc(0.5 - var(--de-ambient))" }}
        pointerEvents="none"
      />

      {/*
        Шар маркерів і тултипів. Малюється останнім, тому:
        — маркери не тонуть у затемненні й не перекриваються предметами;
        — фокусна рамка обводить лише сам предмет, а не bounding box
          разом із тултипом, як було раніше.
      */}
      <g pointerEvents="none">
        {HOTSPOTS.map((spot) => (
          <Marker
            key={spot.id}
            at={ANCHORS[spot.id]}
            active={hoveredId === spot.id}
          />
        ))}

        {hoveredId && (
          <Tooltip
            at={ANCHORS[hoveredId]}
            text={HOTSPOT_BY_ID[hoveredId].label[locale]}
          />
        )}
      </g>
    </svg>
  );
}
