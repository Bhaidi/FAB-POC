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
} from "@chakra-ui/react";
import { HiArrowRightOnRectangle, HiChevronDown } from "react-icons/hi2";
import { dashColors, dashRadius } from "@/components/dashboard/dashboardTokens";

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
  return (
    <Menu placement="bottom-end" strategy="fixed">
      <MenuButton
        as={Button}
        variant="ghost"
        h="auto"
        py={avatarOnly ? 0 : 1.5}
        px={avatarOnly ? 0 : 2}
        borderRadius={avatarOnly ? "full" : dashRadius.surface}
        _hover={{ bg: avatarOnly ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.06)" }}
        _active={{ bg: "rgba(255,255,255,0.08)" }}
      >
        <Flex align="center" gap={2}>
          <Avatar
            size={avatarOnly ? "md" : "sm"}
            name={displayName}
            getInitials={() => initials(displayName)}
            bg="#000245"
            color="white"
            fontFamily="var(--font-graphik)"
            fontWeight={600}
            fontSize="sm"
            border="2px solid"
            borderColor="rgba(255,255,255,0.14)"
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
              <HiChevronDown size={16} color="rgba(255,255,255,0.5)" />
            </>
          ) : null}
        </Flex>
      </MenuButton>
      <MenuList
        minW="240px"
        bg="rgba(12, 16, 32, 0.96)"
        borderColor="rgba(255,255,255,0.12)"
        backdropFilter="blur(12px)"
        py={2}
        zIndex={200}
      >
        <Box px={3} pb={2}>
          <Text fontFamily="var(--font-graphik)" fontSize="xs" color={dashColors.text.muted}>
            Corporate ID
          </Text>
          <Text fontFamily="var(--font-graphik)" fontSize="sm" color={dashColors.text.primary} fontWeight={500}>
            {corporateId}
          </Text>
          <Text fontFamily="var(--font-graphik)" fontSize="xs" color={dashColors.text.muted} mt={2}>
            User ID
          </Text>
          <Text fontFamily="var(--font-graphik)" fontSize="sm" color={dashColors.text.primary} fontWeight={500}>
            {userId}
          </Text>
        </Box>
        <MenuDivider borderColor="rgba(255,255,255,0.08)" />
        {!avatarOnly ? (
          <MenuItem
            icon={<HiArrowRightOnRectangle size={18} />}
            fontFamily="var(--font-graphik)"
            color={dashColors.text.primary}
            bg="transparent"
            _hover={{ bg: "rgba(255,255,255,0.08)" }}
            _focus={{ bg: "rgba(255,255,255,0.08)" }}
            onClick={onSignOut}
          >
            Sign out
          </MenuItem>
        ) : null}
      </MenuList>
    </Menu>
  );
}
