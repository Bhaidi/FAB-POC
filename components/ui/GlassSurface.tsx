"use client";

import type { ReactNode } from "react";
import { Box, type BoxProps } from "@chakra-ui/react";
import { glassTokens } from "@/lib/glassTokens";

export type GlassSurfaceVariant = "shell" | "card" | "panel" | "button" | "active" | "input";

export type GlassSurfaceProps = Omit<BoxProps, "children"> & {
  variant: GlassSurfaceVariant;
  children: ReactNode;
  /** Enables hover border / lift styling where variant supports it */
  interactive?: boolean;
  /** Active / selected — blue-glass family */
  isActive?: boolean;
  /** Subtle translateY on hover (cards: -2px; buttons: -1px via smaller lift) */
  hoverLift?: boolean;
  /** Adds restrained cool bloom */
  glow?: boolean;
};

function variantFill(v: GlassSurfaceVariant, isActive: boolean): string {
  if (isActive || v === "active") return glassTokens.fill.active;
  switch (v) {
    case "shell":
      return glassTokens.fill.shell;
    case "card":
      return glassTokens.fill.card;
    case "panel":
      return glassTokens.fill.panel;
    case "button":
      return glassTokens.fill.button;
    case "input":
      return glassTokens.fill.input;
    default:
      return glassTokens.fill.card;
  }
}

function variantBlur(v: GlassSurfaceVariant, isActive: boolean): string {
  if (isActive || v === "active") return glassTokens.blur.active;
  switch (v) {
    case "shell":
      return glassTokens.blur.shell;
    case "card":
    case "panel":
      return glassTokens.blur.card;
    case "button":
      return glassTokens.blur.button;
    case "input":
      return glassTokens.blur.input;
    default:
      return glassTokens.blur.card;
  }
}

function variantRadius(v: GlassSurfaceVariant): string {
  switch (v) {
    case "shell":
      return glassTokens.radius.shell;
    case "card":
    case "panel":
      return glassTokens.radius.card;
    case "button":
    case "active":
      return glassTokens.radius.button;
    case "input":
      return glassTokens.radius.pill;
    default:
      return glassTokens.radius.card;
  }
}

function variantShadow(v: GlassSurfaceVariant, isActive: boolean, glow: boolean): string {
  if (isActive || v === "active") {
    return glow ? `${glassTokens.shadowStack.active}, ${glassTokens.shadow.ambientBlue}` : glassTokens.shadowStack.active;
  }
  switch (v) {
    case "shell":
      return glassTokens.shadowStack.shell;
    case "card":
      return glow ? `${glassTokens.shadowStack.card}, ${glassTokens.shadow.ambientBlue}` : glassTokens.shadowStack.card;
    case "panel":
      return glassTokens.shadowStack.panel;
    case "button":
      return glassTokens.shadowStack.button;
    case "input":
      return glassShadowInput();
    default:
      return glassTokens.shadowStack.card;
  }
}

function glassShadowInput(): string {
  return "none";
}

/**
 * Layered dark glass surface — base fill, border, top sheen, inner edge, bottom depth.
 * Content sits in a relatively positioned stacking context above decorative layers.
 */
export function GlassSurface({
  variant,
  interactive = false,
  isActive = false,
  hoverLift = false,
  glow = false,
  children,
  sx,
  ...rest
}: GlassSurfaceProps) {
  const fill = variantFill(variant, isActive);
  const blur = variantBlur(variant, isActive);
  const radius = variantRadius(variant);
  const shadowStack = variantShadow(variant, isActive, glow);

  const liftY = variant === "button" || variant === "input" ? "-1px" : "-2px";

  const baseSx = {
    WebkitBackdropFilter: blur,
    boxShadow: shadowStack,
    borderWidth: 0,
    borderStyle: "solid",
    borderColor: "transparent",
    transition: glassTokens.motion.transition,
    ...(interactive || hoverLift
      ? {
          _hover: {
            borderColor: "transparent",
            boxShadow:
              variant === "shell"
                ? glassTokens.shadowStack.shellHover
                : variant === "card"
                  ? glassTokens.shadowStack.cardHover
                  : shadowStack,
            transform: hoverLift ? `translateY(${liftY})` : undefined,
          },
        }
      : {}),
    ...(interactive
      ? {
          _focusVisibleWithin: {
            borderColor: "transparent",
            boxShadow: shadowStack,
          },
        }
      : {}),
  };

  return (
    <Box
      position="relative"
      overflow="hidden"
      borderRadius={radius}
      bg={fill}
      backdropFilter={blur}
      sx={{ ...baseSx, ...sx }}
      {...rest}
    >
      <Box position="relative" zIndex={1} h="full" w="full">
        {children}
      </Box>
    </Box>
  );
}

/** Opinionated aliases — same component, clearer call sites */
export const GlassCard = (props: Omit<GlassSurfaceProps, "variant">) => (
  <GlassSurface variant="card" {...props} />
);
export const GlassPanel = (props: Omit<GlassSurfaceProps, "variant">) => (
  <GlassSurface variant="panel" {...props} />
);
export const GlassButtonSurface = (props: Omit<GlassSurfaceProps, "variant">) => (
  <GlassSurface variant="button" interactive hoverLift {...props} />
);
export const GlassInputSurface = (props: Omit<GlassSurfaceProps, "variant">) => (
  <GlassSurface variant="input" {...props} />
);
export const GlassSidebarItemSurface = (props: Omit<GlassSurfaceProps, "variant">) => (
  <GlassSurface variant="button" interactive {...props} />
);
