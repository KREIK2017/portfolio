import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { PROJECT_KIND_LABELS, type ProjectSummary } from "@/types/project";

export function ProjectCard({ project }: { project: ProjectSummary }) {
  return (
    <article className="group border-border bg-surface hover:border-accent/50 overflow-hidden rounded-xl border transition-colors">
      <Link href={`/projects/${project.slug}`} className="block">
        <div className="bg-bg relative aspect-16/10 overflow-hidden">
          {project.cover ? (
            <Image
              src={project.cover}
              alt={`Обкладинка проєкту ${project.title}`}
              fill
              sizes="(max-width: 640px) 100vw, 50vw"
              className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            />
          ) : (
            // Обкладинки може не бути — показуємо нейтральну заглушку
            // замість «битої» картинки.
            <div className="from-surface to-border flex h-full items-center justify-center bg-linear-to-br">
              <span className="text-muted text-xs">Без обкладинки</span>
            </div>
          )}
        </div>

        <div className="p-5">
          <div className="mb-3 flex items-center gap-2">
            <Badge variant="accent">{PROJECT_KIND_LABELS[project.kind]}</Badge>
          </div>

          <h3 className="group-hover:text-accent text-lg font-semibold tracking-tight transition-colors">
            {project.title}
          </h3>

          <p className="text-muted mt-2 line-clamp-2 text-sm">
            {project.summary}
          </p>

          <ul className="mt-4 flex flex-wrap gap-1.5">
            {project.stack.slice(0, 4).map((tech) => (
              <li key={tech}>
                <Badge>{tech}</Badge>
              </li>
            ))}
          </ul>
        </div>
      </Link>
    </article>
  );
}
