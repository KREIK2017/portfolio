import type { Localized, SkillId } from "@/types/content";

/** Сцена пробудження. Порядок реплік визначає драматургію інтро. */
export const INTRO_LINES: Array<{ skill: SkillId; text: Localized }> = [
  {
    skill: "encyclopedia",
    text: {
      uk: "Тиша. Стеля. Плями від вологи, схожі на карту невідомої країни.",
      en: "Silence. A ceiling. Damp stains shaped like the map of a country nobody named.",
    },
  },
  {
    skill: "logic",
    text: {
      uk: "Ти не пам'ятаєш, як тут опинився. Це поки що не має значення.",
      en: "You do not remember arriving. For now, that is not the important part.",
    },
  },
  {
    skill: "drama",
    text: {
      uk: "Важливо інше: хтось жив у цій кімнаті й лишив по собі роботи.",
      en: "This is what matters: someone lived in this room, and left his work behind.",
    },
  },
  {
    skill: "kinesthetics",
    text: {
      uk: "Розплющ очі. Далі — сам.",
      en: "Open your eyes. You are on your own from here.",
    },
  },
];
