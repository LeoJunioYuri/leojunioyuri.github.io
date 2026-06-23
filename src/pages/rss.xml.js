import rss from "@astrojs/rss";
import { SITE } from "@/consts";
import { getAllPosts } from "@/content-utils";

export async function GET(context) {
  const posts = await getAllPosts();
  return rss({
    title: SITE.name,
    description: "Notes on product, engineering and applied AI.",
    site: context.site,
    items: posts.map((post) => {
        const lang = post.data.lang;
        const slug = post.id.replace(/^(pt|en)\//, "");
        const link =
          lang === "pt" ? `/writing/${slug}` : `/en/writing/${slug}`;
        return {
          title: post.data.title,
          description: post.data.description,
          pubDate: post.data.date,
          link,
          categories: post.data.tags,
        };
      }),
    customData: `<language>pt-br</language>`,
  });
}
