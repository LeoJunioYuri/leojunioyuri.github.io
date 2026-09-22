import { buildFeed } from "@/rss-feed";

export const GET = (context) => buildFeed(context, "en");
