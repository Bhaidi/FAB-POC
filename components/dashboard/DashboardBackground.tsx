"use client";

import { Box } from "@chakra-ui/react";
import { dashColors, dashEffects, dashGradients, dashRadius } from "@/components/dashboard/dashboardTokens";

/**
 * Full-viewport canvas — gradient + blur + subtle breathing overlay (command-center ambience).
 */
export function DashboardBackground() {
  return (
    <Box
      position="fixed"
      inset={0}
      zIndex={0}
      pointerEvents="none"
      aria-hidden
      bg={dashColors.canvas}
      borderRadius={dashRadius.canvas}
      overflow="hidden"
      sx={{
        backgroundImage: dashGradients.canvas,
        backdropFilter: dashEffects.surfaceBlur,
        WebkitBackdropFilter: dashEffects.surfaceBlur,
        "&::after": {
          content: '""',
          position: "absolute",
          inset: 0,
          borderRadius: "inherit",
          pointerEvents: "none",
          background:
            "radial-gradient(ellipse 85% 55% at 50% -10%, rgba(0, 72, 255, 0.14), transparent 52%), radial-gradient(ellipse 70% 45% at 100% 50%, rgba(100, 140, 255, 0.08), transparent 50%)",
          opacity: 0.55,
          animation: "fabDashBgBreath 16s ease-in-out infinite",
        },
        "@keyframes fabDashBgBreath": {
          "0%, 100%": { opacity: 0.42 },
          "50%": { opacity: 0.62 },
        },
      }}
    />
  );
}
