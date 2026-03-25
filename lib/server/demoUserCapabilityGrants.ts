/**
 * Layer 2 — User capability grants within country offerings.
 *
 * Each stub login maps 1:1 to an `organizationId` (`org-9001` …). Here we record
 * which L1s that **user** must **not** receive in a given market, even when the country
 * offers them. Omitted L1 keys mean: “if the country offers it, this user gets it.”
 *
 * Effective rule: `enabled = countryOffers[l1] && denials[l1] !== false`
 *
 * @see docs/STUB_DATA_MATRIX_TEMPLATE.md — Matrix B (user grants)
 * @see docs/PLATFORM_TEST_PERSONAS.md — login ↔ org
 */
import {
  L1_KEYS,
  type L1Key,
  getCountryOfferedL1,
  normalizeMarketKey,
} from "@/lib/server/countryCapabilityMatrix";

/** Markets for which we build `service-access` per stub org (must match platform stub slices). */
export const DEMO_ORG_MARKETS: Record<string, readonly string[]> = {
  /** Max persona — five regions with full catalog slices */
  "org-9001": ["UAE", "UK", "SG", "HK", "FR"],
  /** Min persona — single home market */
  "org-9002": ["UAE"],
  /** Checker / approver — three-region queue */
  "org-9003": ["UAE", "UK", "SG"],
};

/**
 * `organizationId` → market → L1 → `false` = user is **not** entitled (hidden), even if country offers.
 * Only `false` is meaningful; do not set `true` (redundant).
 */
export const USER_CAPABILITY_DENIALS_BY_ORG: Record<
  string,
  Record<string, Partial<Record<L1Key, boolean>>>
> = {
  /** Full product access in every market slice — no denials */
  "org-9001": {},
  /** UAE only: exactly four L1 tiles — accounts, payments, liquidity, collections */
  "org-9002": {
    UAE: {
      "trade-finance": false,
      "supply-chain-finance": false,
      "virtual-accounts": false,
      "host-to-host": false,
      "reports-insights": false,
      administration: false,
    },
  },
  /** Full L1 access within each country row (same as max, smaller market set) */
  "org-9003": {},
};

export function getEffectiveL1ForOrgAndMarket(
  marketCode: string,
  organizationId: string
): Record<L1Key, boolean> | null {
  const mkt = normalizeMarketKey(marketCode);
  const offered = getCountryOfferedL1(mkt);
  if (!offered) return null;

  const denials = USER_CAPABILITY_DENIALS_BY_ORG[organizationId]?.[mkt] ?? {};
  const out = {} as Record<L1Key, boolean>;
  for (const l1 of L1_KEYS) {
    out[l1] = Boolean(offered[l1] && denials[l1] !== false);
  }
  return out;
}
