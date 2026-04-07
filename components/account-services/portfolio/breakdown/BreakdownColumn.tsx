"use client";

import { BreakdownSection } from "@/components/account-services/portfolio/breakdown/BreakdownSection";
import type { BreakdownChartSelection } from "@/data/breakdownChartTypes";
import type { TreasurySummaryData } from "@/data/treasurySummaryTypes";
import type { PortfolioModuleTab } from "@/data/portfolioSummaryTypes";

/** Column 2 — breakdown: toggle + visual table (no chart). */
export function BreakdownColumn({
  module,
  effectiveDistId,
  distConfig,
  activeSlice,
  onDistChange,
  onBreakdownSelect,
}: {
  module: PortfolioModuleTab;
  effectiveDistId: string;
  distConfig: TreasurySummaryData["distribution"];
  activeSlice: TreasurySummaryData["distribution"]["slices"][string];
  onDistChange: (id: string) => void;
  onBreakdownSelect?: (payload: BreakdownChartSelection) => void;
}) {
  return (
    <BreakdownSection
      module={module}
      effectiveDistId={effectiveDistId}
      distConfig={distConfig}
      activeSlice={activeSlice}
      onDistChange={onDistChange}
      onBreakdownSelect={onBreakdownSelect}
    />
  );
}
