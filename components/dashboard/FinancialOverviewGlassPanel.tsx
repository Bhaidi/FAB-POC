"use client";

import type { BoxProps } from "@chakra-ui/react";
import { Box } from "@chakra-ui/react";
import { useReducedMotion } from "framer-motion";
import { financialOverviewShellSx } from "@/components/dashboard/financialOverviewShellStyle";

/** Radial gloss / breathe layers — same as `FinancialOverviewWidget` chrome. */
function FinancialOverviewGlassSheen() {
  return (
    <Box
      position="absolute"
      pointerEvents="none"
      inset={0}
      borderRadius="inherit"
      overflow="hidden"
      aria-hidden
    >
      <Box
        position="absolute"
        top="-28%"
        left="-15%"
        w="88%"
        h="72%"
        bg="radial-gradient(ellipse at 30% 40%, rgba(80, 110, 220, 0.12) 0%, rgba(40, 55, 130, 0.04) 45%, transparent 70%)"
        opacity={0.85}
      />
      <Box
        position="absolute"
        top="2%"
        left="-8%"
        w="92%"
        h="58%"
        className="fin-overview-amount-breathe"
        bg="radial-gradient(ellipse 80% 55% at 28% 46%, rgba(120, 155, 255, 0.18) 0%, transparent 62%)"
        filter="blur(28px)"
      />
    </Box>
  );
}

export type FinancialOverviewGlassPanelProps = BoxProps & {
  /** Dashboard-style hover lift + brighter rim (e.g. page hero). */
  hoverLift?: boolean;
};

/**
 * Dashboard balance widget glass: frosted gradient, glossy sheen, inset highlights.
 * Matches `FinancialOverviewWidget` outer shell (18px radius).
 */
export function FinancialOverviewGlassPanel({
  children,
  hoverLift = false,
  ...rest
}: FinancialOverviewGlassPanelProps) {
  const rm = useReducedMotion() === true;

  return (
    <Box
      {...financialOverviewShellSx}
      borderRadius="18px"
      transition="transform 0.28s cubic-bezier(0.33, 1, 0.68, 1), box-shadow 0.32s ease, border-color 0.28s ease"
      _hover={
        hoverLift && !rm
          ? {
              transform: "translateY(-2px)",
              borderColor: "rgba(0, 98, 255, 0.22)",
              boxShadow:
                "0 20px 48px rgba(1, 5, 145, 0.1), 0 0 0 1px rgba(1, 5, 145, 0.08), 0 0 28px rgba(0, 98, 255, 0.08), inset 0 1px 0 rgba(255,255,255,0.98)",
            }
          : undefined
      }
      {...rest}
    >
      <FinancialOverviewGlassSheen />
      <Box position="relative" zIndex={1}>
        {children}
      </Box>
    </Box>
  );
}
