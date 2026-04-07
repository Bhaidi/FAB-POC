import type { ColorMode } from "@chakra-ui/react";
import { DS_TEXT_FIELD, getDsTextFieldStyles } from "@/lib/fabTheme/dsTextField";

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
  return {
    flex: 1,
    minW: 0,
    h: "full",
    w: "full",
    px: "24px",
    py: 0,
    border: "none",
    outline: "none",
    boxShadow: "none",
    bg: "transparent",
    color: "rgba(255, 255, 255, 0.96)",
    fontFamily: DS_TEXT_FIELD.fontFamily,
    fontSize: DS_TEXT_FIELD.fontSize,
    lineHeight: DS_TEXT_FIELD.lineHeight,
    fontWeight: DS_TEXT_FIELD.fontWeight,
    display: "flex",
    alignItems: "center",
    gap: "12px",
    _placeholder: { color: DS_TEXT_FIELD.placeholder, opacity: 1 },
    _focusVisible: { outline: "none", boxShadow: "none" },
  } as const;
}
