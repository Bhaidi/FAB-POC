import { extendTheme, type ThemeConfig } from "@chakra-ui/react";

const config: ThemeConfig = {
  initialColorMode: "light",
  useSystemColorMode: false,
};

const GRAPHIK_STACK = "var(--font-graphik)";

const fonts = {
  heading: GRAPHIK_STACK,
  body: GRAPHIK_STACK,
  /** Chakra defaults mono to Menlo/etc.; force Graphik for OTP/code surfaces too */
  mono: GRAPHIK_STACK,
};

const fontWeights = {
  light: 300,
  normal: 400,
  medium: 500,
  semibold: 600,
};

const fontSizes = {
  "2xs": "11px",
  xs: "12px",
  sm: "14px",
  md: "16px",
  lg: "18px",
  xl: "20px",
  "2xl": "24px",
  "3xl": "36px",
  "4xl": "48px",
  "5xl": "64px",
  "6xl": "120px",
  "7xl": "80px",
};

const lineHeights = {
  hero: "110%",
  heroHeadline: "100%",
  body: "120%",
  lead: "30px",
  description: "140%",
};

/**
 * Semantic text styles – Graphik typography.
 * heroHeadline: large hero (e.g. "End-to-End Corporate Banking Solution Suite.")
 * bodyLead: body/lead copy (16px, 30px line-height)
 */
const textStyles = {
  heroHeadline: {
    fontFamily: GRAPHIK_STACK,
    fontWeight: 300,
    fontStyle: "normal",
    fontSize: "80px",
    lineHeight: "100%",
    letterSpacing: "0px",
  },
  bodyLead: {
    fontFamily: GRAPHIK_STACK,
    fontWeight: 400,
    fontStyle: "normal",
    fontSize: "16px",
    lineHeight: "30px",
    letterSpacing: "0px",
  },
  /** Developer Portal (Figma) – card title "Log in to access your profile" */
  cardTitle: {
    fontFamily: GRAPHIK_STACK,
    fontWeight: 400,
    fontSize: "40px",
    lineHeight: "1.1",
    letterSpacing: "-1px",
  },
  /** Developer Portal – labels, caption (11px) */
  caption: {
    fontFamily: GRAPHIK_STACK,
    fontWeight: 400,
    fontSize: "11px",
    lineHeight: "14px",
    letterSpacing: "0px",
  },
  /** Developer Portal – tab text (13px) */
  tab: {
    fontFamily: GRAPHIK_STACK,
    fontWeight: 500,
    fontSize: "13px",
    lineHeight: "1.4",
    letterSpacing: "0px",
  },
};

const breakpoints = {
  base: "0",
  sm: "480px",
  md: "768px",
  lg: "992px",
  xl: "1280px",
  "2xl": "1536px",
};

const space = {
  1: "4px",
  2: "8px",
  3: "12px",
  4: "16px",
  5: "20px",
  6: "24px",
  8: "32px",
  10: "40px",
  12: "48px",
  14: "56px",
  16: "64px",
  20: "80px",
  24: "96px",
  28: "112px",
  32: "128px",
  36: "144px",
  40: "160px",
  44: "176px",
  48: "192px",
};

const radii = {
  sm: "8px",
  md: "10px",
  lg: "16px",
  xl: "100px",
  full: "9999px",
};

const colors = {
  brand: {
    primaryDark: "#000245",
    header: "#010227",
    darkBlueAccent: "#010591",
    logoBlue: "#003087",
    gradient: {
      from: "#000481",
      mid: "#00037F",
      mid2: "#000353",
      to: "#000107",
    },
    heroGradient:
      "linear-gradient(115deg, #000481 -55.63%, #00037F -17.24%, #000353 22.71%, #000107 100%)",
  },
  accent: {
    linkCta: "#0f62fe",
  },
  neutral: {
    pageBg: "#f2f2f3",
    mainText: "#242e3d",
    secondaryText: "#48525e",
    mutedText: "#2d3237",
    mutedTextAlt: "#6c7280",
    border: "#e0e0e0",
    borderAlt: "#d9d9d9",
    borderLight: "#e2e3e5",
    borderMuted: "#a1a1aa",
    lightGray: "#f0f1f2",
    lightGrayAlt: "#f5f5f5",
    offWhite: "#fbfbfb",
    offWhiteAlt: "#fcfcfc",
  },
  semantic: {
    success: "#14a155",
    chatPurple: "#5d35ad",
    chatPurpleBorder: "rgba(93, 53, 173, 0.3)",
  },
  overlay: {
    dark: "rgba(0, 0, 0, 0.4)",
    light: "rgba(255, 255, 255, 0.05)",
    light1: "rgba(255, 255, 255, 0.1)",
    light12: "rgba(255, 255, 255, 0.12)",
    light24: "rgba(255, 255, 255, 0.24)",
    inputPanel: "rgba(204, 210, 216, 0.24)",
  },
  loginScreen: {
    bg: "#050a18",
    bgAlt: "#000000",
    blueGlow: "linear-gradient(90deg, transparent 0%, rgba(15, 98, 254, 0.15) 40%, rgba(15, 98, 254, 0.25) 100%)",
    blueGlowBeam: "linear-gradient(180deg, transparent 0%, rgba(15, 98, 254, 0.08) 20%, rgba(15, 98, 254, 0.2) 50%, transparent 100%)",
    blueGlowSoft: "radial-gradient(ellipse 80% 50% at 70% 50%, rgba(15, 98, 254, 0.12) 0%, transparent 70%)",
    glassCard: "rgba(10, 15, 35, 0.6)",
    glassBorder: "rgba(255, 255, 255, 0.08)",
    glassBorderGlow: "rgba(15, 98, 254, 0.25)",
    inputBg: "rgba(204, 210, 216, 0.08)",
    inputBorder: "rgba(255, 255, 255, 0.12)",
    inputFocusGlow: "0 0 0 1px rgba(15, 98, 254, 0.5), 0 0 20px rgba(15, 98, 254, 0.15)",
    ctaBg: "#ffffff",
    ctaText: "#050a18",
    ctaHoverGlow: "0 0 24px rgba(15, 98, 254, 0.35)",
  },
  /** Developer Portal UI (Figma) – design tokens */
  developerPortal: {
    vividBlue: "#0062FF",
    topBar: "#010227",
    overlayGradient: "linear-gradient(180deg, rgba(1,4,20,0) -1.13%, rgba(0,0,3,0.8) 100%)",
    tabsBg: "rgba(255,255,255,0.12)",
    tabsBlur: 25,
    tabRadius: "8px",
    inputBg: "rgba(255,255,255,0.12)",
    inputBorder: "rgba(255,255,255,0.24)",
    inputHeight: "48px",
    inputRadius: "4px",
    inputPx: "12px",
    pillRadius: "200px",
    ctaText: "#000245",
    navBlur: 12,
    navPx: 48,
    navPy: 12,
  },
};

const styles = {
  global: {
    /**
     * Chakra CSS reset sets `html { font-family: system-ui }` and monospace on code/kbd.
     * Globals.css uses !important so Graphik wins regardless of injection order; we mirror here for Emotion layer.
     */
    html: {
      fontFamily: GRAPHIK_STACK,
      fontSynthesis: "none",
    },
    body: {
      bg: "neutral.pageBg",
      color: "neutral.mainText",
      fontFamily: GRAPHIK_STACK,
      fontSynthesis: "none",
      fontWeight: 400,
      lineHeight: "120%",
    },
    ":where(pre, code, kbd, samp)": {
      fontFamily: GRAPHIK_STACK,
    },
    ".chakra-portal, .chakra-portal-zIndex, [id^='chakra-toast-manager']": {
      fontFamily: GRAPHIK_STACK,
    },
  },
};

const components = {
  Button: {
    baseStyle: {
      fontFamily: GRAPHIK_STACK,
      fontWeight: 500,
      minHeight: "44px",
      borderRadius: "xl",
    },
    defaultProps: {
      variant: "solid",
    },
    variants: {
      solid: {
        bg: "accent.linkCta",
        color: "white",
        _hover: {
          bg: "blue.600",
          _disabled: { bg: "neutral.borderMuted" },
        },
      },
      outline: {
        borderColor: "neutral.border",
        color: "neutral.mainText",
        _hover: {
          bg: "neutral.lightGray",
          borderColor: "accent.linkCta",
        },
      },
      ghost: {
        color: "neutral.secondaryText",
        _hover: {
          bg: "neutral.lightGray",
          color: "neutral.mainText",
        },
      },
    },
  },
  Input: {
    baseStyle: {
      field: {
        fontFamily: GRAPHIK_STACK,
        minHeight: "44px",
        borderRadius: "md",
        fontSize: "md",
      },
    },
    variants: {
      filled: {
        field: {
          bg: "white",
          borderWidth: "1px",
          borderColor: "neutral.border",
          color: "neutral.mainText",
          _hover: { borderColor: "neutral.borderAlt" },
          _focus: {
            borderColor: "accent.linkCta",
            boxShadow: "0 0 0 1px var(--chakra-colors-accent-linkCta)",
          },
        },
      },
    },
    defaultProps: {
      variant: "filled",
    },
  },
  Card: {
    baseStyle: {
      container: {
        borderRadius: "lg",
        bg: "white",
        borderWidth: "1px",
        borderColor: "neutral.border",
        boxShadow: "sm",
      },
    },
  },
  Heading: {
    baseStyle: {
      fontFamily: GRAPHIK_STACK,
      fontWeight: 600,
      color: "neutral.mainText",
      lineHeight: "120%",
    },
    sizes: {
      xs: { fontSize: "xs" },
      sm: { fontSize: "sm" },
      md: { fontSize: "md" },
      lg: { fontSize: "lg" },
      xl: { fontSize: "xl" },
      "2xl": { fontSize: "2xl" },
      "3xl": { fontSize: "3xl" },
      "4xl": { fontSize: "4xl" },
      "5xl": { fontSize: "5xl" },
      "6xl": { fontSize: "6xl" },
    },
  },
  Text: {
    baseStyle: {
      fontFamily: GRAPHIK_STACK,
      color: "neutral.mainText",
      lineHeight: "120%",
    },
  },
  Code: {
    baseStyle: {
      fontFamily: GRAPHIK_STACK,
    },
  },
  Kbd: {
    baseStyle: {
      fontFamily: GRAPHIK_STACK,
    },
  },
  Container: {
    baseStyle: {
      px: { base: 4, md: 12 },
      maxW: "container.xl",
    },
  },
};

const theme = extendTheme({
  config,
  fonts,
  fontWeights,
  fontSizes,
  lineHeights,
  textStyles,
  breakpoints,
  space,
  radii,
  colors,
  styles,
  components,
  shadows: {
    card: "0 4px 24px rgba(0,0,0,0.08)",
    soft: "0 2px 12px rgba(0,0,0,0.06)",
  },
});

export default theme;
