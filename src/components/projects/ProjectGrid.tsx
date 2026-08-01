import { ProjectCard } from "./ProjectCard";
import type { ProjectSummary } from "@/types/project";

export function ProjectGrid({ projects }: { projects: ProjectSummary[] }) {
  if (projects.length === 0) {
    return (
      <p className="text-muted border-border rounded-xl border border-dashed p-10 text-center text-sm">
        Проєктів поки немає. Додай перший файл у{" "}
        <code className="font-mono text-xs">src/content/projects/</code>.
      </p>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2">
      {projects.map((project) => (
        <ProjectCard key={project.slug} project={project} />
      ))}
    </div>
  );
}
