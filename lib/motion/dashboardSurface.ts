import { AUTH_CONTENT_EASE_OUT } from "@/lib/motion/authContentTransition";

/** Same easing as auth mode transitions — dashboard “surface ready” uses this for a single rhythm. */
export const DASH_SURFACE_EASE = AUTH_CONTENT_EASE_OUT;

export function dashSurfaceRevealTransition(reduceMotion: boolean | null | undefined): {
  duration: number;
  ease?: readonly number[];
} {
  const rm = reduceMotion === true;
  return rm ? { duration: 0.12 } : { duration: 0.38, ease: DASH_SURFACE_EASE };
}
