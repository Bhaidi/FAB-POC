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
import { iftCountries } from "@/data/iftPaymentMock";

/**
 * Payment Overview 4 — Label on top, value below, separated groups
 * Each field stacks vertically (label → value). Groups are visually
 * separated by thin dividers. Amounts at the bottom with accent styling.
 */

interface IftPaymentSummaryPanel4Props {
  rows: IftSummaryRow[];
}

const GROUP_DEFS: { title: string; labels: string[] }[] = [
  {
    title: "Transfer Details",
    labels: ["Payment Reference No.", "Country", "Transaction Type"],
  },
  {
    title: "Debit Account",
    labels: ["Debit Account Name", "Debit Account Number"],
  },
  {
    title: "Beneficiary",
    labels: ["Beneficiary Name", "Beneficiary Account"],
  },
  {
    title: "Payment Schedule",
    labels: ["Payment Date"],
  },
];

export function IftPaymentSummaryPanel4({ rows }: IftPaymentSummaryPanel4Props) {
  const { dashColors } = useFabTokens();
  const bg = useColorModeValue("white", dashColors.cardBg);
  const borderColor = useColorModeValue("neutral.border", dashColors.cardBorder);
  const labelColor = useColorModeValue("neutral.secondaryText", dashColors.pageSubtitle);
  const valueColor = useColorModeValue("neutral.mainText", dashColors.pageTitle);
  const headerColor = useColorModeValue("rgba(0,0,0,0.8)", dashColors.pageTitle);
  const amountBg = useColorModeValue("gray.50", dashColors.surfaceElevated);

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
      <Box px={4} pt={3} pb={2} bg="#40639e" borderTopRadius="lg">
        <Text fontSize="lg" fontWeight="semibold" color="white">
          Payment Overview
        </Text>
      </Box>

      {/* Grouped sections — label top, value bottom */}
      <Box px={5}>
        {groups.map((group, gi) => (
          <Box key={gi}>
            {group.rows.map((row, ri) => (
              <Box key={ri} py={2}>
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
                    >
                      <IconCopy size={12} />
                    </Box>
                  )}
                </Flex>
                <Text fontSize="sm" fontWeight="semibold" color={valueColor} mt={0.5} wordBreak="break-all">
                  {row.label === "Country" && (() => {
                    const c = iftCountries.find((ct) => ct.name === row.value);
                    return c ? `${c.flagEmoji} ` : "";
                  })()}
                  {row.value}
                </Text>
              </Box>
            ))}
            {gi < groups.length - 1 && <Divider borderColor={borderColor} />}
          </Box>
        ))}
      </Box>

      {/* Amounts — anchored at bottom */}
      {(paymentAmt || debitAmt) && (
        <Box bg={amountBg} mt={2} px={5} py={3} borderTopWidth="1px" borderColor={borderColor}>
          {paymentAmt && (
            <Box py={1.5}>
              <Text fontSize="2xs" color={labelColor} letterSpacing="wide">
                Payment Amount
              </Text>
              <Text fontSize="md" fontWeight="bold" color={valueColor} mt={0.5}>
                {paymentAmt.value}
              </Text>
            </Box>
          )}
          {paymentAmt && debitAmt && <Divider borderColor={borderColor} />}
          {debitAmt && (
            <Box py={1.5}>
              <Text fontSize="2xs" color={labelColor} letterSpacing="wide">
                Debit Amount
              </Text>
              <Text fontSize="md" fontWeight="bold" color={valueColor} mt={0.5}>
                {debitAmt.value}
              </Text>
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
}
