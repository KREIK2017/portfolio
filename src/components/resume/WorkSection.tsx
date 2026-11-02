"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { site } from "@/config/site";
import { ui } from "@/content/dictionary";
import { PROJECTS } from "@/content/projects";
import type { Locale, Project } from "@/types/content";
import styles from "./WorkSection.module.css";

function CaseNumber({ index, locale }: { index: number; locale: Locale }) {
  return (
    <span className={styles.caseNumber}>
      {String(index + 1).padStart(2, "0")} /{" "}
      {index === 0
        ? ui.resume.workSection.commercial[locale]
        : ui.resume.workSection.ownProject[locale]}
    </span>
  );
}

function ProjectLinks({ project, locale }: { project: Project; locale: Locale }) {
  return (
    <div className={styles.links}>
      {project.liveUrl && (
        <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
          {project.slug === "site-watch-bot"
            ? ui.resume.workSection.openBot[locale]
            : ui.resume.workSection.openSite[locale]}{" "}
          ↗
        </a>
      )}
      {project.repoUrl && (
        <a href={project.repoUrl} target="_blank" rel="noopener noreferrer">
          {ui.resume.workSection.viewCode[locale]} ↗
        </a>
      )}
    </div>
  );
}

function ProjectStack({
  project,
  locale,
  compact = false,
}: {
  project: Project;
  locale: Locale;
  compact?: boolean;
}) {
  return (
    <ul className={styles.stack} aria-label={ui.projects.stack[locale]}>
      {(compact ? project.stack.slice(0, 3) : project.stack).map((technology) => (
        <li key={technology}>{technology}</li>
      ))}
    </ul>
  );
}

function BotCover({ locale }: { locale: Locale }) {
  return (
    <div className={styles.botCover} aria-hidden="true">
      <div className={styles.botPaper}>
        <span className={styles.botHeading}>SITE WATCH BOT · TELEGRAM</span>
        <span className={styles.botMessage}>
          <small>↗ {ui.resume.workSection.botPreview[locale]}</small>
          {ui.resume.workSection.botPrice[locale]}
        </span>
        <span className={styles.botMessage}>
          <small>✓ SITE WATCH BOT</small>
          {ui.resume.workSection.botStatus[locale]}
        </span>
      </div>
    </div>
  );
}

function FeaturedCase({ project, locale }: { project: Project; locale: Locale }) {
  return (
    <li className={styles.featured}>
      <div className={styles.mobileFolderCover} aria-hidden="true"><span>{locale === "uk" ? "ДОСЬЄ" : "DOSSIER"} / 01</span><strong>{project.title[locale]}</strong></div>
      <div className={styles.featuredVisual}>
        {project.image && (
          <Image
            src={project.image}
            alt={locale === "uk" ? "Інтерактивний острів CodeUnity" : "CodeUnity interactive island"}
            width={project.imageWidth ?? 1200}
            height={project.imageHeight ?? 750}
            sizes="(max-width: 800px) 100vw, 55vw"
            loading="lazy"
          />
        )}
        <CaseNumber index={0} locale={locale} />
        <span className={styles.mobileSticker}>{locale === "uk" ? "Мова коду" : "Code language"}<strong>JavaScript</strong></span>
      </div>
      <div className={styles.featuredContent}>
        <span className={styles.kicker}>{project.year} · TuiSpace</span>
        <h3>{project.title[locale]}</h3>
        <p className={styles.featuredSummary}>{project.summary[locale]}</p>
        <div className={styles.featuredRole}>
          <span className={styles.kicker}>{ui.resume.workSection.contribution[locale]}</span>
          <p>{project.role[locale]}</p>
        </div>
        <ProjectStack project={project} locale={locale} />
        <p className={styles.featuredResult}>{project.result[locale]}</p>
        <ProjectLinks project={project} locale={locale} />
      </div>
    </li>
  );
}

function SmallCase({ project, locale, index }: { project: Project; locale: Locale; index: number }) {
  const bot = project.slug === "site-watch-bot";

  return (
    <li className={styles.smallCase}>
      <div className={styles.mobileFolderCover} aria-hidden="true"><span>{locale === "uk" ? "ДОСЬЄ" : "DOSSIER"} / {String(index + 1).padStart(2, "0")}</span><strong>{project.title[locale]}</strong></div>
      <div className={styles.smallVisual}>
        {bot ? (
          <BotCover locale={locale} />
        ) : (
          project.image && (
            <Image
              src={project.image}
              alt={locale === "uk" ? "Інтерфейс AIO Dashboard" : "AIO Dashboard interface"}
              width={project.imageWidth ?? 1200}
              height={project.imageHeight ?? 750}
              sizes="(max-width: 800px) 100vw, 45vw"
              loading="lazy"
            />
          )
        )}
        <CaseNumber index={index} locale={locale} />
        <span className={styles.mobileSticker}>{locale === "uk" ? "Мова коду" : "Code language"}<strong>TypeScript</strong></span>
      </div>
      <div className={styles.smallContent}>
        <div className={styles.smallMeta}>
          <span>{ui.resume.workSection.ownProject[locale]}</span>
          <span>{project.year}</span>
        </div>
        <h3>{project.title[locale]}</h3>
        <p className={styles.smallSummary}>{project.summary[locale]}</p>
        <p className={styles.smallRole}>
          <strong>{ui.resume.workSection.contribution[locale]}: </strong>
          {project.role[locale]}
        </p>
        <ProjectStack project={project} locale={locale} compact />
        <details className={styles.details}>
          <summary>{ui.resume.workSection.solution[locale]}</summary>
          <p>{project.result[locale]}</p>
          {project.stack.length > 3 && (
            <ul className={styles.extraStack}>
              {project.stack.slice(3).map((technology) => (
                <li key={technology}>{technology}</li>
              ))}
            </ul>
          )}
        </details>
        <ProjectLinks project={project} locale={locale} />
      </div>
    </li>
  );
}

function WorkHeading({ locale, current = 0 }: { locale: Locale; current?: number }) {
  return (
    <>
      <div className={styles.topline}>
        <span>{"//"} {ui.resume.workSection.dossier[locale]}</span>
        <span>{String(current + 1).padStart(2, "0")} / {String(PROJECTS.length).padStart(2, "0")}</span>
      </div>
      <div className={styles.heading}>
        <h2>{ui.resume.workSection.heading[locale]}</h2>
        <p>{ui.resume.workSection.introduction[locale]}</p>
      </div>
    </>
  );
}

function FolderCase({ project, locale, index, active }: { project: Project; locale: Locale; index: number; active: boolean }) {
  return (
    <article className={styles.caseBundle} data-folder={index} data-active={active} inert={!active}>
      <div className={styles.caseFolder} aria-hidden="true">
        <div className={styles.caseFolderBack}>
          <span className={styles.caseFolderTab}>{locale === "uk" ? "СПРАВА" : "CASE"} {String(index + 1).padStart(2, "0")}</span>
        </div>
        <div className={styles.caseFolderCover}>
          <span className={styles.folderStamp}>{locale === "uk" ? "КОНФІДЕНЦІЙНО" : "CONFIDENTIAL"}</span>
          <span className={styles.folderSeal}>KREIK</span>
          <span className={styles.folderDossier}>{locale === "uk" ? "ДОСЬЄ" : "DOSSIER"}</span>
          <span className={styles.folderCaseNo}>{locale === "uk" ? "СПРАВА №" : "CASE NO."} <b>{String(index + 1).padStart(2, "0")}</b></span>
          <strong className={styles.folderTitle}>{project.title[locale]}</strong>
          <span className={styles.folderCategory}>{index === 0 ? ui.resume.workSection.commercial[locale] : ui.resume.workSection.ownProject[locale]}</span>
        </div>
      </div>
      <div className={styles.projectSheet}>
        <span className={styles.sheetCaseLabel}>{locale === "uk" ? "СПРАВА №" : "CASE NO."} {String(index + 1).padStart(2, "0")} / {project.year}</span>
        <div className={styles.sheetBody}>
          <p className={styles.sheetLine}><span>{locale === "uk" ? "Назва:" : "Name:"}</span><strong>{project.title[locale]}</strong></p>
          <p className={styles.sheetLine}><span>{locale === "uk" ? "Категорія:" : "Category:"}</span>{index === 0 ? ui.resume.workSection.commercial[locale] : ui.resume.workSection.ownProject[locale]}</p>
          <ProjectStack project={project} locale={locale} compact />
          <p className={styles.sheetSummary}>{project.summary[locale]}</p>
          <p className={styles.sheetRole}><strong>{ui.resume.workSection.contribution[locale]}:</strong> {project.role[locale]}</p>
          <ProjectLinks project={project} locale={locale} />
        </div>
      </div>
      <div className={styles.projectPhoto}>
        {project.slug === "site-watch-bot" ? <BotCover locale={locale} /> : project.image && (
          <Image
            src={project.image}
            alt={project.slug === "codeunity" ? (locale === "uk" ? "Інтерактивний острів CodeUnity" : "CodeUnity interactive island") : (locale === "uk" ? "Інтерфейс AIO Dashboard" : "AIO Dashboard interface")}
            width={project.imageWidth ?? 1200}
            height={project.imageHeight ?? 750}
            sizes="(max-width: 1200px) 45vw, 550px"
            loading="lazy"
          />
        )}
        <span className={styles.folderImageLabel}>{project.year} / {index === 0 ? "TUISPACE" : "KREIK"}</span>
      </div>
      <span className={styles.languageSticker}>
        <small>{locale === "uk" ? "Мова коду:" : "Code language:"}</small>
        <strong>{project.slug === "codeunity" ? "JavaScript" : "TypeScript"}</strong>
      </span>
    </article>
  );
}

function FolderStack({ locale }: { locale: Locale }) {
  const region = useRef<HTMLDivElement>(null);
  const selectCase = useRef<(index: number) => void>(() => {});
  const [active, setActive] = useState(0);

  useEffect(() => {
    const element = region.current;
    if (!element) return;
    let frame = 0;
    const cards = [...element.querySelectorAll<HTMLElement>("[data-folder]")];
    let selected = -1;
    let carousel = false;
    let scrollFrame = 0;
    const clamp = (value: number) => Math.min(1, Math.max(0, value));
    const paint = (card: HTMLElement, phase: number) => {
        const landing = clamp(phase / 0.4);
        const easedLanding = 1 - (1 - landing) ** 2;
        const impact = phase > 0.4 && phase < 0.52 ? Math.sin(((phase - 0.4) / 0.12) * Math.PI) : 0;
        const sheet = clamp((phase - 0.62) / 0.25);
        const photo = clamp((phase - 0.72) / 0.2);
        const sticker = clamp((phase - 0.84) / 0.16);
        card.style.setProperty("--case-x", `${(145 * (1 - easedLanding)).toFixed(2)}%`);
        card.style.setProperty("--case-y", `${(115 * (1 - easedLanding) - 10 * Math.sin(Math.PI * landing) + 7 * impact).toFixed(2)}%`);
        card.style.setProperty("--case-opacity", `${clamp(phase * 9).toFixed(3)}`);
        card.style.setProperty("--case-rotation", `${(14 * (1 - easedLanding) - 3 * impact).toFixed(2)}deg`);
        const coverLift = Math.sin(Math.PI * clamp((phase - 0.5) / 0.5));
        card.style.setProperty("--case-open", `${(coverLift * 72).toFixed(2)}deg`);
        card.style.setProperty("--sheet-x", `${(92 * (1 - sheet)).toFixed(2)}%`);
        card.style.setProperty("--sheet-y", `${(-8 * Math.sin(Math.PI * sheet)).toFixed(2)}%`);
        card.style.setProperty("--sheet-scale", `${(0.22 + 0.78 * sheet).toFixed(3)}`);
        card.style.setProperty("--sheet-rotation", `${(8 * (1 - sheet)).toFixed(2)}deg`);
        card.style.setProperty("--sheet-opacity", `${clamp(sheet * 5).toFixed(3)}`);
        card.style.setProperty("--photo-x", `${(107 * (1 - photo)).toFixed(2)}%`);
        card.style.setProperty("--photo-y", `${(64 * (1 - photo) - 9 * Math.sin(Math.PI * photo)).toFixed(2)}%`);
        card.style.setProperty("--photo-scale", `${(0.3 + 0.7 * photo).toFixed(3)}`);
        card.style.setProperty("--photo-rotation", `${(-7 * (1 - photo)).toFixed(2)}deg`);
        card.style.setProperty("--photo-opacity", `${clamp(photo * 5).toFixed(3)}`);
        card.style.setProperty("--sticker-x", `${(300 * (1 - sticker)).toFixed(2)}%`);
        card.style.setProperty("--sticker-y", `${(820 * (1 - sticker) - 20 * Math.sin(Math.PI * sticker)).toFixed(2)}%`);
        card.style.setProperty("--sticker-rotation", `${(-25 * (1 - sticker) + 4 * sticker).toFixed(2)}deg`);
        card.style.setProperty("--sticker-opacity", `${clamp(sticker * 3).toFixed(3)}`);
    };
    const openCase = (index: number) => {
      if (index === selected || !cards[index]) return;
      selected = index;
      window.cancelAnimationFrame(frame);
      cards.forEach((card, cardIndex) => {
        card.style.setProperty("--case-retire", String(Number(cardIndex === index)));
      });
      const card = cards[index];
      paint(card, 0);
      setActive(index);
      const start = performance.now();
      const animate = (now: number) => {
        const phase = clamp((now - start) / 2300);
        paint(card, phase);
        if (phase < 1) frame = window.requestAnimationFrame(animate);
      };
      frame = window.requestAnimationFrame(animate);
    };
    const updateFromScroll = () => {
      scrollFrame = 0;
      if (carousel || !window.matchMedia("(min-width: 1024px) and (min-height: 540px) and (prefers-reduced-motion: no-preference)").matches) return;
      const bounds = element.getBoundingClientRect();
      const offset = Math.max(0, -bounds.top / window.innerHeight);
      const phases = [0.3, 1.9, 3.5].map((start) => clamp((offset - start) / 1.25));
      const current = offset >= 3.55 ? 2 : offset >= 1.95 ? 1 : 0;
      cards.forEach((card, index) => {
        paint(card, phases[index]);
        const nextPhase = phases[index + 1] ?? 0;
        card.style.setProperty("--case-retire", String(1 - clamp((nextPhase - 0.04) / 0.22)));
      });
      if (selected !== current) {
        selected = current;
        setActive(current);
      }
      // Once the first pass leaves the stage, remove the long scroll track.
      // Compensate the scroll position so the following content stays in place.
      if (bounds.bottom <= window.innerHeight && phases.every((phase) => phase === 1)) {
        const oldHeight = element.offsetHeight;
        element.dataset.carousel = "true";
        carousel = true;
        const removedHeight = oldHeight - element.offsetHeight;
        window.scrollTo({ top: window.scrollY - removedHeight, behavior: "instant" });
        cards.forEach((card, index) => card.style.setProperty("--case-retire", String(Number(index === current))));
      }
    };
    const schedule = () => {
      if (!scrollFrame) scrollFrame = window.requestAnimationFrame(updateFromScroll);
    };
    selectCase.current = (index) => {
      if (carousel) {
        openCase(index);
      } else {
        const top = element.getBoundingClientRect().top + window.scrollY;
        window.scrollTo({ top: top + [1.65, 3.25, 4.85][index] * window.innerHeight, behavior: "smooth" });
      }
    };
    updateFromScroll();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      window.cancelAnimationFrame(frame);
      window.cancelAnimationFrame(scrollFrame);
      selectCase.current = () => {};
    };
  }, []);

  return (
    <div className={styles.scrollRegion} ref={region}>
      <div className={styles.stickyStage}>
        <div className={styles.inner}>
          <WorkHeading locale={locale} current={active} />
          <div className={styles.folderDesk}>
            {PROJECTS.map((project, index) => <FolderCase key={project.slug} project={project} locale={locale} index={index} active={active === index} />)}
          </div>
          <nav className={styles.folderNav} aria-label={locale === "uk" ? "Вибрати справу" : "Select a case"}>
            <button className={styles.carouselArrow} type="button" onClick={() => selectCase.current((active + PROJECTS.length - 1) % PROJECTS.length)} aria-label={locale === "uk" ? "Попередня справа" : "Previous case"}>←</button>
            {PROJECTS.map((project, index) => (
              <button key={project.slug} type="button" onClick={() => selectCase.current(index)} aria-current={active === index ? "step" : undefined}>
                <span>{String(index + 1).padStart(2, "0")}</span> {project.title[locale]}
              </button>
            ))}
            <button className={styles.carouselArrow} type="button" onClick={() => selectCase.current((active + 1) % PROJECTS.length)} aria-label={locale === "uk" ? "Наступна справа" : "Next case"}>→</button>
          </nav>
        </div>
      </div>
    </div>
  );
}

export function WorkSection({ locale }: { locale: Locale }) {
  const [featured, ...others] = PROJECTS;
  if (!featured) return null;

  return (
    <section id="work" className={styles.section} aria-label={ui.resume.workSection.heading[locale]}>
      <FolderStack locale={locale} />
      <div className={`${styles.inner} ${styles.staticCases}`}>
        <WorkHeading locale={locale} />

        <ul className={styles.featuredList}>
          <FeaturedCase project={featured} locale={locale} />
        </ul>

        <div className={styles.subhead} aria-hidden="true">
          {ui.resume.workSection.otherCases[locale]}
        </div>
        <ul className={styles.otherList}>
          {others.map((project, index) => (
            <SmallCase key={project.slug} project={project} locale={locale} index={index + 1} />
          ))}
        </ul>
        <span className={styles.folio} aria-hidden="true">
          {site.handle} / SELECTED WORK · 01
        </span>
      </div>
    </section>
  );
}
