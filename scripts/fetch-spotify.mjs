import { writeFileSync } from "node:fs";

// Requires GitHub Secrets: SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET,
// SPOTIFY_REFRESH_TOKEN. See README for how to obtain the refresh token.
const { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET, SPOTIFY_REFRESH_TOKEN } =
  process.env;

if (!SPOTIFY_CLIENT_ID || !SPOTIFY_CLIENT_SECRET || !SPOTIFY_REFRESH_TOKEN) {
  console.error("Missing Spotify secrets.");
  process.exit(1);
}

const basic = Buffer.from(
  `${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`,
).toString("base64");

const tokenRes = await fetch("https://accounts.spotify.com/api/token", {
  method: "POST",
  headers: {
    Authorization: `Basic ${basic}`,
    "Content-Type": "application/x-www-form-urlencoded",
  },
  body: new URLSearchParams({
    grant_type: "refresh_token",
    refresh_token: SPOTIFY_REFRESH_TOKEN,
  }),
});
const { access_token } = await tokenRes.json();
if (!access_token) {
  console.error("Could not refresh Spotify token.");
  process.exit(1);
}

const res = await fetch(
  "https://api.spotify.com/v1/me/player/recently-played?limit=8",
  { headers: { Authorization: `Bearer ${access_token}` } },
);
const data = await res.json();

const tracks = (data.items || []).map((i) => ({
  name: i.track.name,
  artist: i.track.artists.map((a) => a.name).join(", "),
  url: i.track.external_urls?.spotify,
  image: i.track.album?.images?.at(-1)?.url,
  playedAt: i.played_at,
}));

writeFileSync(
  new URL("../src/data/spotify.json", import.meta.url),
  JSON.stringify({ updatedAt: new Date().toISOString(), tracks }, null, 2) +
    "\n",
);
console.log(`Wrote ${tracks.length} tracks.`);
