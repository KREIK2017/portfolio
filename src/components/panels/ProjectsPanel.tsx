"use client";

import Image from "next/image";
import { useState } from "react";
import { Divider, Panel } from "./Panel";
import { SkillCheck } from "./SkillCheck";
import { ui } from "@/content/dictionary";
import { PROJECTS } from "@/content/projects";
import type { Locale, Project } from "@/types/content";

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span className="label border border-[#5c4f3a]/35 px-2 py-1 text-[#4a4032]">
      {children}
    </span>
  );
}

function CaseCard({
  project,
  locale,
  onOpen,
}: {
  project: Project;
  locale: Locale;
  onOpen: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className="group relative block w-full border border-[#5c4f3a]/35 bg-[#cdbb92]/60 p-4 text-left transition-colors hover:border-[#7a2e2e]/60 hover:bg-[#cdbb92]"
    >
      {/* Виступ картонної папки */}
      <span
        aria-hidden="true"
        className="absolute -top-2 left-4 h-2 w-14 rounded-t-sm bg-[#b8a67e]"
      />

      <div className="flex items-baseline justify-between gap-3">
        <h3 className="text-xl leading-snug text-[#2a241c]">
          {project.title[locale]}
        </h3>
        <span className="label shrink-0 text-[#7a2e2e]">{project.year}</span>
      </div>

      <p className="mt-2 text-sm leading-relaxed text-[#4a4032]">
        {project.summary[locale]}
      </p>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {project.stack.slice(0, 4).map((tech) => (
          <Chip key={tech}>{tech}</Chip>
        ))}
      </div>

      {project.skillCheck && (
        <p className="label mt-3 text-[#7a2e2e]/80">
          {ui.check.title[locale]} →
        </p>
      )}
    </button>
  );
}

function CaseDetail({
  project,
  locale,
  onBack,
}: {
  project: Project;
  locale: Locale;
  onBack: () => void;
}) {
  return (
    <div className="anim-fade-in">
      <button
        type="button"
        onClick={onBack}
        className="label text-[#7a2e2e] transition-opacity hover:opacity-70"
      >
        ← {locale === "uk" ? "усі справи" : "all case files"}
      </button>

      {project.image && (
        <div className="mt-4 overflow-hidden border border-[#5c4f3a]/35">
          <Image
            src={project.image}
            alt={project.title[locale]}
            width={1200}
            height={750}
            className="h-auto w-full"
          />
        </div>
      )}

      <h3 className="mt-5 text-2xl text-[#2a241c]">{project.title[locale]}</h3>
      <p className="mt-2 leading-relaxed text-[#4a4032]">
        {project.summary[locale]}
      </p>

      <Divider />

      <dl className="space-y-4">
        <div>
          <dt className="label text-[#7a2e2e]">{ui.projects.role[locale]}</dt>
          <dd className="mt-1 text-[#3c3327]">{project.role[locale]}</dd>
        </div>
        <div>
          <dt className="label text-[#7a2e2e]">{ui.projects.stack[locale]}</dt>
          <dd className="mt-1.5 flex flex-wrap gap-1.5">
            {project.stack.map((tech) => (
              <Chip key={tech}>{tech}</Chip>
            ))}
          </dd>
        </div>
        <div>
          <dt className="label text-[#7a2e2e]">{ui.projects.result[locale]}</dt>
          <dd className="mt-1 text-[#3c3327]">{project.result[locale]}</dd>
        </div>
      </dl>

      {(project.liveUrl || project.repoUrl) && (
        <div className="mt-7 flex flex-wrap gap-3">
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noreferrer noopener"
              className="label border border-[#7a2e2e]/50 px-4 py-2.5 text-[#7a2e2e] transition-colors hover:bg-[#7a2e2e]/10"
            >
              {ui.projects.live[locale]} ↗
            </a>
          )}
          {project.repoUrl && (
            <a
              href={project.repoUrl}
              target="_blank"
              rel="noreferrer noopener"
              className="label border border-[#5c4f3a]/50 px-4 py-2.5 text-[#3c3327] transition-colors hover:bg-[#5c4f3a]/10"
            >
              {ui.projects.repo[locale]} ↗
            </a>
          )}
        </div>
      )}
    </div>
  );
}

export function ProjectsPanel({
  locale,
  onClose,
}: {
  locale: Locale;
  onClose: () => void;
}) {
  const [openSlug, setOpenSlug] = useState<string | null>(null);
  /** Слаги, для яких перевірку навички вже пройдено — щоб не повторювати. */
  const [resolved, setResolved] = useState<string[]>([]);

  const project = PROJECTS.find((item) => item.slug === openSlug) ?? null;
  const needsCheck =
    project?.skillCheck != null && !resolved.includes(project.slug);

  return (
    <Panel
      title={ui.projects.title[locale]}
      subtitle={project ? undefined : ui.projects.subtitle[locale]}
      locale={locale}
      onClose={onClose}
    >
      {project == null && (
        <>
          {PROJECTS.length === 0 ? (
            <p className="text-[#4a4032]">{ui.projects.empty[locale]}</p>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2">
              {PROJECTS.map((item) => (
                <CaseCard
                  key={item.slug}
                  project={item}
                  locale={locale}
                  onOpen={() => setOpenSlug(item.slug)}
                />
              ))}
            </div>
          )}
        </>
      )}

      {project != null && needsCheck && project.skillCheck && (
        <SkillCheck
          check={project.skillCheck}
          locale={locale}
          onResolved={() => setResolved((current) => [...current, project.slug])}
        />
      )}

      {project != null && !needsCheck && (
        <CaseDetail
          project={project}
          locale={locale}
          onBack={() => setOpenSlug(null)}
        />
      )}
    </Panel>
  );
}
