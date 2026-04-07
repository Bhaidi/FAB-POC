"use client";

import { Flex, Text } from "@chakra-ui/react";
import { currencyCodeToFlagEmoji } from "@/components/account-services/portfolio/cells/currencyRegionCode";
import { useFabTokens } from "@/components/theme/FabTokensContext";

export function CurrencyCell({ code }: { code?: string | null }) {
  const { corpTable } = useFabTokens();
  const raw = String(code ?? "").trim();
  if (!raw) {
    return (
      <Text fontFamily="var(--font-graphik)" fontSize="13px" color={corpTable.bodyMuted}>
        —
      </Text>
    );
  }
  const ccy = raw.toUpperCase();
  return (
    <Flex align="center" gap={2} minW={0}>
      <Text as="span" fontSize="13px" lineHeight={1} aria-hidden flexShrink={0} w="20px" textAlign="center">
        {currencyCodeToFlagEmoji(ccy)}
      </Text>
      <Text
        fontFamily="var(--font-graphik)"
        fontSize="13px"
        fontWeight={600}
        letterSpacing="0.04em"
        color={corpTable.bodyPrimary}
        sx={{ fontVariantNumeric: "tabular-nums" }}
      >
        {ccy}
      </Text>
    </Flex>
  );
}
