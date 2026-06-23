import type { Lang } from "@/consts";

/** Single primary bucket per post — drives the chip and the writing filter. */
export const CATEGORIES = [
  "produto",
  "engenharia",
  "growth",
  "ia",
  "lideranca",
  "carreira",
  "pessoal",
  "reflexoes",
] as const;

export type Category = (typeof CATEGORIES)[number];

export const categoryLabel: Record<Lang, Record<Category, string>> = {
  pt: {
    produto: "Produto",
    engenharia: "Engenharia",
    growth: "Growth",
    ia: "IA",
    lideranca: "Liderança",
    carreira: "Carreira",
    pessoal: "Pessoal",
    reflexoes: "Reflexões",
  },
  en: {
    produto: "Product",
    engenharia: "Engineering",
    growth: "Growth",
    ia: "AI",
    lideranca: "Leadership",
    carreira: "Career",
    pessoal: "Personal",
    reflexoes: "Reflections",
  },
};

/** Accent color per category — colored text on a faint same-hue background. */
export const categoryColor: Record<Category, string> = {
  produto: "#6366f1",
  engenharia: "#0ea5e9",
  growth: "#16a34a",
  ia: "#a855f7",
  lideranca: "#d97706",
  carreira: "#0d9488",
  pessoal: "#ec4899",
  reflexoes: "#6b7280",
};
