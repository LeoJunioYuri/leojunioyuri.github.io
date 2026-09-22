import { writeFileSync } from "node:fs";

// Reads the MetaAds headline floors from a Metabase *public* card (card 21220,
// "[PÚBLICO] Site leojunioyuri — métricas MetaAds arredondadas"). The card's
// SQL already rounds every value down, so raw figures never leave Metabase.
// Set METABASE_METRICS_URL (…/api/public/card/<uuid>/query/json) as a secret.
const { METABASE_METRICS_URL } = process.env;

if (!METABASE_METRICS_URL) {
  console.error("Missing METABASE_METRICS_URL.");
  process.exit(1);
}

const res = await fetch(METABASE_METRICS_URL);
if (!res.ok) throw new Error(`Metabase responded ${res.status}`);
const [row] = await res.json();

// Refuse anything that isn't a rounded floor, so a card edit can't leak
// exact numbers onto the site.
const rules = {
  restaurants: (v) => v % 100 === 0,
  active: (v) => v % 100 === 0,
  sales_millions: () => true,
  monthly_thousands: (v) => v % 100 === 0,
};
for (const [key, isRounded] of Object.entries(rules)) {
  const v = row?.[key];
  if (!Number.isInteger(v) || v <= 0 || !isRounded(v)) {
    throw new Error(`Unexpected value for ${key}: ${v}`);
  }
}
const extra = Object.keys(row).filter((k) => !(k in rules));
if (extra.length) throw new Error(`Unexpected columns: ${extra.join(", ")}`);

const metrics = {
  restaurants: row.restaurants,
  active: row.active,
  salesMillions: row.sales_millions,
  monthlyThousands: row.monthly_thousands,
};
writeFileSync(
  new URL("../src/data/brendi-metrics.json", import.meta.url),
  JSON.stringify(metrics, null, 2) + "\n",
);
console.log("Wrote MetaAds metrics.");
