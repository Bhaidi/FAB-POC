"use client";

import { Box, VStack } from "@chakra-ui/react";
import { authLayout, authSpacing } from "@/components/auth/authTokens";

export type AuthSplitLayoutProps = {
  /** Left column: hero / marketing / onboarding lead (max width token). */
  left: React.ReactNode;
  /** Right column: form, QR panel, etc. (same width as sibling mode). */
  right: React.ReactNode;
};

/**
 * Professional two-column auth canvas — identical structure for Login and Register.
 */
export function AuthSplitLayout({ left, right }: AuthSplitLayoutProps) {
  return (
    <Box
      display="flex"
      justifyContent={{ base: "stretch", lg: "center" }}
      w="full"
      flex="1"
      minH={{ base: "auto", lg: "100%" }}
      minW={0}
      overflow="hidden"
    >
      <Box
        display="grid"
        gridTemplateColumns={{
          base: "1fr",
          lg: `minmax(0, ${authSpacing.heroColumnMaxW}) minmax(300px, ${authLayout.rightColumnMaxW})`,
        }}
        columnGap={{ base: 0, lg: authSpacing.heroToFormGap.lg }}
        rowGap={{ base: 14, md: 16, lg: 0 }}
        alignItems={{ base: "stretch", lg: "center" }}
        w={{ base: "100%", lg: "auto" }}
        maxW={{ base: "100%", lg: authLayout.splitMaxW }}
        minH={authLayout.minH}
      >
        <Box w="full" maxW={authSpacing.heroColumnMaxW} justifySelf={{ base: "center", lg: "start" }}>
          {left}
        </Box>
        <VStack
          align="stretch"
          w="full"
          maxW={{ base: "100%", lg: authLayout.rightColumnMaxW }}
          spacing={0}
          justifySelf={{ base: "stretch", lg: "end" }}
        >
          {right}
        </VStack>
      </Box>
    </Box>
  );
}
