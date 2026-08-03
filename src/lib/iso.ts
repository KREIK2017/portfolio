/**
 * Ізометрична проєкція: паралельна, кути 30°, без точки зникнення.
 * Координати рахуються один раз під час рендеру, тому кімната —
 * не картинка, а геометрія, і масштабується без втрат.
 */

const SCALE = 34;
const COS30 = Math.cos(Math.PI / 6);

export type Point = readonly [number, number];

/** Світові координати (x праворуч-вниз, y ліворуч-вниз, z вгору) → екранні. */
export function iso(x: number, y: number, z: number): Point {
  return [(x - y) * COS30 * SCALE, ((x + y) * 0.5 - z) * SCALE];
}

/** Список точок у форматі атрибута points полігона. */
export function poly(...pts: Point[]): string {
  return pts.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
}

export interface BoxSpec {
  x: number;
  y: number;
  z?: number;
  w: number;
  d: number;
  h: number;
}

/**
 * Три видимі грані куба. У цій проєкції камера бачить верх,
 * грань з максимальним x і грань з максимальним y — решта завжди позаду.
 */
export function boxFaces({ x, y, z = 0, w, d, h }: BoxSpec) {
  const top = z + h;

  return {
    top: poly(
      iso(x, y, top),
      iso(x + w, y, top),
      iso(x + w, y + d, top),
      iso(x, y + d, top),
    ),
    /** Грань, повернена праворуч-вниз. */
    right: poly(
      iso(x + w, y, top),
      iso(x + w, y + d, top),
      iso(x + w, y + d, z),
      iso(x + w, y, z),
    ),
    /** Грань, повернена ліворуч-вниз. Найдальша від вікна, тому найтемніша. */
    left: poly(
      iso(x, y + d, top),
      iso(x + w, y + d, top),
      iso(x + w, y + d, z),
      iso(x, y + d, z),
    ),
  };
}

/** Прямокутник, що лежить у площині задньої стіни (y = 0). */
export function onBackWall(
  x1: number,
  x2: number,
  z1: number,
  z2: number,
): string {
  return poly(iso(x1, 0, z1), iso(x2, 0, z1), iso(x2, 0, z2), iso(x1, 0, z2));
}

/** Прямокутник у площині лівої стіни (x = 0). */
export function onLeftWall(
  y1: number,
  y2: number,
  z1: number,
  z2: number,
): string {
  return poly(iso(0, y1, z1), iso(0, y2, z1), iso(0, y2, z2), iso(0, y1, z2));
}

/** Прямокутник, що лежить на підлозі (z = 0). */
export function onFloor(
  x1: number,
  x2: number,
  y1: number,
  y2: number,
): string {
  return poly(iso(x1, y1, 0), iso(x2, y1, 0), iso(x2, y2, 0), iso(x1, y2, 0));
}

/** Габарити кімнати. */
export const ROOM = { w: 11, d: 11, h: 7 } as const;
