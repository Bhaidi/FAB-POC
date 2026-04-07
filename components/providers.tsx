"use client";

import { ChakraProvider } from "@chakra-ui/react";
import { FabTokensProvider } from "@/components/theme/FabTokensContext";
import theme from "@/theme";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ChakraProvider theme={theme}>
      <FabTokensProvider>{children}</FabTokensProvider>
    </ChakraProvider>
  );
}
