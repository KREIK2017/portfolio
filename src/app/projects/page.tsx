import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ProjectGrid } from "@/components/projects/ProjectGrid";
import { getAllProjects } from "@/lib/projects";

export const metadata: Metadata = {
  title: "Проєкти",
  description: "Усі проєкти: вебсайти, Shopify-теми та WordPress-розробка.",
};

export default function ProjectsPage() {
  const projects = getAllProjects();

  return (
    <section className="py-16">
      <Container>
        <SectionHeading
          title="Проєкти"
          description={`Усього робіт: ${projects.length}. Найновіші — зверху.`}
        />
        <ProjectGrid projects={projects} />
      </Container>
    </section>
  );
}
