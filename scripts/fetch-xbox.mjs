import { writeFileSync } from "node:fs";

// Requires GitHub Secret: XBOX_API_KEY (from xbl.io)
// XUID resolved once from gamertag "Leonardo Yuri".
const { XBOX_API_KEY } = process.env;
const XUID = "2533274992722176";

if (!XBOX_API_KEY) {
  console.error("Missing XBOX_API_KEY.");
  process.exit(1);
}

const headers = {
  "X-Authorization": XBOX_API_KEY,
  "Accept": "application/json",
  "Accept-Language": "pt-BR,pt;q=0.9,en;q=0.8",
};

let recent = [];
let topGamerscore = [];

try {
  const res = await fetch(
    `https://xbl.io/api/v2/player/titleHistory/${XUID}`,
    { headers },
  );
  const data = await res.json();
  const titles = data.content?.titles ?? [];

  // Recently played — sorted by lastTimePlayed
  recent = titles
    .filter((t) => t.type === "Game" && t.titleHistory?.lastTimePlayed)
    .sort((a, b) =>
      new Date(b.titleHistory.lastTimePlayed).getTime() -
      new Date(a.titleHistory.lastTimePlayed).getTime()
    )
    .slice(0, 8)
    .map((t) => ({
      name: t.name,
      titleId: t.titleId,
      lastPlayed: t.titleHistory.lastTimePlayed,
      image: t.displayImage || null,
      gamerscore: t.achievement?.currentGamerscore ?? 0,
      url: `https://www.xbox.com/games/store/-/${t.titleId}`,
    }));

  // Most played proxy — sorted by gamerscore earned
  topGamerscore = titles
    .filter((t) => t.type === "Game" && (t.achievement?.currentGamerscore ?? 0) > 0)
    .sort((a, b) =>
      (b.achievement?.currentGamerscore ?? 0) - (a.achievement?.currentGamerscore ?? 0)
    )
    .slice(0, 8)
    .map((t) => ({
      name: t.name,
      titleId: t.titleId,
      image: t.displayImage || null,
      gamerscore: t.achievement?.currentGamerscore ?? 0,
      gamerscoreTotal: t.achievement?.totalGamerscore ?? 0,
      url: `https://www.xbox.com/games/store/-/${t.titleId}`,
    }));

  console.log(`Xbox recent: ${recent.length} | Top gamerscore: ${topGamerscore.length}.`);
} catch (e) {
  console.error("fetch-xbox:", e.message);
}

writeFileSync(
  new URL("../src/data/xbox.json", import.meta.url),
  JSON.stringify({ updatedAt: new Date().toISOString(), recent, topGamerscore }, null, 2) + "\n",
);
console.log("Wrote src/data/xbox.json");
