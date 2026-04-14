"use client";

import Image from "next/image";
import { Box, useColorMode } from "@chakra-ui/react";
import { dashRadius } from "@/components/dashboard/dashboardTokens";
import { useFabTokens } from "@/components/theme/FabTokensContext";

/** Served from `public/images/dashboardbackground.png` */
const DASHBOARD_DARK_BG_IMAGE = "/images/dashboardbackground.png";

/** Figma launch `558:17874` — decorative wash (same asset family as auth light) */
const DASHBOARD_LIGHT_BG_IMAGE = "/images/lightbackground.png";

type DashboardBackgroundProps = {
  /**
   * Light mode only: soft radial wash + breathing animation over the base gradient, plus surface blur.
   * Dark mode always shows the photo alone (no vignette or global wash).
   */
  ambientOverlay?: boolean;
};

/**
 * Full-viewport canvas — photos via `next/image` (below); washes are separate layers so the image stays visible.
 */
export function DashboardBackground({ ambientOverlay = true }: DashboardBackgroundProps) {
  const { colorMode } = useColorMode();
  const { dashColors } = useFabTokens();
  const lightAmbient =
    "radial-gradient(ellipse 90% 58% at 50% -10%, rgba(0, 98, 255, 0.06), transparent 58%), radial-gradient(ellipse 65% 48% at 100% 18%, rgba(120, 100, 220, 0.04), transparent 55%)";

  const isDark = colorMode === "dark";

  return (
    <Box
      position="fixed"
      inset={0}
      zIndex={0}
      pointerEvents="none"
      aria-hidden
      bg={isDark ? dashColors.canvas : "transparent"}
      borderRadius={dashRadius.canvas}
      overflow="hidden"
    >
      <Box position="absolute" inset={0} zIndex={0} overflow="hidden">
        <Image
          src={isDark ? DASHBOARD_DARK_BG_IMAGE : DASHBOARD_LIGHT_BG_IMAGE}
          alt=""
          fill
          priority
          sizes="100vw"
          style={{ objectFit: "cover", objectPosition: "center center" }}
        />
      </Box>

      {!isDark ? (
        <Box
          position="absolute"
          inset={0}
          zIndex={1}
          pointerEvents="none"
          sx={{
            backgroundImage: [
              "linear-gradient(125deg, rgba(95, 145, 224, 0.07) 0%, transparent 45%)",
              "linear-gradient(180deg, rgba(238, 242, 251, 0.22) 0%, rgba(250, 251, 255, 0.12) 70%, transparent 100%)",
            ].join(", "),
            backgroundSize: "cover",
          }}
        />
      ) : null}

      {isDark ? (
        <Box
          position="absolute"
          inset={0}
          zIndex={1}
          pointerEvents="none"
          sx={{
            background: [
              "radial-gradient(ellipse 90% 70% at 12% 18%, rgba(55, 75, 220, 0.14) 0%, transparent 52%)",
              "radial-gradient(ellipse 75% 55% at 88% 22%, rgba(130, 90, 200, 0.1) 0%, transparent 50%)",
              "radial-gradient(ellipse 120% 80% at 50% 0%, rgba(6, 10, 40, 0.42) 0%, transparent 55%)",
              "linear-gradient(180deg, rgba(4, 8, 32, 0.28) 0%, rgba(2, 4, 20, 0.38) 100%)",
            ].join(", "),
            opacity: 0.78,
          }}
        />
      ) : null}

      {ambientOverlay && !isDark ? (
        <Box
          className="fab-dash-bg-breath-layer"
          position="absolute"
          inset={0}
          zIndex={2}
          pointerEvents="none"
          sx={{
            background: lightAmbient,
            opacity: 0.28,
            animation: "fabDashBgBreath 16s ease-in-out infinite",
          }}
        />
      ) : null}
    </Box>
  );
}
