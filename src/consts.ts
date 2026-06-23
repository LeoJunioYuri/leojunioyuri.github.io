/** Global site metadata. */
export const SITE = {
  name: "Leonardo Basso",
  url: "https://leojunioyuri.github.io",
  email: "leojunioyuri@hotmail.com",
  socials: {
    github: "https://github.com/leojunioyuri",
    linkedin: "https://www.linkedin.com/in/leojunioyuri/",
    instagram: "https://instagram.com/leojunioyuri",
    // TODO: confirme o handle do seu canal.
    youtube: "https://youtube.com/@leojunioyuri",
  },
  // External profiles for the /life page. Leave empty ("") to hide the link.
  links: {
    imdb: "https://letterboxd.com/leojunioyuri/films/",
    youtube: "https://youtube.com/@leojunioyuri",
    steam: "https://steamcommunity.com/id/leojunioyuri/",
  },
} as const;

export type Lang = "pt" | "en";
export const LANGS: Lang[] = ["pt", "en"];
