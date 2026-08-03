"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { Grain } from "./Grain";
import { Intro } from "./Intro";
import { Room } from "./Room";
import { SkillVoices, type Voice } from "./SkillVoices";
import { AboutPanel } from "@/components/panels/AboutPanel";
import { ContactPanel } from "@/components/panels/ContactPanel";
import { CvPanel } from "@/components/panels/CvPanel";
import { ProjectsPanel } from "@/components/panels/ProjectsPanel";
import { TriviaPanel } from "@/components/panels/TriviaPanel";
import { ui } from "@/content/dictionary";
import { HOTSPOTS } from "@/content/hotspots";
import { SKILLS, SKILL_BY_ID } from "@/content/skills";
import { site } from "@/config/site";
import { localePath } from "@/lib/i18n";
import type { Hotspot, Locale, PanelId, SkillId } from "@/types/content";

const VOICE_LIFETIME = 7000;
const AMBIENT_INTERVAL = 19000;
/** Скільки тримати онбординг-підказку, якщо користувач нічого не робить. */
const HINT_LIFETIME = 11000;

const MINI_NAV: Array<{ id: PanelId; label: keyof typeof ui.nav }> = [
  { id: "projects", label: "projects" },
  { id: "about", label: "about" },
  { id: "contact", label: "contact" },
  { id: "cv", label: "cv" },
];

type Phase = "intro" | "room";
type TimeOfDay = "day" | "night";

export function Experience({ locale }: { locale: Locale }) {
  const [phase, setPhase] = useState<Phase>("intro");
  const [panel, setPanel] = useState<PanelId | null>(null);
  const [time, setTime] = useState<TimeOfDay>("day");
  const [voices, setVoices] = useState<Voice[]>([]);
  const [hintVisible, setHintVisible] = useState(true);

  const nextVoiceId = useRef(0);
  const lastText = useRef<string>("");
  const timers = useRef<number[]>([]);

  useEffect(() => {
    // Масив той самий на весь час життя компонента, тому копія
    // посилання безпечна — і потрібна, щоб cleanup не читав ref.
    const pending = timers.current;
    return () => pending.forEach(window.clearTimeout);
  }, []);

  const pushVoice = useCallback((skill: SkillId, text: string) => {
    // Той самий рядок при швидкому наведенні туди-сюди не дублюємо.
    if (text === lastText.current) return;
    lastText.current = text;

    const id = (nextVoiceId.current += 1);
    // Тримаємо максимум три репліки — далі стрічка перекриває сцену.
    setVoices((current) => [...current.slice(-2), { id, skill, text }]);

    const timer = window.setTimeout(() => {
      setVoices((current) => current.filter((voice) => voice.id !== id));
      if (lastText.current === text) lastText.current = "";
    }, VOICE_LIFETIME);

    timers.current.push(timer);
  }, []);

  /**
   * Підказка зникає сама, якщо людина просто дивиться на сцену.
   * Свідомо не зберігаємо факт показу в localStorage: ТЗ вимагає
   * зникнення після першої взаємодії, а не «раз і назавжди», і читання
   * стореджа при монтуванні дало б розбіжність гідрації.
   */
  useEffect(() => {
    if (phase !== "room" || !hintVisible) return;

    const timer = window.setTimeout(() => setHintVisible(false), HINT_LIFETIME);
    return () => window.clearTimeout(timer);
  }, [phase, hintVisible]);

  /** Періодичні репліки, поки користувач просто дивиться на кімнату. */
  useEffect(() => {
    if (phase !== "room" || panel != null) return;

    const id = window.setInterval(() => {
      const skill = SKILLS[Math.floor(Math.random() * SKILLS.length)];
      const lines = skill.lines[locale];
      pushVoice(skill.id, lines[Math.floor(Math.random() * lines.length)]);
    }, AMBIENT_INTERVAL);

    return () => window.clearInterval(id);
  }, [phase, panel, locale, pushVoice]);

  const handleHover = useCallback(
    (hotspot: Hotspot | null) => {
      if (hotspot) {
        setHintVisible(false);
        pushVoice(hotspot.voice, hotspot.line[locale]);
      }
    },
    [locale, pushVoice],
  );

  const handleSelect = useCallback(
    (id: PanelId) => {
      setHintVisible(false);
      setPanel(id);

      // При відкритті розділу говорить інша навичка, ніж при наведенні —
      // так монолог не повторюється двічі підряд.
      const spot = HOTSPOTS.find((item) => item.id === id);
      if (!spot) return;

      const others = SKILLS.filter((skill) => skill.id !== spot.voice);
      const skill = others[Math.floor(Math.random() * others.length)];
      const lines = skill.lines[locale];
      pushVoice(skill.id, lines[Math.floor(Math.random() * lines.length)]);
    },
    [locale, pushVoice],
  );

  const closePanel = useCallback(() => setPanel(null), []);
  const toggleTime = useCallback(
    () => setTime((current) => (current === "day" ? "night" : "day")),
    [],
  );

  const otherLocale: Locale = locale === "uk" ? "en" : "uk";

  return (
    <div data-time={time} className="relative min-h-dvh">
      <Grain />

      {phase === "intro" && (
        <Intro locale={locale} onEnter={() => setPhase("room")} />
      )}

      <header className="relative z-30 flex items-center justify-between px-5 py-5 sm:px-8">
        <div>
          <p className="font-display text-lg leading-none text-light">
            {site.name}
          </p>
          <p className="label mt-1 text-light/45">{site.role[locale]}</p>
        </div>

        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={toggleTime}
            className="label text-light/50 transition-colors hover:text-amber"
            aria-label={ui.dayNight[locale]}
            aria-pressed={time === "night"}
          >
            {time === "day" ? "☀" : "☾"}
          </button>

          <Link
            href={localePath(otherLocale)}
            hrefLang={otherLocale}
            className="label border border-light/20 px-3 py-2 text-light/60 transition-colors hover:border-amber/50 hover:text-amber"
          >
            {ui.langSwitch[locale]}
          </Link>
        </div>
      </header>

      {/*
        Онбординг-підказка. Раніше це був рядок під сценою — на широких
        екранах він опинявся за межами видимої області, тому людина
        просто не знала, що з кімнатою можна взаємодіяти.
      */}
      {phase === "room" && hintVisible && (
        <div
          role="status"
          className="anim-fade-up pointer-events-none absolute left-1/2 top-24 z-40 w-[min(26rem,calc(100%-2rem))] -translate-x-1/2"
        >
          <div className="pointer-events-auto flex items-start gap-3 border border-amber/40 bg-[#14120f]/95 px-4 py-3 backdrop-blur-sm">
            <p className="flex-1 text-sm leading-relaxed text-light/85">
              {ui.roomHint[locale]}
            </p>
            <button
              type="button"
              onClick={() => setHintVisible(false)}
              aria-label={ui.close[locale]}
              className="label shrink-0 text-light/40 transition-colors hover:text-amber"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      <main className="relative z-20 px-3 pb-16 sm:px-6">
        <Room
          locale={locale}
          onHover={handleHover}
          onSelect={handleSelect}
          onToggleTime={toggleTime}
          timeLabel={ui.dayNight[locale]}
        />

        {/* Мобільний фолбек: дрібні предмети важко влучити пальцем. */}
        <nav
          className="mx-auto mt-6 max-w-sm sm:hidden"
          aria-label={ui.nav.projects[locale]}
        >
          <ul className="divide-y divide-light/10 border-y border-light/10">
            {HOTSPOTS.map((spot) => {
              const skill = SKILL_BY_ID[spot.voice];

              return (
                <li key={spot.id}>
                  <button
                    type="button"
                    onClick={() => handleSelect(spot.id)}
                    className="flex w-full items-center justify-between gap-3 py-4 text-left"
                  >
                    <span className="font-display text-lg text-light/90">
                      {spot.label[locale]}
                    </span>
                    <span className="label" style={{ color: skill.color }}>
                      →
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>
      </main>

      {/*
        Постійна міні-навігація: швидкий шлях до контенту повз метафори
        кімнати. На мобільному не потрібна — там уже є список вище.
      */}
      <nav
        className="fixed bottom-6 left-6 z-30 hidden sm:block"
        aria-label={ui.nav.about[locale]}
      >
        <ul className="space-y-1.5">
          {MINI_NAV.map((item) => (
            <li key={item.id}>
              <button
                type="button"
                onClick={() => handleSelect(item.id)}
                className="label text-light/40 transition-colors hover:text-amber"
              >
                {ui.nav[item.label][locale]}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <SkillVoices voices={voices} locale={locale} />

      {panel === "projects" && (
        <ProjectsPanel locale={locale} onClose={closePanel} />
      )}
      {panel === "about" && <AboutPanel locale={locale} onClose={closePanel} />}
      {panel === "contact" && (
        <ContactPanel locale={locale} onClose={closePanel} />
      )}
      {panel === "cv" && <CvPanel locale={locale} onClose={closePanel} />}
      {panel === "trivia" && <TriviaPanel locale={locale} onClose={closePanel} />}
    </div>
  );
}
