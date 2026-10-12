"use client";

import Image from "next/image";
import { useState } from "react";
import { createPortal } from "react-dom";
import { Panel } from "./Panel";
import { SuitcaseScene, type SuitcaseItem } from "./SuitcaseScene";
import { ui } from "@/content/dictionary";
import { site } from "@/config/site";
import type { Locale } from "@/types/content";

const SKILLS = ["WordPress", "PHP", "React", "Next.js", "TypeScript", "Node.js", "Docker", "MySQL"];

function ItemDetail({
  item,
  locale,
  onClose,
}: {
  item: SuitcaseItem;
  locale: Locale;
  onClose: () => void;
}) {
  const uk = locale === "uk";
  const title = {
    photo: uk ? "Фотокартка" : "Photo card",
    passport: uk ? "Паспорт навичок" : "Skills passport",
    cv: uk ? "Розгорнутий CV" : "Unfolded CV",
  }[item];

  return createPortal(
    <div className="suitcase-detail" role="dialog" aria-modal="true" aria-label={title}>
      <button type="button" className="suitcase-detail__backdrop" tabIndex={-1} aria-hidden="true" onClick={onClose} />
      <article className={`suitcase-detail__paper ${item === "cv" ? "suitcase-detail__paper--cv" : ""}`}>
        <header className="flex items-start justify-between gap-5 border-b border-[#5c4f3a]/30 pb-4">
          <div>
            <p className="label text-[#7a2e2e]">KREIK · {item === "cv" ? "DOCUMENT 03" : item === "passport" ? "DOCUMENT 02" : "DOCUMENT 01"}</p>
            <h3 className="mt-1 text-3xl text-[#2a241c]">{title}</h3>
          </div>
          <button type="button" onClick={onClose} autoFocus className="label min-h-11 border border-[#7a2e2e]/40 px-3 text-[#7a2e2e]">
            ← {ui.back[locale]}
          </button>
        </header>

        {item === "photo" && (
          <div className="mt-5 grid items-center gap-5 sm:grid-cols-[minmax(0,240px)_1fr]">
            <div className="border-8 border-[#f0e5cd] bg-[#f0e5cd] shadow-xl">
              <Image src="/img/suitcase-photo.webp" alt={site.name[locale]} width={720} height={1009} className="h-auto w-full" />
            </div>
            <div>
              <p className="text-2xl text-[#2a241c]">{site.name[locale]}</p>
              <p className="mt-2 leading-relaxed text-[#4a4032]">{site.role[locale]}</p>
              <p className="mt-4 text-sm italic text-[#5c4f3a]">
                {uk ? "Фото з особистого архіву. А за роботою — відкрий паспорт або CV." : "A photo from my personal archive. For the work, open the passport or CV."}
              </p>
            </div>
          </div>
        )}

        {item === "passport" && (
          <div className="mt-5">
            <p className="text-xl text-[#2a241c]">{site.name[locale]}</p>
            <p className="mt-1 text-[#5c4f3a]">{site.role[locale]}</p>
            <p className="mt-5 leading-relaxed text-[#4a4032]">
              {uk
                ? "Бакалавр інженерії програмного забезпечення, магістратура триває. Понад рік комерційної роботи з WordPress."
                : "BSc in Software Engineering, MSc in progress. Over a year of commercial WordPress work."}
            </p>
            <p className="label mt-7 text-[#7a2e2e]">{uk ? "ІНСТРУМЕНТИ" : "TOOLS"}</p>
            <ul className="mt-3 flex flex-wrap gap-2">
              {SKILLS.map((skill) => <li key={skill} className="border border-[#5c4f3a]/40 px-2.5 py-1.5 text-sm text-[#3c3327]">{skill}</li>)}
            </ul>
          </div>
        )}

        {item === "cv" && (
          <div className="mt-5">
            <p className="mb-4 leading-relaxed text-[#4a4032]">
              {uk
                ? "Розгорни CV просто тут або відкрий оригінал PDF в окремій вкладці."
                : "Read the CV here or open the original PDF in a separate tab."}
            </p>
            <div className="suitcase-pdf-frame">
              <Image src="/img/cv-preview.png" alt={uk ? "Перша сторінка CV Максима Мичка" : "Maksim Mychko CV preview"} width={990} height={1400} className="h-auto w-full" />
            </div>
            <div className="mt-5 flex flex-wrap gap-3">
              <a href={site.cvPath} target="_blank" rel="noreferrer noopener" className="label inline-flex min-h-11 items-center border border-[#7a2e2e]/50 px-4 text-[#7a2e2e] hover:bg-[#7a2e2e]/10">
                {uk ? "Відкрити PDF" : "Open PDF"} ↗
              </a>
              <a href={site.cvPath} download className="label inline-flex min-h-11 items-center border border-[#5c4f3a]/50 px-4 text-[#3c3327] hover:bg-[#5c4f3a]/10">
                ↓ {ui.cv.download[locale]}
              </a>
            </div>
          </div>
        )}
      </article>
    </div>,
    document.body,
  );
}

export function CvPanel({
  locale,
  onClose,
}: {
  locale: Locale;
  onClose: () => void;
}) {
  const [selected, setSelected] = useState<SuitcaseItem | null>(null);
  const closeDetail = () => {
    const item = selected;
    setSelected(null);
    if (item) window.requestAnimationFrame(() => document.querySelector<HTMLButtonElement>(`[data-suitcase-item="${item}"]`)?.focus());
  };

  return (
    <Panel
      title={ui.cv.title[locale]}
      subtitle={locale === "uk"
        ? "Три речі, які розповідають про мене. Пересувай і відкривай."
        : "Three objects that tell my story. Move and inspect them."}
      locale={locale}
      onClose={() => (selected ? closeDetail() : onClose())}
      wide
    >
      <SuitcaseScene locale={locale} onInspect={setSelected} />
      {selected && <ItemDetail item={selected} locale={locale} onClose={closeDetail} />}
    </Panel>
  );
}
