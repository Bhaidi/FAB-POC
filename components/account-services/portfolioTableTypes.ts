export type PortfolioTableRow = {
  kind: "accounts" | "deposits" | "loans";
  key: string;
  name: string;
  amountDisplay: string;
  meta: string;
  statusActive: boolean;
  statusLabel: string;
  progressPct: number | null;
  href: string;
};
