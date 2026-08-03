import { Cormorant, Lora } from "next/font/google";

/**
 * Обидві сімʼї обрані зі списку в ТЗ саме тому, що мають кирилицю.
 * Marcellus, який ТЗ пропонує першим варіантом для заголовків,
 * має лише latin — український текст падав би на системний шрифт.
 */
export const fontDisplay = Cormorant({
  variable: "--font-cormorant",
  subsets: ["latin", "latin-ext", "cyrillic"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const fontBody = Lora({
  variable: "--font-lora",
  subsets: ["latin", "latin-ext", "cyrillic"],
  display: "swap",
});
