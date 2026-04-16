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
 * Payment Overview 5 — Label-top / value-below with light tile groups.
 * No timeline. Rows grouped into subtle tiles with amounts in an accent tile.
 */

interface IftPaymentSummaryPanel5Props {
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

export function IftPaymentSummaryPanel5({ rows }: IftPaymentSummaryPanel5Props) {
  const { dashColors } = useFabTokens();
  const bg = useColorModeValue("white", dashColors.cardBg);
  const borderColor = useColorModeValue("neutral.border", dashColors.cardBorder);
  const labelColor = useColorModeValue("neutral.secondaryText", dashColors.pageSubtitle);
  const valueColor = useColorModeValue("neutral.mainText", dashColors.pageTitle);
  const headerColor = useColorModeValue("rgba(0,0,0,0.8)", dashColors.pageTitle);
  const tileBg = useColorModeValue("gray.50", dashColors.surfaceElevated);
  const amountCardBg = useColorModeValue("blue.50", "rgba(0, 98, 255, 0.08)");
  const amountBorder = useColorModeValue("blue.200", "rgba(96,165,250,0.25)");

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
      maxH="80vh"
      display="flex"
      flexDirection="column"
    >
      {/* Header */}
      <Box px={4} pt={4} pb={1.5} flexShrink={0}>
        <Text fontSize="md" fontWeight="semibold" color={headerColor}>
          Payment Overview 5
        </Text>
      </Box>

      {/* Grouped tiles — label top, value below */}
      <Flex direction="column" gap={1.5} px={3} pb={3} flex={1} overflowY="auto">
        {groups.map((group, gi) => (
          <Box key={gi} bg={tileBg} borderRadius="md" px={3} py={2}>
            {group.rows.map((row, ri) => (
              <Box key={ri} py={1}>
                <Flex align="center" gap={1}>
                  <Text fontSize="2xs" color={labelColor} letterSpacing="wide">
                    {row.label}
                  </Text>
                  {row.label === "Payment Reference No." && (
                    <Box
                      as="button"
                      aria-label="Copy reference"
                      color={labelColor}
                      _hover={{ color: "accent.linkCta" }}
                      cursor="pointer"
                      flexShrink={0}
                    >
                      <IconCopy size={12} />
                    </Box>
                  )}
                </Flex>
                <Text fontSize="sm" fontWeight="semibold" color={valueColor} mt={0.5} wordBreak="break-all">
                  {row.value}
                </Text>
              </Box>
            ))}
          </Box>
        ))}

        {/* Amounts tile */}
        {(paymentAmt || debitAmt) && (
          <Box bg={amountCardBg} borderRadius="md" borderWidth="1px" borderColor={amountBorder} px={3} py={2} flexShrink={0}>
            {paymentAmt && (
              <Box py={1}>
                <Text fontSize="2xs" color={labelColor} letterSpacing="wide">
                  Payment Amount
                </Text>
                <Text fontSize="sm" fontWeight="bold" color="accent.linkCta" mt={0.5}>
                  {paymentAmt.value}
                </Text>
              </Box>
            )}
            {paymentAmt && debitAmt && <Divider borderColor={amountBorder} />}
            {debitAmt && (
              <Box py={1}>
                <Text fontSize="2xs" color={labelColor} letterSpacing="wide">
                  Debit Amount
                </Text>
                <Text fontSize="sm" fontWeight="bold" color={valueColor} mt={0.5}>
                  {debitAmt.value}
                </Text>
              </Box>
            )}
          </Box>
        )}
      </Flex>
    </Box>
  );
}
