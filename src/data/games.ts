export interface Game {
  title: string;
  year?: number;
  platform?: string;
  /** 0–5, half steps allowed. Omit for wishlist items. */
  rating?: number;
  status: "played" | "wishlist";
  favorite?: boolean;
  note?: string;
}

/**
 * Curated by hand — your games. Edit freely.
 * The examples below are placeholders; replace them.
 */
export const games: Game[] = [
  // —— Favoritos & jogados / Favorites & played ——
  { title: "World of Warcraft", platform: "PC", rating: 5, status: "played", favorite: true, note: "[sua nota aqui]" },
  { title: "The Witcher 3: Wild Hunt", year: 2015, rating: 5, status: "played", favorite: true },
  { title: "Hollow Knight", year: 2017, rating: 4.5, status: "played" },

  // —— Quero jogar / Want to play ——
  { title: "Hollow Knight: Silksong", status: "wishlist" },
  { title: "Elden Ring", year: 2022, status: "wishlist" },
];
