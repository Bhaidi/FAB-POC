/** Tabs for portfolio views — shared summary + table (toggle order: Portfolio → Accounts → Deposits → Loans). */
export type PortfolioModuleTab = "portfolio" | "accounts" | "loans" | "deposits";

/** One row in the top-4 currency breakdown (amounts in AED equivalent). */
export type PortfolioCurrencyExposureRow = {
  code: string;
  /** Formatted AED amount for this slice (e.g. AED 217B) */
  amountLabel: string;
  /** Share of portfolio total (0–100, rounded) */
  sharePercent: number;
  /** Bar fill width vs largest value in top 4 (0–100) */
  barPercent: number;
};

export type PortfolioSummarySnapshot = {
  /** Pre-formatted headline total (e.g. AED 1.64T) */
  totalBalanceLabel: string;
  /** One line, e.g. “Across 76 accounts • …” */
  metaLine: string;
  entityCount: number;
  /** Middle KPI label + count (Accounts / Deposits / Loans) */
  positionLabel: string;
  positionCount: number;
  countryCount: number;
  currencyCount: number;
  currencyExposureTop: PortfolioCurrencyExposureRow[];
  moreCurrenciesCount: number;
  insightLine: string;
  alerts: string[];
};
