import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { site } from "@/config/site";

export const metadata: Metadata = {
  title: "Контакти",
  description: `Зв'язатися з ${site.name}: email і GitHub.`,
};

const LINKS = [
  { label: "Email", value: site.email, href: `mailto:${site.email}` },
  { label: "GitHub", value: "@KREIK2017", href: site.socials.github },
];

export default function ContactPage() {
  return (
    <section className="py-16">
      <Container>
        <h1 className="text-3xl font-bold tracking-tight sm:text-5xl">
          Контакти
        </h1>

        <p className="text-muted mt-5 max-w-xl text-lg">
          Відкритий до нових проєктів. Напиши на email — відповідаю протягом
          робочого дня.
        </p>

        {/*
          Свідомо без форми: статичний сайт не має бекенду, щоб її
          обробити. Якщо форма таки знадобиться — найпростіше додати
          Cloudflare Worker або зовнішній сервіс на кшталт Formspree.
        */}
        <ul className="divide-border mt-10 max-w-xl divide-y">
          {LINKS.map((link) => (
            <li
              key={link.label}
              className="flex items-center justify-between gap-4 py-4"
            >
              <span className="text-muted text-sm">{link.label}</span>
              <a
                href={link.href}
                target={link.href.startsWith("http") ? "_blank" : undefined}
                rel="noreferrer noopener"
                className="hover:text-accent text-sm font-medium transition-colors"
              >
                {link.value}
              </a>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
