"use client";

import { CorpTableThemeProvider } from "@/components/account-services/portfolio/CorpTableThemeContext";
import { CorporateDataGrid } from "@/components/account-services/portfolio/corporateGrid/CorporateDataGrid";
import { useFabTokens } from "@/components/theme/FabTokensContext";
import type { CorporateBankingGridRow } from "@/data/corporateBankingGridTypes";

type Props = {
  data: CorporateBankingGridRow[];
  isLoading?: boolean;
  selectedDetailId?: string | null;
  onRowOpenDetail?: (row: CorporateBankingGridRow) => void;
};

/** @deprecated Prefer `CorporateDataGrid` with explicit `view` — kept for compatibility */
export function PortfolioAccountsSection({ data, isLoading, selectedDetailId, onRowOpenDetail }: Props) {
  const { corpTable } = useFabTokens();
  return (
    <CorpTableThemeProvider value={corpTable}>
      <CorporateDataGrid
        view="accounts"
        data={data}
        isLoading={isLoading}
        selectedDetailId={selectedDetailId}
        onRowOpenDetail={onRowOpenDetail}
      />
    </CorpTableThemeProvider>
  );
}
