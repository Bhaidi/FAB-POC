import type { ColorMode } from "@chakra-ui/react";
import { getDsGlassTextFieldInnerStyles, getDsTextFieldStyles } from "@/lib/fabTheme/dsTextField";

/**
 * Figma frame: **434×48**, **radius 24**, **gap 12**, **padding 24** (horizontal; see `dsTextField`).
 */
export const AUTH_INPUT_FIGMA_LAYOUT = {
  display: "flex",
  alignItems: "center",
  gap: "12px",
  w: { base: "100%", sm: "434px" },
  maxW: "100%",
  boxSizing: "border-box",
} as const;

/** Auth credential inputs — full `getDsTextFieldStyles` (light + dark without glass frame). */
export function getAuthInputFieldStyles(colorMode: ColorMode) {
  const ds = getDsTextFieldStyles({
    colorMode: colorMode === "dark" ? "dark" : "light",
    height: "48px",
  });
  return {
    ...ds,
    ...AUTH_INPUT_FIGMA_LAYOUT,
  } as const;
}

/**
 * Inner `<Input>` for {@link GlassCredentialFieldFrame} — transparent; glass is drawn by layers behind.
 */
export function getAuthGlassCredentialInputStyles() {
  return getDsGlassTextFieldInnerStyles();
}
