import type { Hotspot } from "@/types/content";

/**
 * Предмети кімнати, що ведуть у розділи. Геометрія — у Room.tsx,
 * тут лише те, що читає користувач.
 */
export const HOTSPOTS: Hotspot[] = [
  {
    id: "projects",
    label: { uk: "Дошка з нотатками", en: "The pinboard" },
    voice: "logic",
    line: {
      uk: "Нитки, шпильки, обривки. Хтось тут вів слідство над власною кар'єрою.",
      en: "Threads, pins, torn scraps. Someone ran an investigation into his own career.",
    },
  },
  {
    id: "about",
    label: { uk: "Дзеркало", en: "The mirror" },
    voice: "visual",
    line: {
      uk: "Скло вкрите патиною. Обличчя видно, але не все — і це милосердно.",
      en: "The glass has gone cloudy. You can see a face, but not all of it. That is a mercy.",
    },
  },
  {
    id: "contact",
    label: { uk: "Радіо", en: "The radio" },
    voice: "empathy",
    line: {
      uk: "Приймач теплий. Хтось слухав його щойно і не хотів залишатися сам.",
      en: "The set is still warm. Someone was listening, and did not want to be alone.",
    },
  },
  {
    id: "cv",
    label: { uk: "Валіза", en: "The suitcase" },
    voice: "drama",
    line: {
      uk: "Не розпакована. Або він щойно приїхав, або готовий піти будь-якої миті.",
      en: "Still packed. Either he just arrived, or he is ready to leave at any moment.",
    },
  },
  {
    id: "trivia",
    label: { uk: "Пляшка й попільничка", en: "Bottle and ashtray" },
    voice: "kinesthetics",
    line: {
      uk: "Скло липке, попіл давній. Тут думали довго й не завжди продуктивно.",
      en: "Sticky glass, old ash. A lot of thinking happened here. Not all of it useful.",
    },
  },
];
