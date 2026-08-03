/**
 * Процедурний генератор мазків для картки стеку.
 *
 * Чистий алгоритм: приймає 2D-контекст і палітру, більше нічого про
 * сторінку не знає. Тому його можна викликати і з React-компонента, і з
 * Node-скрипта, якщо колись захочемо запікати текстури під час збірки.
 *
 * Порядок шарів повторює олійний живопис: підмальовок → мазки →
 * патьоки → вінʼєтка → зерно → рваний кут.
 */

export interface BrushPalette {
  /** Підмальовок — найтемніший тон, на якому лежить усе інше. */
  base: string;
  /** Кольори мазків. Що більше відтінків, то живіша поверхня. */
  accents: readonly string[];
}

export interface PaintCardOptions extends BrushPalette {
  width: number;
  height: number;
  /** Однакове значення завжди дає однаковий малюнок. */
  seed: number;
  /**
   * Сила затемнення до країв, 0–1. Світлій картці потрібна слабша:
   * стандартні 0.55 перетворили б папір на брудно-сірий.
   */
  vignette?: number;
}

/** Розмір, під який підбиралися всі числові константи. */
const REFERENCE_SIDE = 212;
const GRAIN_TILE = 128;

/** Детермінований PRNG — щоб картки не перемальовувалися при кожному візиті. */
function mulberry32(seed: number): () => number {
  let a = seed >>> 0;

  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Рядок → число, щоб id технології можна було віддати як seed. */
export function seedFrom(value: string): number {
  let hash = 2166136261;

  for (let i = 0; i < value.length; i += 1) {
    hash ^= value.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }

  return hash >>> 0;
}

/**
 * Плитка зерна робиться один раз на весь застосунок.
 *
 * Оригінальний прийом — getImageData по всій картці й прохід по кожному
 * пікселю. На дванадцяти картках це мільйони ітерацій у момент
 * завантаження й помітний фриз. Одна плитка 128×128, розмножена
 * патерном, дає той самий вигляд за пару десятків тисяч ітерацій.
 */
let grainTile: HTMLCanvasElement | null = null;

function getGrainTile(): HTMLCanvasElement | null {
  if (grainTile) return grainTile;
  if (typeof document === "undefined") return null;

  const tile = document.createElement("canvas");
  tile.width = GRAIN_TILE;
  tile.height = GRAIN_TILE;

  const tileCtx = tile.getContext("2d");
  if (!tileCtx) return null;

  const image = tileCtx.createImageData(GRAIN_TILE, GRAIN_TILE);
  const data = image.data;
  const random = mulberry32(0x9e3779b9);

  for (let i = 0; i < data.length; i += 4) {
    // Сірий навколо 128: у режимі overlay такий тон не зсуває колір,
    // а лише додає дрібну нерівність.
    const value = 128 + (random() - 0.5) * 46;
    data[i] = value;
    data[i + 1] = value;
    data[i + 2] = value;
    data[i + 3] = 255;
  }

  tileCtx.putImageData(image, 0, 0);
  grainTile = tile;

  return tile;
}

export function paintCard(
  ctx: CanvasRenderingContext2D,
  { width, height, base, accents, seed, vignette = 0.55 }: PaintCardOptions,
): void {
  const random = mulberry32(seed);
  /*
    Усі константи підбиралися для картки 212px. Множник тримає вигляд
    незмінним і на retina, і на широкій колонці — без нього мазки на
    подвоєному полотні стають удвічі дрібнішими.
  */
  const scale = Math.min(width, height) / REFERENCE_SIDE;
  const pick = () => accents[Math.floor(random() * accents.length)];

  // Canvas 2D filter зʼявився в Safari лише в 16.4 — якщо його немає,
  // малюємо без розмиття: краї мазків жорсткіші, але картка не ламається.
  const canBlur = typeof ctx.filter === "string";

  ctx.clearRect(0, 0, width, height);

  ctx.fillStyle = base;
  ctx.fillRect(0, 0, width, height);

  /* ── Мазки: розмиті витягнуті плями ─────────────────────────────── */
  for (let i = 0; i < 90; i += 1) {
    ctx.save();
    // Верхні три чверті густіше: унизу картки буде текст.
    ctx.translate(random() * width, random() * height * 0.75);
    ctx.rotate(((random() * 60 - 30) * Math.PI) / 180);
    ctx.globalAlpha = 0.08 + random() * 0.22;
    if (canBlur) ctx.filter = `blur(${(4 + random() * 10) * scale}px)`;
    ctx.fillStyle = pick();

    ctx.beginPath();
    ctx.ellipse(
      0,
      0,
      (8 + random() * 22) * scale,
      (30 + random() * 110) * scale,
      0,
      0,
      Math.PI * 2,
    );
    ctx.fill();
    ctx.restore();
  }

  /* ── Патьоки: стікають вниз, розчиняючись ───────────────────────── */
  for (let i = 0; i < 10; i += 1) {
    const x = random() * width;
    const startY = random() * height * 0.5;
    const dropHeight = (60 + random() * 160) * scale;
    const color = pick();

    const gradient = ctx.createLinearGradient(x, startY, x, startY + dropHeight);
    gradient.addColorStop(0, `${color}55`);
    gradient.addColorStop(1, `${color}00`);

    ctx.strokeStyle = gradient;
    ctx.lineWidth = (2 + random() * 5) * scale;
    ctx.beginPath();
    ctx.moveTo(x, startY);
    ctx.quadraticCurveTo(
      x + (random() * 10 - 5) * scale,
      startY + dropHeight * 0.6,
      x + (random() * 6 - 3) * scale,
      startY + dropHeight,
    );
    ctx.stroke();
  }

  /* ── Вінʼєтка ───────────────────────────────────────────────────── */
  const edgeShade = ctx.createRadialGradient(
    width / 2,
    height * 0.4,
    width * 0.2,
    width / 2,
    height * 0.5,
    width * 0.8,
  );
  edgeShade.addColorStop(0, "rgba(0,0,0,0)");
  edgeShade.addColorStop(1, `rgba(0,0,0,${vignette})`);
  ctx.fillStyle = edgeShade;
  ctx.fillRect(0, 0, width, height);

  /* ── Зерно ──────────────────────────────────────────────────────── */
  const tile = getGrainTile();
  if (tile) {
    const pattern = ctx.createPattern(tile, "repeat");

    if (pattern) {
      ctx.save();
      ctx.globalCompositeOperation = "overlay";
      ctx.globalAlpha = 0.4;
      ctx.fillStyle = pattern;
      ctx.fillRect(0, 0, width, height);
      ctx.restore();
    }
  }

  /* ── Рваний кут ─────────────────────────────────────────────────── */
  /*
    В оригіналі кут заливався кольором паперу. Це прив'язує картку до
    одного фону: на іншій секції підробка стала б помітною. Тут кут
    навпаки вирізається в прозорість, тому крізь нього видно справжнє
    тло сторінки, яким би воно не було.
  */
  ctx.save();
  ctx.globalCompositeOperation = "destination-out";
  ctx.beginPath();
  ctx.moveTo(width * 0.72, 0);

  let tearX = width * 0.72;
  let tearY = 0;
  const tearLimit = height * 0.28;

  while (tearX < width || tearY < tearLimit) {
    tearX += random() * 14 * scale;
    tearY += random() * 10 * scale;
    ctx.lineTo(Math.min(tearX, width), Math.min(tearY, tearLimit));
  }

  ctx.lineTo(width, 0);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}
