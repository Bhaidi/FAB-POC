"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  type ReactNode,
} from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";

function clamp(v: number, min: number, max: number) {
  return Math.max(min, Math.min(max, v));
}

type StageMotionValues = {
  logoX: MotionValue<number>;
  logoY: MotionValue<number>;
  toggleX: MotionValue<number>;
  toggleY: MotionValue<number>;
  heroX: MotionValue<number>;
  heroY: MotionValue<number>;
  rightX: MotionValue<number>;
  rightY: MotionValue<number>;
  verifyX: MotionValue<number>;
  verifyY: MotionValue<number>;
};

const AuthStageMotionContext = createContext<StageMotionValues | null>(null);

const IDLE_FLOAT_DURATION_S = 9;
const IDLE_FLOAT_EASE: [number, number, number, number] = [0.42, 0, 0.58, 1];

/**
 * Pointer-normalized parallax (springs) for auth chrome + content groups.
 * Transform + opacity only; respects reduced motion (no pointer tracking).
 */
export function AuthStageMotionProvider({ children }: { children: ReactNode }) {
  const reduceMotion = useReducedMotion();
  const normX = useMotionValue(0);
  const normY = useMotionValue(0);

  useEffect(() => {
    if (reduceMotion) return;
    const onMove = (e: PointerEvent) => {
      const w = window.innerWidth || 1;
      const h = window.innerHeight || 1;
      normX.set((e.clientX / w - 0.5) * 2);
      normY.set((e.clientY / h - 0.5) * 2);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [reduceMotion, normX, normY]);

  const springOpts = reduceMotion
    ? { stiffness: 500, damping: 50, mass: 0.2 }
    : { stiffness: 150, damping: 28, mass: 0.42 };

  const smoothX = useSpring(normX, springOpts);
  const smoothY = useSpring(normY, springOpts);

  const logoX = useTransform(smoothX, (v) => clamp(v * 2, -2, 2));
  const logoY = useTransform(smoothY, (v) => clamp(v * 2, -2, 2));
  const toggleX = useTransform(smoothX, (v) => clamp(v * 2, -2, 2));
  const toggleY = useTransform(smoothY, (v) => clamp(v * 2, -2, 2));
  const heroX = useTransform(smoothX, (v) => clamp(v * 4, -4, 4));
  const heroY = useTransform(smoothY, (v) => clamp(v * 3, -4, 4));
  const rightX = useTransform(smoothX, (v) => clamp(v * 4, -4, 4));
  const rightY = useTransform(smoothY, (v) => clamp(v * 3, -4, 4));
  const verifyX = useTransform(smoothX, (v) => clamp(v * 3, -3, 3));
  const verifyY = useTransform(smoothY, (v) => clamp(v * 2.5, -3, 3));

  const value = useMemo(
    () => ({
      logoX,
      logoY,
      toggleX,
      toggleY,
      heroX,
      heroY,
      rightX,
      rightY,
      verifyX,
      verifyY,
    }),
    [logoX, logoY, toggleX, toggleY, heroX, heroY, rightX, rightY, verifyX, verifyY]
  );

  return (
    <AuthStageMotionContext.Provider value={value}>{children}</AuthStageMotionContext.Provider>
  );
}

export function useOptionalAuthStageMotion(): StageMotionValues | null {
  return useContext(AuthStageMotionContext);
}

export type AuthParallaxRole = "logo" | "toggle" | "hero" | "right" | "verify";

type AuthParallaxLayerProps = {
  role: AuthParallaxRole;
  /** Ultra-subtle vertical idle loop (hero / right / verify only). */
  idleFloat?: boolean;
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
};

function pickMotion(role: AuthParallaxRole, ctx: StageMotionValues) {
  switch (role) {
    case "logo":
      return { x: ctx.logoX, y: ctx.logoY };
    case "toggle":
      return { x: ctx.toggleX, y: ctx.toggleY };
    case "hero":
      return { x: ctx.heroX, y: ctx.heroY };
    case "right":
      return { x: ctx.rightX, y: ctx.rightY };
    case "verify":
      return { x: ctx.verifyX, y: ctx.verifyY };
  }
}

/**
 * Applies pointer parallax (spring-smoothed) to a content group; optional idle float.
 */
export function AuthParallaxLayer({
  role,
  idleFloat = false,
  children,
  className,
  style,
}: AuthParallaxLayerProps) {
  const ctx = useOptionalAuthStageMotion();
  const reduceMotion = useReducedMotion();

  if (!ctx) {
    return <>{children}</>;
  }

  const { x, y } = pickMotion(role, ctx);

  const parallax = (
    <motion.div
      className={className}
      style={{
        ...style,
        x,
        y,
        willChange: reduceMotion ? undefined : "transform",
      }}
    >
      {children}
    </motion.div>
  );

  if (idleFloat && !reduceMotion && (role === "hero" || role === "right" || role === "verify")) {
    return (
      <motion.div
        style={{ willChange: "transform" }}
        animate={{ y: [0, -3, 0] }}
        transition={{
          duration: IDLE_FLOAT_DURATION_S,
          repeat: Infinity,
          ease: IDLE_FLOAT_EASE,
        }}
      >
        {parallax}
      </motion.div>
    );
  }

  return parallax;
}
