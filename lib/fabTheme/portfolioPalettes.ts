import { LIGHT_INK_PRIMARY, LIGHT_SURFACE } from "@/lib/fabTheme/lightModePrimitives";

/** Shared metrics with dark; light only overrides ink below. */
const portfolioSectionHeadingType = {
  fontSize: "12px",
  fontWeight: 700,
  letterSpacing: "0.14em",
  textTransform: "uppercase" as const,
  fontFamily: "var(--font-graphik)",
} as const;

export const portfolioSectionHeadingSxDark = {
  ...portfolioSectionHeadingType,
  color: "rgba(142, 220, 255, 0.98)",
  textShadow:
    "0 0 36px rgba(50, 140, 215, 0.42), 0 0 12px rgba(60, 150, 220, 0.2), 0 1px 0 rgba(0,0,0,0.2)",
} as const;

export const portfolioOperationalSurfaceSxDark = {
  background:
    "linear-gradient(165deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.028) 42%, rgba(255,255,255,0.012) 100%)",
  border: "1px solid rgba(255,255,255,0.06)",
  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.09), 0 2px 16px rgba(0,0,0,0.06)",
  backdropFilter: "blur(10px)",
  WebkitBackdropFilter: "blur(10px)",
} as const;

export const portfolioSectionHeadingSxLight = {
  ...portfolioSectionHeadingType,
  color: LIGHT_INK_PRIMARY,
  textShadow: "none",
} as const;

export const portfolioOperationalSurfaceSxLight = {
  background: LIGHT_SURFACE.subtle,
  border: "1px solid rgba(1, 5, 145, 0.11)",
  boxShadow:
    "inset 0 1px 0 rgba(255, 255, 255, 0.92), 0 0 0 1px rgba(1, 5, 145, 0.05), 0 3px 14px rgba(1, 5, 145, 0.05), 0 2px 8px rgba(0, 98, 255, 0.04)",
  backdropFilter: "none",
  WebkitBackdropFilter: "none",
} as const;
