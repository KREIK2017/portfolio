import type { Metadata } from "next";
import { Experience } from "@/components/scene/Experience";
import { site } from "@/config/site";

export const metadata: Metadata = {
  title: `${site.name.uk} — кімната`,
  description:
    "Портфоліо як ізометрична кімната: предмети ведуть у розділи, голоси навичок комментують дії.",
  alternates: {
    canonical: "/room/",
    languages: { uk: "/room/", en: "/en/room/" },
  },
};

export default function RoomPage() {
  return <Experience locale="uk" />;
}
