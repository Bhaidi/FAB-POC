"use client";

import {
  Box,
  Flex,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { IconCopy } from "@tabler/icons-react";
import { useFabTokens } from "@/components/theme/FabTokensContext";
import type { IftSummaryRow } from "@/data/iftPaymentTypes";

interface IftPaymentSummaryPanelProps {
  rows: IftSummaryRow[];
}

export function IftPaymentSummaryPanel({ rows }: IftPaymentSummaryPanelProps) {
  const { dashColors } = useFabTokens();
  const bg = useColorModeValue("white", dashColors.cardBg);
  const borderColor = useColorModeValue("neutral.border", dashColors.cardBorder);
  const labelColor = useColorModeValue("neutral.secondaryText", dashColors.pageSubtitle);
  const valueColor = useColorModeValue("neutral.mainText", dashColors.pageTitle);
  const headerColor = useColorModeValue("rgba(0,0,0,0.8)", dashColors.pageTitle);
  const highlightBg = useColorModeValue("blue.50", "rgba(0, 98, 255, 0.08)");

  /* Labels after which we draw a separator */
  const separatorAfter = new Set(["Transaction Type", "Debit Account Number"]);

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
      <Box px={6} pt={5} pb={3}>
        <Text fontSize="lg" fontWeight="semibold" color={headerColor}>
          Payment Overview
        </Text>
      </Box>

      <Flex direction="column">
        {rows.map((row, i) => {
          const isSeparator = separatorAfter.has(row.label);
          return (
            <Box key={i}>
              <Flex
                justify="space-between"
                align="center"
                gap={4}
                {...(row.highlight
                  ? {
                      px: 4,
                      py: 2.5,
                      mx: 3,
                      borderRadius: "md",
                      borderLeftWidth: "3px",
                      borderLeftColor: "accent.linkCta",
                      bg: highlightBg,
                      mb: 1,
                    }
                  : {
                      px: 6,
                      py: 3,
                    })}
              >
                <Text fontSize="xs" color={labelColor}>
                  {row.label}
                </Text>
                <Flex align="center" gap={1}>
                  <Text
                    fontSize="sm"
                    fontWeight="semibold"
                    color={valueColor}
                    textAlign="right"
                    maxW="180px"
                    wordBreak="break-all"
                  >
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
                      <IconCopy size={14} />
                    </Box>
                  )}
                </Flex>
              </Flex>
              {isSeparator && (
                <Box
                  borderBottomWidth="1px"
                  borderColor={borderColor}
                  mb={1}
                  mx={3}
                />
              )}
            </Box>
          );
        })}
      </Flex>
    </Box>
  );
}
