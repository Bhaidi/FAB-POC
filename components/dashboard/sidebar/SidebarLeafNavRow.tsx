"use client";

import { Box, Flex, Text } from "@chakra-ui/react";
import { dashRadius } from "@/components/dashboard/dashboardTokens";
import { useFabTokens } from "@/components/theme/FabTokensContext";
import { SIDEBAR_L1_ACCENT_W } from "@/components/dashboard/sidebar/sidebarNavTokens";
import { AccessTooltip } from "@/components/dashboard/sidebar/AccessTooltip";
import { LockIndicator } from "@/components/dashboard/sidebar/LockIndicator";

export type SidebarLeafNavRowProps = {
  label: string;
  isActive: boolean;
  locked: boolean;
  partial: boolean;
  onClick?: () => void;
  /** L2 single link vs L3 action under an expanded L2. */
  variant: "l2" | "l3";
};

/**
 * Navigable leaf row — L2 and L3 share chrome but typography and active treatments differ.
 */
export function SidebarLeafNavRow({ label, isActive, locked, partial, onClick, variant }: SidebarLeafNavRowProps) {
  const { dashColors } = useFabTokens();
  const textMuted = locked ? 0.48 : partial ? 0.82 : 1;
  const isL3 = variant === "l3";

  const inner = (
    <Flex
      align="center"
      justify="space-between"
      gap={2}
      w="full"
      minH={isL3 ? "32px" : "36px"}
      pl={isL3 ? 2 : 2.5}
      pr={2}
      py={isL3 ? 1 : 1.5}
      borderRadius={isL3 ? "lg" : "md"}
      borderWidth="1px"
      borderColor={
        isActive
          ? isL3
            ? "rgba(0, 140, 255, 0.45)"
            : dashColors.navActiveBorder
          : "rgba(1, 5, 145, 0.1)"
      }
      borderLeftWidth={isActive && isL3 ? SIDEBAR_L1_ACCENT_W : "1px"}
      borderLeftColor={isActive && isL3 ? "rgba(0, 170, 255, 0.95)" : undefined}
      bg={
        isActive
          ? isL3
            ? "linear-gradient(90deg, rgba(0, 98, 255, 0.14) 0%, rgba(0, 98, 255, 0.08) 100%)"
            : dashColors.navActiveBg
          : "transparent"
      }
      cursor={locked ? "not-allowed" : onClick ? "pointer" : "default"}
      opacity={textMuted}
      transition="background 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease, opacity 0.2s ease"
      role="group"
      boxShadow={
        isActive
          ? isL3
            ? "0 0 14px rgba(0, 98, 255, 0.12), inset 0 1px 0 rgba(255,255,255,0.9)"
            : "none"
          : "none"
      }
      _hover={
        locked || !onClick
          ? {}
          : {
              bg: isActive
                ? isL3
                  ? "linear-gradient(90deg, rgba(0, 98, 255, 0.18) 0%, rgba(0, 98, 255, 0.1) 100%)"
                  : "rgba(0, 98, 255, 0.14)"
                : dashColors.navItemHoverBg,
              borderColor: isActive
                ? isL3
                  ? "rgba(0, 98, 255, 0.4)"
                  : "rgba(0, 98, 255, 0.28)"
                : dashColors.navItemHoverBorder,
              boxShadow: isActive && isL3 ? "0 0 16px rgba(0, 98, 255, 0.14), inset 0 1px 0 rgba(255,255,255,0.95)" : undefined,
            }
      }
    >
      <Text
        as="span"
        fontFamily="var(--font-graphik)"
        fontSize={isL3 ? "11px" : "12px"}
        fontWeight={isActive ? (isL3 ? 500 : 600) : isL3 ? 400 : 500}
        lineHeight="1.35"
        letterSpacing={isL3 ? "0.01em" : "0.015em"}
        color={
          isActive ? dashColors.text.primary : isL3 ? dashColors.text.secondary : dashColors.text.primary
        }
        textAlign="left"
        noOfLines={2}
      >
        {label}
      </Text>
      {locked ? <LockIndicator /> : <Box w="14px" flexShrink={0} aria-hidden />}
    </Flex>
  );

  if (locked) {
    return (
      <AccessTooltip access="locked">
        <Box
          as="span"
          display="block"
          w="full"
          tabIndex={0}
          borderRadius={dashRadius.surface}
          cursor="not-allowed"
          _focusVisible={{ outline: "none", boxShadow: "0 0 0 2px rgba(0, 98, 255, 0.35)" }}
        >
          {inner}
        </Box>
      </AccessTooltip>
    );
  }

  if (!onClick) {
    return inner;
  }

  const btn = (
    <Box
      as="button"
      type="button"
      w="full"
      textAlign="left"
      bg="transparent"
      border="none"
      p={0}
      cursor="pointer"
      borderRadius={dashRadius.surface}
      onClick={onClick}
      aria-current={isActive ? "page" : undefined}
      _focusVisible={{
        outline: "none",
        boxShadow: "0 0 0 2px rgba(0, 98, 255, 0.45), 0 0 16px rgba(0, 98, 255, 0.15)",
      }}
    >
      {inner}
    </Box>
  );

  if (partial) {
    return <AccessTooltip access="partial">{btn}</AccessTooltip>;
  }
  return btn;
}
