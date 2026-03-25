/**
 * Layer 1 — Country capability offering (locked product matrix).
 *
 * Defines which L1 platforms exist in the **product** for each market (country).
 * This does **not** vary by user. User entitlements are applied on top in
 * `demoUserCapabilityGrants.ts`.
 *
 * Source of truth for the table: `docs/STUB_DATA_MATRIX_TEMPLATE.md` → Matrix A.
 */
export const L1_KEYS = [
  "accounts",
  "payments",
  "liquidity",
  "trade-finance",
  "collections",
  "supply-chain-finance",
  "virtual-accounts",
  "host-to-host",
  "reports-insights",
  "administration",
] as const;

export type L1Key = (typeof L1_KEYS)[number];

function allOff(): Record<L1Key, boolean> {
  return Object.fromEntries(L1_KEYS.map((k) => [k, false])) as Record<L1Key, boolean>;
}

function offered(...enabled: L1Key[]): Record<L1Key, boolean> {
  const o = allOff();
  for (const k of enabled) o[k] = true;
  return o;
}

/**
 * For each ISO/catalog market code: which L1s the **country / market** offers (`yes` in Matrix A).
 * Blank cells in the doc = not offered → always false here.
 */
export const COUNTRY_OFFERED_L1: Record<string, Record<L1Key, boolean>> = {
  UAE: offered(...L1_KEYS),
  UK: offered("accounts", "payments", "reports-insights", "administration"),
  SG: offered("accounts", "payments", "reports-insights", "administration"),
  HK: offered("accounts", "payments"),
  FR: offered(
    "accounts",
    "payments",
    "liquidity",
    "trade-finance",
    "virtual-accounts",
    "host-to-host",
    "reports-insights",
    "administration"
  ),
  US: offered("accounts", "payments"),
  CN: offered("accounts", "payments"),
  KW: offered("accounts", "payments"),
  KSA: offered("accounts", "payments", "supply-chain-finance", "virtual-accounts", "host-to-host"),
};

export function normalizeMarketKey(marketCode: string): string {
  return marketCode.trim().toUpperCase();
}

/** Map of L1 → offered in this market, or `undefined` if market not in matrix. */
export function getCountryOfferedL1(marketCode: string): Record<L1Key, boolean> | undefined {
  return COUNTRY_OFFERED_L1[normalizeMarketKey(marketCode)];
}
