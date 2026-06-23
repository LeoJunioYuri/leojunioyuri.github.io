// @ts-check
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";

// https://astro.build
export default defineConfig({
  // GitHub Pages user site -> served at the domain root.
  site: "https://leojunioyuri.github.io",
  base: "/",
  trailingSlash: "ignore",
  integrations: [sitemap()],
  i18n: {
    defaultLocale: "pt",
    locales: ["pt", "en"],
    routing: {
      // PT lives at "/", EN lives at "/en/".
      prefixDefaultLocale: false,
    },
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
