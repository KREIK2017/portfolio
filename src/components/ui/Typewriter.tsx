"use client";

import { useEffect, useRef, useState } from "react";
import { usePrefersReducedMotion } from "@/lib/hooks";
import { cn } from "@/lib/utils";

interface TypewriterProps {
  text: string;
  /** Мілісекунд на символ. */
  speed?: number;
  /** Затримка перед початком набору. */
  delay?: number;
  className?: string;
  showCaret?: boolean;
  onDone?: () => void;
}

/**
 * Набирає текст посимвольно.
 *
 * Важливо: компонент не скидає прогрес при зміні пропа text —
 * викликаючий бік має давати кожній репліці власний key (у нас це
 * id голосу або id навички). Так позбуваємось скидання стану
 * всередині ефекту й зайвого ререндеру.
 */
export function Typewriter({
  text,
  speed = 26,
  delay = 0,
  className,
  showCaret = false,
  onDone,
}: TypewriterProps) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(delay === 0);
  const reduced = usePrefersReducedMotion();

  // onDone тримаємо в ref, щоб новий інлайновий колбек від батька
  // не перезапускав набір з нуля. Синхронізуємо в ефекті, а не під
  // час рендеру — запис у ref під час рендеру ламає узгодженість.
  const onDoneRef = useRef(onDone);

  useEffect(() => {
    onDoneRef.current = onDone;
  }, [onDone]);

  useEffect(() => {
    if (delay === 0) return;

    const id = window.setTimeout(() => setStarted(true), delay);
    return () => window.clearTimeout(id);
  }, [delay]);

  useEffect(() => {
    if (!started) return;

    // Рух вимкнено в системі: показуємо текст цілим, без інтервалу.
    if (reduced) {
      onDoneRef.current?.();
      return;
    }

    let shown = 0;

    const id = window.setInterval(() => {
      shown += 1;
      setCount(shown);

      if (shown >= text.length) {
        window.clearInterval(id);
        onDoneRef.current?.();
      }
    }, speed);

    return () => window.clearInterval(id);
  }, [text.length, speed, started, reduced]);

  const visible = reduced ? text.length : count;
  const done = visible >= text.length;

  return (
    <span className={cn(className, showCaret && !done && "caret")}>
      {/* Повний текст лишається в DOM для скрінрідерів і копіювання. */}
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">{text.slice(0, visible)}</span>
    </span>
  );
}
