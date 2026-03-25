import { consolidateMarketServiceAccess } from "@/lib/consolidateMarketServiceAccess";
import type { CapabilityAccess, CapabilityMenuItem } from "@/data/dashboardTypes";
import type {
  MarketServiceAccessResponse,
  MarketServiceDomainAccess,
  MarketServiceGroupAccess,
  ServiceAccessStatus,
  ServiceCatalogResponse,
  ServiceDomain,
  ServiceGroup,
} from "@/types/platformServiceTaxonomy";

function mapAccessStatus(status: ServiceAccessStatus): CapabilityAccess {
  if (status === "enabled") return "full";
  if (status === "restricted") return "partial";
  return "locked";
}

function resolveL3Status(
  domainStatus: ServiceAccessStatus,
  groupOverride: MarketServiceGroupAccess | undefined,
  l3Override: { status: ServiceAccessStatus; visible: boolean } | undefined
): ServiceAccessStatus | "skip" {
  if (l3Override && !l3Override.visible) return "skip";
  if (l3Override) return l3Override.status;
  if (groupOverride) return groupOverride.status;
  return domainStatus;
}

function buildL3Item(
  domain: ServiceDomain,
  group: ServiceGroup,
  domainAccess: MarketServiceDomainAccess,
  groupOverride: MarketServiceGroupAccess | undefined
): CapabilityMenuItem[] {
  const out: CapabilityMenuItem[] = [];
  for (const leaf of group.l3Items) {
    const o = groupOverride?.l3Items?.find((x) => x.l3Code === leaf.l3Code);
    const st = resolveL3Status(domainAccess.status, groupOverride, o);
    if (st === "skip") continue;
    out.push({
      id: leaf.l3Code,
      label: leaf.l3Name,
      access: mapAccessStatus(st),
      href: leaf.route,
    });
  }
  return out;
}

function buildL2Items(
  domain: ServiceDomain,
  domainAccess: MarketServiceDomainAccess
): CapabilityMenuItem[] {
  const overrides = domainAccess.l2Items;
  if (overrides !== undefined && overrides !== null && overrides.length === 0) {
    return [];
  }

  const out: CapabilityMenuItem[] = [];
  for (const group of domain.l2Items) {
    const groupOverride = overrides?.find((g) => g.l2Code === group.l2Code);
    if (groupOverride && !groupOverride.visible) continue;

    const l3Children = buildL3Item(domain, group, domainAccess, groupOverride);
    const gStatus = groupOverride?.status ?? domainAccess.status;
    if (l3Children.length === 0 && gStatus !== "enabled") continue;

    out.push({
      id: group.l2Code,
      label: group.l2Name,
      access: mapAccessStatus(gStatus),
      children: l3Children.length ? l3Children : undefined,
    });
  }
  return out;
}

function buildDomainMenuItem(domain: ServiceDomain, da: MarketServiceDomainAccess): CapabilityMenuItem {
  const children = buildL2Items(domain, da);
  return {
    id: domain.l1Code,
    label: domain.l1Name,
    subtitle: domain.description,
    access: mapAccessStatus(da.status),
    children: children.length ? children : undefined,
  };
}

export type TaxonomyMergeResult = {
  activeL1Codes: string[];
  secondaryL1Codes: string[];
  /** Enabled L1 domains for collapsed rail (switcher). */
  railDomains: CapabilityMenuItem[];
  /** Full merged menu item per L1 (for selected context). */
  domainByL1: Map<string, CapabilityMenuItem>;
  /** Catalog row by L1 for cards. */
  catalogDomainByL1: Map<string, ServiceDomain>;
};

export function mergeCatalogWithMarketAccess(
  catalog: ServiceCatalogResponse,
  access: MarketServiceAccessResponse | null
): TaxonomyMergeResult {
  const catalogDomainByL1 = new Map(catalog.domains.map((d) => [d.l1Code, d]));
  const domainByL1 = new Map<string, CapabilityMenuItem>();
  const activeL1Codes: string[] = [];
  const secondaryL1Codes: string[] = [];
  const railDomains: CapabilityMenuItem[] = [];

  if (!access) {
    return { activeL1Codes, secondaryL1Codes, railDomains, domainByL1, catalogDomainByL1 };
  }

  const accessByL1 = new Map(consolidateMarketServiceAccess(access).serviceDomains.map((d) => [d.l1Code, d]));

  for (const domain of catalog.domains) {
    const da = accessByL1.get(domain.l1Code);
    if (!da) continue;

    if (!da.visible || da.status === "hidden") continue;

    const item = buildDomainMenuItem(domain, da);
    domainByL1.set(domain.l1Code, item);

    if (da.status === "enabled") {
      activeL1Codes.push(domain.l1Code);
      railDomains.push(item);
    } else if (
      da.status === "available_on_request" ||
      da.status === "restricted" ||
      da.status === "inactive"
    ) {
      secondaryL1Codes.push(domain.l1Code);
    }
  }

  return { activeL1Codes, secondaryL1Codes, railDomains, domainByL1, catalogDomainByL1 };
}

export function firstNavigableL3Href(domainItem: CapabilityMenuItem | undefined): string | null {
  if (!domainItem?.children?.length) return null;
  for (const l2 of domainItem.children) {
    for (const l3 of l2.children ?? []) {
      if (l3.href && l3.access !== "locked") return l3.href;
    }
  }
  for (const l2 of domainItem.children) {
    for (const l3 of l2.children ?? []) {
      if (l3.href) return l3.href;
    }
  }
  return null;
}
