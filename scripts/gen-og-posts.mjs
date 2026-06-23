import { readdirSync, readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { Resvg } from "@resvg/resvg-js";

// Generates a per-post OG image (1200x630) into public/og/<lang>-<slug>.png.
// Runs as `prebuild` so production builds always have fresh cards.

const root = fileURLToPath(new URL("..", import.meta.url));
const outDir = `${root}public/og`;
mkdirSync(outDir, { recursive: true });

const catLabel = {
  produto: { pt: "Produto", en: "Product" },
  engenharia: { pt: "Engenharia", en: "Engineering" },
  growth: { pt: "Growth", en: "Growth" },
  ia: { pt: "IA", en: "AI" },
  lideranca: { pt: "Liderança", en: "Leadership" },
  carreira: { pt: "Carreira", en: "Career" },
  pessoal: { pt: "Pessoal", en: "Personal" },
  reflexoes: { pt: "Reflexões", en: "Reflections" },
};

const esc = (s) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

// Wrap a title into lines of at most `max` chars (word-aware), up to 4 lines.
function wrap(text, max = 22) {
  const words = text.split(/\s+/);
  const lines = [];
  let line = "";
  for (const w of words) {
    if ((line + " " + w).trim().length > max) {
      if (line) lines.push(line);
      line = w;
    } else {
      line = (line + " " + w).trim();
    }
  }
  if (line) lines.push(line);
  return lines.slice(0, 4);
}

function svg({ title, category, lang }) {
  const cat = (catLabel[category] && catLabel[category][lang]) || "";
  const lines = wrap(title);
  const startY = 300 - (lines.length - 1) * 34;
  const tspans = lines
    .map(
      (l, i) =>
        `<text x="80" y="${startY + i * 78}" font-size="66" font-weight="bold" fill="#ffffff">${esc(l)}</text>`,
    )
    .join("");
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#0e0c0d"/>
      <stop offset="1" stop-color="#241016"/>
    </linearGradient>
    <radialGradient id="glow" cx="0.82" cy="0.18" r="0.7">
      <stop offset="0" stop-color="#9c1f33" stop-opacity="0.6"/>
      <stop offset="1" stop-color="#9c1f33" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>
  <rect width="1200" height="630" fill="url(#glow)"/>
  <g font-family="DejaVu Sans">
    <rect x="80" y="74" width="54" height="54" rx="12" fill="#9c1f33"/>
    <text x="107" y="111" font-size="26" font-weight="bold" fill="#ffffff" text-anchor="middle">LB</text>
    <text x="150" y="110" font-size="25" font-weight="bold" fill="#c7c0c2">Leonardo Basso${cat ? `  ·  ${esc(cat)}` : ""}</text>
    ${tspans}
    <text x="80" y="560" font-size="26" fill="#a59b92">leojunioyuri.github.io</text>
  </g>
</svg>`;
}

function parseFrontmatter(raw) {
  const m = raw.match(/^---\n([\s\S]*?)\n---/);
  if (!m) return {};
  const fm = {};
  for (const line of m[1].split("\n")) {
    const kv = line.match(/^(\w+):\s*"?(.*?)"?\s*$/);
    if (kv) fm[kv[1]] = kv[2];
  }
  return fm;
}

let count = 0;
for (const lang of ["pt", "en"]) {
  const dir = `${root}src/content/blog/${lang}`;
  let files;
  try {
    files = readdirSync(dir).filter((f) => f.endsWith(".md"));
  } catch {
    continue;
  }
  for (const file of files) {
    const slug = file.replace(/\.md$/, "");
    const fm = parseFrontmatter(readFileSync(`${dir}/${file}`, "utf8"));
    if (!fm.title) continue;
    const resvg = new Resvg(
      svg({ title: fm.title, category: fm.category, lang }),
      {
        fitTo: { mode: "width", value: 1200 },
        font: {
          fontDirs: ["/usr/share/fonts/truetype/dejavu"],
          defaultFontFamily: "DejaVu Sans",
          loadSystemFonts: true,
        },
      },
    );
    writeFileSync(`${outDir}/${lang}-${slug}.png`, resvg.render().asPng());
    count++;
  }
}
console.log(`Generated ${count} per-post OG images in public/og/.`);
