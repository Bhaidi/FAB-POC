"use client";

import {
  Box,
  Divider,
  Flex,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { useFabTokens } from "@/components/theme/FabTokensContext";
import type { BeneSummaryRow } from "@/data/beneficiaryTypes";

interface BeneSummaryPanelProps {
  rows: BeneSummaryRow[];
}

export function BeneSummaryPanel({ rows }: BeneSummaryPanelProps) {
  const { dashColors } = useFabTokens();
  const bg = useColorModeValue("white", dashColors.cardBg);
  const borderColor = useColorModeValue("neutral.border", dashColors.cardBorder);
  const labelColor = useColorModeValue("neutral.secondaryText", dashColors.pageSubtitle);
  const valueColor = useColorModeValue("neutral.mainText", dashColors.pageTitle);

  return (
    <Box
      bg={bg}
      borderRadius="lg"
      shadow="sm"
      borderWidth="1px"
      borderColor={borderColor}
      overflow="hidden"
      w="full"
    >
      {/* Header */}
      <Box px={4} pt={3} pb={2} bg="#40639e" borderTopRadius="lg">
        <Text fontSize="lg" fontWeight="semibold" color="white">
          Beneficiary Overview
        </Text>
      </Box>

      {/* Rows */}
      <Box px={5}>
        {rows.map((row, i) => (
          <Box key={i}>
            <Flex py={2.5} justify="space-between" align="flex-start" gap={4}>
              <Text fontSize="2xs" color={labelColor} flex="0 0 40%" letterSpacing="wide">
                {row.label}
              </Text>
              <Text fontSize="xs" fontWeight="semibold" color={valueColor} textAlign="right" wordBreak="break-all">
                {row.value || "—"}
              </Text>
            </Flex>
            {i < rows.length - 1 && <Divider borderColor={borderColor} />}
          </Box>
        ))}
        {rows.length === 0 && (
          <Text fontSize="xs" color={labelColor} py={4} textAlign="center">
            Fill in beneficiary details to see overview
          </Text>
        )}
      </Box>
    </Box>
  );
}
