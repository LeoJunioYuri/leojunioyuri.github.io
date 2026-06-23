import { writeFileSync } from "node:fs";

// Requires GitHub Secrets: STEAM_API_KEY (https://steamcommunity.com/dev/apikey)
// and STEAM_ID (your 64-bit SteamID). Profile must be public.
const { STEAM_API_KEY, STEAM_ID } = process.env;

if (!STEAM_API_KEY || !STEAM_ID) {
  console.error("Missing Steam secrets.");
  process.exit(1);
}

const res = await fetch(
  `https://api.steampowered.com/IPlayerService/GetRecentlyPlayedGames/v1/?key=${STEAM_API_KEY}&steamid=${STEAM_ID}&count=8`,
);
const data = await res.json();

const games = (data.response?.games || []).map((g) => ({
  name: g.name,
  appid: g.appid,
  minutes2weeks: g.playtime_2weeks || 0,
  minutesTotal: g.playtime_forever || 0,
  image: g.img_icon_url
    ? `https://media.steampowered.com/steamcommunity/public/images/apps/${g.appid}/${g.img_icon_url}.jpg`
    : null,
  url: `https://store.steampowered.com/app/${g.appid}`,
}));

writeFileSync(
  new URL("../src/data/steam.json", import.meta.url),
  JSON.stringify({ updatedAt: new Date().toISOString(), games }, null, 2) + "\n",
);
console.log(`Wrote ${games.length} games.`);
