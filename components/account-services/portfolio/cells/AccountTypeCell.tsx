"use client";

import { Text } from "@chakra-ui/react";
import { useFabTokens } from "@/components/theme/FabTokensContext";

export function AccountTypeCell({ type }: { type?: string | null }) {
  const { corpTable } = useFabTokens();
  if (type == null) {
    return (
      <Text fontFamily="var(--font-graphik)" fontSize="13px" color={corpTable.bodyMuted}>
        —
      </Text>
    );
  }
  return (
    <Text
      as="span"
      display="inline-block"
      fontFamily="var(--font-graphik)"
      fontSize="12px"
      fontWeight={500}
      px={2.5}
      py={0.5}
      borderRadius="md"
      bg={corpTable.pillBg}
      color={corpTable.bodyPrimary}
    >
      {type}
    </Text>
  );
}
