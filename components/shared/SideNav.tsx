"use client";

import {
  Box,
  Flex,
  Icon,
  Text,
  VStack,
  useBreakpointValue,
} from "@chakra-ui/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { HiHome, HiCog } from "react-icons/hi";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: HiHome },
  { href: "/dashboard/settings", label: "Settings", icon: HiCog },
];

export function SideNav() {
  const pathname = usePathname();
  const isCollapsed = useBreakpointValue({ base: true, lg: false });

  return (
    <Box
      as="nav"
      w={{ base: "full", lg: "240px" }}
      minH={{ base: "auto", lg: "100vh" }}
      bg="brand.primaryDark"
      borderRightWidth="1px"
      borderColor="brand.darkBlueAccent"
      py={4}
    >
      <Flex align="center" justify={{ base: "center", lg: "flex-start" }} px={4}>
        <Text
          fontWeight="bold"
          fontSize="lg"
          color="white"
          noOfLines={1}
          title="Logo placeholder — replace with brand asset"
        >
          Portal
        </Text>
      </Flex>
      <VStack align="stretch" spacing={1} mt={6} px={2}>
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Box
              key={item.href}
              as={Link}
              href={item.href}
              px={4}
              py={3}
              borderRadius="lg"
              bg={isActive ? "whiteAlpha.200" : "transparent"}
              color={isActive ? "white" : "whiteAlpha.800"}
              _hover={{ bg: "whiteAlpha.200", color: "white" }}
              display="flex"
              alignItems="center"
              gap={3}
            >
              <Icon as={item.icon} boxSize={5} />
              {!isCollapsed && <Text fontSize="sm">{item.label}</Text>}
            </Box>
          );
        })}
      </VStack>
    </Box>
  );
}
