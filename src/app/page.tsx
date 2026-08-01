import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ProjectGrid } from "@/components/projects/ProjectGrid";
import { getFeaturedProjects } from "@/lib/projects";
import { site } from "@/config/site";

export default function HomePage() {
  const featured = getFeaturedProjects(4);

  return (
    <>
      <section className="py-20 sm:py-28">
        <Container>
          <p className="text-accent mb-4 text-sm font-medium">{site.role}</p>

          <h1 className="max-w-3xl text-4xl font-bold tracking-tight sm:text-6xl">
            Створюю сайти, які працюють швидко і виглядають добре
          </h1>

          <p className="text-muted mt-6 max-w-xl text-base sm:text-lg">
            {site.description} Тут зібрані роботи, над якими я працював — від
            інтернет-магазинів на Shopify до кастомних тем WordPress.
          </p>

          <div className="mt-9 flex flex-wrap gap-3">
            <Link
              href="/projects"
              className="bg-accent text-accent-fg rounded-lg px-5 py-2.5 text-sm font-medium transition-opacity hover:opacity-90"
            >
              Дивитись проєкти
            </Link>
            <Link
              href="/contact"
              className="border-border hover:border-accent rounded-lg border px-5 py-2.5 text-sm font-medium transition-colors"
            >
              Зв’язатись
            </Link>
          </div>
        </Container>
      </section>

      <section>
        <Container>
          <SectionHeading
            title="Вибрані роботи"
            description="Кілька проєктів, якими я задоволений найбільше."
            action={
              <Link
                href="/projects"
                className="text-accent text-sm font-medium hover:underline"
              >
                Усі проєкти →
              </Link>
            }
          />
          <ProjectGrid projects={featured} />
        </Container>
      </section>
    </>
  );
}
