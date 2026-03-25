"use client";

import { Box, Flex, Text, Tooltip } from "@chakra-ui/react";
import type { ReactNode } from "react";
import { dashColors, dashRadius } from "@/components/dashboard/dashboardTokens";
import { SIDEBAR_NAV_TOOLTIP_PROPS } from "@/components/dashboard/sidebar/sidebarNavTokens";

export type SidebarNavItemProps = {
  icon: ReactNode;
  label: string;
  active?: boolean;
  collapsed?: boolean;
  onClick?: () => void;
};

export function SidebarNavItem({
  icon,
  label,
  active = false,
  collapsed = false,
  onClick,
}: SidebarNavItemProps) {
  const row = (
    <Flex
      as="button"
      type="button"
      aria-label={collapsed ? label : undefined}
      align="center"
      justify={collapsed ? "center" : "flex-start"}
      gap={collapsed ? 0 : 3}
      w="full"
      px={collapsed ? 2 : 3}
      py={2.5}
      borderRadius={dashRadius.surface}
      border="1px solid"
      borderColor={active ? dashColors.navActiveBorder : "transparent"}
      bg={active ? dashColors.navActiveBg : "transparent"}
      color={active ? dashColors.text.primary : dashColors.text.secondary}
      cursor="pointer"
      transition="background 0.2s ease, border-color 0.2s ease, color 0.2s ease, transform 0.2s ease"
      _hover={{
        bg: active ? dashColors.navActiveBg : "rgba(255,255,255,0.06)",
        color: dashColors.text.primary,
        borderColor: active ? dashColors.navActiveBorder : "rgba(255,255,255,0.08)",
        transform: collapsed ? "none" : "translateX(2px)",
      }}
      onClick={onClick}
    >
      <Box flexShrink={0} fontSize="18px" opacity={active ? 1 : 0.85} aria-hidden>
        {icon}
      </Box>
      {!collapsed ? (
        <Text
          as="span"
          fontFamily="var(--font-graphik)"
          fontSize="14px"
          fontWeight={active ? 500 : 400}
          lineHeight="1.35"
          textAlign="left"
        >
          {label}
        </Text>
      ) : null}
    </Flex>
  );

  if (collapsed) {
    return (
      <Tooltip label={label} placement="right" hasArrow openDelay={280} gutter={10} {...SIDEBAR_NAV_TOOLTIP_PROPS}>
        {row}
      </Tooltip>
    );
  }

  return row;
}
