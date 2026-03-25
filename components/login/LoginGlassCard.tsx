"use client";

import { Box } from "@chakra-ui/react";

interface LoginGlassCardProps {
  children: React.ReactNode;
  /** Optional max width */
  maxW?: string;
}

/**
 * Glassy dark card for login form. Premium fintech look with subtle border and backdrop blur.
 */
export function LoginGlassCard({ children, maxW = "md" }: LoginGlassCardProps) {
  return (
    <Box
      w="full"
      maxW={maxW}
      bg="loginScreen.glassCard"
      borderRadius="2xl"
      borderWidth="1px"
      borderColor="loginScreen.glassBorder"
      boxShadow="0 0 0 1px rgba(255,255,255,0.06), 0 0 40px -8px rgba(15,98,254,0.12), 0 24px 48px -12px rgba(0,0,0,0.5)"
      p={8}
      backdropFilter="blur(20px)"
      position="relative"
      overflow="hidden"
    >
      {children}
    </Box>
  );
}
