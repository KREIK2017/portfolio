"use client";

import { useState } from "react";
import { Panel } from "./Panel";
import { SkillEmblem } from "@/components/ui/SkillEmblem";
import { ui } from "@/content/dictionary";
import {
  ATTRIBUTES,
  MAX_SKILL_LEVEL,
  SKILLS,
  attributeLevel,
  skillsOf,
} from "@/content/skills";
import { site } from "@/config/site";
import { cn } from "@/lib/utils";
import type { Locale, Skill, SkillId } from "@/types/content";

/** Ромбики-пипси, як у character sheet оригіналу. */
function Pips({
  level,
  color,
  size = "sm",
}: {
  level: number;
  color: string;
  size?: "sm" | "lg";
}) {
  return (
    <span
      className="inline-flex items-center gap-[3px]"
      role="img"
      aria-label={`${level} / ${MAX_SKILL_LEVEL}`}
    >
      {Array.from({ length: MAX_SKILL_LEVEL }, (_, index) => (
        <span
          key={index}
          className={cn(
            "rotate-45 border",
            size === "lg" ? "size-2.5" : "size-[7px]",
          )}
          style={{
            borderColor: color,
            background: index < level ? color : "transparent",
          }}
        />
      ))}
    </span>
  );
}

/** Ліва колонка: групи навичок із великим числом, як атрибути в грі. */
function AttributeColumn({ locale }: { locale: Locale }) {
  return (
    <ul className="space-y-6">
      {ATTRIBUTES.map((attribute) => {
        const shade = `color-mix(in srgb, ${attribute.color} 68%, #2a241c)`;

        return (
          <li key={attribute.id} className="flex items-start gap-4">
            <span
              className="font-display text-5xl leading-none tabular-nums"
              style={{ color: shade }}
            >
              {attributeLevel(attribute.id)}
            </span>

            <div className="pt-1">
              <Pips level={attributeLevel(attribute.id)} color={shade} />
              <p className="label mt-1.5" style={{ color: shade }}>
                {attribute.name[locale]}
              </p>
              <p className="mt-1 text-xs leading-snug text-[#5c4f3a]">
                {attribute.blurb[locale]}
              </p>
            </div>
          </li>
        );
      })}
    </ul>
  );
}

function SkillCard({
  skill,
  locale,
  active,
  onSelect,
}: {
  skill: Skill;
  locale: Locale;
  active: boolean;
  onSelect: () => void;
}) {
  const shade = `color-mix(in srgb, ${skill.color} 68%, #2a241c)`;

  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={active}
      className={cn(
        "block w-full border p-2 text-left transition-colors",
        active
          ? "border-[#2a241c] bg-[#cdbb92]"
          : "border-[#5c4f3a]/30 hover:border-[#5c4f3a]/70",
      )}
    >
      <span className="relative block aspect-square overflow-hidden">
        <SkillEmblem skill={skill} />
      </span>

      <span className="mt-2 flex items-center justify-between gap-2">
        <span className="label text-[0.62rem] leading-tight" style={{ color: shade }}>
          {skill.name[locale]}
        </span>
        <span
          className="font-display shrink-0 px-1.5 text-sm tabular-nums"
          style={{ background: shade, color: "#e8ddc4" }}
        >
          {skill.level}
        </span>
      </span>

      <span className="mt-1.5 block">
        <Pips level={skill.level} color={shade} />
      </span>
    </button>
  );
}

/** Права колонка: розгорнутий опис вибраної навички. */
function SkillDetail({ skill, locale }: { skill: Skill; locale: Locale }) {
  const shade = `color-mix(in srgb, ${skill.color} 68%, #2a241c)`;
  const attribute = ATTRIBUTES.find((item) => item.id === skill.attribute);

  return (
    <div className="anim-fade-in">
      <div className="relative aspect-4/3 overflow-hidden border border-[#5c4f3a]/35">
        <SkillEmblem skill={skill} />
      </div>

      <p
        className="label mt-3 border-b border-[#5c4f3a]/30 pb-2 text-sm"
        style={{ color: shade }}
      >
        {skill.name[locale]}
      </p>

      <p className="mt-3 text-sm leading-relaxed text-[#3c3327]">
        {skill.blurb[locale]}
      </p>

      <dl className="mt-4 space-y-1.5 text-xs text-[#5c4f3a]">
        <div className="flex justify-between gap-3">
          <dt>{locale === "uk" ? "Група" : "Attribute"}</dt>
          <dd style={{ color: shade }}>{attribute?.name[locale]}</dd>
        </div>
        <div className="flex items-center justify-between gap-3">
          <dt>{locale === "uk" ? "Рівень" : "Level"}</dt>
          <dd className="flex items-center gap-2">
            <Pips level={skill.level} color={shade} size="lg" />
            <span className="font-display tabular-nums" style={{ color: shade }}>
              {skill.level}
            </span>
          </dd>
        </div>
      </dl>

      {/* Одна репліка навички — щоб було чути, як цей голос звучить. */}
      <blockquote
        className="mt-4 border-l-2 pl-3 text-sm italic leading-relaxed text-[#4a4032]"
        style={{ borderColor: shade }}
      >
        {skill.lines[locale][0]}
      </blockquote>
    </div>
  );
}

export function AboutPanel({
  locale,
  onClose,
}: {
  locale: Locale;
  onClose: () => void;
}) {
  const [selected, setSelected] = useState<SkillId>(SKILLS[0].id);
  const skill = SKILLS.find((item) => item.id === selected) ?? SKILLS[0];

  return (
    <Panel
      title={ui.about.title[locale]}
      subtitle={ui.about.subtitle[locale]}
      locale={locale}
      onClose={onClose}
      wide
    >
      <div className="space-y-3">
        {site.bio[locale].map((paragraph) => (
          <p key={paragraph} className="leading-relaxed text-[#3c3327]">
            {paragraph}
          </p>
        ))}
      </div>

      <div className="my-7 h-px bg-[#5c4f3a]/25" />

      {/*
        Три колонки як у референсі: атрибути → сітка навичок → деталі.
        На вузьких екранах усе стає одна під одною, деталі опускаються
        під сітку — інакше вибір і результат не видно одночасно.
      */}
      <div className="grid gap-8 lg:grid-cols-[13rem_1fr_15rem]">
        <AttributeColumn locale={locale} />

        <div>
          <p className="label mb-3 text-[#7a2e2e]">{ui.about.skills[locale]}</p>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {ATTRIBUTES.flatMap((attribute) => skillsOf(attribute.id)).map(
              (item) => (
                <SkillCard
                  key={item.id}
                  skill={item}
                  locale={locale}
                  active={item.id === selected}
                  onSelect={() => setSelected(item.id)}
                />
              ),
            )}
          </div>
        </div>

        <SkillDetail skill={skill} locale={locale} />
      </div>
    </Panel>
  );
}
