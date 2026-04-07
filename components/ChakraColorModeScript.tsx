"use client";

import { ColorModeScript } from "@chakra-ui/react";
import theme from "@/theme";

/** Client boundary — Chakra color-mode init must not run from the RSC root layout bundle. */
export function ChakraColorModeScript() {
  return <ColorModeScript initialColorMode={theme.config.initialColorMode} />;
}
