"use client";

import Image from "next/image";
import { Box, Flex, useColorMode } from "@chakra-ui/react";
import { useOptionalAuthChrome } from "@/components/auth/AuthChromeContext";
import type { MasterSegmentedToggleProps } from "@/components/auth/MasterSegmentedToggle";
import { MasterSegmentedToggle } from "@/components/auth/MasterSegmentedToggle";
import { authSpacing } from "@/components/auth/authTokens";
import { AuthParallaxLayer } from "@/components/auth/AuthStageMotion";
import { FabThemeToggle } from "@/components/theme/FabThemeToggle";

export type AuthPageShellProps = {
  activeMode: MasterSegmentedToggleProps["value"];
  onModeChange: MasterSegmentedToggleProps["onChange"];
  children: React.ReactNode;
};

/** Horizontal inset — slimmer side margins so content uses more of the canvas. */
const CONTENT_INSET = {
  pl: { base: 4, md: 5, lg: "max(0.75rem, 2vw)" },
  pr: { base: 4, md: 5, lg: "max(0.75rem, 2vw)" },
} as const;

/** Login — content clears fixed toggle + extra air below the bar. */
const MAIN_PT_LOGIN = { base: "12.5rem", md: "13.25rem", lg: "14.5rem" } as const;
/** Login — post-submit flow (no segmented toggle); clears logo + comfortable top air. */
const MAIN_PT_LOGIN_COMPACT = { base: "9rem", md: "9.5rem", lg: "10rem" } as const;
/** Register — same toggle row as login; extra space below the bar before hero/form. */
const MAIN_PT_REGISTER = { base: "13.75rem", md: "14.25rem", lg: "15.5rem" } as const;

/**
 * Shared auth canvas: FAB logo, centered master toggle, animated mode content below.
 */
export function AuthPageShell({ activeMode, onModeChange, children }: AuthPageShellProps) {
  const { colorMode } = useColorMode();
  const logoSrc = colorMode === "dark" ? "/assets/fab-logo.svg" : "/images/fablogoblue.png";
  const chrome = useOptionalAuthChrome();
  const segmentedToggleVisible = chrome?.segmentedToggleVisible ?? true;
  const chromeLocked = chrome?.chromeInteractionLocked ?? false;
  const showSegmentedToggle = activeMode === "register" || segmentedToggleVisible;
  const mainPt =
    activeMode === "register"
      ? MAIN_PT_REGISTER
      : showSegmentedToggle
        ? MAIN_PT_LOGIN
        : MAIN_PT_LOGIN_COMPACT;

  return (
    <Box flex="1" minH={0} w="full" display="flex" flexDirection="column" overflow="hidden" position="relative">
      <Box
        position="absolute"
        top="8px"
        left={0}
        zIndex={2}
        pl={{ base: 4, md: 12 }}
        pt={3}
      >
        <AuthParallaxLayer role="logo">
          <Box position="relative" h={{ base: "32px", md: "40px" }} w={{ base: "100px", md: "140px" }}>
            <Image
              src={logoSrc}
              alt="FAB"
              fill
              style={{ objectFit: "contain", objectPosition: "left center" }}
              priority
            />
          </Box>
        </AuthParallaxLayer>
      </Box>

      <Box position="absolute" top="8px" right={0} zIndex={2} pr={{ base: 4, md: 12 }} pt={3}>
        <FabThemeToggle variant="auth" />
      </Box>

      {showSegmentedToggle ? (
        <Flex
          position="fixed"
          top={{ base: "4.25rem", lg: "4.75rem" }}
          left={0}
          right={0}
          justify="center"
          align="center"
          pointerEvents="none"
          zIndex={3}
          px={4}
        >
          <AuthParallaxLayer role="toggle">
            <Box pointerEvents="auto" w="full" maxW="100vw" display="flex" justifyContent="center">
              <MasterSegmentedToggle value={activeMode} onChange={onModeChange} isDisabled={chromeLocked} />
            </Box>
          </AuthParallaxLayer>
        </Flex>
      ) : null}

      <Box
        position="relative"
        zIndex={1}
        maxW="min(1680px, 100%)"
        w="full"
        mx="auto"
        flex="1"
        minH={0}
        display="flex"
        flexDirection="column"
        pt={mainPt}
        pb={{ base: 8, md: 10, lg: 12 }}
        pl={CONTENT_INSET.pl}
        pr={CONTENT_INSET.pr}
        overflow="hidden"
      >
        <Box
          flex="1"
          display="flex"
          flexDirection="column"
          justifyContent={{ base: "flex-start", lg: "center" }}
          w="full"
          minH={0}
          overflow="hidden"
          pt={activeMode === "register" ? 0 : { base: 4, md: 5, lg: 6 }}
          pb={{
            base: authSpacing.authPageBottomAir.base,
            md: authSpacing.authPageBottomAir.md,
            lg: authSpacing.authPageBottomAir.lg,
          }}
        >
          <Box position="relative" w="full" flex="1" minH={0} display="flex" flexDirection="column" overflow="hidden">
            {children}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
