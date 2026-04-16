"use client";

import {
  Box,
  Flex,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { IconCopy, IconArrowDown } from "@tabler/icons-react";
import { useFabTokens } from "@/components/theme/FabTokensContext";
import type { IftSummaryRow } from "@/data/iftPaymentTypes";

/**
 * Payment Overview 3 — Timeline / stepped tracker style
 * Each row renders as a step in a vertical timeline with a dot connector.
 * Highlighted amounts render as inline accent cards within the timeline flow.
 */

interface IftPaymentSummaryPanel3Props {
  rows: IftSummaryRow[];
}

export function IftPaymentSummaryPanel3({ rows }: IftPaymentSummaryPanel3Props) {
  const { dashColors } = useFabTokens();
  const bg = useColorModeValue("white", dashColors.cardBg);
  const borderColor = useColorModeValue("neutral.border", dashColors.cardBorder);
  const labelColor = useColorModeValue("neutral.secondaryText", dashColors.pageSubtitle);
  const valueColor = useColorModeValue("neutral.mainText", dashColors.pageTitle);
  const headerColor = useColorModeValue("rgba(0,0,0,0.8)", dashColors.pageTitle);
  const dotColor = useColorModeValue("accent.linkCta", "#60A5FA");
  const dotInactive = useColorModeValue("gray.300", dashColors.sectionDivider);
  const lineColor = useColorModeValue("gray.200", dashColors.sectionDivider);
  const amountCardBg = useColorModeValue("blue.50", "rgba(0, 98, 255, 0.08)");
  const amountBorder = useColorModeValue("blue.200", "rgba(96,165,250,0.25)");

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
      <Box px={5} pt={5} pb={2}>
        <Text fontSize="lg" fontWeight="semibold" color={headerColor}>
          Payment Overview 3
        </Text>
      </Box>

      {/* Timeline rows */}
      <Box px={5} pb={5}>
        {rows.map((row, i) => {
          const isLast = i === rows.length - 1;
          const hasValue = !!row.value;

          return (
            <Flex key={i} gap={3} position="relative">
              {/* Dot + line */}
              <Flex direction="column" align="center" flexShrink={0} w="14px">
                <Box
                  w={row.highlight ? "10px" : "8px"}
                  h={row.highlight ? "10px" : "8px"}
                  borderRadius="full"
                  bg={hasValue ? dotColor : dotInactive}
                  mt="5px"
                  flexShrink={0}
                  {...(row.highlight && {
                    boxShadow: "0 0 0 3px rgba(59,130,246,0.2)",
                  })}
                />
                {!isLast && (
                  <Box flex={1} w="1.5px" bg={lineColor} mt="2px" mb="2px" />
                )}
              </Flex>

              {/* Content */}
              <Box pb={isLast ? 0 : 3} flex={1} minW={0}>
                {row.highlight ? (
                  /* Amount rows — styled inline card */
                  <Box
                    bg={amountCardBg}
                    borderWidth="1px"
                    borderColor={amountBorder}
                    borderRadius="lg"
                    px={3.5}
                    py={2.5}
                    mt={-0.5}
                  >
                    <Flex justify="space-between" align="center">
                      <Text fontSize="2xs" color={labelColor} textTransform="uppercase" letterSpacing="wide">
                        {row.label}
                      </Text>
                      <Text fontSize="md" fontWeight="bold" color={valueColor}>
                        {row.value}
                      </Text>
                    </Flex>
                  </Box>
                ) : (
                  /* Regular rows */
                  <>
                    <Text fontSize="2xs" color={labelColor} textTransform="uppercase" letterSpacing="wide" lineHeight="tall">
                      {row.label}
                    </Text>
                    <Flex align="center" gap={1}>
                      <Text
                        fontSize="sm"
                        fontWeight="semibold"
                        color={valueColor}
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
                          flexShrink={0}
                        >
                          <IconCopy size={12} />
                        </Box>
                      )}
                    </Flex>
                  </>
                )}
              </Box>
            </Flex>
          );
        })}
      </Box>
    </Box>
  );
}
