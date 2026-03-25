"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type KeyboardEvent } from "react";
import { Box } from "@chakra-ui/react";
import { animate, motion, useMotionValue, useReducedMotion } from "framer-motion";
import { authSegmentedControlTheme } from "@/components/auth/authSegmentedControlTheme";

export type AuthSegmentedOption<T extends string = string> = {
  value: T;
  label: string;
};

export type AuthSegmentedControlProps<T extends string = string> = {
  options: [AuthSegmentedOption<T>, AuthSegmentedOption<T>];
  value: T;
  onChange: (value: T) => void;
  isDisabled?: boolean;
};

const PAD = 4;
const GAP = 4;
/** Inner track row — thumb + labels share this height for alignment */
const INNER_H = 46;
const TRACK_OUTER_H = INNER_H + 2 * PAD;

const SNAP_SPRING = {
  type: "spring" as const,
  stiffness: 380,
  damping: 34,
  mass: 0.85,
};

const THUMB_POP_SPRING = {
  type: "spring" as const,
  stiffness: 520,
  damping: 32,
  mass: 0.85,
};

const DRAG_ELASTIC = 0.1;

const {
  track: trackChrome,
  trackSheen,
  thumb: thumbChrome,
  thumbDragging: thumbDragChrome,
  label: labelChrome,
} = authSegmentedControlTheme;

const labelVariants = {
  active: { color: labelChrome.active },
  inactive: { color: labelChrome.inactive },
  inactiveHover: { color: labelChrome.inactiveHover },
} as const;

/**
 * Login / Register — iOS-like segmented control: draggable glass thumb, two discrete states.
 * Thumb is split: outer layer owns `x` + drag; inner layer owns scale/lift so post-drag alignment stays stable.
 */
export function AuthSegmentedControl<T extends string>({
  options,
  value,
  onChange,
  isDisabled = false,
}: AuthSegmentedControlProps<T>) {
  const reduceMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const prevMaxXRef = useRef(0);
  const [metrics, setMetrics] = useState({ thumbW: 0, maxX: 0 });
  const [isDragging, setIsDragging] = useState(false);

  const activeIndex = value === options[0].value ? 0 : 1;
  const pillX = useMotionValue(0);

  const springSnap = useMemo(
    () =>
      reduceMotion
        ? { type: "tween" as const, duration: 0.15, ease: [0.33, 1, 0.68, 1] as const }
        : SNAP_SPRING,
    [reduceMotion]
  );

  const labelTransition = reduceMotion
    ? { type: "tween" as const, duration: 0.12, ease: [0.33, 1, 0.68, 1] as const }
    : { ...SNAP_SPRING, color: { type: "tween" as const, duration: 0.22, ease: [0.33, 1, 0.68, 1] } };

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const measure = () => {
      const inner = el.clientWidth - 2 * PAD;
      if (inner <= GAP) {
        setMetrics({ thumbW: 0, maxX: 0 });
        return;
      }
      const thumbW = (inner - GAP) / 2;
      const maxX = thumbW + GAP;
      setMetrics({ thumbW, maxX });
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    if (!metrics.maxX) return;
    const target = activeIndex === 0 ? 0 : metrics.maxX;
    if (prevMaxXRef.current === 0) {
      pillX.set(target);
    } else if (prevMaxXRef.current !== metrics.maxX) {
      pillX.stop();
      animate(pillX, target, springSnap);
    }
    prevMaxXRef.current = metrics.maxX;
  }, [metrics.maxX, activeIndex, pillX, springSnap]);

  const selectSegment = useCallback(
    (ix: number) => {
      if (isDisabled) return;
      onChange(options[ix].value);
      if (!metrics.maxX) return;
      pillX.stop();
      const target = ix === 0 ? 0 : metrics.maxX;
      animate(pillX, target, springSnap);
    },
    [isDisabled, metrics.maxX, onChange, options, pillX, springSnap]
  );

  const onDragEnd = useCallback(() => {
    setIsDragging(false);
    if (isDisabled) return;
    if (!metrics.maxX) return;
    const cx = pillX.get();
    const next = cx < metrics.maxX / 2 ? 0 : 1;
    const target = next === 0 ? 0 : metrics.maxX;
    pillX.stop();
    animate(pillX, target, springSnap);
    onChange(options[next].value);
  }, [isDisabled, metrics.maxX, onChange, options, pillX, springSnap]);

  const thumbWpx = metrics.thumbW > 0 ? `${metrics.thumbW}px` : "calc(50% - 2px)";

  const thumbVisual = isDragging ? { ...thumbChrome, ...thumbDragChrome } : thumbChrome;

  const thumbLift = reduceMotion ? { scale: 1, y: 0 } : isDragging ? { scale: 1.09, y: -2 } : { scale: 1, y: 0 };

  return (
    <motion.div
      ref={containerRef}
      className="auth-segmented-control"
      style={{
        position: "relative",
        width: "min(100% - 2rem, 320px)",
        minWidth: "min(300px, calc(100vw - 2rem))",
        maxWidth: 320,
        height: TRACK_OUTER_H,
        minHeight: TRACK_OUTER_H,
        marginLeft: "auto",
        marginRight: "auto",
        padding: PAD,
        borderRadius: 9999,
        transform: "translateZ(0)",
        opacity: isDisabled ? 0.52 : 1,
        pointerEvents: isDisabled ? "none" : "auto",
        ...trackChrome,
      }}
      initial={false}
      whileTap={reduceMotion || isDisabled ? undefined : { scale: 0.998 }}
      transition={reduceMotion ? { duration: 0.15 } : SNAP_SPRING}
      data-auth-segmented-disabled={isDisabled ? "" : undefined}
    >
      <Box
        position="absolute"
        inset={0}
        borderRadius="inherit"
        pointerEvents="none"
        zIndex={1}
        bg={trackSheen}
        style={{ mixBlendMode: "soft-light" }}
        aria-hidden
      />

      <Box
        position="absolute"
        inset={`${PAD}px`}
        borderRadius={9999}
        pointerEvents="none"
        zIndex={1}
        boxShadow="inset 0 1px 10px rgba(0, 0, 0, 0.1), inset 0 0 0 1px rgba(0, 0, 0, 0.05)"
        aria-hidden
      />

      <Box
        role="tablist"
        aria-label="Sign in or register"
        aria-orientation="horizontal"
        position="absolute"
        left={`${PAD}px`}
        top={`${PAD}px`}
        right={`${PAD}px`}
        h={`${INNER_H}px`}
        zIndex={3}
        pointerEvents="none"
      >
        <Box
          as="button"
          type="button"
          role="tab"
          aria-selected={activeIndex === 0}
          disabled={isDisabled}
          position="absolute"
          left={0}
          top={0}
          bottom={0}
          w={thumbWpx}
          minW={0}
          zIndex={activeIndex === 0 ? 3 : 5}
          display="flex"
          alignItems="center"
          justifyContent="center"
          lineHeight={1}
          border="none"
          bg="transparent"
          cursor={isDisabled ? "not-allowed" : "pointer"}
          outline="none"
          px={4}
          pointerEvents={isDisabled ? "none" : "auto"}
          className="auth-segmented-control__segment"
          onClick={() => selectSegment(0)}
          onKeyDown={(e: KeyboardEvent<HTMLButtonElement>) => {
            if (e.key === "ArrowRight") {
              e.preventDefault();
              selectSegment(1);
            }
          }}
        >
          <motion.span
            className="auth-segmented-control__label"
            variants={labelVariants}
            initial={false}
            animate={activeIndex === 0 ? "active" : "inactive"}
            whileHover={activeIndex === 0 ? undefined : "inactiveHover"}
            transition={labelTransition}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: "var(--font-graphik)",
              fontSize: "clamp(14px, 2.5vw, 15px)",
              lineHeight: 1,
              fontWeight: 600,
              letterSpacing: "-0.02em",
              userSelect: "none",
              pointerEvents: "none",
            }}
          >
            {options[0].label}
          </motion.span>
        </Box>

        <Box
          as="button"
          type="button"
          role="tab"
          aria-selected={activeIndex === 1}
          disabled={isDisabled}
          position="absolute"
          top={0}
          bottom={0}
          w={thumbWpx}
          minW={0}
          left={metrics.thumbW > 0 ? `${metrics.thumbW + GAP}px` : "calc(50% + 2px)"}
          zIndex={activeIndex === 1 ? 3 : 5}
          display="flex"
          alignItems="center"
          justifyContent="center"
          lineHeight={1}
          border="none"
          bg="transparent"
          cursor={isDisabled ? "not-allowed" : "pointer"}
          outline="none"
          px={4}
          pointerEvents={isDisabled ? "none" : "auto"}
          className="auth-segmented-control__segment"
          onClick={() => selectSegment(1)}
          onKeyDown={(e: KeyboardEvent<HTMLButtonElement>) => {
            if (e.key === "ArrowLeft") {
              e.preventDefault();
              selectSegment(0);
            }
          }}
        >
          <motion.span
            className="auth-segmented-control__label"
            variants={labelVariants}
            initial={false}
            animate={activeIndex === 1 ? "active" : "inactive"}
            whileHover={activeIndex === 1 ? undefined : "inactiveHover"}
            transition={labelTransition}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: "var(--font-graphik)",
              fontSize: "clamp(14px, 2.5vw, 15px)",
              lineHeight: 1,
              fontWeight: 600,
              letterSpacing: "-0.02em",
              userSelect: "none",
              pointerEvents: "none",
            }}
          >
            {options[1].label}
          </motion.span>
        </Box>
      </Box>

      {/* Outer: drag + `x` only — keeps layout box aligned with labels after drag */}
      <motion.div
        aria-hidden
        drag={metrics.maxX > 0 && !reduceMotion && !isDisabled ? "x" : false}
        dragConstraints={{ left: 0, right: metrics.maxX }}
        dragElastic={DRAG_ELASTIC}
        dragMomentum={false}
        dragTransition={{ bounceStiffness: 500, bounceDamping: 35 }}
        style={{
          x: pillX,
          position: "absolute",
          left: PAD,
          top: PAD,
          width: thumbWpx,
          height: INNER_H,
          zIndex: isDragging ? 6 : 4,
          willChange: "transform",
          touchAction: "none",
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
        {/* Inner: glass + magnify — scale/y never compose with drag translateX on the same node */}
        <motion.div
          className="auth-segmented-control__thumb"
          initial={false}
          animate={thumbLift}
          transition={reduceMotion ? { duration: 0.15 } : THUMB_POP_SPRING}
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: 9999,
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
