import type { Lang } from "@/consts";
import data from "@/data/brendi-metrics.json";

/**
 * MetaAds headline numbers, formatted for display.
 *
 * src/data/brendi-metrics.json holds rounded-down floors refreshed by
 * scripts/fetch-brendi-metrics.mjs (Metabase public card) in the
 * "Update /life data" workflow.
 */

/** Cumulative media managed. The metrics table only starts in Nov 2025, so
 *  it can't be derived from the card — kept as a manual floor. */
const MEDIA_MILLIONS = 4;

/** First month building MetaAds (Career: "Oct 2024 — present"). */
const START = { year: 2024, month: 10 };

function monthsBuilding(now = new Date()) {
  return (now.getFullYear() - START.year) * 12 + (now.getMonth() + 1 - START.month);
}

export function metrics(lang: Lang) {
  const n = (v: number) => v.toLocaleString(lang === "pt" ? "pt-BR" : "en");
  return {
    restaurants: `${n(data.restaurants)}+`,
    active: `${n(data.active)}+`,
    media: `R$${MEDIA_MILLIONS}M+`,
    sales: `R$${data.salesMillions}M+`,
    monthly: `R$${data.monthlyThousands}k+`,
    months: String(monthsBuilding()),
  };
}
