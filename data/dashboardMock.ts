/**
 * Stub data for `/dashboard` — replace with API responses when backend is ready.
 */

export type DashboardNavItem = {
  id: string;
  label: string;
  href: string;
};

export type DashboardServiceTile = {
  id: string;
  title: string;
  description?: string;
};

export type ExploreSolutionChip = {
  id: string;
  label: string;
};

export const DASHBOARD_NAV_ITEMS: DashboardNavItem[] = [
  { id: "home", label: "Home", href: "/dashboard" },
  { id: "cheque-deposit", label: "Corporate Cheque Deposit", href: "#" },
  { id: "h2h", label: "Host to Host", href: "#" },
  { id: "remote-cheque", label: "Remote Cheque Printing", href: "#" },
  { id: "account-services", label: "Account Services", href: "#" },
  { id: "payments", label: "Payments", href: "#" },
  { id: "reports", label: "Integrated Info Report", href: "#" },
  { id: "settings", label: "Settings", href: "#" },
];

export const DASHBOARD_SERVICE_TILES: DashboardServiceTile[] = [
  {
    id: "t1",
    title: "Corporate Cheque Deposit",
    description: "Submit and track corporate cheques digitally with status updates and reconciliation-friendly exports.",
  },
  {
    id: "t2",
    title: "Host to Host",
    description: "Secure file-based integration for high-volume payments and reporting straight from your ERP or treasury stack.",
  },
  {
    id: "t3",
    title: "iBanking",
    description: "Self-service corporate banking for balances, transfers, and approvals with role-based entitlements.",
  },
  {
    id: "t4",
    title: "Remote Cheque Printing",
    description: "Issue and print cheques from approved locations while keeping maker-checker controls and audit trails.",
  },
  {
    id: "t5",
    title: "Supply Chain Finance",
    description: "Extend working capital to suppliers and buyers with programmes anchored on receivables and payables data.",
  },
  {
    id: "t6",
    title: "Receivables and Collections",
    description: "Automate collections workflows, allocations, and reporting across channels and entity structures.",
  },
  {
    id: "t7",
    title: "Direct Debit / Invoice Presentation",
    description: "Present invoices, collect via direct debit mandates, and reduce manual follow-ups with structured messaging.",
  },
  {
    id: "t8",
    title: "Integrated Info Report",
    description: "Consolidated operational and cash reporting across accounts, products, and regions in one dashboard.",
  },
];

export const DASHBOARD_EXPLORE_CHIPS: ExploreSolutionChip[] = [
  { id: "e1", label: "Virtual Account" },
  { id: "e2", label: "FAB Online — Cash" },
  { id: "e3", label: "FAB Online — Trade" },
  { id: "e4", label: "Collections" },
  { id: "e5", label: "Liquidity Management" },
  { id: "e6", label: "Trade Finance Hub" },
];

export const DASHBOARD_MOCK_USER = {
  displayName: "Ahmed Al M.",
  /** Hero greeting — stub until profile API supplies preferred name */
  homeGreetingName: "Daniel Okonkwo",
  role: "Corporate Administrator",
};
