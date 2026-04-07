"use client";

import { Flex, Text } from "@chakra-ui/react";
import { countryCodeToFlagEmoji } from "@/components/account-services/portfolio/cells/countryFlagEmoji";
import { useFabTokens } from "@/components/theme/FabTokensContext";

export function CountryCell({ code, name }: { code?: string | null; name?: string | null }) {
  const { corpTable } = useFabTokens();
  const safeCode = String(code ?? "").trim();
  const safeName = String(name ?? "").trim();
  if (!safeCode && !safeName) {
    return (
      <Text fontFamily="var(--font-graphik)" fontSize="14px" color={corpTable.bodyMuted}>
        —
      </Text>
    );
  }
  return (
    <Flex align="center" gap={2} minW={0}>
      <Text as="span" fontSize="15px" lineHeight={1} aria-hidden flexShrink={0}>
        {countryCodeToFlagEmoji(safeCode || "XX")}
      </Text>
      <Text fontFamily="var(--font-graphik)" fontSize="14px" color={corpTable.bodyPrimary} noOfLines={1} minW={0}>
        {safeName || "—"}
      </Text>
    </Flex>
  );
}
