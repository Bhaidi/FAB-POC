import type { PortfolioModuleTab } from "@/data/portfolioSummaryTypes";

/** Emitted when user selects a breakdown row (future portfolio table filter / group hook). */
export type BreakdownChartSelection = {
  module: PortfolioModuleTab;
  sliceId: string;
  itemName: string;
  percent: number;
  amountLabel: string;
};
