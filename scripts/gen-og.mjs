import { Resvg } from "@resvg/resvg-js";
import { writeFileSync } from "node:fs";

// OG card (1200x630), tuned to render cleanly with the bundled DejaVu Sans
// fallback so it's deterministic across environments (no Inter needed).
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
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
    <rect x="80" y="78" width="62" height="62" rx="14" fill="#9c1f33"/>
    <text x="111" y="122" font-size="30" font-weight="bold" fill="#ffffff" text-anchor="middle">LB</text>
    <text x="162" y="121" font-size="27" font-weight="bold" fill="#c7c7d1">Leonardo Basso  ·  Product Engineer</text>
    <text x="80" y="308" font-size="72" font-weight="bold" fill="#ffffff">Building AI automation</text>
    <text x="80" y="392" font-size="72" font-weight="bold" fill="#ffffff">for restaurant growth.</text>
    <text x="80" y="486" font-size="28" fill="#a6a6b3">2,000+ restaurants  ·  R$4M+ managed  ·  R$20M+ tracked sales</text>
  </g>
</svg>`;

const resvg = new Resvg(svg, {
  fitTo: { mode: "width", value: 1200 },
  font: {
    fontDirs: ["/usr/share/fonts/truetype/dejavu"],
    defaultFontFamily: "DejaVu Sans",
    loadSystemFonts: true,
  },
});
const png = resvg.render().asPng();
writeFileSync(new URL("../public/og.png", import.meta.url), png);
console.log(`Wrote public/og.png (${png.length} bytes)`);
