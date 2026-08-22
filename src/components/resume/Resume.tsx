"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { SECTIONS, Sidebar } from "./Sidebar";
import { StackCard } from "./StackCard";
import { LivingOilFilter } from "@/components/ui/LivingOilFilter";
import { ui } from "@/content/dictionary";
import { PROJECTS } from "@/content/projects";
import { ATTRIBUTES, MAX_SKILL_LEVEL, skillsOf } from "@/content/skills";
import { STACK, STACK_POINTS } from "@/content/stack";
import { site } from "@/config/site";
import { useActiveSection, useSmoothScroll } from "@/lib/hooks";
import { readMode, resumePath, roomPath, writeMode } from "@/lib/mode";
import { cn } from "@/lib/utils";
import type { Locale } from "@/types/content";

function Grain() {
  return (
    <svg className="grain-light" aria-hidden="true" focusable="false">
      <filter id="paperGrain">
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.9"
          numOctaves="3"
          stitchTiles="stitch"
        />
        <feColorMatrix type="saturate" values="0" />
      </filter>
      <rect width="100%" height="100%" filter="url(#paperGrain)" />
    </svg>
  );
}

function Section({
  id,
  eyebrow,
  title,
  children,
  className,
}: {
  id: string;
  eyebrow: string;
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      id={id}
      className={cn("scroll-mt-8 px-5 py-16 sm:px-10 lg:px-14", className)}
    >
      <p className="rs-label text-rs-accent">{eyebrow}</p>
      <h2 className="rs-title mt-2 text-4xl sm:text-6xl">{title}</h2>
      <div className="mt-8">{children}</div>
    </section>
  );
}

function Stats({ locale }: { locale: Locale }) {
  return (
    <dl className="grid grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-4">
      {site.stats.map((stat) => (
        <div key={stat.label[locale]} className="border-rs-line border-t pt-3">
          <dt className="rs-label text-rs-muted">{stat.label[locale]}</dt>
          <dd className="mt-1">
            {stat.value ? (
              <>
                <span className="rs-title text-3xl tabular-nums">
                  {stat.value}
                </span>
                <span className="rs-label text-rs-muted ml-2">
                  {stat.note[locale]}
                </span>
              </>
            ) : (
              <span className="rs-label text-rs-accent text-[0.8rem]">
                {stat.note[locale]}
              </span>
            )}
          </dd>
        </div>
      ))}
    </dl>
  );
}

export function Resume({ locale }: { locale: Locale }) {
  const active = useActiveSection(SECTIONS);
  const router = useRouter();
  useSmoothScroll(true);

  /**
   * Résumé — режим за замовчуванням, тому воно й лежить у корені.
   * Але якщо минулого разу людина обрала кімнату — ведемо туди.
   * Перевірка можлива лише на клієнті: у статичному експорті немає
   * сервера, який прочитав би cookie до віддачі HTML.
   */
  useEffect(() => {
    if (readMode() === "room") {
      router.replace(roomPath(locale));
      return;
    }

    writeMode("resume");
  }, [router, locale]);

  const otherLocale: Locale = locale === "uk" ? "en" : "uk";
  const gridItems = STACK.filter((item) => item.group !== "ai");
  const aiItem = STACK.find((item) => item.group === "ai");

  return (
    <div className="bg-rs-paper text-rs-ink min-h-dvh">
      <Grain />
      {/* Оголошується один раз на сторінку, застосовується в CSS
          до полотна кожної картки через filter: url(#livingOil). */}
      <LivingOilFilter />
      <Sidebar locale={locale} active={active} />

      <div className="pb-24 sm:pb-0 sm:pl-20">
        {/* Перемикачі режиму й мови — завжди доступні, як вимагає ТЗ */}
        <div className="border-rs-line flex items-center justify-end gap-3 border-b px-5 py-3 sm:px-10">
          <Link
            href={resumePath(otherLocale)}
            hrefLang={otherLocale}
            className="rs-label text-rs-muted hover:text-rs-ink transition-colors"
          >
            {ui.langSwitch[locale]}
          </Link>
          <span aria-hidden="true" className="bg-rs-line h-4 w-px" />
          <Link
            href={roomPath(locale)}
            onClick={() => writeMode("room")}
            className="rs-label text-rs-accent hover:underline"
          >
            {ui.resume.toRoom[locale]} →
          </Link>
        </div>

        {/* ── Головна ─────────────────────────────────────────────── */}
        <section
          id="home"
          className="grid gap-8 px-5 pb-14 pt-12 sm:px-10 lg:grid-cols-[1fr_1.1fr] lg:items-center lg:px-14"
        >
          <div>
            <p className="rs-label text-rs-accent">
              {ui.resume.hero.eyebrow[locale]}
            </p>
            <h1 className="rs-title mt-3 text-5xl sm:text-7xl">
              {site.name[locale]}
            </h1>
            <p className="rs-label text-rs-muted mt-3 text-sm">
              {site.role[locale]}
            </p>

            <p className="mt-6 max-w-md leading-relaxed">
              {site.tagline[locale]}
            </p>

            <a
              href="#work"
              className="rs-label text-rs-accent mt-7 inline-flex items-center gap-2 hover:underline"
            >
              {ui.resume.workSection.cta[locale]} →
            </a>

            <figure className="border-rs-line mt-8 max-w-md border-l-2 pl-4">
              <blockquote className="text-sm italic leading-relaxed">
                {site.quip.text[locale]}
              </blockquote>
              <figcaption className="rs-label text-rs-muted mt-2 text-[0.62rem]">
                {site.quip.author[locale]}
              </figcaption>
            </figure>
          </div>

          <div className="border-rs-line overflow-hidden border">
            <Image
              src="/img/hero.webp"
              alt={ui.resume.hero.photoAlt[locale]}
              width={1280}
              height={853}
              priority
              sizes="(max-width: 1024px) 100vw, 55vw"
              className="h-auto w-full"
            />
          </div>
        </section>

        <div className="px-5 sm:px-10 lg:px-14">
          <Stats locale={locale} />
        </div>

        {/* ── Про мене ────────────────────────────────────────────── */}
        <Section
          id="about"
          eyebrow={ui.resume.aboutSection.eyebrow[locale]}
          title={ui.resume.aboutSection.title[locale]}
        >
          <div className="max-w-2xl space-y-4">
            {site.bio[locale].map((paragraph) => (
              <p key={paragraph} className="leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>

          <p className="rs-label text-rs-accent mt-10">
            {ui.resume.aboutSection.voices[locale]}
          </p>

          <div className="mt-5 grid gap-8 sm:grid-cols-3">
            {ATTRIBUTES.map((attribute) => (
              <div key={attribute.id}>
                <p
                  className="rs-label border-rs-line border-b pb-2"
                  style={{
                    color: `color-mix(in srgb, ${attribute.color} 60%, #1a1815)`,
                  }}
                >
                  {attribute.name[locale]}
                </p>

                <ul className="mt-3 space-y-3">
                  {skillsOf(attribute.id).map((skill) => (
                    <li key={skill.id}>
                      <div className="flex items-center justify-between gap-3">
                        <span className="rs-label text-[0.68rem]">
                          {skill.name[locale]}
                        </span>
                        <span className="flex items-center gap-1">
                          {Array.from({ length: MAX_SKILL_LEVEL }, (_, i) => (
                            <span
                              key={i}
                              className={cn(
                                "size-[6px] rotate-45 border border-[#1a1815]/50",
                                i < skill.level && "bg-[#1a1815]/75",
                              )}
                            />
                          ))}
                        </span>
                      </div>
                      <p className="text-rs-muted mt-1 text-[0.8rem] leading-snug">
                        {skill.blurb[locale]}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Section>

        {/* ── Роботи ──────────────────────────────────────────────── */}
        <Section
          id="work"
          eyebrow={ui.resume.workSection.eyebrow[locale]}
          title={ui.resume.workSection.title[locale]}
          className="bg-rs-paper-2/60"
        >
          <ul className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {PROJECTS.map((project) => (
              <li
                key={project.slug}
                className="border-rs-line bg-rs-paper flex flex-col border"
              >
                {project.image && (
                  <Image
                    src={project.image}
                    alt={project.title[locale]}
                    width={1200}
                    height={750}
                    className="h-auto w-full"
                  />
                )}

                <div className="flex flex-1 flex-col p-5">
                  <div className="flex items-baseline justify-between gap-3">
                    <h3 className="rs-title text-xl">{project.title[locale]}</h3>
                    <span className="rs-label text-rs-accent shrink-0">
                      {project.year}
                    </span>
                  </div>

                  <p className="text-rs-muted mt-2 flex-1 text-sm leading-relaxed">
                    {project.summary[locale]}
                  </p>

                  <p className="rs-label text-rs-muted mt-4 text-[0.6rem]">
                    {ui.projects.role[locale]}
                  </p>
                  <p className="text-sm">{project.role[locale]}</p>

                  <ul className="mt-4 flex flex-wrap gap-1.5">
                    {project.stack.map((tech) => (
                      <li
                        key={tech}
                        className="rs-label border-rs-line text-rs-muted border px-2 py-1 text-[0.58rem]"
                      >
                        {tech}
                      </li>
                    ))}
                  </ul>

                  <p className="border-rs-line mt-4 border-t pt-3 text-sm leading-relaxed">
                    {project.result[locale]}
                  </p>

                  {(project.liveUrl || project.repoUrl) && (
                    <div className="mt-4 flex flex-wrap gap-4">
                      {project.liveUrl && (
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noreferrer noopener"
                          className="rs-label text-rs-accent hover:underline"
                        >
                          {ui.projects.live[locale]} ↗
                        </a>
                      )}
                      {project.repoUrl && (
                        <a
                          href={project.repoUrl}
                          target="_blank"
                          rel="noreferrer noopener"
                          className="rs-label text-rs-muted hover:text-rs-ink transition-colors"
                        >
                          {ui.projects.repo[locale]} ↗
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </Section>

        {/* ── Стек ────────────────────────────────────────────────── */}
        <Section
          id="stack"
          eyebrow={ui.resume.stackSection.eyebrow[locale]}
          title={ui.resume.stackSection.title[locale]}
        >
          <div className="flex flex-wrap items-end justify-between gap-4">
            <p className="max-w-md leading-relaxed">
              {ui.resume.stackSection.intro[locale]}
            </p>
            <p className="rs-label text-rs-muted">
              {ui.resume.stackSection.points[locale]}
              <span className="rs-title text-rs-ink ml-3 text-xl tabular-nums">
                {STACK_POINTS}
              </span>
            </p>
          </div>

          <ul className="mt-7 grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-6">
            {gridItems.map((item) => (
              <li key={item.id}>
                <StackCard item={item} locale={locale} />
              </li>
            ))}
          </ul>

          {/* Нижній ряд мокапу: AI-картка, цитата, цифри, кнопка */}
          <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,17rem)_1fr]">
            {aiItem && <StackCard item={aiItem} locale={locale} />}

            <div className="flex flex-col justify-between gap-6">
              <blockquote className="border-rs-accent border-l-2 pl-4 text-lg leading-snug italic">
                {site.motto[locale]}
              </blockquote>

              <Stats locale={locale} />

              <a
                href="#work"
                className="rs-label bg-rs-ink text-rs-paper hover:bg-rs-accent self-start px-6 py-3.5 transition-colors"
              >
                {ui.resume.workSection.cta[locale]} →
              </a>
            </div>
          </div>
        </Section>

        {/* ── Контакти ────────────────────────────────────────────── */}
        <Section
          id="contact"
          eyebrow={ui.resume.contactSection.eyebrow[locale]}
          title={ui.resume.contactSection.title[locale]}
          className="bg-rs-paper-2/60"
        >
          <ul className="border-rs-line max-w-xl divide-y" style={{ borderColor: "var(--rs-line)" }}>
            {[
              {
                label: "Email",
                value: site.contacts.email,
                href: `mailto:${site.contacts.email}`,
              },
              {
                label: "GitHub",
                value: "@KREIK2017",
                href: site.contacts.github,
              },
              site.contacts.linkedin && {
                label: "LinkedIn",
                value: site.contacts.linkedin.replace(/^https?:\/\/(www\.)?/, ""),
                href: site.contacts.linkedin,
              },
              site.contacts.telegram && {
                label: "Telegram",
                value: site.contacts.telegram.replace(/^https?:\/\/(www\.)?/, ""),
                href: site.contacts.telegram,
              },
            ]
              .filter(Boolean)
              .map((entry) => {
                const link = entry as { label: string; value: string; href: string };

                return (
                  <li
                    key={link.label}
                    className="flex items-center justify-between gap-4 py-4"
                  >
                    <span className="rs-label text-rs-muted">{link.label}</span>
                    <a
                      href={link.href}
                      target={link.href.startsWith("http") ? "_blank" : undefined}
                      rel="noreferrer noopener"
                      className="hover:text-rs-accent underline decoration-[color:var(--rs-line)] underline-offset-4 transition-colors"
                    >
                      {link.value}
                    </a>
                  </li>
                );
              })}
          </ul>

          <a
            href={site.cvPath}
            download
            className="rs-label border-rs-ink hover:bg-rs-ink hover:text-rs-paper mt-8 inline-block border px-6 py-3.5 transition-colors"
          >
            ↓ {ui.cv.download[locale]}
          </a>
        </Section>
      </div>
    </div>
  );
}
