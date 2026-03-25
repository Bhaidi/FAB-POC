/**
 * Organization × market service-access stubs — drives L1 cards and L2/L3 visibility.
 *
 * Composes two layers (see `docs/STUB_DATA_MATRIX_TEMPLATE.md`):
 * 1. **Country offering** — `countryCapabilityMatrix.ts` (Matrix A, locked)
 * 2. **User grant** — `demoUserCapabilityGrants.ts` (denials within that offer per demo org)
 */
import { consolidateMarketServiceAccess } from "@/lib/consolidateMarketServiceAccess";
import { L1_KEYS, type L1Key } from "@/lib/server/countryCapabilityMatrix";
import { DEMO_ORG_MARKETS, getEffectiveL1ForOrgAndMarket } from "@/lib/server/demoUserCapabilityGrants";
import type { MarketServiceAccessResponse, MarketServiceDomainAccess } from "@/types/platformServiceTaxonomy";

const D = (
  l1Code: string,
  status: MarketServiceDomainAccess["status"],
  visible: boolean,
  selectable: boolean,
  statusLabel: string,
  l2Items?: MarketServiceDomainAccess["l2Items"]
): MarketServiceDomainAccess => ({
  l1Code,
  status,
  visible,
  selectable,
  statusLabel,
  l2Items,
});

function accessForEffectiveCaps(
  marketCode: string,
  organizationId: string,
  c: Record<L1Key, boolean>
): MarketServiceAccessResponse {
  const serviceDomains = L1_KEYS.map((l1) =>
    c[l1] ? D(l1, "enabled", true, true, "Active") : D(l1, "hidden", false, false, "Not available")
  );
  return { marketCode, organizationId, serviceDomains };
}

function buildByOrg(): Record<string, Record<string, MarketServiceAccessResponse>> {
  const out: Record<string, Record<string, MarketServiceAccessResponse>> = {};
  for (const [orgId, markets] of Object.entries(DEMO_ORG_MARKETS)) {
    out[orgId] = {};
    for (const mkt of markets) {
      const eff = getEffectiveL1ForOrgAndMarket(mkt, orgId);
      if (eff) out[orgId][mkt] = accessForEffectiveCaps(mkt, orgId, eff);
    }
  }
  return out;
}

const BY_ORG = buildByOrg();

export function getMarketServiceAccessStub(organizationId: string, marketCode: string): MarketServiceAccessResponse | null {
  const org = BY_ORG[organizationId];
  if (!org) return null;
  const key = marketCode.trim().toUpperCase();
  const raw = org[key] ?? null;
  if (!raw) return null;
  return consolidateMarketServiceAccess({ ...raw, marketCode: key });
}
