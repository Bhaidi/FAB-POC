"use client";

import { IconButton, useColorMode } from "@chakra-ui/react";
import { Moon, Sun } from "lucide-react";
import { useFabTokens } from "@/components/theme/FabTokensContext";

export type FabThemeToggleProps = {
  /** Ghost icon — matches primary nav utilities. */
  variant?: "nav" | "auth";
};

/**
 * Switches Chakra color mode (light / dark). Persists via Chakra’s color-mode storage.
 */
export function FabThemeToggle({ variant = "nav" }: FabThemeToggleProps) {
  const { colorMode, toggleColorMode } = useColorMode();
  const { authColors, dashPrimaryNavChrome } = useFabTokens();
  const dark = colorMode === "dark";
  const navIcon = dashPrimaryNavChrome.iconButton;

  if (variant === "auth") {
    return (
      <IconButton
        type="button"
        aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
        icon={dark ? <Sun size={18} strokeWidth={2} aria-hidden /> : <Moon size={18} strokeWidth={2} aria-hidden />}
        onClick={toggleColorMode}
        variant="ghost"
        size="sm"
        borderRadius="full"
        color={authColors.text.secondary}
        _hover={{ bg: authColors.glass.tintHover, color: authColors.text.primary }}
      />
    );
  }

  return (
    <IconButton
      type="button"
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
      icon={dark ? <Sun size={20} strokeWidth={2} aria-hidden /> : <Moon size={20} strokeWidth={2} aria-hidden />}
      onClick={toggleColorMode}
      {...navIcon}
    />
  );
}
