/** Compact AED label for large treasury-style totals (T / B / M). */
export function formatAedExecutive(amount: number): string {
  const n = Number.isFinite(amount) ? amount : 0;
  const abs = Math.abs(n);
  if (abs >= 1e12) return `AED ${(n / 1e12).toFixed(2)}T`;
  if (abs >= 1e9) return `AED ${(n / 1e9).toFixed(2)}B`;
  if (abs >= 1e6) return `AED ${(n / 1e6).toFixed(2)}M`;
  if (abs >= 1e3) return `AED ${(n / 1e3).toFixed(1)}K`;
  return new Intl.NumberFormat("en-AE", {
    style: "currency",
    currency: "AED",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(n);
}
