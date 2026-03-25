"use client";

import { Box } from "@chakra-ui/react";

/** Full-screen login background — static photo only (no motion layers). */
export function ExactBackground() {
  return (
    <Box className="auth-exact-bg-root" aria-hidden>
      <Box className="auth-exact-bg-image-layer" />
    </Box>
  );
}
