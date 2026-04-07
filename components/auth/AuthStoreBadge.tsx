"use client";

import NextLink from "next/link";
import { Box, Icon, Text, VStack } from "@chakra-ui/react";
import type { IconType } from "react-icons";
import { authRadius } from "@/components/auth/authTokens";
import { useFabTokens } from "@/components/theme/FabTokensContext";

export type AuthStoreBadgeProps = {
  href: string;
  icon: IconType;
  line1: string;
  line2: string;
  /** `sm` = compact (QR panel); `md` = hero / marketing row */
  size?: "sm" | "md";
  /** Lighter chrome for inline hero / text column (no “card” look). */
  visualWeight?: "default" | "minimal";
};

/**
 * App Store / Google Play–style badge; shared styling across QR panel and download hero.
 */
export function AuthStoreBadge({
  href,
  icon,
  line1,
  line2,
  size = "sm",
  visualWeight = "default",
}: AuthStoreBadgeProps) {
  const { authColors } = useFabTokens();
  const md = size === "md";
  const minimal = visualWeight === "minimal";
  return (
    <Box
      as={NextLink}
      href={href}
      display="flex"
      alignItems="center"
      gap={md ? 2.5 : 2}
      px={minimal ? 2.5 : md ? 3 : 2.5}
      py={minimal ? 2 : md ? 2.5 : 2}
      borderRadius={authRadius.surface}
      bg={minimal ? "rgba(255, 255, 255, 0.05)" : authColors.glass.tintHover}
      border="1px solid"
      borderColor={minimal ? authColors.border.subtle : authColors.border.default}
      transition="background 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease, transform 0.18s ease"
      flex={1}
      minW="0"
      justifyContent="center"
      _hover={
        minimal
          ? {
              bg: "rgba(255, 255, 255, 0.085)",
              borderColor: authColors.border.default,
            }
          : {
              bg: "rgba(255, 255, 255, 0.1)",
              borderColor: authColors.border.strong,
              boxShadow: "0 4px 20px rgba(0, 98, 255, 0.14)",
              transform: "translateY(-1px)",
            }
      }
      _active={{ transform: "translateY(0)" }}
    >
      <Icon as={icon} boxSize={md ? 6 : 5} color="white" flexShrink={0} opacity={0.95} aria-hidden />
      <VStack align="flex-start" spacing={0} lineHeight="1.12" minW={0}>
        <Text
          fontFamily="var(--font-graphik)"
          fontSize={md ? "9px" : "8px"}
          fontWeight={500}
          color={authColors.text.tertiary}
          textTransform="uppercase"
          letterSpacing="0.05em"
        >
          {line1}
        </Text>
        <Text
          fontFamily="var(--font-graphik)"
          fontSize={md ? "12px" : "11px"}
          fontWeight={600}
          color={authColors.text.primary}
          noOfLines={1}
        >
          {line2}
        </Text>
      </VStack>
    </Box>
  );
}
