import { getCollection } from "astro:content";
import type { Lang } from "@/consts";

/** Drafts are visible in `astro dev` but hidden from the production build. */
export const SHOW_DRAFTS = import.meta.env.DEV;

/** Strip the language prefix from a post id -> the public slug. */
export function slugOf(id: string): string {
  return id.replace(/^(pt|en)\//, "");
}

/** Posts for a locale, newest first, with drafts filtered out in production. */
export async function getPosts(lang: Lang) {
  const posts = await getCollection(
    "blog",
    (p) => p.data.lang === lang && (SHOW_DRAFTS || !p.data.draft),
  );
  return posts.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}

/** All published posts across locales (for RSS / sitemap). */
export async function getAllPosts() {
  const posts = await getCollection(
    "blog",
    (p) => SHOW_DRAFTS || !p.data.draft,
  );
  return posts.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}
