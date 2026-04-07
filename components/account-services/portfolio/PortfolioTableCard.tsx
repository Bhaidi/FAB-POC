"use client";

import { Box } from "@chakra-ui/react";
import { CorpTableThemeProvider } from "@/components/account-services/portfolio/CorpTableThemeContext";
import { CorporateDataGrid } from "@/components/account-services/portfolio/corporateGrid/CorporateDataGrid";
import { useFabTokens } from "@/components/theme/FabTokensContext";
import type { CorporateBankingGridRow } from "@/data/corporateBankingGridTypes";
import type { PortfolioModuleTab } from "@/data/portfolioSummaryTypes";

type Props = {
  gridRows: CorporateBankingGridRow[];
  isLoading?: boolean;
  selectedRowId?: string | null;
  onSelectRow?: (row: CorporateBankingGridRow) => void;
  activeTab: PortfolioModuleTab;
  scrollAreaMode?: "viewport" | "fill";
};

export function PortfolioTableCard({
  gridRows,
  isLoading,
  selectedRowId,
  onSelectRow,
  activeTab,
  scrollAreaMode = "viewport",
}: Props) {
  const { corpTable } = useFabTokens();
  return (
    <Box h={scrollAreaMode === "fill" ? "full" : undefined} minH={scrollAreaMode === "fill" ? 0 : undefined} minW={0} display="flex" flexDirection="column">
      <Box bg={corpTable.cardBg} boxShadow={corpTable.cardShadow} overflow="visible" flex={scrollAreaMode === "fill" ? 1 : undefined} minH={scrollAreaMode === "fill" ? 0 : undefined} display="flex" flexDirection="column">
        <CorpTableThemeProvider value={corpTable}>
          <CorporateDataGrid
            view={activeTab}
            data={gridRows}
            isLoading={isLoading}
            selectedDetailId={selectedRowId ?? null}
            onRowOpenDetail={onSelectRow}
            scrollAreaMode={scrollAreaMode}
          />
        </CorpTableThemeProvider>
      </Box>
    </Box>
  );
}
