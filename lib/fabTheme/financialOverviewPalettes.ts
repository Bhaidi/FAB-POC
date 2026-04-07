import { LIGHT_SURFACE } from "@/lib/fabTheme/lightModePrimitives";

/** Shared glass shell for balance widgets — per appearance mode. */
export const financialOverviewShellDark = {
  border: "rgba(255,255,255,0.1)",
  backdropFilter: "blur(20px)",
  WebkitBackdropFilter: "blur(20px)",
  backgroundImage: `
    linear-gradient(168deg, rgba(14, 20, 52, 0.92) 0%, rgba(10, 16, 42, 0.82) 48%, rgba(8, 12, 36, 0.94) 100%),
    linear-gradient(180deg, rgba(255,255,255,0.08) 0%, transparent 36%, rgba(95, 85, 180, 0.055) 100%)
  `,
  boxShadow:
    "0 20px 50px rgba(0, 0, 0, 0.42), 0 0 0 1px rgba(255,255,255,0.09), inset 0 1px 0 rgba(255,255,255,0.16), inset 0 0 0 1px rgba(255,255,255,0.04), inset 0 0 72px rgba(40, 60, 140, 0.06)",
  hoverBorder: "rgba(255,255,255,0.17)",
  hoverBoxShadow:
    "0 26px 58px rgba(0, 0, 0, 0.48), 0 0 0 1px rgba(255,255,255,0.11), 0 0 36px rgba(45, 107, 255, 0.14), inset 0 1px 0 rgba(255,255,255,0.18), inset 0 0 80px rgba(50, 75, 160, 0.09)",
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
