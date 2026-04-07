"use client";

import { Box, useColorMode } from "@chakra-ui/react";
import { dashRadius } from "@/components/dashboard/dashboardTokens";
import { useFabTokens } from "@/components/theme/FabTokensContext";

/** Served from `public/images/dashboardbackground.png` */
const DASHBOARD_DARK_BG_IMAGE = "/images/dashboardbackground.png";

type DashboardBackgroundProps = {
  /**
   * Light mode only: soft radial wash + breathing animation over the base gradient, plus surface blur.
   * Dark mode always shows the photo alone (no vignette or global wash).
   */
  ambientOverlay?: boolean;
};

/**
 * Full-viewport canvas — light: gradient + optional ambient overlay; dark: full-bleed photo only.
 */
export function DashboardBackground({ ambientOverlay = true }: DashboardBackgroundProps) {
  const { colorMode } = useColorMode();
  const { dashColors, dashEffects, dashGradients } = useFabTokens();
  const lightAmbient =
    "radial-gradient(ellipse 90% 58% at 50% -10%, rgba(0, 98, 255, 0.07), transparent 58%), radial-gradient(ellipse 65% 48% at 100% 18%, rgba(120, 100, 220, 0.05), transparent 55%), radial-gradient(ellipse 55% 40% at 0% 80%, rgba(0, 98, 255, 0.035), transparent 50%)";

  const isDark = colorMode === "dark";

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
        backgroundImage: isDark ? `url(${DASHBOARD_DARK_BG_IMAGE})` : dashGradients.canvas,
        ...(isDark
          ? {
              backgroundSize: "cover",
              backgroundPosition: "center center",
              backgroundRepeat: "no-repeat",
            }
          : {}),
        ...(ambientOverlay && !isDark
          ? {
              backdropFilter: dashEffects.surfaceBlur,
              WebkitBackdropFilter: dashEffects.surfaceBlur,
              "&::after": {
                content: '""',
                position: "absolute",
                inset: 0,
                borderRadius: "inherit",
                pointerEvents: "none",
                background: lightAmbient,
                opacity: 0.85,
                animation: "fabDashBgBreath 16s ease-in-out infinite",
              },
              "@keyframes fabDashBgBreath": {
                "0%, 100%": { opacity: 0.72 },
                "50%": { opacity: 0.95 },
              },
            }
          : {}),
      }}
    />
  );
}
