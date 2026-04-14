import { authColorsDark, authColorsLight, authShadowLight } from "@/lib/fabTheme/authPalettes";

/**
 * Text field — Figma **Glass** (Inspector):
 * - Frame: **434×48**, `border-radius: 24px`, `gap: 12px`, align center
 * - Fill: **transparent** (tint from canvas via backdrop blur)
 * - Effects → **Glass** (background blur)
 * - Corners: `overflow: hidden` + same radius clips blur; inset stack defines the curved rim
 */
export const DS_TEXT_FIELD = {
  placeholder: "#9B9C9F",
  radius: "24px",
  fontSize: "14px",
  lineHeight: "24px",
  fontFamily: "var(--font-graphik)",
  fontWeight: 400,
} as const;

const GLASS_FILL = "transparent";
const GLASS_FILL_HOVER = "transparent";
const GLASS_FILL_FOCUS = "transparent";

const GLASS_BACKDROP_DARK = "blur(22px) saturate(195%)";
const GLASS_BACKDROP_LIGHT = "blur(15px) saturate(170%)";

const GLASS_BORDER = "transparent";
const GLASS_BORDER_HOVER = "transparent";
const GLASS_BORDER_FOCUS = "transparent";

const glassInsetDark = "none";
const glassInsetDarkHover = "none";
const glassInsetDarkFocus = "none";

/**
 * Figma **Text field / Glass** (node `558:17083`) — same values as {@link getDsTextFieldStyles} dark mode.
 * Used by {@link GlassCredentialFieldFrame} so login fields match the Design System component.
 */
export const dsGlassFieldDark = {
  fill: GLASS_FILL,
  fillHover: GLASS_FILL_HOVER,
  fillFocus: GLASS_FILL_FOCUS,
  backdrop: GLASS_BACKDROP_DARK,
  border: GLASS_BORDER,
  borderHover: GLASS_BORDER_HOVER,
  borderFocus: GLASS_BORDER_FOCUS,
  inset: glassInsetDark,
  insetHover: glassInsetDarkHover,
  insetFocus: glassInsetDarkFocus,
} as const;

const focusRing = {
  outline: "2px solid rgba(0, 98, 255, 0.45)",
  outlineOffset: "2px",
} as const;

const ZOOM = {
  rest: "scale(1)",
  focus: "scale(1.02)",
} as const;

const EASE_ZOOM = "cubic-bezier(0.25, 0.1, 0.25, 1)";

/** Smoother curved mask for backdrop + border anti-alias */
const glassCornerAssist = {
  isolation: "isolate" as const,
  WebkitBackfaceVisibility: "hidden" as const,
  backfaceVisibility: "hidden" as const,
};

export type DsGlassTextFieldInnerOptions = {
  /** Default `24px`. Use `false` when horizontal padding comes from a parent flex row. */
  paddingX?: string | false;
};

/**
 * Styles for the **inner** `<Input>` inside {@link GlassCredentialFieldFrame} (dark mode).
 * Same typography as {@link getDsTextFieldStyles}; background stays transparent — glass is drawn by the frame.
 */
export function getDsGlassTextFieldInnerStyles(options?: DsGlassTextFieldInnerOptions) {
  const paddingX = options?.paddingX === undefined ? "24px" : options.paddingX;
  return {
    flex: 1,
    minW: 0,
    h: "full",
    w: "full",
    ...(paddingX !== false ? { px: paddingX } : {}),
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

export type DsTextFieldOptions = {
  colorMode: "light" | "dark";
  height?: string;
  paddingX?: string | false;
  /**
   * Figma DS login light (`558:17096`) — white pill, `#9B9C9F` border, no backdrop blur.
   * Only applies when `colorMode` is `light`.
   */
  surface?: "glass" | "authLoginLight";
};

const AUTH_LOGIN_LIGHT_INK = "#383A3F";
const AUTH_LOGIN_LIGHT_BORDER = "#9B9C9F";

export function getDsTextFieldStyles(options: DsTextFieldOptions) {
  const h = options.height ?? "48px";
  const paddingX = options.paddingX === undefined ? "24px" : options.paddingX;
  const isDark = options.colorMode === "dark";
  const loginLight = !isDark && options.surface === "authLoginLight";

  const transition = [
    `transform 0.22s ${EASE_ZOOM}`,
    "background 0.2s ease",
    "border-color 0.2s ease",
    "box-shadow 0.2s ease",
    "backdrop-filter 0.2s ease",
  ].join(", ");

  const base = {
    h,
    minH: h,
    ...(paddingX !== false ? { px: paddingX } : {}),
    py: 0,
    borderRadius: DS_TEXT_FIELD.radius,
    /** Clips `backdrop-filter` to the pill — removes fuzzy/square corner artifacts */
    overflow: "hidden",
    fontFamily: DS_TEXT_FIELD.fontFamily,
    fontSize: DS_TEXT_FIELD.fontSize,
    lineHeight: DS_TEXT_FIELD.lineHeight,
    fontWeight: DS_TEXT_FIELD.fontWeight,
    transform: ZOOM.rest,
    transformOrigin: "center center",
    transition,
    _placeholder: { color: DS_TEXT_FIELD.placeholder, opacity: 1 },
  } as const;

  if (isDark) {
    const c = authColorsDark;
    return {
      ...base,
      ...glassCornerAssist,
      bg: GLASS_FILL,
      backdropFilter: GLASS_BACKDROP_DARK,
      WebkitBackdropFilter: GLASS_BACKDROP_DARK,
      border: "none",
      borderColor: GLASS_BORDER,
      color: c.text.primary,
      boxShadow: glassInsetDark,
      _hover: {
        bg: GLASS_FILL_HOVER,
        borderColor: GLASS_BORDER_HOVER,
        boxShadow: glassInsetDarkHover,
      },
      _focus: {
        transform: ZOOM.focus,
      },
      _focusVisible: {
        bg: GLASS_FILL_FOCUS,
        borderColor: GLASS_BORDER_FOCUS,
        boxShadow: glassInsetDarkFocus,
        transform: ZOOM.focus,
        ...focusRing,
      },
      _disabled: {
        transform: ZOOM.rest,
      },
    } as const;
  }

  const c = authColorsLight;

  if (loginLight) {
    return {
      ...base,
      borderRadius: "9999px",
      bg: "#FFFFFF",
      backdropFilter: "none",
      WebkitBackdropFilter: "none",
      border: "1px solid",
      borderColor: AUTH_LOGIN_LIGHT_BORDER,
      color: AUTH_LOGIN_LIGHT_INK,
      boxShadow: "none",
      _placeholder: { color: DS_TEXT_FIELD.placeholder, opacity: 1 },
      _hover: {
        bg: "#FFFFFF",
        borderColor: "#8B8D91",
      },
      _focus: {
        transform: ZOOM.focus,
      },
      _focusVisible: {
        bg: "#FFFFFF",
        borderColor: "rgba(0, 98, 255, 0.55)",
        boxShadow: "none",
        outline: "2px solid rgba(0, 98, 255, 0.35)",
        outlineOffset: "2px",
        transform: ZOOM.focus,
      },
      _disabled: {
        transform: ZOOM.rest,
        opacity: 0.65,
      },
    } as const;
  }

  return {
    ...base,
    ...glassCornerAssist,
    bg: c.glass.input,
    backdropFilter: GLASS_BACKDROP_LIGHT,
    WebkitBackdropFilter: GLASS_BACKDROP_LIGHT,
    border: "1px solid",
    borderColor: c.border.default,
    color: c.text.primary,
    boxShadow: [
      "inset 0 1px 0 rgba(255, 255, 255, 0.95)",
      "inset 0 -1px 0 rgba(1, 5, 145, 0.06)",
      "0 1px 2px rgba(1, 5, 145, 0.04)",
    ].join(", "),
    _hover: {
      bg: c.glass.inputHover,
      borderColor: c.border.strong,
    },
    _focus: {
      transform: ZOOM.focus,
    },
    _focusVisible: {
      bg: c.glass.inputFocus,
      borderColor: "rgba(0, 98, 255, 0.45)",
      boxShadow: `${authShadowLight.inputFocus}, inset 0 1px 0 rgba(255, 255, 255, 0.98)`,
      outline: "2px solid rgba(0, 98, 255, 0.45)",
      outlineOffset: "2px",
      transform: ZOOM.focus,
    },
    _disabled: {
      transform: ZOOM.rest,
    },
  } as const;
}
