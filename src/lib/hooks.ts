"use client";

import { useEffect, useSyncExternalStore } from "react";

const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";

function subscribeToMotionPreference(onChange: () => void) {
  const query = window.matchMedia(REDUCED_MOTION);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

function getMotionPreference() {
  return window.matchMedia(REDUCED_MOTION).matches;
}

/** На сервері анімації вважаємо дозволеними — інакше буде розбіжність гідрації. */
function getServerMotionPreference() {
  return false;
}

/**
 * Стан системної опції «зменшити рух».
 *
 * Читаємо через useSyncExternalStore, а не через useState + useEffect:
 * matchMedia — це саме зовнішнє джерело, і синхронний setState у тілі
 * ефекту спричиняв би каскадний ререндер.
 *
 * Потрібно в логіці, а не лише в CSS: правило @media не скоротить
 * інтервал typewriter'а і не зупинить кидок кубиків.
 */
export function usePrefersReducedMotion(): boolean {
  return useSyncExternalStore(
    subscribeToMotionPreference,
    getMotionPreference,
    getServerMotionPreference,
  );
}

/** Викликає handler на Escape, поки компонент змонтований. */
export function useEscape(handler: () => void): void {
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") handler();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [handler]);
}
