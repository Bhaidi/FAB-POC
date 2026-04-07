import type { CapabilityMenuItem } from "@/data/dashboardTypes";

/** Primary module entry — used by dashboard tiles and sidebar. */
export const ACCOUNT_SERVICES_BASE_PATH = "/account-services";

/** L1 domain ids that map to the Account Services product surface (template + taxonomy rail). */
export const ACCOUNT_SERVICES_DOMAIN_IDS = new Set<string>(["account-services", "accounts"]);

export function isAccountServicesPath(pathname: string | null | undefined): boolean {
  return Boolean(pathname?.startsWith(ACCOUNT_SERVICES_BASE_PATH));
}

/**
 * @param strict When true (Account Services shell), never fall back to the full list if no AS domain exists.
 */
export function filterAccountServicesDomains(domains: CapabilityMenuItem[], strict = false) {
  const next = domains.filter((d) => ACCOUNT_SERVICES_DOMAIN_IDS.has(d.id));
  if (strict) return next;
  return next.length > 0 ? next : domains;
}

export function findAccountServicesDomain(domains: CapabilityMenuItem[]) {
  return domains.find((d) => ACCOUNT_SERVICES_DOMAIN_IDS.has(d.id));
}

/** Expand every L2 group that has L3 children (full feature tree visible). */
export function expandedL2IdsForAccountDomain(domain: CapabilityMenuItem | undefined): Record<string, boolean> {
  if (!domain?.children?.length) return {};
  const r: Record<string, boolean> = {};
  for (const l2 of domain.children) {
    if (l2.children?.length) r[l2.id] = true;
  }
  return r;
}
