"use client";

import { Box, Flex, Text } from "@chakra-ui/react";
import { AlertCircle, Bell, CheckCircle2, Info } from "lucide-react";
import { useFabTokens } from "@/components/theme/FabTokensContext";

const MAX_ITEMS = 3;

type Props = {
  alerts: string[];
};

function ItemIcon({ index }: { index: number }) {
  const p = { size: 14 as const, strokeWidth: 1.75, "aria-hidden": true as const };
  if (index === 0) return <AlertCircle {...p} color="rgba(220, 175, 130, 0.72)" />;
  if (index === 1) return <Info {...p} color="rgba(145, 175, 235, 0.65)" />;
  return <Bell {...p} color="rgba(255,255,255,0.42)" />;
}

export function PortfolioAttentionCard({ alerts }: Props) {
  const { corpTable } = useFabTokens();
  const hasAlerts = alerts.length > 0;
  const visible = hasAlerts ? alerts.slice(0, MAX_ITEMS) : [];

  return (
    <Box role="complementary" aria-label="Attention" display="flex" flexDirection="column" h="full">
      <Text
        fontFamily={corpTable.chromeFontFamily}
        fontSize="12px"
        fontWeight={500}
        letterSpacing="0.02em"
        color={corpTable.chromeTextMuted}
        mb={3}
      >
        Attention
      </Text>
      {!hasAlerts ? (
        <Flex align="flex-start" gap={2} minH="48px">
          <Box pt="2px" flexShrink={0}>
            <CheckCircle2 size={15} strokeWidth={1.75} color="rgba(130, 195, 165, 0.65)" aria-hidden />
          </Box>
          <Text
            fontFamily={corpTable.chromeFontFamily}
            fontSize="14px"
            fontWeight={corpTable.chromeFontWeight}
            lineHeight={1.45}
            color={corpTable.chromeTextMuted}
            letterSpacing={corpTable.chromeLetterSpacing}
          >
            Everything looks good
          </Text>
        </Flex>
      ) : (
        <Flex direction="column" gap={3}>
          {visible.map((line, i) => (
            <Flex key={`${i}-${line.slice(0, 20)}`} align="flex-start" gap={2} minW={0}>
              <Box pt="2px" flexShrink={0}>
                <ItemIcon index={i} />
              </Box>
              <Text
                fontFamily={corpTable.chromeFontFamily}
                fontSize="14px"
                fontWeight={corpTable.chromeFontWeight}
                lineHeight={1.45}
                color={corpTable.bodyPrimary}
                letterSpacing={corpTable.chromeLetterSpacing}
              >
                {line}
              </Text>
            </Flex>
          ))}
        </Flex>
      )}
    </Box>
  );
}
