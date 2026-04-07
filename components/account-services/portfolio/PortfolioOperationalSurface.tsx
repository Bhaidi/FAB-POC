"use client";

import { Box, type BoxProps } from "@chakra-ui/react";
import type { ReactNode } from "react";
import { useFabTokens } from "@/components/theme/FabTokensContext";

type Props = BoxProps & {
  children: ReactNode;
};

/** Shared glossy uplift behind Directory heading + data table (operational block). */
export function PortfolioOperationalSurface({ children, ...rest }: Props) {
  const { portfolioOperationalSurfaceSx } = useFabTokens();
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
