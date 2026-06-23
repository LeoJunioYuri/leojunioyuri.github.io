import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";
import { CATEGORIES } from "./i18n/categories";

const blog = defineCollection({
  // Posts live in src/content/blog/<lang>/<slug>.md
  loader: glob({ pattern: "**/*.md", base: "./src/content/blog" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    updated: z.coerce.date().optional(),
    lang: z.enum(["pt", "en"]),
    /** Primary bucket: drives the chip and the writing filter. */
    category: z.enum(CATEGORIES),
    /** Secondary free-form labels. */
    tags: z.array(z.string()).default([]),
    /** Pinned posts surface in the "Start here" section. */
    pinned: z.boolean().default(false),
    draft: z.boolean().default(false),
    /** Optional companion post id in the other language. */
    translationOf: z.string().optional(),
  }),
});

export const collections = { blog };
