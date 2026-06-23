import { writeFileSync } from "node:fs";

// No secret needed — YouTube exposes a public per-channel RSS feed.
// Set YOUTUBE_CHANNEL_ID (the "UC..." id) as a repo variable or secret.
const { YOUTUBE_CHANNEL_ID } = process.env;

if (!YOUTUBE_CHANNEL_ID) {
  console.error("Missing YOUTUBE_CHANNEL_ID.");
  process.exit(1);
}

const res = await fetch(
  `https://www.youtube.com/feeds/videos.xml?channel_id=${YOUTUBE_CHANNEL_ID}`,
);
const xml = await res.text();

// Light parse of the Atom feed (no XML dependency).
const entries = xml.split("<entry>").slice(1, 7);
const videos = entries.map((e) => {
  const id = (e.match(/<yt:videoId>(.*?)<\/yt:videoId>/) || [])[1];
  const title = (e.match(/<title>(.*?)<\/title>/) || [])[1] || "";
  return {
    title: title.replace(/&amp;/g, "&").replace(/&quot;/g, '"'),
    url: `https://www.youtube.com/watch?v=${id}`,
    thumbnail: id ? `https://i.ytimg.com/vi/${id}/hqdefault.jpg` : null,
  };
});

writeFileSync(
  new URL("../src/data/youtube.json", import.meta.url),
  JSON.stringify({ updatedAt: new Date().toISOString(), videos }, null, 2) +
    "\n",
);
console.log(`Wrote ${videos.length} videos.`);
