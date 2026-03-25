"use client";

import { Box, Container, Flex } from "@chakra-ui/react";

interface AuthLayoutProps {
  children: React.ReactNode;
  /** Optional: use developer theme variant (darker, tech-premium) */
  variant?: "default" | "developer";
}

export function AuthLayout({ children, variant = "default" }: AuthLayoutProps) {
  return (
    <Flex
      minH="100vh"
      bg={variant === "developer" ? "brand.header" : "neutral.pageBg"}
      align="center"
      justify="center"
      py={8}
    >
      <Container maxW="md">
        <Box
          bg="white"
          borderRadius="2xl"
          p={8}
          shadow="xl"
          borderWidth="1px"
          borderColor="neutral.border"
        >
          {children}
        </Box>
      </Container>
    </Flex>
  );
}
