"use client";

import { useEffect, useRef, useState } from "react";
import { useMotionValue, useReducedMotion } from "framer-motion";

function formatMmSs(wholeSecondsRemaining: number): string {
  const s = Math.max(0, Math.floor(wholeSecondsRemaining));
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${String(m).padStart(2, "0")}:${String(r).padStart(2, "0")}`;
}

/** Whole seconds still counting down (stable display, smooth ring). */
function wholeSecondsFromMs(leftMs: number): number {
  if (leftMs <= 0) return 0;
  return Math.floor((leftMs + 999) / 1000);
}

/**
 * Smooth countdown for Approve Sign-In — `progress` motion value updates every frame for ring sync;
 * `displaySeconds` updates only when the visible second changes (low React churn).
 */
export function useVerificationCountdown(
  totalSeconds: number,
  resetKey: number,
  onExpire: () => void
) {
  const reduceMotion = useReducedMotion();
  const totalMs = Math.max(0, totalSeconds * 1000);
  const progress = useMotionValue(1);
  const [displaySeconds, setDisplaySeconds] = useState(totalSeconds);
  const [expired, setExpired] = useState(false);
  const onExpireRef = useRef(onExpire);
  const firedRef = useRef(false);
  onExpireRef.current = onExpire;

  useEffect(() => {
    firedRef.current = false;
    setExpired(false);
    progress.set(1);
    setDisplaySeconds(totalSeconds);

    if (totalMs <= 0) {
      setExpired(true);
      if (!firedRef.current) {
        firedRef.current = true;
        queueMicrotask(() => onExpireRef.current());
      }
      return;
    }

    if (reduceMotion) {
      let leftMs = totalMs;
      progress.set(1);
      setDisplaySeconds(wholeSecondsFromMs(leftMs));
      const id = window.setInterval(() => {
        leftMs = Math.max(0, leftMs - 1000);
        const p = totalMs > 0 ? leftMs / totalMs : 0;
        progress.set(p);
        setDisplaySeconds(wholeSecondsFromMs(leftMs));
        if (leftMs <= 0) {
          window.clearInterval(id);
          setExpired(true);
          if (!firedRef.current) {
            firedRef.current = true;
            queueMicrotask(() => onExpireRef.current());
          }
        }
      }, 1000);
      return () => window.clearInterval(id);
    }

    const deadline = Date.now() + totalMs;
    let raf = 0;

    const tick = () => {
      const left = Math.max(0, deadline - Date.now());
      const p = totalMs > 0 ? left / totalMs : 0;
      progress.set(p);

      const nextWhole = wholeSecondsFromMs(left);
      setDisplaySeconds((prev) => (prev !== nextWhole ? nextWhole : prev));

      if (left <= 0) {
        setExpired(true);
        if (!firedRef.current) {
          firedRef.current = true;
          queueMicrotask(() => onExpireRef.current());
        }
        return;
      }
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [resetKey, totalMs, totalSeconds, reduceMotion, progress]);

  const urgent = !expired && displaySeconds <= 10;
  const mmSs = formatMmSs(displaySeconds);

  return { progress, displaySeconds, mmSs, expired, urgent, totalSeconds };
}
