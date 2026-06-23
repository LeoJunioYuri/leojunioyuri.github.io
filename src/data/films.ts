export interface Film {
  title: string;
  year?: number;
  /** 0–5, half steps allowed (e.g. 4.5). Omit for watchlist items. */
  rating?: number;
  status: "watched" | "watchlist";
  favorite?: boolean;
  note?: string;
}

/**
 * Curated by hand — your films. Edit freely.
 * The examples below are placeholders (chosen to fit the vibe); replace them.
 */
export const films: Film[] = [
  // —— Assistidos / Watched ——
  { title: "Kingdom of Heaven", year: 2005, rating: 5, status: "watched", favorite: true, note: "Diretor's cut. [sua nota aqui]" },
  { title: "Gladiator", year: 2000, rating: 4.5, status: "watched" },
  { title: "Interstellar", year: 2014, rating: 4.5, status: "watched", favorite: true },

  // —— Quero ver / Watchlist ——
  { title: "The Name of the Rose", year: 1986, status: "watchlist" },
  { title: "Andrei Rublev", year: 1966, status: "watchlist" },
];
