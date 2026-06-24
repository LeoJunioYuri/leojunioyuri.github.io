import { writeFileSync } from "node:fs";

const { STEAM_API_KEY, STEAM_ID } = process.env;

if (!STEAM_API_KEY || !STEAM_ID) {
  console.error("Missing Steam secrets.");
  process.exit(1);
}

function gameShape(g) {
  return {
    name: g.name,
    appid: g.appid,
    minutes2weeks: g.playtime_2weeks || 0,
    minutesTotal: g.playtime_forever || 0,
    image: g.img_icon_url
      ? `https://media.steampowered.com/steamcommunity/public/images/apps/${g.appid}/${g.img_icon_url}.jpg`
      : null,
    url: `https://store.steampowered.com/app/${g.appid}`,
  };
}

// Recently played (last 2 weeks)
const recentRes = await fetch(
  `https://api.steampowered.com/IPlayerService/GetRecentlyPlayedGames/v1/?key=${STEAM_API_KEY}&steamid=${STEAM_ID}&count=8`,
);
const recentData = await recentRes.json();
const games = (recentData.response?.games || []).map(gameShape);

// All owned games — sorted by total hours, top 8
const ownedRes = await fetch(
  `https://api.steampowered.com/IPlayerService/GetOwnedGames/v1/?key=${STEAM_API_KEY}&steamid=${STEAM_ID}&include_appinfo=true&include_played_free_games=true`,
);
const ownedData = await ownedRes.json();
const topGames = (ownedData.response?.games || [])
  .filter((g) => g.playtime_forever > 0)
  .sort((a, b) => b.playtime_forever - a.playtime_forever)
  .slice(0, 8)
  .map(gameShape);

// Wishlist — via IWishlistService API (requires "Game details: Public")
let wishlist = [];
try {
  const wRes = await fetch(
    `https://api.steampowered.com/IWishlistService/GetWishlist/v1/?key=${STEAM_API_KEY}&steamid=${STEAM_ID}`,
  );
  const wData = await wRes.json();
  const items = wData.response?.items ?? [];

  // Sort: prioritized items first, then by most recently added
  const sorted = [...items].sort((a, b) =>
    b.priority !== a.priority ? b.priority - a.priority : b.date_added - a.date_added
  );
  const top = sorted.slice(0, 12).map((i) => i.appid);

  // Batch-fetch names + header images (filters=basic keeps it fast)
  // Fetch each game individually (batch requests are unreliable)
  const results = await Promise.all(
    top.map(async (appid) => {
      try {
        const r = await fetch(
          `https://store.steampowered.com/api/appdetails?appids=${appid}&filters=basic`,
        );
        const json = await r.json();
        const d = json?.[String(appid)]?.data;
        if (!d) return null;
        return {
          name: d.name,
          appid,
          url: `https://store.steampowered.com/app/${appid}`,
          header: d.header_image ?? `https://cdn.cloudflare.steamstatic.com/steam/apps/${appid}/header.jpg`,
        };
      } catch { return null; }
    }),
  );
  wishlist = results.filter(Boolean);
  console.log(`Wishlist: ${wishlist.length} games.`);
} catch (e) {
  console.error("fetch-steam wishlist:", e.message);
}

writeFileSync(
  new URL("../src/data/steam.json", import.meta.url),
  JSON.stringify({ updatedAt: new Date().toISOString(), games, topGames, wishlist }, null, 2) + "\n",
);
console.log(`Recent: ${games.length} | Top: ${topGames.length} | Wishlist: ${wishlist.length}`);
