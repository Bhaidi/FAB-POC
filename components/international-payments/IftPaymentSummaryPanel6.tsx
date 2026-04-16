"use client";

import {
  Box,
  Divider,
  Flex,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { IconCopy } from "@tabler/icons-react";
import { useFabTokens } from "@/components/theme/FabTokensContext";
import type { IftSummaryRow } from "@/data/iftPaymentTypes";

/**
 * Payment Overview 6 — Light tile sections
 * Each group of rows sits inside a subtle tinted tile card.
 * Amounts get their own tile at the bottom with accent styling.
 * Tiles are stacked vertically with small gaps between them.
 */

interface IftPaymentSummaryPanel6Props {
  rows: IftSummaryRow[];
}

const GROUP_DEFS: { title: string; labels: string[] }[] = [
  {
    title: "Transfer Details",
    labels: ["Payment Reference No.", "Country", "Transaction Type", "Payment Date"],
  },
  {
    title: "Debit Account",
    labels: ["Debit Account Name", "Debit Account Number"],
  },
  {
    title: "Beneficiary",
    labels: ["Beneficiary Name", "Beneficiary Account"],
  },
];

export function IftPaymentSummaryPanel6({ rows }: IftPaymentSummaryPanel6Props) {
  const { dashColors } = useFabTokens();
  const bg = useColorModeValue("white", dashColors.cardBg);
  const borderColor = useColorModeValue("neutral.border", dashColors.cardBorder);
  const labelColor = useColorModeValue("neutral.secondaryText", dashColors.pageSubtitle);
  const valueColor = useColorModeValue("neutral.mainText", dashColors.pageTitle);
  const headerColor = useColorModeValue("rgba(0,0,0,0.8)", dashColors.pageTitle);
  const tileBg = useColorModeValue("gray.50", dashColors.surfaceElevated);
  const amountTileBg = useColorModeValue("blue.50", "rgba(0, 98, 255, 0.08)");
  const amountBorder = useColorModeValue("blue.100", "rgba(96,165,250,0.2)");

  const rowMap = new Map(rows.map((r) => [r.label, r]));
  const paymentAmt = rowMap.get("Payment Amount");
  const debitAmt = rowMap.get("Debit Amount");

  const groups = GROUP_DEFS.map((g) => ({
    title: g.title,
    rows: g.labels.map((l) => rowMap.get(l)).filter(Boolean) as IftSummaryRow[],
  })).filter((g) => g.rows.length > 0);

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
      <Box px={5} pt={4} pb={2}>
        <Text fontSize="lg" fontWeight="semibold" color={headerColor}>
          Payment Overview 6
        </Text>
      </Box>

      {/* Grouped tiles */}
      <Flex direction="column" gap={2} px={4} pb={4}>
        {groups.map((group, gi) => (
          <Box key={gi} bg={tileBg} borderRadius="lg" px={4} py={3}>
            {group.rows.map((row, ri) => (
              <Box key={ri}>
                <Flex justify="space-between" align="center" py={1.5}>
                  <Text fontSize="xs" color={labelColor}>
                    {row.label}
                  </Text>
                  <Flex align="center" gap={1} flexShrink={0}>
                    <Text fontSize="xs" fontWeight="semibold" color={valueColor} textAlign="right" maxW="155px" wordBreak="break-all">
                      {row.value}
                    </Text>
                    {row.label === "Payment Reference No." && (
                      <Box
                        as="button"
                        aria-label="Copy reference"
                        color={labelColor}
                        _hover={{ color: "accent.linkCta" }}
                        cursor="pointer"
                      >
                        <IconCopy size={12} />
                      </Box>
                    )}
                  </Flex>
                </Flex>
                {ri < group.rows.length - 1 && <Divider borderColor={borderColor} opacity={0.5} />}
              </Box>
            ))}
          </Box>
        ))}

        {/* Amounts tile */}
        {(paymentAmt || debitAmt) && (
          <Box bg={amountTileBg} borderRadius="lg" borderWidth="1px" borderColor={amountBorder} px={4} py={3}>
            {paymentAmt && (
              <Flex justify="space-between" align="baseline" py={1.5}>
                <Text fontSize="xs" color={labelColor}>Payment Amount</Text>
                <Text fontSize="sm" fontWeight="bold" color="accent.linkCta">
                  {paymentAmt.value}
                </Text>
              </Flex>
            )}
            {paymentAmt && debitAmt && <Divider borderColor={amountBorder} />}
            {debitAmt && (
              <Flex justify="space-between" align="baseline" py={1.5}>
                <Text fontSize="xs" color={labelColor}>Debit Amount</Text>
                <Text fontSize="sm" fontWeight="bold" color={valueColor}>
                  {debitAmt.value}
                </Text>
              </Flex>
            )}
          </Box>
        )}
      </Flex>
    </Box>
  );
}
