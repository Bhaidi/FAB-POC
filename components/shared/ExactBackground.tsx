"use client";

import Image from "next/image";
import { Box, useColorMode } from "@chakra-ui/react";

/**
 * Full-screen auth backdrop — `next/image` so the photo always paints (CSS `background-image`
 * on Chakra `Box` can be overridden / masked by theme layers).
 */
export function ExactBackground() {
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";
  const src = isDark ? "/images/dashboardbackground.png" : "/images/lightbackground.png";

  return (
    <Box className="auth-exact-bg-root" aria-hidden bg="transparent">
      <Box
        className="auth-exact-bg-image-layer"
        position="absolute"
        inset="-10%"
        zIndex={0}
        overflow="hidden"
      >
        <Image
          src={src}
          alt=""
          fill
          priority
          sizes="100vw"
          style={{
            objectFit: "cover",
            objectPosition: "center center",
            filter: isDark ? "brightness(1.06) contrast(1.04) saturate(1.06)" : "brightness(1.02) contrast(1.02) saturate(1.02)",
          }}
        />
      </Box>
      {!isDark ? (
        <Box
          position="absolute"
          inset="-10%"
          zIndex={1}
          pointerEvents="none"
          sx={{
            background: [
              "linear-gradient(125deg, rgba(95, 145, 224, 0.06) 0%, transparent 48%)",
              "linear-gradient(180deg, rgba(238, 242, 251, 0.18) 0%, transparent 55%)",
            ].join(", "),
          }}
        />
      ) : null}
    </Box>
  );
}
