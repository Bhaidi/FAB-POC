"use client";

import { Box, Flex } from "@chakra-ui/react";
import { SideNav } from "./SideNav";
import { TopBar } from "./TopBar";

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  return (
    <Flex minH="100vh" bg="neutral.pageBg" direction={{ base: "column", lg: "row" }}>
      <SideNav />
      <Box flex={1} display="flex" flexDirection="column" minW={0}>
        <TopBar />
        <Box as="main" flex={1} p={{ base: 4, md: 6 }}>
          {children}
        </Box>
      </Box>
    </Flex>
  );
}
