import { StackCardArt } from "./StackCardArt";
import { STACK_MAX_LEVEL } from "@/content/stack";
import { cn } from "@/lib/utils";
import type { Locale, StackItem } from "@/types/content";

/** Світла картка потребує слабшої вінʼєтки, інакше папір сіріє. */
const LIGHT_VIGNETTE = 0.14;

export function StackCard({
  item,
  locale,
}: {
  item: StackItem;
  locale: Locale;
}) {
  // AI Tools у макеті стоїть окремим рядком на папері, а не серед
  // темних карток — звідси світлий варіант.
  const light = item.group === "ai";

  return (
    <article className={cn("stack-card", light && "stack-card--light")}>
      <StackCardArt
        id={item.id}
        base={item.base}
        accents={item.accents}
        vignette={light ? LIGHT_VIGNETTE : undefined}
      />

      {/* Число дублює ромбики, тому для читача екрана приховане:
          підпис несуть самі ромбики нижче. */}
      <span className="stack-card__level" aria-hidden="true">
        {item.level}
      </span>

      <div className="stack-card__body">
        <h3 className="stack-card__name">{item.name}</h3>
        <p className="stack-card__desc">{item.summary[locale]}</p>

        <p
          className="stack-card__pips"
          role="img"
          aria-label={`${item.level} / ${STACK_MAX_LEVEL}`}
        >
          {"◆".repeat(item.level)}
          <span className="stack-card__pips-empty">
            {"◇".repeat(STACK_MAX_LEVEL - item.level)}
          </span>
        </p>
      </div>
    </article>
  );
}
