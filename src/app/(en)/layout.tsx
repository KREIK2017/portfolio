import type { Metadata } from "next";
import { fontBody, fontCondensed, fontDisplay } from "../fonts";
import { buildMetadata } from "@/lib/metadata";
import "../globals.css";

export const metadata: Metadata = buildMetadata("en");

export default function EnglishLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${fontDisplay.variable} ${fontBody.variable} ${fontCondensed.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
