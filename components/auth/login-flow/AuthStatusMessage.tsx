"use client";

import { Box, Text } from "@chakra-ui/react";
import { useFabTokens } from "@/components/theme/FabTokensContext";

type Tone = "error" | "info";

export function AuthStatusMessage({
  message,
  tone = "error",
  role = "alert",
}: {
  message: string;
  tone?: Tone;
  role?: "alert" | "status";
}) {
  const { authColors } = useFabTokens();
  const color = tone === "error" ? "rgba(255, 160, 160, 0.95)" : authColors.text.secondary;
  const border = tone === "error" ? "rgba(255, 120, 120, 0.35)" : authColors.border.default;
  const bg = tone === "error" ? "rgba(120, 20, 20, 0.2)" : "rgba(255,255,255,0.04)";

  return (
    <Box
      role={role}
      w="full"
      borderRadius="10px"
      border="1px solid"
      borderColor={border}
      bg={bg}
      px={4}
      py={3}
    >
      <Text fontFamily="var(--font-graphik)" fontSize="14px" lineHeight="1.55" color={color}>
        {message}
      </Text>
    </Box>
  );
}
