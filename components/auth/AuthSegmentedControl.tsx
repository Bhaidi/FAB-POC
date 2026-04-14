"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
} from "react";
import { Box, useColorMode } from "@chakra-ui/react";
import { animate, motion, useMotionValue, useReducedMotion, type MotionStyle } from "framer-motion";
import { GlassCornerRim } from "@/components/ui/GlassCornerRim";
import { glassCornerRimPaletteAuth } from "@/lib/fabTheme/glassCornerRim";
import { useFabTokens } from "@/components/theme/FabTokensContext";

export type AuthSegmentedOption<T extends string = string> = {
  value: T;
  label: string;
};

type OptionsTuple<T extends string> = readonly [AuthSegmentedOption<T>, AuthSegmentedOption<T>, ...AuthSegmentedOption<T>[]];

export type AuthSegmentedControlSurface = "standard" | "canvas";

export type AuthSegmentedControlLayout = "auth" | "toolbar";

export type AuthSegmentedControlProps<T extends string = string> = {
  options: OptionsTuple<T>;
  value: T;
  onChange: (value: T) => void;
  isDisabled?: boolean;
  /** Login/register chrome vs subtler in-page capsule (account services). */
  surface?: AuthSegmentedControlSurface;
  /** Centered compact (auth) or full-width toolbar (portfolio module). */
  layout?: AuthSegmentedControlLayout;
  /** `role="tablist"` label */
  ariaLabel?: string;
};

/** Light: compact glass pill. */
const PAD_LIGHT = 4;
const GAP_LIGHT = 4;
const INNER_H_LIGHT = 48;

/** Dark DS `558:17091` outer track: 406×64, padding 6px, flex gap 12px → 52px inner height */
const PAD_DARK = 6;
const GAP_DARK = 12;
const TRACK_OUTER_W_DARK = 406;
const TRACK_OUTER_H_DARK = 64;
const INNER_H_DARK = TRACK_OUTER_H_DARK - 2 * PAD_DARK;

/** Login/register master toggle — compact so it doesn’t dominate the header */
const PAD_AUTH = 5;
const GAP_AUTH = 10;
const TRACK_OUTER_W_AUTH = 320;
const TRACK_OUTER_H_AUTH = 52;
const INNER_H_AUTH = TRACK_OUTER_H_AUTH - 2 * PAD_AUTH;

/** Pill snap — soft, iOS-weighted motion */
const SNAP_SPRING = {
  type: "spring" as const,
  stiffness: 300,
  damping: 32,
  mass: 0.88,
};

const THUMB_POP_SPRING = {
  type: "spring" as const,
  stiffness: 420,
  damping: 26,
  mass: 0.82,
};

/** Low elastic = less rubber-band fighting programmatic snap after release */
const DRAG_ELASTIC = 0.04;

/**
 * Dark segment labels — same box model for selected vs inactive (only color + weight differ).
 * Use flex (not `-webkit-box`) so metrics match Figma/body text; Graphik only (see `app/layout.tsx`).
 */
const AUTH_SEG_LABEL_DARK_BASE: CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: "100%",
  minWidth: 0,
  boxSizing: "border-box",
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  fontFamily: "var(--font-graphik)",
  fontSize: "16px",
  fontStyle: "normal",
  lineHeight: "24px",
  letterSpacing: "0",
  textAlign: "center",
  WebkitFontSmoothing: "antialiased",
  MozOsxFontSmoothing: "grayscale",
  userSelect: "none",
  pointerEvents: "none",
  transformOrigin: "center center",
};

const AUTH_SEG_LABEL_DARK_SELECTED: CSSProperties = {
  ...AUTH_SEG_LABEL_DARK_BASE,
  color: "var(--text-white, #ffffff)",
  fontWeight: 500,
};

const AUTH_SEG_LABEL_DARK_INACTIVE: CSSProperties = {
  ...AUTH_SEG_LABEL_DARK_BASE,
  color: "var(--neutral-300, #9b9c9f)",
  fontWeight: 400,
};

/**
 * Login / Register (2-up) or multi-segment toolbar — same glass thumb + drag model everywhere.
 * Chrome comes from `useFabTokens()` so light/dark matches globally.
 */
export function AuthSegmentedControl<T extends string>({
  options,
  value,
  onChange,
  isDisabled = false,
  surface = "standard",
  layout = "auth",
  ariaLabel = "Sign in or register",
}: AuthSegmentedControlProps<T>) {
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";
  const tokens = useFabTokens();
  /** Figma `558:17096` — login/register light track matches dark dimensions (406×64, 6px pad). */
  const authPageLight = !isDark && layout === "auth";
  const seg =
    authPageLight && surface !== "canvas"
      ? tokens.authSegmentedControlLoginLight
      : surface === "canvas"
        ? tokens.authSegmentedControlCanvas
        : tokens.authSegmentedControlTheme;

  const authToggleCompact = layout === "auth" && (isDark || authPageLight);
  const pad = authToggleCompact ? PAD_AUTH : isDark || authPageLight ? PAD_DARK : PAD_LIGHT;
  const gap = authToggleCompact ? GAP_AUTH : isDark || authPageLight ? GAP_DARK : GAP_LIGHT;
  const innerH = authToggleCompact ? INNER_H_AUTH : isDark || authPageLight ? INNER_H_DARK : INNER_H_LIGHT;
  const trackOuterH = authToggleCompact
    ? TRACK_OUTER_H_AUTH
    : isDark || authPageLight
      ? TRACK_OUTER_H_DARK
      : INNER_H_LIGHT + 2 * PAD_LIGHT;

  const {
    track: trackChrome,
    trackSheen,
    trackRimGradient,
    trackFloorGradient,
    trackInnerWellShadow,
    thumbAura,
    thumb: thumbChrome,
    thumbDragging: thumbDragChrome,
    thumbDraggingAura,
    label: labelChrome,
  } = seg;

  const labelVariants = useMemo(
    () =>
      isDark
        ? ({
            /** Dark: typography from `style` (DS md-medium / md-regular); variants only motion */
            active: { opacity: 1, scale: 1 },
            inactive: { opacity: 1, scale: 1 },
            inactiveHover: { opacity: 1, scale: 1 },
          } as const)
        : authPageLight
          ? ({
              active: { color: labelChrome.active, fontWeight: 500, opacity: 1, scale: 1 },
              inactive: { color: labelChrome.inactive, fontWeight: 400, opacity: 1, scale: 1 },
              inactiveHover: { color: labelChrome.inactiveHover, fontWeight: 400, opacity: 1, scale: 1 },
            } as const)
          : ({
              active: { color: labelChrome.active, fontWeight: 650, opacity: 1, scale: 1 },
              inactive: { color: labelChrome.inactive, fontWeight: 600, opacity: 0.88, scale: 1 },
              inactiveHover: { color: labelChrome.inactiveHover, fontWeight: 600, opacity: 1, scale: 1.02 },
            } as const),
    [authPageLight, isDark, labelChrome],
  );

  const reduceMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const [metrics, setMetrics] = useState({ thumbW: 0, maxX: 0, step: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const N = options.length;

  const activeIndex = useMemo(() => {
    const i = options.findIndex((o) => o.value === value);
    return i < 0 ? 0 : i;
  }, [options, value]);

  const pillX = useMotionValue(0);

  const springSnap = useMemo(
    () =>
      reduceMotion
        ? { type: "tween" as const, duration: 0.15, ease: [0.33, 1, 0.68, 1] as const }
        : SNAP_SPRING,
    [reduceMotion],
  );

  /** Dark: typography is static inline styles — do not tween color/fontWeight (avoids mismatch vs DS). */
  const labelTransition = useMemo(() => {
    if (reduceMotion) {
      return { type: "tween" as const, duration: 0.12, ease: [0.33, 1, 0.68, 1] as const };
    }
    if (isDark) {
      return {
        scale: { type: "spring" as const, stiffness: 520, damping: 36, mass: 0.65 },
        opacity: { type: "tween" as const, duration: 0.22, ease: [0.25, 0.1, 0.25, 1] as const },
      };
    }
    return {
      scale: { type: "spring" as const, stiffness: 520, damping: 36, mass: 0.65 },
      opacity: { type: "tween" as const, duration: 0.22, ease: [0.25, 0.1, 0.25, 1] as const },
      color: { type: "tween" as const, duration: 0.3, ease: [0.25, 0.1, 0.25, 1] as const },
      fontWeight: { type: "tween" as const, duration: 0.2, ease: [0.25, 0.1, 0.25, 1] as const },
    };
  }, [isDark, reduceMotion]);

  const measure = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;
    const inner = el.clientWidth - 2 * pad;
    if (inner <= (N - 1) * gap) {
      setMetrics({ thumbW: 0, maxX: 0, step: 0 });
      return;
    }
    const thumbW = (inner - (N - 1) * gap) / N;
    const maxX = (N - 1) * (thumbW + gap);
    const step = maxX > 0 ? maxX / (N - 1) : 0;
    setMetrics({ thumbW, maxX, step });
  }, [N, gap, pad]);

  useLayoutEffect(() => {
    measure();
  }, [measure]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => measure());
    ro.observe(el);
    return () => ro.disconnect();
  }, [measure]);

  /** Single source of truth for thumb X when `value` / layout metrics change (clicks, keyboard, parent). */
  useEffect(() => {
    if (!metrics.step) return;
    const target = activeIndex * metrics.step;
    pillX.stop();
    animate(pillX, target, springSnap);
  }, [activeIndex, metrics.maxX, metrics.step, pillX, springSnap]);

  const selectSegment = useCallback(
    (ix: number) => {
      if (isDisabled) return;
      const next = options[ix]?.value;
      if (next === undefined) return;
      onChange(next);
    },
    [isDisabled, onChange, options],
  );

  const onDragEnd = useCallback(() => {
    setIsDragging(false);
    if (isDisabled || !metrics.step) return;
    const step = metrics.step;
    const raw = Math.round(pillX.get() / step);
    const next = Math.max(0, Math.min(N - 1, raw));
    const opt = options[next];
    if (!opt) return;
    const target = next * step;
    if (opt.value !== value) {
      // Let the `activeIndex` effect run one animation from release position → target (avoids double animate + jank).
      onChange(opt.value);
      return;
    }
    pillX.stop();
    animate(pillX, target, springSnap);
  }, [isDisabled, metrics.step, N, onChange, options, pillX, springSnap, value]);

  const dragEnabled = metrics.maxX > 0 && reduceMotion !== true && !isDisabled;

  const innerGapsPx = (N - 1) * gap;
  const thumbWpx =
    metrics.thumbW > 0 ? `${metrics.thumbW}px` : `calc((100% - ${innerGapsPx}px) / ${N})`;

  const segmentLeft = useCallback(
    (ix: number) =>
      metrics.thumbW > 0
        ? `${ix * (metrics.thumbW + gap)}px`
        : ix === 0
          ? "0"
          : `calc(${ix} * (((100% - ${innerGapsPx}px) / ${N}) + ${gap}px))`,
    [N, gap, innerGapsPx, metrics.thumbW],
  );

  const thumbRadiusPx = authPageLight || isDark ? (isDark ? 74 : 100) : 9999;
  /** DS outer `border-radius: 100px`; inner well = 100 − pad (no track border in DS) */
  const trackOuterRadiusPx = authPageLight || isDark ? 100 : 9999;
  const trackInnerWellRadius = authPageLight || isDark ? 100 - pad : 9999;

  const thumbVisual = isDragging ? { ...thumbChrome, ...thumbDragChrome } : thumbChrome;
  const thumbLift =
    isDark || authPageLight || reduceMotion
      ? { scale: 1, y: 0 }
      : isDragging
        ? { scale: 1.04, y: -1.5 }
        : { scale: 1, y: 0 };

  const innerWellShadow = trackInnerWellShadow ?? "none";

  const sheenBlendMode = surface === "canvas" && colorMode === "dark" ? ("normal" as const) : ("soft-light" as const);

  const auraShadow = isDragging ? thumbDraggingAura ?? thumbAura : thumbAura;

  const darkLabelCompactSx: CSSProperties | undefined =
    authToggleCompact && isDark ? { fontSize: "14px", lineHeight: "20px" } : undefined;

  const outerStyle =
    layout === "auth"
      ? isDark || authPageLight
        ? {
            display: "flex" as const,
            flexDirection: "column" as const,
            justifyContent: "center" as const,
            alignItems: "flex-start" as const,
            gap: 12,
            width: authToggleCompact ? TRACK_OUTER_W_AUTH : TRACK_OUTER_W_DARK,
            maxWidth: "100%" as const,
            minWidth: 0,
          }
        : {
            width: "min(100% - 2rem, 320px)" as const,
            minWidth: "min(300px, calc(100vw - 2rem))" as const,
            maxWidth: 320,
          }
      : {
          width: "100%" as const,
          minWidth: 300,
          maxWidth: 560,
        };

  const trackSurfaceStyle: MotionStyle = {
    position: "relative",
    ...outerStyle,
    height: trackOuterH,
    minHeight: trackOuterH,
    maxHeight: layout === "auth" && (isDark || authPageLight) ? trackOuterH : undefined,
    marginLeft: layout === "auth" ? "auto" : undefined,
    marginRight: layout === "auth" ? "auto" : undefined,
    padding: layout === "auth" && (isDark || authPageLight) ? `${pad}px` : pad,
    borderRadius: trackOuterRadiusPx === 9999 ? 9999 : trackOuterRadiusPx,
    transform: "translateZ(0)",
    isolation: "isolate",
    opacity: isDisabled ? 0.52 : 1,
    pointerEvents: isDisabled ? "none" : "auto",
    ...trackChrome,
  };

  const segmentOuterGlassR =
    isDark && layout === "auth"
      ? `${Math.min(trackOuterRadiusPx, trackOuterH / 2)}px`
      : null;

  return (
    <motion.div
      ref={containerRef}
      className="auth-segmented-control"
      style={trackSurfaceStyle}
      initial={false}
      whileTap={isDisabled || dragEnabled || isDark || authPageLight ? undefined : { scale: 0.992 }}
      transition={reduceMotion ? { duration: 0.18, ease: [0.25, 0.1, 0.25, 1] } : SNAP_SPRING}
      data-auth-segmented-disabled={isDisabled ? "" : undefined}
    >
      {segmentOuterGlassR ? (
        <GlassCornerRim radius={segmentOuterGlassR} palette={glassCornerRimPaletteAuth} zIndex={4} />
      ) : null}
      {trackSheen ? (
        <Box
          position="absolute"
          inset={0}
          borderRadius="inherit"
          pointerEvents="none"
          zIndex={1}
          bg={trackSheen}
          style={{ mixBlendMode: sheenBlendMode }}
          aria-hidden
        />
      ) : null}

      {trackRimGradient ? (
        <Box
          position="absolute"
          inset={0}
          borderRadius="inherit"
          pointerEvents="none"
          zIndex={1}
          bg={trackRimGradient}
          aria-hidden
        />
      ) : null}

      {trackFloorGradient ? (
        <Box
          position="absolute"
          inset={0}
          borderRadius="inherit"
          pointerEvents="none"
          zIndex={1}
          bg={trackFloorGradient}
          aria-hidden
        />
      ) : null}

      {innerWellShadow !== "none" ? (
        <Box
          position="absolute"
          inset={`${pad}px`}
          borderRadius={trackInnerWellRadius === 9999 ? 9999 : trackInnerWellRadius}
          pointerEvents="none"
          zIndex={1}
          boxShadow={innerWellShadow}
          aria-hidden
        />
      ) : null}

      <Box
        role="tablist"
        aria-label={ariaLabel}
        aria-orientation="horizontal"
        position="absolute"
        left={`${pad}px`}
        top={`${pad}px`}
        right={`${pad}px`}
        h={`${innerH}px`}
        /** Above the thumb so selected label (light mode: white on blue) paints on the pill; thumb stays below for hit-testing via `pointerEvents` on segments */
        zIndex={8}
        pointerEvents="none"
      >
        {options.map((opt, ix) => (
          <Box
            key={opt.value}
            as="button"
            type="button"
            role="tab"
            aria-selected={activeIndex === ix}
            disabled={isDisabled}
            position="absolute"
            left={segmentLeft(ix)}
            top={0}
            bottom={0}
            w={thumbWpx}
            minW={0}
            zIndex={1}
            display="flex"
            alignItems="center"
            justifyContent="center"
            border="none"
            bg="transparent"
            cursor={isDisabled ? "not-allowed" : "pointer"}
            outline="none"
            px={layout === "toolbar" ? (isDark ? 4 : 1) : 4}
            pointerEvents={
              isDisabled ? "none" : activeIndex === ix ? "none" : "auto"
            }
            className="auth-segmented-control__segment"
            sx={{
              userSelect: "none",
              WebkitUserSelect: "none",
              WebkitTapHighlightColor: "transparent",
              ...(!isDark
                ? {
                    transition: "transform 0.22s cubic-bezier(0.34, 1.4, 0.64, 1)",
                    _hover:
                      isDisabled || activeIndex === ix
                        ? undefined
                        : { transform: "scale(1.02)", transformOrigin: "center center" },
                    _active:
                      isDisabled || activeIndex === ix
                        ? undefined
                        : { transform: "scale(0.97)", transitionDuration: "0.12s" },
                  }
                : {}),
            }}
            onClick={() => selectSegment(ix)}
            onKeyDown={(e: KeyboardEvent<HTMLButtonElement>) => {
              if (e.key === "ArrowRight") {
                e.preventDefault();
                selectSegment(Math.min(N - 1, ix + 1));
              }
              if (e.key === "ArrowLeft") {
                e.preventDefault();
                selectSegment(Math.max(0, ix - 1));
              }
            }}
          >
            <motion.span
              className="auth-segmented-control__label"
              variants={labelVariants}
              initial={false}
              animate={activeIndex === ix ? "active" : "inactive"}
              whileHover={activeIndex === ix ? undefined : "inactiveHover"}
              transition={labelTransition}
              style={
                isDark
                  ? activeIndex === ix
                    ? { ...AUTH_SEG_LABEL_DARK_SELECTED, ...darkLabelCompactSx }
                    : { ...AUTH_SEG_LABEL_DARK_INACTIVE, ...darkLabelCompactSx }
                  : {
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      maxWidth: "100%",
                      overflow: layout === "toolbar" ? "hidden" : "visible",
                      textOverflow: layout === "toolbar" ? "ellipsis" : undefined,
                      whiteSpace: "nowrap",
                      fontFamily: "var(--font-graphik)",
                      fontSize:
                        layout === "auth" ? "clamp(12px, 2.2vw, 13px)" : "clamp(14px, 2.5vw, 15px)",
                      lineHeight: 1.35,
                      letterSpacing: layout === "auth" ? "-0.015em" : "-0.02em",
                      userSelect: "none",
                      pointerEvents: "none",
                      transformOrigin: "center center",
                    }
              }
            >
              {opt.label}
            </motion.span>
          </Box>
        ))}
      </Box>

      <motion.div
        aria-hidden
        drag={dragEnabled ? "x" : false}
        dragConstraints={{ left: 0, right: metrics.maxX }}
        dragElastic={DRAG_ELASTIC}
        dragMomentum={false}
        dragTransition={{ bounceStiffness: 420, bounceDamping: 38 }}
        style={{
          x: pillX,
          position: "absolute",
          left: pad,
          top: pad,
          width: thumbWpx,
          height: innerH,
          zIndex: isDragging ? 6 : 4,
          willChange: "transform",
          touchAction: "none",
          WebkitTapHighlightColor: "transparent",
          cursor:
            isDisabled ? "not-allowed" : metrics.maxX > 0 ? (isDragging ? "grabbing" : "grab") : "default",
          pointerEvents: isDisabled ? "none" : "auto",
        }}
        onDragStart={() => {
          pillX.stop();
          setIsDragging(true);
        }}
        onDragEnd={onDragEnd}
        initial={false}
      >
        {auraShadow ? (
          <Box
            position="absolute"
            inset="-3px"
            borderRadius={`${thumbRadiusPx}px`}
            pointerEvents="none"
            zIndex={0}
            opacity={isDragging ? 1 : 0.72}
            transition="opacity 0.28s ease"
            aria-hidden
            sx={{ boxShadow: auraShadow }}
          />
        ) : null}
        <motion.div
          className="auth-segmented-control__thumb"
          initial={false}
          animate={thumbLift}
          transition={reduceMotion ? { duration: 0.18, ease: [0.25, 0.1, 0.25, 1] } : THUMB_POP_SPRING}
          style={{
            position: "relative",
            zIndex: 1,
            width: "100%",
            height: "100%",
            borderRadius: thumbRadiusPx,
            boxSizing: "border-box",
            transformOrigin: "center center",
            pointerEvents: "none",
            ...thumbVisual,
          }}
        />
      </motion.div>
    </motion.div>
  );
}
