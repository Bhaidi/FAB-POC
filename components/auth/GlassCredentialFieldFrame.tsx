"use client";

import type { ReactNode } from "react";
import { Box, type BoxProps } from "@chakra-ui/react";
import { LoginGlassCornerAccents } from "@/components/auth/LoginGlassCornerAccents";
import { authLoginFieldChromeDark, loginAuthInputGlassSx } from "@/lib/fabTheme/authPalettes";
import { DS_TEXT_FIELD, dsGlassFieldDark } from "@/lib/fabTheme/dsTextField";

const R = DS_TEXT_FIELD.radius;

/**
 * Layered glass frame for credential inputs.
 * - **`ds`**: DS glass (transparent fill + backdrop + optional rim via `dsGlassFieldDark`).
 * - **`authLogin`**: Login only — {@link loginAuthInputGlassSx} + {@link LoginGlassCornerAccents} (brighter TL/BR only).
 *
 * The `<Input>` should use **transparent** fill; typography from `getDsGlassTextFieldInnerStyles`.
 */
export type GlassCredentialFieldFrameProps = {
  children: ReactNode;
  isDisabled?: boolean;
  /** Default `48px` — Figma DS text field height */
  height?: string;
  /** Width — default matches login column (`100%` / `434px` from `sm`) */
  w?: BoxProps["w"];
  maxW?: BoxProps["maxW"];
  /** `authLogin` — Figma login glass spec only. Default `ds` — shared DS glass (`dsGlassFieldDark`). */
  chrome?: "ds" | "authLogin";
};

export function GlassCredentialFieldFrame({
  children,
  isDisabled,
  height = "48px",
  w = { base: "100%", sm: "434px" },
  maxW = "100%",
  chrome = "ds",
}: GlassCredentialFieldFrameProps) {
  const g = chrome === "authLogin" ? authLoginFieldChromeDark : dsGlassFieldDark;
  const authLogin = chrome === "authLogin";

  return (
    <Box
      className="glass-credential-root"
      position="relative"
      borderRadius={R}
      /* `authLogin` draws 1px corner strokes; `overflow: hidden` clips them at TL/BR. */
      overflow={authLogin ? "visible" : "hidden"}
      h={height}
      w={w}
      maxW={maxW}
      flexShrink={0}
      opacity={isDisabled ? 0.55 : 1}
      transform="scale(1)"
      transformOrigin="center center"
      transition={
        authLogin
          ? undefined
          : "transform 0.22s cubic-bezier(0.25, 0.1, 0.25, 1), opacity 0.2s ease, outline 0.2s ease"
      }
      sx={{
        isolation: authLogin ? "auto" : "isolate",
        ...(!authLogin
          ? {
              WebkitBackfaceVisibility: "hidden",
              backfaceVisibility: "hidden",
            }
          : {}),
        boxShadow: "none",
        "&:focus-within": {
          transform: "scale(1)",
          outline: authLogin ? "none" : "2px solid rgba(0, 98, 255, 0.45)",
          outlineOffset: authLogin ? "0" : "2px",
        },
        ...(isDisabled || authLogin
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
        ...(!authLogin
          ? {
              "&:focus-within .glass-credential-fill": {
                bg: g.fillFocus,
              },
              "&:focus-within .glass-credential-chrome": {
                borderColor: g.borderFocus,
                boxShadow: g.insetFocus,
              },
            }
          : {}),
      }}
    >
      {authLogin ? (
        <Box
          className="glass-credential-fill"
          aria-hidden
          position="absolute"
          inset={0}
          borderRadius={R}
          pointerEvents="none"
          sx={loginAuthInputGlassSx}
        />
      ) : (
        <>
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
          {/* Layer B: fill */}
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
        </>
      )}
      {/* Layer C: DS inset rim — login draws border + insets on the glass surface above. */}
      {!authLogin ? (
        <Box
          className="glass-credential-chrome"
          aria-hidden
          position="absolute"
          inset={0}
          borderRadius={R}
          pointerEvents="none"
          border="none"
          borderColor={g.border}
          boxShadow={g.inset}
          transition="border-color 0.2s ease, box-shadow 0.2s ease"
        />
      ) : null}
      {authLogin ? <LoginGlassCornerAccents radius={R} /> : null}
      <Box position="relative" zIndex={2} h="full" w="full" display="flex" alignItems="center" minW={0}>
        {children}
      </Box>
    </Box>
  );
}
