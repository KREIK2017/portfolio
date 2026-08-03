import type { Metadata } from "next";
import { Experience } from "@/components/scene/Experience";
import { site } from "@/config/site";

export const metadata: Metadata = {
  title: `${site.name} — the room`,
  description:
    "A portfolio you walk into: objects lead to the sections, skill voices comment on what you do.",
  alternates: {
    canonical: "/en/room/",
    languages: { uk: "/room/", en: "/en/room/" },
  },
};

export default function EnglishRoomPage() {
  return <Experience locale="en" />;
}
