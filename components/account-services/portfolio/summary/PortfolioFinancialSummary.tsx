"use client";

import { Box, Grid, Text } from "@chakra-ui/react";
import type { PortfolioSummarySnapshot } from "@/data/portfolioSummaryTypes";
import { useFabTokens } from "@/components/theme/FabTokensContext";
import { CurrencyExposureSummary } from "@/components/account-services/portfolio/summary/CurrencyExposureSummary";

type Props = {
  summary: PortfolioSummarySnapshot;
};

function Kpi({ label, value }: { label: string; value: string | number }) {
  const { corpTable } = useFabTokens();
  return (
    <Box minW={0}>
      <Text
        fontFamily={corpTable.chromeFontFamily}
        fontSize="11px"
        fontWeight={500}
        letterSpacing="0.06em"
        textTransform="uppercase"
        color={corpTable.headerLabel}
        mb={1}
      >
        {label}
      </Text>
      <Text
        fontFamily={corpTable.chromeFontFamily}
        fontSize="16px"
        fontWeight={500}
        color={corpTable.chromeText}
        letterSpacing={corpTable.chromeLetterSpacing}
        sx={{ fontVariantNumeric: "tabular-nums" }}
      >
        {value}
      </Text>
    </Box>
  );
}

export function PortfolioFinancialSummary({ summary }: Props) {
  const { corpTable } = useFabTokens();
  return (
    <Box textAlign="left">
      <Text
        fontFamily={corpTable.chromeFontFamily}
        fontSize={{ base: "28px", md: "34px" }}
        fontWeight={400}
        letterSpacing="-0.03em"
        lineHeight={1.05}
        color={corpTable.bodyPrimary}
        mb={3}
        sx={{ fontVariantNumeric: "tabular-nums" }}
      >
        {summary.totalBalanceLabel}
      </Text>

      <Text
        fontFamily={corpTable.chromeFontFamily}
        fontSize="15px"
        fontWeight={corpTable.chromeFontWeight}
        lineHeight={1.45}
        color={corpTable.chromeTextMuted}
        letterSpacing={corpTable.chromeLetterSpacing}
        mb={4}
      >
        {summary.metaLine}
      </Text>

      <Grid templateColumns="repeat(3, minmax(0, 1fr))" gap={{ base: 3, md: 6 }} mb={4} w="full">
        <Kpi label="Entities" value={summary.entityCount} />
        <Kpi label={summary.positionLabel} value={summary.positionCount} />
        <Kpi label="Countries" value={summary.countryCount} />
      </Grid>

      <CurrencyExposureSummary
        rows={summary.currencyExposureTop}
        moreCurrenciesCount={summary.moreCurrenciesCount}
      />

      <Text
        mt={4}
        fontFamily={corpTable.chromeFontFamily}
        fontSize="13px"
        fontWeight={corpTable.chromeFontWeight}
        lineHeight={1.5}
        color={corpTable.chromeTextMuted}
        letterSpacing={corpTable.chromeLetterSpacing}
      >
        {summary.insightLine}
      </Text>
    </Box>
  );
}
