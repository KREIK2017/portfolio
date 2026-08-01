"use client";

import { useRef, useState } from "react";
import type { AudioTrack } from "@/types/project";

/**
 * Єдиний клієнтський компонент на сторінці проєкту.
 * Решта сторінки залишається статичним HTML без JS.
 *
 * Свідомо використовуємо нативні <audio controls>: браузер сам дає
 * доступність, керування з клавіатури та системні медіа-кнопки.
 * Наша логіка лише гарантує, що одночасно грає один трек.
 */
export function AudioPlayer({ tracks }: { tracks: AudioTrack[] }) {
  const refs = useRef<Array<HTMLAudioElement | null>>([]);
  const [playing, setPlaying] = useState<number | null>(null);

  if (tracks.length === 0) return null;

  function handlePlay(index: number) {
    refs.current.forEach((audio, i) => {
      if (i !== index) audio?.pause();
    });
    setPlaying(index);
  }

  return (
    <section className="mt-14">
      <h2 className="mb-5 text-xl font-semibold tracking-tight">Аудіо</h2>

      <ul className="space-y-3">
        {tracks.map((track, index) => (
          <li
            key={track.src}
            className="border-border bg-surface rounded-lg border p-4"
          >
            <p className="mb-3 flex items-center gap-2 text-sm font-medium">
              {playing === index && (
                <span
                  className="bg-accent inline-block size-1.5 rounded-full"
                  aria-hidden="true"
                />
              )}
              {track.title}
            </p>

            <audio
              ref={(element) => {
                refs.current[index] = element;
              }}
              onPlay={() => handlePlay(index)}
              onPause={() => setPlaying((current) => (current === index ? null : current))}
              controls
              preload="metadata"
              className="w-full"
            >
              <source src={track.src} />
              Твій браузер не підтримує відтворення аудіо.
            </audio>
          </li>
        ))}
      </ul>
    </section>
  );
}
