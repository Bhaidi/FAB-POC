import { extendTheme } from "@chakra-ui/react";
import baseTheme from "./index";

/**
 * Developer portal theme variant: slightly more modern, tech-premium feel.
 * Extends base corporate theme with sharper accents and tech-oriented colors.
 */
const developerTheme = extendTheme(
  {
    colors: {
      accent: {
        ...baseTheme.colors?.accent,
        primary: "#22d3ee",
        linkCta: "#22d3ee",
      },
    },
    components: {
      Button: {
        variants: {
          solid: {
            bg: "accent.primary",
            color: "gray.900",
            _hover: { bg: "cyan.400", _disabled: { bg: "neutral.borderMuted" } },
          },
        },
      },
    },
  },
  baseTheme
);

export default developerTheme;
