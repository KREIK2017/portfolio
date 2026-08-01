import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { Gallery } from "@/components/projects/Gallery";
import { AudioPlayer } from "@/components/projects/AudioPlayer";
import { getProject, getProjectSlugs } from "@/lib/projects";
import { PROJECT_KIND_LABELS } from "@/types/project";
import { formatDate } from "@/lib/utils";

type Params = { slug: string };

/**
 * Обов'язково для output: "export" — Next має знати наперед,
 * які саме сторінки згенерувати під час збірки.
 */
export function generateStaticParams(): Params[] {
  return getProjectSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);

  if (!project) return {};

  return {
    title: project.title,
    description: project.summary,
    openGraph: {
      title: project.title,
      description: project.summary,
      images: project.cover ? [project.cover] : undefined,
    },
  };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const project = getProject(slug);

  if (!project) notFound();

  return (
    <article className="py-16">
      <Container>
        <Link
          href="/projects"
          className="text-muted hover:text-fg text-sm transition-colors"
        >
          ← Усі проєкти
        </Link>

        <header className="mt-6">
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <Badge variant="accent">{PROJECT_KIND_LABELS[project.kind]}</Badge>
            <span className="text-muted text-sm">
              {formatDate(project.date)}
            </span>
          </div>

          <h1 className="text-3xl font-bold tracking-tight sm:text-5xl">
            {project.title}
          </h1>

          <p className="text-muted mt-4 max-w-2xl text-lg">{project.summary}</p>

          <ul className="mt-6 flex flex-wrap gap-1.5">
            {project.stack.map((tech) => (
              <li key={tech}>
                <Badge>{tech}</Badge>
              </li>
            ))}
          </ul>

          {(project.liveUrl || project.repoUrl) && (
            <div className="mt-7 flex flex-wrap gap-3">
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="bg-accent text-accent-fg rounded-lg px-4 py-2 text-sm font-medium transition-opacity hover:opacity-90"
                >
                  Відкрити сайт
                </a>
              )}
              {project.repoUrl && (
                <a
                  href={project.repoUrl}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="border-border hover:border-accent rounded-lg border px-4 py-2 text-sm font-medium transition-colors"
                >
                  Код на GitHub
                </a>
              )}
            </div>
          )}
        </header>

        {project.cover && (
          <div className="border-border bg-surface relative mt-12 aspect-16/9 overflow-hidden rounded-xl border">
            <Image
              src={project.cover}
              alt={`Обкладинка проєкту ${project.title}`}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 1024px"
              className="object-cover"
            />
          </div>
        )}

        {/* HTML тут — результат збірки з власного markdown-файлу,
            тобто довірений контент, а не введення користувача. */}
        <div
          className="prose mt-12 max-w-2xl"
          dangerouslySetInnerHTML={{ __html: project.html }}
        />

        <Gallery images={project.gallery ?? []} />
        <AudioPlayer tracks={project.audio ?? []} />
      </Container>
    </article>
  );
}
