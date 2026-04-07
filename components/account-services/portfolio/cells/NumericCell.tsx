"use client";

import { Text, Tooltip } from "@chakra-ui/react";
import { useFabTokens } from "@/components/theme/FabTokensContext";

export function NumericCell({
  value,
  title,
  truncate,
}: {
  value?: string | null;
  title?: string;
  truncate?: boolean;
}) {
  const { corpTable } = useFabTokens();
  const display = value != null && String(value).length > 0 ? String(value) : "—";
  const inner = (
    <Text
      fontFamily={corpTable.mono}
      fontSize="13px"
      letterSpacing="0.02em"
      color={display === "—" ? corpTable.bodyMuted : corpTable.bodyPrimary}
      noOfLines={truncate ? 1 : undefined}
      minW={0}
      sx={{ fontVariantNumeric: "tabular-nums" }}
    >
      {display}
    </Text>
  );

  if (truncate && title) {
    return (
      <Tooltip label={title} openDelay={400} hasArrow bg="rgba(12, 16, 32, 0.97)" px={3} py={2}>
        {inner}
      </Tooltip>
    );
  }

  return inner;
}
