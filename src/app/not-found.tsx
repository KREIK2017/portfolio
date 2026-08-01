import Link from "next/link";
import { Container } from "@/components/ui/Container";

export default function NotFound() {
  return (
    <section className="py-28">
      <Container className="text-center">
        <p className="text-accent font-mono text-sm">404</p>
        <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
          Сторінку не знайдено
        </h1>
        <p className="text-muted mt-4">
          Можливо, посилання застаріло або сторінку перейменували.
        </p>
        <Link
          href="/"
          className="bg-accent text-accent-fg mt-8 inline-block rounded-lg px-5 py-2.5 text-sm font-medium transition-opacity hover:opacity-90"
        >
          На головну
        </Link>
      </Container>
    </section>
  );
}
