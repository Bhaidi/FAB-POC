"use client";

import { Text, Tooltip } from "@chakra-ui/react";
import { useFabTokens } from "@/components/theme/FabTokensContext";

export function TruncatedTextCell({ value, label }: { value?: string | null; label?: string }) {
  const { corpTable } = useFabTokens();
  const display = value != null && String(value).length > 0 ? String(value) : "—";
  if (display === "—") {
    return (
      <Text fontFamily="var(--font-graphik)" fontSize="14px" color={corpTable.bodyMuted}>
        —
      </Text>
    );
  }
  return (
    <Tooltip label={label ?? display} placement="top-start" openDelay={400} hasArrow bg="rgba(12, 16, 32, 0.97)" px={3} py={2}>
      <Text
        fontFamily="var(--font-graphik)"
        fontSize="14px"
        color={corpTable.bodyPrimary}
        noOfLines={1}
        minW={0}
        cursor="default"
      >
        {display}
      </Text>
    </Tooltip>
  );
}
