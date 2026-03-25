"use client";

import { Box } from "@chakra-ui/react";
import { AuthChromeProvider } from "@/components/auth/AuthChromeContext";
import { AuthFooter } from "@/components/auth/AuthFooter";
import { AuthScrollLock } from "@/components/auth/AuthScrollLock";
import { AuthStageMotionProvider } from "@/components/auth/AuthStageMotion";
import { ExactBackground } from "@/components/shared/ExactBackground";

/**
 * Auth routes — full-viewport stage; footer stays `position: fixed`.
 * Background + chrome wrap `{children}` so the image layer is not clipped by nested `overflow:hidden`.
 */
export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <AuthScrollLock>
        <AuthStageMotionProvider>
          <AuthChromeProvider>
            <ExactBackground />
            <Box
              as="main"
              position="relative"
              zIndex={2}
              flex="1"
              minH={0}
              w="100%"
              display="flex"
              flexDirection="column"
              overflow="hidden"
              bg="transparent"
              /* Fixed `ExactBackground` sits behind; transparent so the image is visible */
              /* Reserve space for fixed footer + safe area */
              pb={{ base: "calc(7.5rem + 40px)", md: "calc(7rem + 40px)" }}
            >
              {children}
            </Box>
          </AuthChromeProvider>
        </AuthStageMotionProvider>
      </AuthScrollLock>

      <Box
        position="fixed"
        left={0}
        right={0}
        bottom={{ base: 2, md: 2.5 }}
        zIndex={50}
        display="flex"
        flexDirection="column"
        alignItems="stretch"
        pointerEvents="none"
        sx={{
          "& > *": {
            pointerEvents: "auto",
          },
        }}
      >
        <AuthFooter />
      </Box>
    </>
  );
}
