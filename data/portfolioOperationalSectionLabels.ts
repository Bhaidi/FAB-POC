import type { PortfolioModuleTab } from "@/data/portfolioSummaryTypes";

/** Contextual label above the operational data table (matches portfolio module toggle). Display uses uppercase via shared heading style. */
export const PORTFOLIO_OPERATIONAL_SECTION_LABELS: Record<PortfolioModuleTab, string> = {
  portfolio: "Portfolio Directory",
  accounts: "Account Directory",
  deposits: "Deposit Directory",
  loans: "Loan Directory",
};
