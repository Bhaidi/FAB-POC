/**
 * Dark dashboard glass cards — tuned to reference (navy frosted glass, soft lift).
 * Icons stay app-defined (domain / grid); surface chrome matches the reference.
 */
export const dashboardDarkCardSurface = {
  /** Frosted stack: subtle cool highlight → deep navy (reads solid but shows blur through) */
  fill:
    "linear-gradient(165deg, rgba(255, 255, 255, 0.07) 0%, rgba(22, 30, 58, 0.62) 42%, rgba(12, 16, 36, 0.78) 100%)",
  backdrop: "blur(12px) saturate(180%)",
  border: "rgba(255, 255, 255, 0.1)",
  borderHover: "rgba(0, 140, 255, 0.42)",
  radius: "32px",
  title: "#ffffff",
  /** Slightly muted body (≈75–80% vs pure white) */
  body: "rgba(255, 255, 255, 0.78)",
  bodySubtle: "rgba(255, 255, 255, 0.62)",
  iconBoxBg: "rgba(255, 255, 255, 0.06)",
  iconBoxBorder: "rgba(255, 255, 255, 0.12)",
  hoverScrim: "rgba(0, 0, 0, 0.5)",
  /** Framer Motion — wide soft shadow + hairline + top sheen */
  motionRest:
    "0 10px 44px rgba(0, 0, 0, 0.42), 0 0 0 1px rgba(255, 255, 255, 0.07), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
  motionHover:
    "0 16px 52px rgba(0, 0, 0, 0.48), 0 0 0 1px rgba(0, 120, 255, 0.22), 0 0 48px rgba(0, 98, 255, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.12)",
  padComfortable: "32px",
} as const;
