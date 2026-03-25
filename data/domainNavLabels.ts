/**
 * Short L1 labels for the capability sidebar — command-center style IA.
 * Falls back to template `label` when an id is missing here.
 */
export const DOMAIN_NAV_LABELS: Record<string, string> = {
  "home-group": "Dashboard",
  accounts: "Accounts",
  "account-services": "Accounts",
  payments: "Payments",
  liquidity: "Liquidity",
  "liquidity-management": "Liquidity",
  "trade-finance": "Trade",
  collections: "Collections",
  "receivables-collections": "Receivables",
  "supply-chain-finance": "Supply Chain",
  "cheque-services": "Cheques",
  "virtual-accounts": "Virtual Accounts",
  "host-to-host": "Host-to-Host",
  "reports-insights": "Reports",
  administration: "Administration",
};

export function getDomainNavLabel(domainId: string, fallbackLabel: string): string {
  return DOMAIN_NAV_LABELS[domainId] ?? fallbackLabel;
}
