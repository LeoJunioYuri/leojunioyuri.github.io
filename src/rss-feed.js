import rss from "@astrojs/rss";
import { SITE } from "@/consts";
import { getPosts, slugOf } from "@/content-utils";

const META = {
  pt: {
    description: "Notas sobre produto, engenharia e IA aplicada.",
    language: "pt-br",
    base: "/writing",
  },
  en: {
    description: "Notes on product, engineering and applied AI.",
    language: "en",
    base: "/en/writing",
  },
};

/** One feed per locale, so each declares a single, correct <language>. */
export async function buildFeed(context, lang) {
  const meta = META[lang];
  const posts = await getPosts(lang);
  return rss({
    title: SITE.name,
    description: meta.description,
    site: context.site,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.date,
      link: `${meta.base}/${slugOf(post.id)}`,
      categories: post.data.tags,
    })),
    customData: `<language>${meta.language}</language>`,
  });
}
