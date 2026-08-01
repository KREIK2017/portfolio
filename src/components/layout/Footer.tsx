import { Container } from "@/components/ui/Container";
import { site } from "@/config/site";

export function Footer() {
  return (
    <footer className="border-border mt-24 border-t py-10">
      <Container className="text-muted flex flex-wrap items-center justify-between gap-4 text-sm">
        <p>
          © {new Date().getFullYear()} {site.name}
        </p>

        <ul className="flex items-center gap-5">
          <li>
            <a
              href={site.socials.github}
              target="_blank"
              rel="noreferrer noopener"
              className="hover:text-fg transition-colors"
            >
              GitHub
            </a>
          </li>
          <li>
            <a
              href={`mailto:${site.email}`}
              className="hover:text-fg transition-colors"
            >
              Email
            </a>
          </li>
        </ul>
      </Container>
    </footer>
  );
}
