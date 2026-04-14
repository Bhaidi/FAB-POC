"use client";

import { useCallback, useEffect, type ReactNode } from "react";
import { useColorMode } from "@chakra-ui/react";

const ALLOW_SCROLL_X = "[data-auth-allow-scroll-x]";

/** Walk up DOM; true if this node can still scroll vertically in the wheel direction. */
function canConsumeVerticalWheel(target: EventTarget | null, deltaY: number): boolean {
  let el = target as HTMLElement | null;
  while (el && el !== document.documentElement) {
    const style = window.getComputedStyle(el);
    const oy = style.overflowY;
    const scrollable =
      (oy === "auto" || oy === "scroll" || oy === "overlay") && el.scrollHeight > el.clientHeight + 2;
    if (scrollable) {
      const { scrollTop, scrollHeight, clientHeight } = el;
      const atBottom = scrollTop + clientHeight >= scrollHeight - 2;
      const atTop = scrollTop <= 2;
      if (deltaY > 0 && !atBottom) return true;
      if (deltaY < 0 && !atTop) return true;
    }
    el = el.parentElement;
  }
  return false;
}

function isHorizontalWheelDominant(e: WheelEvent): boolean {
  return Math.abs(e.deltaX) > Math.abs(e.deltaY);
}

function insideAllowScrollX(target: EventTarget | null): boolean {
  return !!(target instanceof Node && (target as Element).closest(ALLOW_SCROLL_X));
}

/**
 * Locks vertical page scroll on auth routes (fixed full-screen stage).
 * Horizontal scroll inside `[data-auth-allow-scroll-x]` is preserved (register steps).
 */
export function AuthScrollLock({ children }: { children: ReactNode }) {
  const { colorMode } = useColorMode();

  const onWheel = useCallback((e: WheelEvent) => {
    if (canConsumeVerticalWheel(e.target, e.deltaY)) return;

    if (insideAllowScrollX(e.target) && isHorizontalWheelDominant(e)) return;

    e.preventDefault();
  }, []);

  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;

    const prev = {
      htmlOverflow: html.style.overflow,
      htmlHeight: html.style.height,
      htmlMinHeight: html.style.minHeight,
      htmlOverscroll: html.style.overscrollBehavior,
      bodyOverflow: body.style.overflow,
      bodyHeight: body.style.height,
      bodyMinHeight: body.style.minHeight,
      bodyOverscroll: body.style.overscrollBehavior,
      bodyBg: body.style.backgroundColor,
    };

    html.style.overflow = "hidden";
    html.style.height = "100%";
    html.style.minHeight = "100%";
    html.style.overscrollBehavior = "none";
    body.style.overflow = "hidden";
    body.style.height = "100%";
    body.style.minHeight = "100%";
    body.style.overscrollBehavior = "none";
    /** Match theme so overscroll / gaps don’t flash wrong color over the fixed backdrop */
    body.style.backgroundColor = colorMode === "dark" ? "#060606" : "#f5f7fb";

    window.addEventListener("wheel", onWheel, { passive: false, capture: true });

    return () => {
      window.removeEventListener("wheel", onWheel, true);
      html.style.overflow = prev.htmlOverflow;
      html.style.height = prev.htmlHeight;
      html.style.minHeight = prev.htmlMinHeight;
      html.style.overscrollBehavior = prev.htmlOverscroll;
      body.style.overflow = prev.bodyOverflow;
      body.style.height = prev.bodyHeight;
      body.style.minHeight = prev.bodyMinHeight;
      body.style.overscrollBehavior = prev.bodyOverscroll;
      body.style.backgroundColor = prev.bodyBg;
    };
  }, [onWheel, colorMode]);

  return (
    <div className="auth-stage-root">
      {children}
    </div>
  );
}
