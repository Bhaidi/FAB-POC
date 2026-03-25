/**
 * Dashboard platform cards — aligned to entitlement keys and IA.
 */

export type PlatformId =
  | "account-services"
  | "payments"
  | "liquidity-management"
  | "trade-finance"
  | "supply-chain-finance"
  | "receivables-collections"
  | "cheque-services"
  | "virtual-accounts"
  | "reports-insights";

export type PlatformDefinition = {
  /** Entitlement key for static `PLATFORMS`, or API service id for market payloads. */
  id: string;
  title: string;
  /** L2+ body copy — not shown on dashboard tiles when omitted. */
  description?: string;
  /** First navigable stub target when launching from the card. */
  defaultNavId: string;
};

export const PLATFORMS: PlatformDefinition[] = [
  {
    id: "account-services",
    title: "Account Services",
    description: "Accounts, balances, statements, and service requests.",
    defaultNavId: "acct-overview-view",
  },
  {
    id: "payments",
    title: "Payments",
    description: "Domestic, international, bulk, and payroll payments.",
    defaultNavId: "payments-domestic-create",
  },
  {
    id: "liquidity-management",
    title: "Liquidity Management",
    description: "Cash positioning, sweeps, and funding visibility.",
    defaultNavId: "liq-cash-consolidated",
  },
  {
    id: "trade-finance",
    title: "Trade Finance",
    description: "Guarantees, letters of credit, and trade documentation.",
    defaultNavId: "tf-guarantee-issue",
  },
  {
    id: "supply-chain-finance",
    title: "Supply Chain Finance",
    description: "Buyer, supplier, and receivables finance services.",
    defaultNavId: "scf-buyer-payables",
  },
  {
    id: "receivables-collections",
    title: "Receivables & Collections",
    description: "Direct debit, invoices, and collections workflows.",
    defaultNavId: "rc-dd-mandates",
  },
  {
    id: "cheque-services",
    title: "Cheque Services",
    description: "Deposit cheques and manage remote cheque printing.",
    defaultNavId: "chq-deposit-submit",
  },
  {
    id: "virtual-accounts",
    title: "Virtual Accounts",
    description: "Virtual account structures and reconciliation support.",
    defaultNavId: "va-mgmt-create",
  },
  {
    id: "reports-insights",
    title: "Reports & Insights",
    description: "Reporting, schedules, and audit visibility.",
    defaultNavId: "rep-std-accounts",
  },
];
