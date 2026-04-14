"use client";

import { Box, type BoxProps, useColorMode } from "@chakra-ui/react";
import type { ReactNode } from "react";
import { GlassSurface } from "@/components/ui/GlassSurface";
import { useFabTokens } from "@/components/theme/FabTokensContext";

type Props = BoxProps & {
  children: ReactNode;
};

/** Shared liquid-glass shell behind Directory heading + data table (operational block). */
export function PortfolioOperationalSurface({ children, ...rest }: Props) {
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";
  const { portfolioOperationalSurfaceSx } = useFabTokens();

  if (isDark) {
    return (
      <GlassSurface
        variant="card"
        borderRadius="12px"
        mt={9}
        mb={5}
        w="full"
        overflow="hidden"
        pb={{ base: 4, md: 5 }}
        display="flex"
        flexDirection="column"
        {...rest}
      >
        {children}
      </GlassSurface>
    );
  }

  return (
    <Box
      mt={9}
      mb={5}
      w="full"
      borderRadius="12px"
      overflow="hidden"
      pb={{ base: 4, md: 5 }}
      display="flex"
      flexDirection="column"
      sx={portfolioOperationalSurfaceSx}
      {...rest}
    >
      {children}
    </Box>
  );
}
