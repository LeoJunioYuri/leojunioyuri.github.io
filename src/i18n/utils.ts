import type { Lang } from "@/consts";
import { ui, type UIKey } from "./ui";

/** Returns a translator bound to a locale. Falls back to PT for missing keys. */
export function useTranslations(lang: Lang) {
  return function t<K extends UIKey>(key: K): (typeof ui)["pt"][K] {
    return (ui[lang][key] ?? ui.pt[key]) as (typeof ui)["pt"][K];
  };
}

/** Build a localized path. PT lives at root, EN under /en/. */
export function localizedPath(lang: Lang, path = ""): string {
  const clean = path.replace(/^\/+|\/+$/g, "");
  if (lang === "pt") return clean ? `/${clean}` : "/";
  return clean ? `/en/${clean}` : "/en/";
}

/** The same page in the other locale (used by the language toggle). */
export function alternatePath(lang: Lang, currentPath: string): string {
  const other: Lang = lang === "pt" ? "en" : "pt";
  // Strip a leading /en if present, then re-localize.
  const base = currentPath.replace(/^\/en(\/|$)/, "/");
  return localizedPath(other, base);
}

/** Locale-aware date formatting. */
export function formatDate(date: Date, lang: Lang): string {
  return new Intl.DateTimeFormat(lang === "pt" ? "pt-BR" : "en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}

/** Rough reading time from the raw markdown body. */
export function readingTime(body: string): number {
  const words = body.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
}
