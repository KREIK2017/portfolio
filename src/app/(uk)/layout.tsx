import type { Metadata } from "next";
import { fontBody, fontDisplay } from "../fonts";
import { buildMetadata } from "@/lib/metadata";
import "../globals.css";

/**
 * Українська версія має власний root layout, щоб атрибут lang був
 * правильним уже в статичному HTML. Другий root layout — у (en).
 */
export const metadata: Metadata = buildMetadata("uk");

export default function UkrainianLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="uk" className={`${fontDisplay.variable} ${fontBody.variable}`}>
      <body>{children}</body>
    </html>
  );
}
