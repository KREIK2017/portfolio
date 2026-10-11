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
import { resumePath, roomPath, writeMode } from "@/lib/mode";
import type { Hotspot, Locale, PanelId, SkillId } from "@/types/content";

const VOICE_LIFETIME = 7000;
const AMBIENT_INTERVAL = 19000;
/** Скільки тримати онбординг-підказку, якщо користувач нічого не робить. */
const HINT_LIFETIME = 11000;

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

  /**
   * Запамʼятовуємо вибір: наступний візит у корінь приведе одразу
   * сюди, а не в résumé. Редирект в інший бік робить сама Resume.
   */
  useEffect(() => {
    writeMode("room");
  }, []);

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
  const roomCopy = {
    chapter: locale === "uk" ? "Внутрішня кімната · 04:17" : "Inner room · 04:17",
    title: locale === "uk" ? "МАЙСТЕРНЯ KREIK" : "KREIK'S WORKSHOP",
    subtitle:
      locale === "uk"
        ? "Пʼять предметів. Чотири проєкти. Один розробник, який усе ще не спить."
        : "Five objects. Four projects. One developer who is still awake.",
    objects: locale === "uk" ? "ОБʼЄКТИ СПРАВИ" : "CASE OBJECTS",
    status: locale === "uk" ? "СЦЕНА АКТИВНА" : "SCENE ACTIVE",
  };

  return (
    <div data-time={time} className="room-experience relative min-h-dvh overflow-hidden">
      <Grain />

      {phase === "intro" && (
        <Intro locale={locale} onEnter={() => setPhase("room")} />
      )}

      <header className="relative z-30 flex items-start justify-between gap-4 border-b border-light/10 px-4 py-4 sm:px-7">
        <div className="flex items-start gap-3">
          <span className="mt-0.5 block size-2 rotate-45 bg-terracotta shadow-[0_0_16px_var(--de-terracotta)]" />
          <div>
            <p className="label text-terracotta">{roomCopy.chapter}</p>
            <p className="mt-1 font-display text-lg leading-none text-light sm:text-xl">
              {site.name[locale]}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-end gap-2 sm:gap-3">
          {/* Вихід у спокійну версію — завжди видимий, як вимагає ТЗ 2.1 */}
          <Link
            href={resumePath(locale)}
            onClick={() => writeMode("resume")}
            className="label inline-flex min-h-11 items-center border border-light/10 px-3 text-light/65 transition-colors hover:border-amber/50 hover:text-amber"
          >
            {ui.resume.toResume[locale]} →
          </Link>

          <button
            type="button"
            onClick={toggleTime}
            className="label inline-flex size-11 items-center justify-center border border-light/10 text-light/65 transition-colors hover:border-amber/50 hover:text-amber"
            aria-label={ui.dayNight[locale]}
            aria-pressed={time === "night"}
          >
            {time === "day" ? "☀" : "☾"}
          </button>

          <Link
            href={roomPath(otherLocale)}
            hrefLang={otherLocale}
            className="label inline-flex min-h-11 items-center border border-light/10 px-3 text-light/65 transition-colors hover:border-amber/50 hover:text-amber"
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
          className="anim-fade-up pointer-events-none relative z-40 mx-auto mt-4 w-[min(36rem,calc(100%-2rem))]"
        >
          <div className="pointer-events-auto flex items-start gap-3 border border-amber/40 bg-[#14120f]/95 px-4 py-3 shadow-2xl backdrop-blur-sm">
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

      <main className="relative z-20 px-3 pb-8 pt-4 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-[96rem] gap-5 lg:grid-cols-[13rem_minmax(0,1fr)_13rem] lg:items-center">
          <aside className="order-2 hidden lg:block">
            <p className="label text-terracotta">{roomCopy.objects}</p>
            <div className="mt-3 h-px bg-gradient-to-r from-terracotta/70 to-transparent" />
            <nav className="mt-3" aria-label={ui.nav.about[locale]}>
              <ol className="space-y-1">
                {HOTSPOTS.map((spot, index) => {
                  const skill = SKILL_BY_ID[spot.voice];
                  return (
                    <li key={spot.id}>
                      <button
                        type="button"
                        onClick={() => handleSelect(spot.id)}
                        className="group flex min-h-11 w-full items-center gap-3 border-b border-light/10 text-left"
                      >
                        <span className="font-condensed text-xs text-light/25">
                          0{index + 1}
                        </span>
                        <span className="font-display text-base text-light/65 transition-colors group-hover:text-light">
                          {spot.label[locale]}
                        </span>
                        <span className="ml-auto" style={{ color: skill.color }}>↗</span>
                      </button>
                    </li>
                  );
                })}
              </ol>
            </nav>
          </aside>

          <section className="room-stage order-1 lg:order-2" aria-labelledby="room-title">
            <div className="room-stage__caption">
              <div>
                <p className="label text-terracotta">{roomCopy.status}</p>
                <h1 id="room-title" className="mt-1 font-display text-2xl text-light sm:text-4xl">
                  {roomCopy.title}
                </h1>
              </div>
              <p className="hidden max-w-sm text-right text-sm leading-relaxed text-light/45 md:block">
                {roomCopy.subtitle}
              </p>
            </div>

            <Room
              locale={locale}
              onHover={handleHover}
              onSelect={handleSelect}
              onToggleTime={toggleTime}
              timeLabel={ui.dayNight[locale]}
            />

            <span className="room-stage__coordinate room-stage__coordinate--left">X 04.17</span>
            <span className="room-stage__coordinate room-stage__coordinate--right">Y 20.26</span>
          </section>

          <aside className="order-3 hidden lg:block">
            <p className="label text-teal">SYSTEM / OBSERVATION</p>
            <p className="mt-4 font-display text-2xl leading-tight text-light/85">
              {locale === "uk" ? "Кімната памʼятає більше, ніж резюме." : "The room remembers more than the résumé."}
            </p>
            <p className="mt-4 text-sm leading-relaxed text-light/45">
              {locale === "uk"
                ? "Наведи курсор на предмет. Голоси підкажуть, що він приховує."
                : "Hover an object. The voices will tell you what it hides."}
            </p>
            <div className="mt-6 border-l border-teal/50 pl-3">
              <p className="label text-light/30">AMBIENT</p>
              <p className="mt-1 text-sm text-light/60">
                {time === "day" ? (locale === "uk" ? "холодне світло" : "cold daylight") : (locale === "uk" ? "лампа й тиша" : "lamp and silence")}
              </p>
            </div>
          </aside>
        </div>

        {/* Мобільний фолбек: дрібні предмети важко влучити пальцем. */}
        <nav
          className="mx-auto mt-5 max-w-xl lg:hidden"
          aria-label={ui.nav.projects[locale]}
        >
          <p className="label mb-3 text-terracotta">{roomCopy.objects}</p>
          <ul className="grid gap-2 sm:grid-cols-2">
            {HOTSPOTS.map((spot, index) => {
              const skill = SKILL_BY_ID[spot.voice];

              return (
                <li key={spot.id}>
                  <button
                    type="button"
                    onClick={() => handleSelect(spot.id)}
                    className="flex min-h-14 w-full items-center justify-between gap-3 border border-light/10 bg-light/[0.025] px-3 py-3 text-left"
                  >
                    <span className="flex items-center gap-3">
                      <span className="font-condensed text-xs text-light/25">0{index + 1}</span>
                      <span className="font-display text-lg text-light/90">{spot.label[locale]}</span>
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
