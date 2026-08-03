"use client";

import { useEffect, useRef } from "react";
import { paintCard, seedFrom, type BrushPalette } from "@/lib/paint/brushCard";

/**
 * Полотно з мазками під карткою стеку.
 *
 * Єдиний клієнтський елемент картки — решта (назва, опис, рівень)
 * рендериться на сервері, тому текст є в HTML і його бачить пошук.
 * Саме зображення декоративне, тож для читача екрана приховане.
 */
export function StackCardArt({
  id,
  base,
  accents,
  vignette,
}: { id: string; vignette?: number } & BrushPalette) {
  const ref = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const seed = seedFrom(id);
    let lastWidth = 0;
    let lastHeight = 0;

    const draw = () => {
      const rect = canvas.getBoundingClientRect();
      if (rect.width < 1 || rect.height < 1) return;

      // Обмежуємо DPR двійкою: на 3x полотно втричі важче,
      // а різниці на мазках не видно.
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = Math.round(rect.width * dpr);
      const height = Math.round(rect.height * dpr);

      // Перемальовуємо лише коли реально змінився розмір: інакше
      // протягування вікна викликало б перерисовку всіх карток щокадру.
      if (width === lastWidth && height === lastHeight) return;
      lastWidth = width;
      lastHeight = height;

      canvas.width = width;
      canvas.height = height;

      paintCard(ctx, { width, height, base, accents, seed, vignette });
    };

    draw();

    const observer = new ResizeObserver(draw);
    observer.observe(canvas);

    return () => observer.disconnect();
  }, [id, base, accents, vignette]);

  return <canvas ref={ref} className="stack-card__art" aria-hidden="true" />;
}
