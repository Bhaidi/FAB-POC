/**
 * Visual hints for platform market codes — driven by API `marketCode`, not free-text names.
 */

const FLAG_BY_MARKET_CODE: Record<string, string> = {
  UAE: "🇦🇪",
  UK: "🇬🇧",
  US: "🇺🇸",
  SG: "🇸🇬",
  FR: "🇫🇷",
  CN: "🇨🇳",
  HK: "🇭🇰",
  KW: "🇰🇼",
  KSA: "🇸🇦",
};

/** Regional flag emoji for known markets; `null` when a non-flag icon should be used. */
export function marketFlagEmoji(marketCode: string | null | undefined): string | null {
  const code = marketCode?.trim().toUpperCase();
  if (!code) return null;
  return FLAG_BY_MARKET_CODE[code] ?? null;
}
