/**
 * Canonical L1 home grid — ids align with `DomainNavIcon` and service taxonomy `domain` param.
 */

export type DashboardL1HomeTile = {
  id: string;
  title: string;
  description: string;
};

export const DASHBOARD_L1_HOME_TILES: readonly DashboardL1HomeTile[] = [
  {
    id: "accounts",
    title: "Account Services",
    description: "Operational accounts, balances, statements, and servicing",
  },
  { id: "payments", title: "Payments", description: "Domestic and international payment flows" },
  { id: "liquidity", title: "Liquidity", description: "Cash visibility and working capital" },
  { id: "trade-finance", title: "Trade Finance", description: "Documentary trade and bank guarantees" },
  { id: "collections", title: "Collections", description: "Receivables and collection workflows" },
  { id: "supply-chain-finance", title: "Supply Chain Finance", description: "Programmes anchored on payables and receivables" },
  { id: "virtual-accounts", title: "Virtual Accounts", description: "Structured virtual account hierarchies" },
  { id: "host-to-host", title: "Host-to-Host", description: "Secure file-based integration from your systems" },
  { id: "reports-insights", title: "Reports & Insights", description: "Operational and cash reporting in one place" },
  { id: "administration", title: "Administration", description: "Users, entitlements, and platform configuration" },
] as const;
