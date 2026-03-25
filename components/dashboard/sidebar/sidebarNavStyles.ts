/** Height collapse — 200–250ms, ease-out feel (AWS / VS Code–adjacent). */
export const SIDEBAR_ACCORDION_ENTER_MS = 0.23;
export const SIDEBAR_ACCORDION_EXIT_MS = 0.2;

/** Ease-out for expand; slightly snappy exit. */
export const SIDEBAR_EASE_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1];
export const SIDEBAR_EASE_IN: [number, number, number, number] = [0.4, 0, 1, 1];

export const sidebarCollapseTransition = {
  enter: { duration: SIDEBAR_ACCORDION_ENTER_MS, ease: SIDEBAR_EASE_OUT },
  exit: { duration: SIDEBAR_ACCORDION_EXIT_MS, ease: SIDEBAR_EASE_IN },
} as const;

/** Staggered L3 item motion */
export const SIDEBAR_L3_STAGGER_MS = 0.03;
export const SIDEBAR_L3_ITEM_DURATION = 0.24;
export const SIDEBAR_L3_ITEM_EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];
