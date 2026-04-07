"use client";

import { Box, Flex, Text } from "@chakra-ui/react";
import type { PortfolioCurrencyExposureRow } from "@/data/portfolioSummaryTypes";
import { useFabTokens } from "@/components/theme/FabTokensContext";

const BAR_GRADIENT =
  "linear-gradient(90deg, rgba(105, 138, 188, 0.34) 0%, rgba(150, 178, 218, 0.15) 55%, rgba(180, 200, 230, 0.08) 100%)";

type Props = {
  rows: PortfolioCurrencyExposureRow[];
  moreCurrenciesCount: number;
};

export function CurrencyExposureSummary({ rows, moreCurrenciesCount }: Props) {
  const { corpTable } = useFabTokens();
  return (
    <Box w="full" textAlign="left">
      <Text
        fontFamily={corpTable.chromeFontFamily}
        fontSize="12px"
        fontWeight={500}
        letterSpacing="0.04em"
        color={corpTable.chromeTextMuted}
        mb={2.5}
      >
        Currency Exposure (Top 4)
      </Text>
      <Flex direction="column" gap={3}>
        {rows.map((row) => (
          <Flex key={row.code} align="center" gap={{ base: 2, md: 3 }} w="full" minW={0}>
            <Text
              w="42px"
              flexShrink={0}
              fontFamily={corpTable.chromeFontFamily}
              fontSize="13px"
              fontWeight={500}
              color={corpTable.chromeText}
              letterSpacing={corpTable.chromeLetterSpacing}
            >
              {row.code}
            </Text>
            <Text
              flexShrink={0}
              w={{ base: "5rem", sm: "5.75rem" }}
              textAlign="right"
              fontFamily={corpTable.chromeFontFamily}
              fontSize="13px"
              fontWeight={corpTable.chromeFontWeight}
              color={corpTable.chromeTextMuted}
              letterSpacing={corpTable.chromeLetterSpacing}
              whiteSpace="nowrap"
              sx={{ fontVariantNumeric: "tabular-nums" }}
            >
              {row.amountLabel}
            </Text>
            <Text
              w="40px"
              flexShrink={0}
              textAlign="right"
              fontFamily={corpTable.chromeFontFamily}
              fontSize="13px"
              fontWeight={500}
              color={corpTable.bodyPrimary}
              letterSpacing={corpTable.chromeLetterSpacing}
              sx={{ fontVariantNumeric: "tabular-nums" }}
            >
              {row.sharePercent}%
            </Text>
            <Box
              flex="1 1 auto"
              maxW="60%"
              minW={0}
              h="6px"
              borderRadius="full"
              bg="rgba(255,255,255,0.06)"
              overflow="hidden"
              boxShadow="inset 0 1px 0 rgba(0,0,0,0.2)"
            >
              <Box
                h="full"
                w={`${row.barPercent}%`}
                maxW="100%"
                borderRadius="full"
                bg={BAR_GRADIENT}
              />
            </Box>
          </Flex>
        ))}
      </Flex>
      {moreCurrenciesCount > 0 ? (
        <Text
          mt={3}
          fontFamily={corpTable.chromeFontFamily}
          fontSize="12px"
          fontWeight={corpTable.chromeFontWeight}
          color={corpTable.chromeTextMuted}
          letterSpacing={corpTable.chromeLetterSpacing}
        >
          +{moreCurrenciesCount} more currencies
        </Text>
      ) : null}
    </Box>
  );
}
