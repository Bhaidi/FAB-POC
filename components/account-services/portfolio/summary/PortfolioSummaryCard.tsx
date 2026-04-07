"use client";

import { Box } from "@chakra-ui/react";
import { ExecutiveTreasurySummary } from "@/components/account-services/portfolio/summary/ExecutiveTreasurySummary";
import { getTreasurySummaryForModule } from "@/data/treasurySummaryStub";
import type { BreakdownChartSelection } from "@/data/breakdownChartTypes";
import type { TreasurySummaryInteractiveKind } from "@/data/treasurySummaryTypes";
import type { PortfolioModuleTab } from "@/data/portfolioSummaryTypes";

type Props = {
  module: PortfolioModuleTab;
  activeTreasuryDistId: string;
  onTreasuryDistIdChange: (id: string) => void;
  onSummaryInteractive: (kind: TreasurySummaryInteractiveKind) => void;
  onBreakdownChartSelect?: (payload: BreakdownChartSelection) => void;
};

/** Treasury hero + meta + distribution — open field on the dashboard canvas */
export function PortfolioSummaryCard({
  module,
  activeTreasuryDistId,
  onTreasuryDistIdChange,
  onSummaryInteractive,
  onBreakdownChartSelect,
}: Props) {
  const data = getTreasurySummaryForModule(module);

  return (
    <Box
      w="full"
      position="relative"
      zIndex={1}
      bg="transparent"
      px={0}
      py={6}
      sx={{
        scrollbarWidth: "thin",
        scrollbarColor: "rgba(255,255,255,0.2) transparent",
      }}
    >
      <ExecutiveTreasurySummary
        module={module}
        data={data}
        activeDistId={activeTreasuryDistId}
        onActiveDistIdChange={onTreasuryDistIdChange}
        onSummaryInteractive={onSummaryInteractive}
        onBreakdownChartSelect={onBreakdownChartSelect}
      />
    </Box>
  );
}
