import { writeFileSync } from "node:fs";

const USERNAME = "leojunioyuri";
const HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (compatible; RSS reader; +https://leojunioyuri.github.io)",
  Accept: "application/rss+xml, application/xml, text/xml, */*",
};

async function fetchRss(url) {
  const res = await fetch(url, { headers: HEADERS });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  return res.text();
}

/** Extract text content of the first occurrence of a tag. */
function tag(xml, name) {
  const m = xml.match(new RegExp(`<${name}[^>]*>([\\s\\S]*?)<\\/${name}>`, "i"));
  return m ? m[1].trim() : null;
}

/** Extract all <item> blocks from RSS. */
function items(xml) {
  return [...xml.matchAll(/<item>([\s\S]*?)<\/item>/gi)].map((m) => m[1]);
}

/** Extract poster URL from Letterboxd description HTML. */
function poster(descHtml) {
  const m = descHtml?.match(/src="([^"]+)"/);
  return m ? m[1] : null;
}

// ── Watched films (with ratings) ──────────────────────────────────────────────
let watched = [];
try {
  const xml = await fetchRss(
    `https://letterboxd.com/${USERNAME}/films/rss/`,
  );
  watched = items(xml).map((item) => {
    const title = tag(item, "letterboxd:filmTitle") ?? tag(item, "title");
    const year  = tag(item, "letterboxd:filmYear");
    const ratingRaw = tag(item, "letterboxd:memberRating");
    const desc  = tag(item, "description");
    const link  = tag(item, "link");
    return {
      title,
      year:   year   ? parseInt(year, 10) : null,
      rating: ratingRaw ? parseFloat(ratingRaw) : null,
      url:    link,
      poster: poster(desc),
    };
  }).filter((f) => f.title);
  console.log(`Watched: ${watched.length} films.`);
} catch (e) {
  console.error("fetch-letterboxd watched:", e.message);
}

// ── Watchlist ─────────────────────────────────────────────────────────────────
let watchlist = [];
try {
  const xml = await fetchRss(
    `https://letterboxd.com/${USERNAME}/watchlist/rss/`,
  );
  watchlist = items(xml).map((item) => {
    const title = tag(item, "letterboxd:filmTitle") ?? tag(item, "title");
    const year  = tag(item, "letterboxd:filmYear");
    const desc  = tag(item, "description");
    const link  = tag(item, "link");
    return {
      title,
      year:   year ? parseInt(year, 10) : null,
      url:    link,
      poster: poster(desc),
    };
  }).filter((f) => f.title);
  console.log(`Watchlist: ${watchlist.length} films.`);
} catch (e) {
  console.error("fetch-letterboxd watchlist:", e.message);
}

writeFileSync(
  new URL("../src/data/letterboxd.json", import.meta.url),
  JSON.stringify(
    { updatedAt: new Date().toISOString(), watched, watchlist },
    null,
    2,
  ) + "\n",
);
console.log("Wrote src/data/letterboxd.json");
