"use client";

import { createContext, useContext, useLayoutEffect, useMemo, type ReactNode } from "react";
import { useColorMode, type ColorMode } from "@chakra-ui/react";
import { buildFabTokens, type FabTokens } from "@/lib/fabTheme/buildFabTokens";

const FabTokensContext = createContext<FabTokens | null>(null);

function normalizeMode(mode: ColorMode): "light" | "dark" {
  return mode === "dark" ? "dark" : "light";
}

/**
 * Supplies appearance tokens (auth + dashboard + account-services chrome) from Chakra color mode.
 * Must render inside `ChakraProvider`.
 */
export function FabTokensProvider({ children }: { children: ReactNode }) {
  const { colorMode } = useColorMode();
  const tokens = useMemo(() => buildFabTokens(colorMode), [colorMode]);

  useLayoutEffect(() => {
    const m = normalizeMode(colorMode);
    document.documentElement.setAttribute("data-fab-theme", m);
  }, [colorMode]);

  return <FabTokensContext.Provider value={tokens}>{children}</FabTokensContext.Provider>;
}

export function useFabTokens(): FabTokens {
  const ctx = useContext(FabTokensContext);
  if (!ctx) {
    throw new Error("useFabTokens must be used within FabTokensProvider (inside ChakraProvider)");
  }
  return ctx;
}
