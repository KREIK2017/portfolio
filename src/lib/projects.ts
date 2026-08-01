import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { marked } from "marked";
import type { Project, ProjectMeta, ProjectSummary } from "@/types/project";

const CONTENT_DIR = path.join(process.cwd(), "src", "content", "projects");

/**
 * Увага: цей модуль читає файлову систему, тому викликати його можна
 * лише з серверних компонентів. Під час `next build` він виконується
 * один раз і результат «запікається» в статичний HTML.
 */

function readSlugs(): string[] {
  if (!fs.existsSync(CONTENT_DIR)) return [];

  return fs
    .readdirSync(CONTENT_DIR)
    .filter((file) => file.endsWith(".md"))
    .map((file) => file.replace(/\.md$/, ""));
}

function parseFile(slug: string): { meta: ProjectMeta; body: string } {
  const raw = fs.readFileSync(path.join(CONTENT_DIR, `${slug}.md`), "utf8");
  const { data, content } = matter(raw);

  return { meta: data as ProjectMeta, body: content };
}

const newestFirst = (a: ProjectSummary, b: ProjectSummary) =>
  b.date.localeCompare(a.date);

/** Усі опубліковані проєкти, найновіші зверху. */
export function getAllProjects(): ProjectSummary[] {
  return readSlugs()
    .map((slug) => ({ slug, ...parseFile(slug).meta }))
    .filter((project) => !project.draft)
    .sort(newestFirst);
}

/**
 * Проєкти для головної. Якщо жоден не позначений featured —
 * повертаємо найновіші, щоб головна ніколи не була порожньою.
 */
export function getFeaturedProjects(limit = 3): ProjectSummary[] {
  const all = getAllProjects();
  const featured = all.filter((project) => project.featured);

  return (featured.length > 0 ? featured : all).slice(0, limit);
}

/** Один проєкт разом з відрендереним тілом статті. */
export function getProject(slug: string): Project | null {
  if (!readSlugs().includes(slug)) return null;

  const { meta, body } = parseFile(slug);
  if (meta.draft) return null;

  return {
    slug,
    ...meta,
    html: marked.parse(body, { async: false }),
  };
}

/** Список slug'ів для generateStaticParams. */
export function getProjectSlugs(): string[] {
  return getAllProjects().map((project) => project.slug);
}
