import { writeFileSync } from "node:fs";

// Requires GitHub Secrets: BNET_CLIENT_ID, BNET_CLIENT_SECRET
// Region: US (covers BR realms like Goldrinn)
const { BNET_CLIENT_ID, BNET_CLIENT_SECRET } = process.env;

if (!BNET_CLIENT_ID || !BNET_CLIENT_SECRET) {
  console.error("Missing BNET_CLIENT_ID or BNET_CLIENT_SECRET.");
  process.exit(1);
}

const CHARACTER = { realm: "goldrinn", name: "lyonys", region: "us", locale: "pt_BR" };
const API = `https://${CHARACTER.region}.api.blizzard.com`;
const NS_PROFILE = `profile-${CHARACTER.region}`;

// Get access token
const tokenRes = await fetch("https://oauth.battle.net/token", {
  method: "POST",
  headers: { "Content-Type": "application/x-www-form-urlencoded" },
  body: new URLSearchParams({
    grant_type: "client_credentials",
    client_id: BNET_CLIENT_ID,
    client_secret: BNET_CLIENT_SECRET,
  }),
});
const { access_token } = await tokenRes.json();
if (!access_token) { console.error("Could not get Battle.net token."); process.exit(1); }

const headers = { Authorization: `Bearer ${access_token}` };
const qs = `namespace=${NS_PROFILE}&locale=${CHARACTER.locale}`;
const url = (path) => `${API}/profile/wow/character/${CHARACTER.realm}/${CHARACTER.name}${path}?${qs}`;

async function get(path) {
  const res = await fetch(url(path), { headers });
  return res.ok ? res.json() : null;
}

// Fetch in parallel
const [char, media, encounters] = await Promise.all([
  get(""),
  get("/character-media"),
  get("/encounters/raids"),
]);

const avatar = media?.assets?.find((a) => a.key === "avatar")?.value ?? null;
const inset  = media?.assets?.find((a) => a.key === "inset")?.value ?? null;

// Recent raids: last 2 expansions, first 3 instances each
const raids = (encounters?.expansions ?? [])
  .slice(-2)
  .flatMap((ex) =>
    (ex.instances ?? []).slice(0, 4).map((inst) => ({
      name: inst.instance?.name,
      kills: (inst.modes ?? []).reduce((s, m) => s + (m.progress?.completed_count ?? 0), 0),
    }))
  )
  .filter((r) => r.kills > 0)
  .slice(0, 6);

const wow = {
  name: char?.name,
  level: char?.level,
  race: char?.race?.name,
  class: char?.character_class?.name,
  spec: char?.active_spec?.name,
  ilvl: char?.equipped_item_level,
  achievementPoints: char?.achievement_points,
  faction: char?.faction?.name,
  realm: char?.realm?.name,
  guild: char?.guild?.name,
  avatar,
  inset,
  raids,
  profileUrl: `https://worldofwarcraft.blizzard.com/pt-br/character/${CHARACTER.region}/${CHARACTER.realm}/${CHARACTER.name}`,
};

writeFileSync(
  new URL("../src/data/wow.json", import.meta.url),
  JSON.stringify({ updatedAt: new Date().toISOString(), wow }, null, 2) + "\n",
);
console.log(`WoW: ${wow.name} (${wow.class} ${wow.level}) — ${wow.achievementPoints} pts`);
