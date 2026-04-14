/**
 * Premium dark “liquid glass” design tokens — iOS-inspired, enterprise banking.
 * Surfaces: deep midnight blues, restrained highlights, cool white ink (no flat grey).
 */

export const glassText = {
  primary: "rgba(255, 255, 255, 0.96)",
  secondary: "rgba(255, 255, 255, 0.68)",
  muted: "rgba(255, 255, 255, 0.42)",
  /** Card titles — near white */
  cardTitle: "rgba(255, 255, 255, 0.96)",
  /** Descriptions */
  cardBody: "rgba(255, 255, 255, 0.62)",
  tertiary: "rgba(255, 255, 255, 0.44)",
} as const;

/** 100% transparent rims — no painted stroke; blur + content provide shape */
export const glassBorder = {
  default: "transparent",
  hover: "transparent",
  strong: "transparent",
  active: "transparent",
} as const;

/**
 * No painted fill — color comes only from content behind via `backdrop-filter`.
 * Use with {@link glassBlur} on the same element.
 */
export const glassFill = {
  shell: "transparent",
  card: "transparent",
  panel: "transparent",
  button: "transparent",
  active: "transparent",
  input: "transparent",
} as const;

export const glassBlur = {
  shell: "blur(28px) saturate(190%)",
  card: "blur(22px) saturate(185%)",
  button: "blur(20px) saturate(180%)",
  active: "blur(24px) saturate(190%)",
  input: "blur(20px) saturate(185%)",
} as const;

export const glassRadius = {
  shell: "28px",
  card: "26px",
  button: "22px",
  iconButton: "18px",
  pill: "9999px",
} as const;

export const glassShadow = {
  soft: "none",
  medium: "none",
  activeGlow: "none",
  ambientBlue: "none",
  insetTopSheen: "none",
  innerLens: "none",
  bottomDepth: "none",
} as const;

/** No drop/inset shadows — fully transparent chrome */
export const glassShadowStack = {
  shell: "none",
  shellHover: "none",
  card: "none",
  cardHover: "none",
  panel: "none",
  button: "none",
  active: "none",
} as const;

/** No overlay tint — glass is blur + border + shadow only */
export const glassSheenTop = "transparent";

export const glassSheenBottom = "transparent";

export const glassMotion = {
  transition: "all 220ms cubic-bezier(0.22, 1, 0.36, 1)",
  ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
} as const;

/** Progress tracks — transparent rails; fill remains visible for data */
export const glassProgress = {
  track: "transparent",
  trackRail: "transparent",
  fill: "linear-gradient(90deg, rgba(73, 101, 255, 0.95) 0%, rgba(120, 160, 255, 0.88) 100%)",
  fillGlow: "0 0 12px rgba(73, 101, 255, 0.35)",
} as const;

/** Primary nav search — embedded pill */
export const glassSearchDark = {
  border: glassBorder.default,
  borderHover: glassBorder.hover,
  borderFocus: glassBorder.active,
  placeholder: glassText.muted,
  icon: "rgba(255, 255, 255, 0.55)",
  bg: glassFill.input,
  blur: glassBlur.input,
  radius: glassRadius.pill,
  focusRing: "none",
} as const;

/**
 * Collapsed sidebar rail — Figma `558:17725` (active tile + glow).
 * Inactive icons: white outline @ ~55% in component; active: blue glass pill.
 */
export const glassSidebarRail = {
  activeBg: "transparent",
  activeBorder: "transparent",
  activeShadow: "none",
  hoverBg: "transparent",
  hoverBorder: "transparent",
  /** Blur sampled from dashboard canvas — use with transparent `activeBg` / `hoverBg` */
  tileBlur: glassBlur.button,
  /** Vertical gap between rail icons (compact vs full Figma frame) */
  collapsedItemGapPx: 28,
  /** Chevron row → first icon */
  collapsedChevronGapPx: 14,
} as const;

/**
 * Single export for `buildFabTokens` / components.
 */
export const glassTokens = {
  text: glassText,
  border: glassBorder,
  fill: glassFill,
  blur: glassBlur,
  radius: glassRadius,
  shadow: glassShadow,
  shadowStack: glassShadowStack,
  sheenTop: glassSheenTop,
  sheenBottom: glassSheenBottom,
  motion: glassMotion,
  progress: glassProgress,
  search: glassSearchDark,
  sidebarRail: glassSidebarRail,
} as const;

export type GlassTokens = typeof glassTokens;
