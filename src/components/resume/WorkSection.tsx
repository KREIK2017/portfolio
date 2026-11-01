import Image from "next/image";
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

export function WorkSection({ locale }: { locale: Locale }) {
  const [featured, ...others] = PROJECTS;
  if (!featured) return null;

  return (
    <section id="work" className={styles.section} aria-labelledby="work-title">
      <div className={styles.inner}>
        <div className={styles.topline}>
          <span>{"//"} {ui.resume.workSection.dossier[locale]}</span>
          <span>01 / {String(PROJECTS.length).padStart(2, "0")}</span>
        </div>
        <div className={styles.heading}>
          <h2 id="work-title">{ui.resume.workSection.heading[locale]}</h2>
          <p>{ui.resume.workSection.introduction[locale]}</p>
        </div>

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
