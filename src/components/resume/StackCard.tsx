import Image from "next/image";
import { STACK_MAX_LEVEL } from "@/content/stack";
import { cn } from "@/lib/utils";
import type { Locale, StackItem } from "@/types/content";

/** «WordPress» → «WP», «React & Next.js» → «RN», «PHP» → «PHP». */
function monogram(name: string): string {
  const words = name.split(/[\s&]+/).filter(Boolean);

  if (words.length === 1) {
    return words[0].length <= 3
      ? words[0].toUpperCase()
      : words[0].slice(0, 2).toUpperCase();
  }

  return words
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();
}

function Pips({ level, light }: { level: number; light: boolean }) {
  return (
    <span
      className="flex items-center gap-1"
      role="img"
      aria-label={`${level} / ${STACK_MAX_LEVEL}`}
    >
      {Array.from({ length: STACK_MAX_LEVEL }, (_, index) => (
        <span
          key={index}
          className={cn(
            "size-[7px] rotate-45 border",
            light ? "border-[#2a241c]/60" : "border-white/70",
            index < level && (light ? "bg-[#2a241c]/80" : "bg-white/90"),
          )}
        />
      ))}
    </span>
  );
}

export function StackCard({
  item,
  locale,
}: {
  item: StackItem;
  locale: Locale;
}) {
  // Картка AI Tools у мокапі світла, тому текст на ній має бути темним.
  const light = item.group === "ai";

  return (
    <article
      className={cn(
        "rs-card flex flex-col p-4",
        light ? "text-[#2a241c]" : "text-[#f4efe3]",
      )}
      style={{ "--card-tone": item.tone } as React.CSSProperties}
    >
      <div className="mb-3 flex h-12 items-start">
        {item.icon ? (
          <Image
            src={item.icon}
            alt=""
            width={44}
            height={44}
            className="h-11 w-auto object-contain"
          />
        ) : (
          // Логотипи технологій — чужі торгові марки, я їх не генерую.
          // Поклади файли в public/stack/ і впиши шлях у поле icon.
          <span
            className={cn(
              "rs-title flex size-11 items-center justify-center border text-base",
              light
                ? "border-[#2a241c]/25 bg-[#2a241c]/8"
                : "border-white/25 bg-white/10",
            )}
          >
            {monogram(item.name)}
          </span>
        )}
      </div>

      <h3 className="rs-label text-[0.82rem] tracking-[0.1em]">{item.name}</h3>

      <p
        className={cn(
          "rs-sans mt-2 flex-1 text-[0.78rem] leading-snug",
          light ? "text-[#2a241c]/80" : "text-white/75",
        )}
      >
        {item.summary[locale]}
      </p>

      <div className="mt-4 flex items-end justify-between gap-2">
        <Pips level={item.level} light={light} />
        <span
          className={cn(
            "rs-title px-1.5 text-lg leading-none tabular-nums",
            light ? "bg-[#2a241c] text-[#f2ece0]" : "bg-white/90 text-[#1a1815]",
          )}
        >
          {item.level}
        </span>
      </div>
    </article>
  );
}
