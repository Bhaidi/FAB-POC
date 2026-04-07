"use client";

import { Text } from "@chakra-ui/react";

export function BreakdownSummaryLine({ children }: { children: string }) {
  if (!children.trim()) return null;
  return (
    <Text
      mt={3}
      fontSize="13px"
      fontWeight={500}
      lineHeight={1.45}
      color="rgba(255,255,255,0.52)"
      fontFamily="var(--font-graphik)"
    >
      {children}
    </Text>
  );
}
