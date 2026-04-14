import { LIGHT_SURFACE } from "@/lib/fabTheme/lightModePrimitives";
import { glassTokens } from "@/lib/glassTokens";

/** Shared glass shell for balance widgets — per appearance mode. */
export const financialOverviewShellDark = {
  border: "transparent",
  backdropFilter: glassTokens.blur.shell,
  WebkitBackdropFilter: glassTokens.blur.shell,
  /** No stacked gradients — only backdrop blur picks up the page behind */
  backgroundImage: "none",
  boxShadow: "none",
  hoverBorder: "transparent",
  hoverBoxShadow: "none",
  sheenRadialA:
    "radial-gradient(ellipse at 30% 40%, rgba(80, 110, 220, 0.22) 0%, rgba(40, 55, 130, 0.08) 45%, transparent 70%)",
  sheenRadialB:
    "radial-gradient(ellipse 80% 55% at 28% 46%, rgba(120, 155, 255, 0.35) 0%, transparent 62%)",
} as const;

export const financialOverviewShellLight = {
  border: "rgba(1, 5, 145, 0.12)",
  backdropFilter: "blur(12px)",
  WebkitBackdropFilter: "blur(12px)",
  backgroundImage: `
    linear-gradient(168deg, ${LIGHT_SURFACE.elevated} 0%, ${LIGHT_SURFACE.subtle} 48%, ${LIGHT_SURFACE.base} 100%),
    linear-gradient(180deg, rgba(255,255,255,0.95) 0%, transparent 42%, rgba(0, 98, 255, 0.04) 100%)
  `,
  boxShadow:
    "0 0 0 1px rgba(1, 5, 145, 0.1), 0 6px 22px rgba(1, 5, 145, 0.06), 0 12px 36px rgba(0, 98, 255, 0.05), inset 0 1px 0 rgba(255,255,255,0.98)",
  hoverBorder: "rgba(0, 98, 255, 0.26)",
  hoverBoxShadow:
    "0 0 0 1px rgba(0, 98, 255, 0.14), 0 10px 32px rgba(1, 5, 145, 0.08), 0 0 32px rgba(0, 98, 255, 0.09), inset 0 1px 0 rgba(255,255,255,1)",
  sheenRadialA:
    "radial-gradient(ellipse at 30% 40%, rgba(80, 110, 220, 0.12) 0%, rgba(40, 55, 130, 0.04) 45%, transparent 70%)",
  sheenRadialB:
    "radial-gradient(ellipse 80% 55% at 28% 46%, rgba(120, 155, 255, 0.18) 0%, transparent 62%)",
} as const;
