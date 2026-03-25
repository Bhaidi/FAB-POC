import { SERVICE_CATALOG_RESPONSE } from "@/lib/server/serviceCatalogCanonical";
import type { MarketServiceAccessResponse, MarketServiceDomainAccess } from "@/types/platformServiceTaxonomy";

const CATALOG_L1_ORDER = SERVICE_CATALOG_RESPONSE.domains.map((d) => d.l1Code);

/**
 * Ensures every catalog L1 is present once, in catalog order, so testers always see a full matrix.
 * Missing keys get a visible inactive row; unknown keys in the payload are dropped.
 */
export function consolidateMarketServiceAccess(response: MarketServiceAccessResponse): MarketServiceAccessResponse {
  const byL1 = new Map(response.serviceDomains.map((d) => [d.l1Code, d]));
  const serviceDomains: MarketServiceDomainAccess[] = CATALOG_L1_ORDER.map((code) => {
    const row = byL1.get(code);
    if (row) return { ...row, l1Code: code };
    return {
      l1Code: code,
      status: "inactive" as const,
      visible: true,
      selectable: false,
      statusLabel: "Not available",
    };
  });
  return { ...response, serviceDomains };
}
