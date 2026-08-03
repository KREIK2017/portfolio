import type { Attribute, AttributeId, Skill, SkillId } from "@/types/content";

/**
 * Шість голосів. Рівні — самооцінка автора, міняй вільно.
 * Репліки писалися окремо для кожної мови, а не перекладалися:
 * іронія в дослівному перекладі зникає першою.
 */
export const SKILLS: Skill[] = [
  {
    id: "logic",
    name: { uk: "ЛОГІКА", en: "LOGIC" },
    attribute: "intellect",
    level: 5,
    color: "#6fa397",
    blurb: {
      uk: "Архітектура, бекенд, чистий код. Розбирає систему на частини й питає, чи всі вони потрібні.",
      en: "Architecture, backend, clean code. Takes the system apart and asks which pieces earn their keep.",
    },
    lines: {
      uk: [
        "Кімната — це система. Кожен предмет щось приховує. Почни з дошки.",
        "Ти навів курсор на пляшку вже двічі. Це не проєкт. Це симптом.",
        "Дедукція проста: якщо тобі показують кімнату замість резюме — є що показувати.",
        "Тут немає бази даних. І це, як не дивно, свідоме рішення.",
      ],
      en: [
        "This room is a system. Every object hides something. Start with the board.",
        "You have hovered the bottle twice now. That is not a project. That is a symptom.",
        "The deduction is simple: a man who shows you a room instead of a CV has something to show.",
        "There is no database here. Strangely enough, that was on purpose.",
      ],
    },
  },
  {
    id: "visual",
    name: { uk: "ВІЗУАЛЬНИЙ СМАК", en: "VISUAL TASTE" },
    attribute: "motorics",
    level: 4,
    color: "#d9a55c",
    blurb: {
      uk: "Інтерфейс, композиція, естетика. Знає, коли прибрати, а не додати.",
      en: "Interface, composition, aesthetics. Knows when to remove rather than add.",
    },
    lines: {
      uk: [
        "Охра на стінах вигоріла нерівно. Хтось підбирав палітру руками. Повага.",
        "Дзеркало. Не дивись надто довго — воно чесніше за будь-яке портфоліо.",
        "Жодного неону. Хтось тут розуміє, що приглушене складніше за яскраве.",
        "Світло падає з вікна не туди, куди мало б. Але так гарніше, тож промовчимо.",
      ],
      en: [
        "The ochre on these walls faded unevenly. Someone mixed this palette by hand. Respect.",
        "A mirror. Don't look too long — it is more honest than any portfolio.",
        "Not a single neon accent. Someone here understands that muted is harder than loud.",
        "The window light falls in the wrong direction. It looks better this way, so we say nothing.",
      ],
    },
  },
  {
    id: "empathy",
    name: { uk: "ЕМПАТІЯ", en: "EMPATHY" },
    attribute: "psyche",
    level: 4,
    color: "#cb8a74",
    blurb: {
      uk: "UX, дослідження, розмови з клієнтом. Чує те, чого не сказали вголос.",
      en: "UX, research, client conversations. Hears the thing that wasn't said out loud.",
    },
    lines: {
      uk: [
        "Він боїться, що ти закриєш вкладку через п'ять секунд. Кожен боїться.",
        "Радіо стоїть біля ліжка. Хтось не любить тишу, коли працює до ночі.",
        "Ти шукаєш контакти, правда? Вони є. Просто не поспішай.",
        "Валіза не розпакована. Людина, що будувала цю кімнату, ще не вирішила, чи залишиться.",
      ],
      en: [
        "He is afraid you will close the tab in five seconds. They all are.",
        "The radio sits by the bed. Someone dislikes silence when they work through the night.",
        "You are looking for the contacts, aren't you. They exist. Take your time.",
        "The suitcase is still packed. Whoever built this room hasn't decided if he's staying.",
      ],
    },
  },
  {
    id: "drama",
    name: { uk: "ДРАМА", en: "DRAMA" },
    attribute: "psyche",
    level: 3,
    color: "#d4787f",
    blurb: {
      uk: "Сторітелінг, презентація, копірайт. Знає, що технічно правильне ще треба продати.",
      en: "Storytelling, presentation, copy. Knows that being technically right still has to be sold.",
    },
    lines: {
      uk: [
        "О, ти прийшов дивитися на роботи. Тоді влаштуємо виставу.",
        "Кажи «архітектурне рішення», а не «я так зробив, бо швидше». Публіка любить упевненість.",
        "Зауваж, як недбало кинута пляшка. Це не безлад — це мізансцена.",
        "Він скромно назвав це портфоліо. Це декорація, і ти в ній зараз стоїш.",
      ],
      en: [
        "Ah — you came to look at the work. Then let us put on a show.",
        "Say \"an architectural decision\", never \"it was faster this way\". Audiences reward confidence.",
        "Note how carelessly the bottle was dropped. That is not mess. That is staging.",
        "He modestly calls this a portfolio. It is a set, and you are standing in it.",
      ],
    },
  },
  {
    id: "encyclopedia",
    name: { uk: "ЕНЦИКЛОПЕДІЯ", en: "ENCYCLOPEDIA" },
    attribute: "intellect",
    level: 5,
    color: "#a9b48d",
    blurb: {
      uk: "Технічні знання, деталі, документація. Пам'ятає, чому це працює саме так.",
      en: "Technical knowledge, details, documentation. Remembers why the thing works the way it does.",
    },
    lines: {
      uk: [
        "Ізометрія: паралельна проєкція, кути 30°. Жодної перспективи, жодної точки зникнення.",
        "Ця кімната намальована векторами, не картинкою. Тому масштабується без втрат.",
        "Готель у Мартінезі, звідки все почалося. Не тут. Там. Але ідея та сама.",
        "Охра, теракота, бурштин — пігменти, доступні до появи синтетичних барвників.",
      ],
      en: [
        "Isometric: parallel projection, thirty-degree angles. No perspective, no vanishing point.",
        "This room is drawn in vectors, not pixels. That is why it scales without loss.",
        "A hotel in Martinaise, where it all began. Not here. There. But the idea is the same.",
        "Ochre, terracotta, amber — pigments available long before synthetic dyes existed.",
      ],
    },
  },
  {
    id: "kinesthetics",
    name: { uk: "КІНЕСТЕТИКА", en: "KINESTHETICS" },
    attribute: "motorics",
    level: 4,
    color: "#c9b58d",
    blurb: {
      uk: "Анімації, інтеракції, відчуття продукту. Різниця між «працює» і «приємно».",
      en: "Animation, interaction, product feel. The difference between it works and it feels good.",
    },
    lines: {
      uk: [
        "Твоя рука вже тягнеться до дошки. Тіло вирішило раніше за тебе.",
        "Переходи тут повільні. Навмисно. Поспіх ламає настрій.",
        "Відчуй вагу панелі, коли вона проступає. Вона не вискакує — вона з'являється.",
        "Якщо ти вимкнув анімації в системі — сайт це помітив і не сперечається.",
      ],
      en: [
        "Your hand is already moving toward the board. The body decided before you did.",
        "The transitions here are slow. Deliberately. Haste ruins the mood.",
        "Feel the weight of the panel as it surfaces. It doesn't pop. It arrives.",
        "If you disabled animation system-wide, this site noticed and won't argue.",
      ],
    },
  },
];

export const SKILL_BY_ID = Object.fromEntries(
  SKILLS.map((skill) => [skill.id, skill]),
) as Record<SkillId, Skill>;

/** Максимальний рівень навички — шкала для character sheet. */
export const MAX_SKILL_LEVEL = 6;

/**
 * Три групи замість чотирьох, як у грі: шість навичок ділиться на
 * три пари рівно, а вигадувати «фізіологію» для розробника було б
 * натягуванням. Розподіл повторює логіку оригіналу — там візуальний
 * аналіз і кінестетика теж належать до моторики.
 */
export const ATTRIBUTES: Attribute[] = [
  {
    id: "intellect",
    name: { uk: "ІНТЕЛЕКТ", en: "INTELLECT" },
    color: "#6fa397",
    blurb: {
      uk: "Розбирає задачу на частини й тримає в голові всю систему.",
      en: "Takes the problem apart and holds the whole system in view.",
    },
  },
  {
    id: "psyche",
    name: { uk: "ПСИХІКА", en: "PSYCHE" },
    color: "#cb8a74",
    blurb: {
      uk: "Читає людей і вміє розповісти так, щоб зрозуміли й повірили.",
      en: "Reads people, and tells the story so they understand and believe it.",
    },
  },
  {
    id: "motorics",
    name: { uk: "МОТОРИКА", en: "MOTORICS" },
    color: "#d9a55c",
    blurb: {
      uk: "Відчуття форми й руху: як інтерфейс виглядає і як він реагує.",
      en: "A feel for form and motion: how the interface looks and how it answers.",
    },
  },
];

export function skillsOf(attribute: AttributeId): Skill[] {
  return SKILLS.filter((skill) => skill.attribute === attribute);
}

/**
 * Значення атрибута — середнє по його навичках, округлене.
 * У грі залежність обернена (атрибут задає базу для навичок), але
 * тут первинна саме самооцінка за навичками, тому рахуємо від них.
 */
export function attributeLevel(attribute: AttributeId): number {
  const group = skillsOf(attribute);
  if (group.length === 0) return 0;

  const sum = group.reduce((total, skill) => total + skill.level, 0);
  return Math.round(sum / group.length);
}
