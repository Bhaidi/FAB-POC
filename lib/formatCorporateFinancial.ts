/**
 * Large-value formatting for grid cells (B / M / K) with ISO currency code.
 * Example: 361_000_000_000 → "AED 361B"
 */
export function formatCorporateCurrencyCompact(amount: number, currencyCode: string): string {
  const n = Number.isFinite(amount) ? amount : 0;
  const abs = Math.abs(n);
  const code = (currencyCode || "AED").toUpperCase();
  const sign = n < 0 ? "−" : "";
  if (abs >= 1e9) return `${sign}${code} ${(abs / 1e9).toFixed(abs >= 100e9 ? 0 : 2)}B`;
  if (abs >= 1e6) return `${sign}${code} ${(abs / 1e6).toFixed(abs >= 100e6 ? 0 : 2)}M`;
  if (abs >= 1e3) return `${sign}${code} ${(abs / 1e3).toFixed(1)}K`;
  return `${sign}${code} ${abs.toLocaleString("en-AE", { maximumFractionDigits: 0 })}`;
}

export function formatPercentValue(pct: number, digits = 2): string {
  if (!Number.isFinite(pct)) return "—";
  return `${pct.toFixed(digits)}%`;
}
