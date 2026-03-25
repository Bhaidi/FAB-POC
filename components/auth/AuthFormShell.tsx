"use client";

import { Box, VStack } from "@chakra-ui/react";

type AuthFormShellProps = {
  /** Login / Register segmented control (fixed slot — does not shift with form). */
  segmentedControl: React.ReactNode;
  children: React.ReactNode;
};

/**
 * Auth right-column layout: reserved height for segmented control, then form body.
 * Keeps the control anchored while login vs register (or future flows) change height below.
 */
export function AuthFormShell({ segmentedControl, children }: AuthFormShellProps) {
  return (
    <VStack align="stretch" w="full" spacing={0}>
      {/* Fixed slot: ~44px control + vertical breathing room; margin to heading unchanged */}
      <Box
        flexShrink={0}
        w="full"
        minH="56px"
        display="flex"
        alignItems="center"
        justifyContent="center"
        mb={8}
      >
        {segmentedControl}
      </Box>
      {/* Form body: min height reduces visible jump when swapping tabs */}
      {/* Tall enough for register flow so the segmented control slot stays visually stable */}
      <Box w="full" flex={1} minH={{ base: "420px", md: "620px" }} position="relative">
        {children}
      </Box>
    </VStack>
  );
}
