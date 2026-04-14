"use client";

import {
  Avatar,
  Box,
  Button,
  Flex,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Text,
  useColorMode,
} from "@chakra-ui/react";
import Link from "next/link";
import { HiArrowRightOnRectangle, HiChevronDown, HiHome } from "react-icons/hi2";
import { GlassCornerRim } from "@/components/ui/GlassCornerRim";
import { dashRadius } from "@/components/dashboard/dashboardTokens";
import { useFabTokens } from "@/components/theme/FabTokensContext";
import { authColorsLight } from "@/lib/fabTheme/authPalettes";
import { glassCornerRimPaletteAuth } from "@/lib/fabTheme/glassCornerRim";
import { glassTokens } from "@/lib/glassTokens";

export type UserProfileMenuProps = {
  displayName: string;
  role: string;
  corporateId: string;
  userId: string;
  onSignOut: () => void;
  /** Primary nav: circular avatar only (Developer Portal pattern). */
  avatarOnly?: boolean;
};

function initials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

export function UserProfileMenu({
  displayName,
  role,
  corporateId,
  userId,
  onSignOut,
  avatarOnly = false,
}: UserProfileMenuProps) {
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";
  const { dashColors } = useFabTokens();
  const menuInk = authColorsLight.text;
  const menuInkResolved = isDark
    ? { primary: glassTokens.text.primary, muted: glassTokens.text.muted }
    : menuInk;
  const menuChromeRadius = dashRadius.surface;

  return (
    <Menu placement="bottom-end" strategy="fixed">
      <Box position="relative" display="inline-block" overflow="visible">
        <MenuButton
          as={Button}
          variant="ghost"
          position="relative"
          zIndex={2}
          h="auto"
          py={avatarOnly ? 0 : 1.5}
          px={avatarOnly ? 0 : 2}
          borderRadius={avatarOnly ? "full" : menuChromeRadius}
          _hover={{
            bg: avatarOnly
              ? isDark
                ? "rgba(255,255,255,0.1)"
                : "rgba(1,5,145,0.06)"
              : "rgba(1,5,145,0.05)",
          }}
          _active={{
            bg: avatarOnly ? (isDark ? "rgba(255,255,255,0.14)" : "rgba(1,5,145,0.08)") : "rgba(1,5,145,0.08)",
          }}
        >
          <Flex align="center" gap={2}>
          <Avatar
            size={avatarOnly ? "md" : "sm"}
            name={displayName}
            getInitials={() => initials(displayName)}
            bg="#010591"
            color="white"
            fontFamily="var(--font-graphik)"
            fontWeight={600}
            fontSize="sm"
            border="2px solid"
            borderColor="rgba(1, 5, 145, 0.15)"
          />
          {!avatarOnly ? (
            <>
              <Box textAlign="left" display={{ base: "none", sm: "block" }}>
                <Text
                  fontFamily="var(--font-graphik)"
                  fontSize="13px"
                  fontWeight={500}
                  color={dashColors.text.primary}
                  lineHeight="1.2"
                  noOfLines={1}
                  maxW="160px"
                >
                  {displayName}
                </Text>
                <Text fontFamily="var(--font-graphik)" fontSize="11px" color={dashColors.text.muted} noOfLines={1}>
                  {role}
                </Text>
              </Box>
              <HiChevronDown size={16} color="rgba(72, 82, 94, 0.55)" />
            </>
          ) : null}
        </Flex>
        </MenuButton>
        {isDark && !avatarOnly ? (
          <GlassCornerRim radius={menuChromeRadius} palette={glassCornerRimPaletteAuth} zIndex={3} />
        ) : null}
      </Box>
      <MenuList
        position="relative"
        overflow="visible"
        minW="240px"
        borderRadius={menuChromeRadius}
        bg={isDark ? glassTokens.fill.panel : "rgba(255, 255, 255, 0.98)"}
        borderWidth="1px"
        borderColor={isDark ? glassTokens.border.default : "rgba(1, 5, 145, 0.1)"}
        backdropFilter={isDark ? glassTokens.blur.card : "blur(12px)"}
        sx={{
          WebkitBackdropFilter: isDark ? glassTokens.blur.card : "blur(12px)",
          boxShadow: isDark ? glassTokens.shadowStack.panel : undefined,
        }}
        py={2}
        zIndex={200}
      >
        <Box position="relative" zIndex={2} px={3} pb={2}>
          <Text fontFamily="var(--font-graphik)" fontSize="xs" color={menuInkResolved.muted}>
            Corporate ID
          </Text>
          <Text fontFamily="var(--font-graphik)" fontSize="sm" color={menuInkResolved.primary} fontWeight={500}>
            {corporateId}
          </Text>
          <Text fontFamily="var(--font-graphik)" fontSize="xs" color={menuInkResolved.muted} mt={2}>
            User ID
          </Text>
          <Text fontFamily="var(--font-graphik)" fontSize="sm" color={menuInkResolved.primary} fontWeight={500}>
            {userId}
          </Text>
        </Box>
        <MenuDivider borderColor={isDark ? glassTokens.border.default : "rgba(1, 5, 145, 0.08)"} />
        <MenuItem
          as={Link}
          href="/dashboard"
          prefetch={false}
          icon={<HiHome size={18} />}
          fontFamily="var(--font-graphik)"
          color={menuInkResolved.primary}
          bg="transparent"
          _hover={{ bg: isDark ? "rgba(255,255,255,0.08)" : "rgba(1, 5, 145, 0.05)" }}
          _focus={{ bg: isDark ? "rgba(255,255,255,0.08)" : "rgba(1, 5, 145, 0.05)" }}
        >
          Home
        </MenuItem>
        {!avatarOnly ? (
          <MenuItem
            icon={<HiArrowRightOnRectangle size={18} />}
            fontFamily="var(--font-graphik)"
            color={menuInkResolved.primary}
            bg="transparent"
            _hover={{ bg: isDark ? "rgba(255,255,255,0.08)" : "rgba(1, 5, 145, 0.05)" }}
            _focus={{ bg: isDark ? "rgba(255,255,255,0.08)" : "rgba(1, 5, 145, 0.05)" }}
            onClick={onSignOut}
          >
            Sign out
          </MenuItem>
        ) : null}
        {isDark ? (
          <GlassCornerRim radius={menuChromeRadius} palette={glassCornerRimPaletteAuth} zIndex={3} />
        ) : null}
      </MenuList>
    </Menu>
  );
}
