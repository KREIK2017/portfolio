import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { site } from "@/config/site";

export const metadata: Metadata = {
  title: "Про мене",
  description: `${site.role} — досвід, стек і підхід до роботи.`,
};

// TODO: заміни на свої реальні навички
const SKILLS = [
  "HTML / CSS",
  "JavaScript",
  "TypeScript",
  "React",
  "Next.js",
  "Tailwind CSS",
  "Shopify / Liquid",
  "WordPress",
  "Git",
];

export default function AboutPage() {
  return (
    <section className="py-16">
      <Container>
        <h1 className="text-3xl font-bold tracking-tight sm:text-5xl">
          Про мене
        </h1>

        <div className="prose mt-8 max-w-2xl">
          <p>
            Привіт! Мене звати {site.name}, я {site.role.toLowerCase()}. Роблю
            сайти під ключ — від верстки до налаштування хостингу й домену.
          </p>
          <p>
            {/* TODO: розкажи про себе своїми словами */}
            Тут напиши, з чого починав, які задачі любиш розв’язувати і чим
            корисний клієнту. Кілька абзаців достатньо.
          </p>

          <h2>Що я роблю</h2>
          <ul>
            <li>Інтернет-магазини на Shopify: теми, кастомізація, інтеграції</li>
            <li>Корпоративні сайти й лендінги на WordPress</li>
            <li>Кастомна розробка на React / Next.js</li>
          </ul>
        </div>

        <h2 className="mt-14 text-xl font-semibold tracking-tight">Стек</h2>
        <ul className="mt-5 flex flex-wrap gap-2">
          {SKILLS.map((skill) => (
            <li key={skill}>
              <Badge>{skill}</Badge>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
