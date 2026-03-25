"use client";

import { Button } from "@chakra-ui/react";

interface LoginCtaButtonProps {
  children: React.ReactNode;
  type?: "button" | "submit";
  isLoading?: boolean;
  w?: string;
}

/**
 * Primary CTA for login. White pill with optional blue glow on hover.
 */
export function LoginCtaButton({
  children,
  type = "submit",
  isLoading,
  w = "full",
}: LoginCtaButtonProps) {
  return (
    <Button
      type={type}
      size="lg"
      w={w}
      minH="44px"
      borderRadius="xl"
      bg="loginScreen.ctaBg"
      color="loginScreen.ctaText"
      fontWeight={500}
      fontSize="sm"
      letterSpacing="wider"
      _hover={{
        bg: "white",
        boxShadow: "0 0 24px rgba(15, 98, 254, 0.35)",
      }}
      _active={{ bg: "whiteAlpha.950" }}
      isLoading={isLoading}
    >
      {children}
    </Button>
  );
}
