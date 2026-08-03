"use client";

import { useEffect, useState, useSyncExternalStore } from "react";

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

/**
 * Інерційний скрол через Lenis.
 *
 * Бібліотека вантажиться динамічним імпортом, тобто не потрапляє в
 * початковий бандл кімнати, якій скрол не потрібен взагалі. При
 * увімкненому «зменшити рух» не підключається — нативний скрол
 * лишається недоторканим.
 */
export function useSmoothScroll(enabled: boolean): void {
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (!enabled || reduced) return;

    let cancelled = false;
    let instance: { raf: (time: number) => void; destroy: () => void } | null =
      null;
    let frame = 0;

    void import("lenis").then(({ default: Lenis }) => {
      if (cancelled) return;

      instance = new Lenis({ duration: 1.05 });

      const loop = (time: number) => {
        instance?.raf(time);
        frame = window.requestAnimationFrame(loop);
      };

      frame = window.requestAnimationFrame(loop);
    });

    return () => {
      cancelled = true;
      window.cancelAnimationFrame(frame);
      instance?.destroy();
    };
  }, [enabled, reduced]);
}

/**
 * Id секції, що зараз найбільше видна — для підсвічування пункту
 * навігації. IntersectionObserver замість слухача scroll: він не
 * смикає лейаут і не рахує позиції на кожен піксель.
 */
export function useActiveSection(ids: readonly string[]): string {
  const [active, setActive] = useState(ids[0] ?? "");

  useEffect(() => {
    const sections = ids
      .map((id) => document.getElementById(id))
      .filter((node): node is HTMLElement => node !== null);

    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visible) setActive(visible.target.id);
      },
      // Вікно спостереження зсунуте до верхньої третини екрана:
      // так активним стає розділ, який читають, а не той, що знизу.
      { rootMargin: "-20% 0px -60% 0px", threshold: [0.1, 0.5, 0.9] },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [ids]);

  return active;
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
