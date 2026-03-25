/**
 * Auth surface design tokens — spacing, radii, glass surfaces, typography contrast.
 * Use across login, register, QR, footer-adjacent components for visual consistency.
 */

/** Global vertical rhythm (px) — use for auth spacing refinements */
export const authVerticalSpace = {
  xs: "8px",
  sm: "12px",
  md: "16px",
  lg: "24px",
  xl: "32px",
  xxl: "48px",
  xxxl: "64px",
} as const;

/** Login form column — vertical rhythm (right side) */
export const authLoginFormVertical = {
  eyebrowToTitle: authVerticalSpace.sm,
  /** Title block → first control (error banner or first field) */
  titleToFirstInput: authVerticalSpace.xl,
  /** Space below API / form-level error before fields */
  errorToFields: authVerticalSpace.md,
  betweenInputs: authVerticalSpace.lg,
  lastInputToCta: authVerticalSpace.xl,
  ctaToHelperLinks: authVerticalSpace.md,
  helpersBottomBreath: authVerticalSpace.xl,
} as const;

/** Login hero column — spec’d gaps (left side) */
export const authLoginHeroVertical = {
  eyebrowToHeading: authVerticalSpace.sm,
  headingToDescription: authVerticalSpace.lg,
  descriptionTail: authVerticalSpace.xl,
} as const;

/** Register flow — spec’d gaps (single source; do not duplicate in authSpacing) */
export const authRegisterVertical = {
  headingToStepsBlock: "40px",
  stepsBlockToCta: authVerticalSpace.xxl,
  ctaToFooterMin: authVerticalSpace.xxl,
  stepsSectionPy: "40px",
  /** Min height for the flex spacer above the centered rule (short-viewport stability) */
  ruleBandSpacerMinH: { base: "1.5rem", md: "2rem" } as const,
  stepIconToTitle: authVerticalSpace.sm,
  stepTitleToDescription: authVerticalSpace.xs,
  stepBlockMinH: { base: "110px", md: "130px" } as const,
} as const;

export const authRadius = {
  input: "10px",
  /** Cards, panels, QR frame */
  surface: "12px",
  surfaceLg: "16px",
  pill: "9999px",
} as const;

export const authSpacing = {
  /** Vertical section rhythm on auth pages */
  sectionY: { base: 10, md: 12, lg: 14 },
  formFieldGap: 7,
  /** Fixed gap between hero + right column */
  heroToFormGap: { base: 10, lg: "80px" },
  /**
   * Shared hero column: login (marketing) + register (onboarding lead block).
   * Keeps headline rhythm and width identical between modes.
   */
  heroStack: { base: 9, md: 11, lg: 12 } as const,
  heroColumnMaxW: "640px",
  /** Max line length for supporting copy inside hero column */
  heroBodyMaxW: "560px",
  /** Space below hero lead copy before next block (disclaimer / steps / etc.) */
  heroFollowPt: { base: 10, md: 12, lg: 14 } as const,
  /**
   * Right column (login form + register QR) — same vertical rhythm:
   * eyebrow → title → supporting → content.
   */
  rightColumnIntroStack: { base: 5, md: 6 } as const,
  /** After supporting copy, before form / QR details */
  rightColumnBeforeControls: { base: 9, md: 10, lg: 11 } as const,
  /** After core block (form / steps), before primary CTA */
  modeCoreToPrimaryCta: { base: 8, md: 9, lg: 10 } as const,
  /** After primary CTA, before secondary actions (login links only when used) */
  modePrimaryToSecondaryActions: { base: 7, md: 8 } as const,
  /** Extra air at bottom of auth main column (above footer reserve) */
  authPageBottomAir: { base: 6, md: 8, lg: 10 } as const,
} as const;

/** Shared split canvas — login & register use identical grid + column widths. */
export const authLayout = {
  /** Wider grid uses more horizontal space; still capped for ultra-wide screens */
  splitMaxW: "min(1280px, 100%)",
  /** Fills parent flex host on large screens (auth stage is non-scrollable). */
  minH: { base: "auto", lg: "min(420px, 100%)" } as const,
  rightColumnMaxW: "480px",
} as const;

/** Large hero headlines — left column marketing / register onboarding lead. */
export const authHeroTypography = {
  overline: {
    fontWeight: 500,
    fontSize: "11px",
    lineHeight: "1",
    letterSpacing: "0.14em",
    textTransform: "uppercase" as const,
  },
  headline: {
    fontWeight: 300,
    fontSize: { base: "40px", sm: "54px", md: "62px", lg: "76px" },
    lineHeight: "1.14",
    letterSpacing: "-0.03em",
  },
  subtitle: {
    fontWeight: 400,
    fontSize: { base: "15px", md: "16px" },
    lineHeight: "1.65",
  },
} as const;

/** Right-column titles & body — login form header + QR panel (same scale). */
export const authColumnTypography = {
  /** Panel / form section title (Login, Need the mobile app?, etc.) */
  title: {
    fontWeight: 400,
    fontSize: { base: "26px", md: "32px" },
    lineHeight: "1.12",
    letterSpacing: "-0.03em",
  },
  supporting: {
    fontWeight: 400,
    fontSize: { base: "14px", md: "15px" },
    lineHeight: "1.6",
  },
} as const;

/** Guided-flow label above steps (register) — matches eyebrow weight. */
export const authStepsSectionLabel = {
  fontWeight: 600,
  fontSize: "11px",
  letterSpacing: "0.14em",
  textTransform: "uppercase" as const,
} as const;

/**
 * Register step row — numbered titles (e.g. “1. Scan the QR Code”).
 * One step up from caption; body size aligns with authColumnTypography.supporting.
 */
export const authRegisterStepTitle = {
  fontWeight: 600,
  fontSize: { base: "14px", md: "15px" },
  lineHeight: "1.38",
  letterSpacing: "-0.02em",
} as const;

/** Step descriptions under each tile — paired scale below title. */
export const authRegisterStepDescription = {
  fontWeight: 400,
  fontSize: { base: "12px", md: "13px" },
  lineHeight: "1.5",
} as const;

export const authShadow = {
  focusRing: "0 0 0 2px rgba(0, 98, 255, 0.28), 0 0 20px rgba(0, 98, 255, 0.12)",
  inputFocus: "0 0 0 2px rgba(0, 98, 255, 0.25)",
  /** Light glass — QR inner frame */
  qr: "0 2px 16px rgba(0, 0, 0, 0.2)",
  /** Soft panel — download / info cards */
  panel: "0 4px 28px rgba(0, 0, 0, 0.14), inset 0 1px 0 rgba(255, 255, 255, 0.06)",
  panelHover: "0 8px 36px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.08)",
  primaryCta: "0 8px 28px rgba(0, 50, 140, 0.28), inset 0 1px 0 rgba(255, 255, 255, 0.12)",
  primaryCtaHover: "0 12px 36px rgba(0, 70, 180, 0.36), inset 0 1px 0 rgba(255, 255, 255, 0.14)",
} as const;

export const authColors = {
  text: {
    primary: "rgba(255, 255, 255, 0.96)",
    secondary: "rgba(255, 255, 255, 0.76)",
    tertiary: "rgba(255, 255, 255, 0.58)",
    muted: "rgba(255, 255, 255, 0.42)",
    faint: "rgba(255, 255, 255, 0.32)",
  },
  border: {
    subtle: "rgba(255, 255, 255, 0.09)",
    default: "rgba(255, 255, 255, 0.12)",
    strong: "rgba(255, 255, 255, 0.18)",
  },
  glass: {
    tint: "rgba(12, 18, 38, 0.26)",
    tintHover: "rgba(255, 255, 255, 0.075)",
    input: "rgba(255, 255, 255, 0.085)",
    inputHover: "rgba(255, 255, 255, 0.11)",
    inputFocus: "rgba(255, 255, 255, 0.12)",
  },
  accent: "#0062FF",
  accentSoft: "rgba(0, 98, 255, 0.88)",
  /** Countdown & emphasis when time is running out */
  warning: "rgba(255, 200, 140, 0.98)",
  warningSoft: "rgba(255, 200, 140, 0.78)",
} as const;

/** Login success — push-verify approved (tight vertical rhythm). */
export const authSuccessSpacing = {
  eyebrowToIcon: "12px",
  iconToHeading: "20px",
  headingToSupporting: "12px",
  supportingToCta: "28px",
} as const;

/** Push verification column — explicit px rhythm (design spec). */
export const authVerificationSpacing = {
  eyebrowToTitle: "16px",
  /** Success / failure screens: title → supporting body */
  titleToSupporting: "16px",
  /** Minimal verify: title → one-line instruction */
  titleToInstruction: "16px",
  /** Instruction → challenge card */
  instructionToCard: "32px",
  cardToCountdown: "16px",
  countdownToStatus: "20px",
  statusToRecovery: "24px",
} as const;

/** Approve Sign-In / success — vertical rhythm (heading → challenge card → timer → status → actions). */
export const authVerifyScreenSpacing = {
  eyebrowToTitle: "16px",
  titleToSecondary: "12px",
  secondaryToChallengeCard: "40px",
  cardToTimer: "12px",
  timerToInstruction: "12px",
  instructionToStatus: "16px",
  statusToActions: "16px",
} as const;

/** Challenge hero card — glass panel */
export const authChallengeCard = {
  bg: "rgba(255, 255, 255, 0.055)",
  border: "rgba(255, 255, 255, 0.12)",
  insetHighlight: "inset 0 1px 0 rgba(255, 255, 255, 0.09)",
  shadow: "0 8px 40px rgba(0, 0, 0, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.08)",
} as const;

export const authMotion = {
  easing: {
    out: [0, 0, 0.2, 1] as [number, number, number, number],
    inOut: [0.42, 0, 0.58, 1] as [number, number, number, number],
  },
  duration: {
    fast: 0.18,
    normal: 0.24,
    slow: 0.38,
  },
} as const;
