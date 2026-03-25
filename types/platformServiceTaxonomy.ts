/** Unified L1 → L2 → L3 platform service taxonomy (catalog + per-market access). */

export type ServiceAction = {
  l3Code: string;
  l3Name: string;
  route: string;
};

export type ServiceGroup = {
  l2Code: string;
  l2Name: string;
  l3Items: ServiceAction[];
};

export type ServiceDomain = {
  l1Code: string;
  l1Name: string;
  description: string;
  icon: string;
  l2Items: ServiceGroup[];
};

export type ServiceCatalogResponse = {
  version: string;
  domains: ServiceDomain[];
};

export type ServiceAccessStatus =
  | "enabled"
  | "available_on_request"
  | "inactive"
  | "restricted"
  | "hidden";

export type MarketServiceActionAccess = {
  l3Code: string;
  status: ServiceAccessStatus;
  visible: boolean;
};

export type MarketServiceGroupAccess = {
  l2Code: string;
  status: ServiceAccessStatus;
  visible: boolean;
  l3Items: MarketServiceActionAccess[];
};

export type MarketServiceDomainAccess = {
  l1Code: string;
  status: ServiceAccessStatus;
  visible: boolean;
  selectable: boolean;
  statusLabel: string;
  /** When omitted or null, full L2/L3 from catalog inherit L1 status. Empty array = no nav children. */
  l2Items?: MarketServiceGroupAccess[] | null;
};

export type MarketServiceAccessResponse = {
  marketCode: string;
  organizationId: string;
  serviceDomains: MarketServiceDomainAccess[];
};
