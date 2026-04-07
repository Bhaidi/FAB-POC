"use client";

import type { ReactNode } from "react";
import { Box } from "@chakra-ui/react";
import { DS_TEXT_FIELD, dsGlassFieldDark } from "@/lib/fabTheme/dsTextField";
import { authShadowDark } from "@/lib/fabTheme/authPalettes";

const R = DS_TEXT_FIELD.radius;

/**
 * Figma **Design System → Text field (Glass)** `558:17083`:
 * - **434×48**, `border-radius: 24px`, horizontal **padding 24px** (on inner input), **gap 12px**
 * - Fill **`#FFFFFF` @ 5%** (`dsGlassFieldDark.fill`)
 * - **Glass**: `backdrop-filter` per DS (`dsGlassFieldDark.backdrop`)
 * - **Border + four-edge inset rim** (light top / soft bottom / sides) — same as `getDsTextFieldStyles` dark
 *
 * The `<Input>` should use **transparent** fill; typography/placement from `getAuthGlassCredentialInputStyles`.
 */
export type GlassCredentialFieldFrameProps = {
  children: ReactNode;
  isDisabled?: boolean;
};

export function GlassCredentialFieldFrame({ children, isDisabled }: GlassCredentialFieldFrameProps) {
  const g = dsGlassFieldDark;

  return (
    <Box
      className="glass-credential-root"
      position="relative"
      borderRadius={R}
      overflow="hidden"
      h="48px"
      w={{ base: "100%", sm: "434px" }}
      maxW="100%"
      flexShrink={0}
      opacity={isDisabled ? 0.55 : 1}
      transform="scale(1)"
      transformOrigin="center center"
      transition="transform 0.22s cubic-bezier(0.25, 0.1, 0.25, 1), opacity 0.2s ease, outline 0.2s ease"
      isolation="isolate"
      sx={{
        WebkitBackfaceVisibility: "hidden",
        backfaceVisibility: "hidden",
        boxShadow: "0 2px 16px rgba(0, 0, 0, 0.14)",
        "&:focus-within": {
          transform: "scale(1.02)",
          outline: "2px solid rgba(0, 98, 255, 0.45)",
          outlineOffset: "2px",
        },
        ...(isDisabled
          ? {}
          : {
              "&:hover:not(:focus-within) .glass-credential-fill": {
                bg: g.fillHover,
              },
              "&:hover:not(:focus-within) .glass-credential-chrome": {
                borderColor: g.borderHover,
                boxShadow: g.insetHover,
              },
            }),
        "&:focus-within .glass-credential-fill": {
          bg: g.fillFocus,
        },
        "&:focus-within .glass-credential-chrome": {
          borderColor: g.borderFocus,
          boxShadow: `${g.insetFocus}, ${authShadowDark.inputFocus}`,
        },
      }}
    >
      {/* Layer A: Glass blur (DS) */}
      <Box
        aria-hidden
        position="absolute"
        inset={0}
        borderRadius={R}
        sx={{
          backdropFilter: g.backdrop,
          WebkitBackdropFilter: g.backdrop,
        }}
      />
      {/* Layer B: #FFFFFF @ 5% (flat — matches Figma inspector) */}
      <Box
        className="glass-credential-fill"
        aria-hidden
        position="absolute"
        inset={0}
        borderRadius={R}
        pointerEvents="none"
        bg={g.fill}
        transition="background 0.2s ease"
      />
      {/* Layer C: 1px border + four-edge inset rim (continuous glass corners) */}
      <Box
        className="glass-credential-chrome"
        aria-hidden
        position="absolute"
        inset={0}
        borderRadius={R}
        pointerEvents="none"
        border="1px solid"
        borderColor={g.border}
        boxShadow={g.inset}
        transition="border-color 0.2s ease, box-shadow 0.2s ease"
      />
      <Box position="relative" zIndex={1} h="full" w="full" display="flex" alignItems="center" minW={0}>
        {children}
      </Box>
    </Box>
  );
}
