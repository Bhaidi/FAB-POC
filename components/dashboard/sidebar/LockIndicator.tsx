"use client";

import { Box } from "@chakra-ui/react";
import { Lock } from "lucide-react";

const SHIMMER = {
  "@keyframes fabLockShimmer": {
    "0%": { filter: "brightness(1)", opacity: 0.55 },
    "40%": { filter: "brightness(1.35)", opacity: 0.95 },
    "100%": { filter: "brightness(1)", opacity: 0.55 },
  },
} as const;

export type LockIndicatorProps = {
  /** When false, no hover shimmer (locked rows — no “glow” affordance). */
  allowHoverPulse?: boolean;
};

export function LockIndicator({ allowHoverPulse = false }: LockIndicatorProps) {
  return (
    <Box
      as="span"
      display="inline-flex"
      alignItems="center"
      justifyContent="center"
      flexShrink={0}
      aria-hidden
      lineHeight={0}
      color="rgba(255,255,255,0.42)"
      sx={
        allowHoverPulse
          ? {
              ...SHIMMER,
              "& .lock-icon": {
                transition: "transform 0.22s ease, filter 0.22s ease",
              },
              _groupHover: {
                "& .lock-icon": {
                  transform: "scale(1.1)",
                  animation: "fabLockShimmer 0.65s ease-out 1",
                },
              },
            }
          : {}
      }
    >
      <Box as="span" className="lock-icon">
        <Lock size={14} strokeWidth={2} aria-hidden />
      </Box>
    </Box>
  );
}
