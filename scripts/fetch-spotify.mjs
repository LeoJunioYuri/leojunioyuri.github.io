import { writeFileSync } from "node:fs";

const { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET, SPOTIFY_REFRESH_TOKEN } = process.env;

if (!SPOTIFY_CLIENT_ID || !SPOTIFY_CLIENT_SECRET || !SPOTIFY_REFRESH_TOKEN) {
  console.error("Missing Spotify secrets.");
  process.exit(1);
}

const basic = Buffer.from(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`).toString("base64");

const tokenRes = await fetch("https://accounts.spotify.com/api/token", {
  method: "POST",
  headers: { Authorization: `Basic ${basic}`, "Content-Type": "application/x-www-form-urlencoded" },
  body: new URLSearchParams({ grant_type: "refresh_token", refresh_token: SPOTIFY_REFRESH_TOKEN }),
});
const { access_token } = await tokenRes.json();
if (!access_token) { console.error("Could not refresh Spotify token."); process.exit(1); }

const headers = { Authorization: `Bearer ${access_token}` };

// Recently played
const recentRes = await fetch("https://api.spotify.com/v1/me/player/recently-played?limit=8", { headers });
const recentData = await recentRes.json();
const tracks = (recentData.items || []).map((i) => ({
  name: i.track.name,
  artist: i.track.artists.map((a) => a.name).join(", "),
  url: i.track.external_urls?.spotify,
  image: i.track.album?.images?.at(-1)?.url,
  playedAt: i.played_at,
}));

// All-time top tracks
const topRes = await fetch("https://api.spotify.com/v1/me/top/tracks?limit=12&time_range=long_term", { headers });
const topData = await topRes.json();
const topTracks = (topData.items || []).map((t, i) => ({
  rank: i + 1,
  name: t.name,
  artist: t.artists.map((a) => a.name).join(", "),
  url: t.external_urls?.spotify,
  image: t.album?.images?.at(-1)?.url,
}));

writeFileSync(
  new URL("../src/data/spotify.json", import.meta.url),
  JSON.stringify({ updatedAt: new Date().toISOString(), tracks, topTracks }, null, 2) + "\n",
);
console.log(`Recent: ${tracks.length} | Top all-time: ${topTracks.length} tracks.`);
