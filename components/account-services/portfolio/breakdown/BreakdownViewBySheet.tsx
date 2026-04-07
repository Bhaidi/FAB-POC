"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Check, ChevronDown } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useFabTokens } from "@/components/theme/FabTokensContext";

export type BreakdownViewByOption = {
  id: string;
  label: string;
};

const SNAP_SPRING = { type: "spring" as const, stiffness: 380, damping: 34, mass: 0.85 };
const EASE_OUT = [0.33, 1, 0.68, 1] as const;

type BreakdownViewBySheetProps = {
  options: BreakdownViewByOption[];
  value: string;
  onChange: (id: string) => void;
  /** When `value` matches this id, the closed trigger uses muted label color (default dimension). */
  defaultOptionId?: string;
  labelText?: string;
  "aria-label"?: string;
};

export function BreakdownViewBySheet({
  options,
  value,
  onChange,
  defaultOptionId,
  labelText = "View by:",
  "aria-label": ariaLabel = "Breakdown dimension",
}: BreakdownViewBySheetProps) {
  const { authSegmentedControlTheme: seg } = useFabTokens();
  const { track, trackSheen, trackInnerWellShadow, thumb, label: labelTheme } = seg;
  const reduceMotion = useReducedMotion() === true;
  const rootRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);

  const active = options.find((o) => o.id === value) ?? options[0];
  const activeLabel = active?.label ?? "—";

  const isDefaultSelection =
    defaultOptionId != null && defaultOptionId !== "" && value === defaultOptionId;
  const triggerLabelColor = isDefaultSelection ? labelTheme.inactive : labelTheme.active;
  const chevronColor = isDefaultSelection ? labelTheme.inactive : labelTheme.inactiveHover;

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, close]);

  /** Capture phase so we don't run before an inside `click` commits (fixes selection not applying). */
  useEffect(() => {
    if (!open) return;
    const onDocClick = (e: MouseEvent) => {
      const t = e.target;
      if (t instanceof Node && rootRef.current?.contains(t)) return;
      close();
    };
    document.addEventListener("click", onDocClick, true);
    return () => document.removeEventListener("click", onDocClick, true);
  }, [open, close]);

  const select = useCallback(
    (id: string) => {
      if (id === value) {
        close();
        return;
      }
      onChange(id);
      close();
    },
    [value, onChange, close],
  );

  const springOpen = reduceMotion ? { duration: 0.15, ease: EASE_OUT } : SNAP_SPRING;

  const menuWidthClass = "min-w-[10.5rem] w-max max-w-[min(calc(100vw-2rem),17rem)]";

  return (
    <div ref={rootRef} className="relative flex min-w-0 max-w-full flex-wrap items-center gap-x-2 gap-y-1.5">
      <span
        className="shrink-0 font-[family-name:var(--font-graphik)] text-[12px] font-semibold leading-snug tracking-[-0.02em]"
        style={{ color: labelTheme.inactive }}
      >
        {labelText}
      </span>
      <div className="relative min-w-0 max-w-full">
        <motion.button
          type="button"
          aria-label={`${ariaLabel}: ${activeLabel}`}
          aria-haspopup="listbox"
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
          initial={false}
          whileTap={reduceMotion ? undefined : { scale: 0.998 }}
          transition={springOpen}
          className="group relative inline-flex max-w-full items-center gap-1 overflow-visible rounded-[8px] py-1 pl-2 pr-1 text-left"
          style={{ ...thumb }}
        >
          <span
            className="relative z-[1] min-w-0 max-w-[min(100%,14rem)] whitespace-normal break-words font-[family-name:var(--font-graphik)] text-[12px] font-semibold leading-snug tracking-[-0.02em]"
            style={{ color: triggerLabelColor }}
          >
            {activeLabel}
          </span>
          <motion.span
            className="relative z-[1] inline-flex shrink-0 self-center"
            style={{ color: chevronColor }}
            animate={{ rotate: open ? 180 : 0 }}
            transition={springOpen}
          >
            <ChevronDown className="h-3 w-3" strokeWidth={2} aria-hidden />
          </motion.span>
        </motion.button>

        <AnimatePresence>
          {open ? (
            <motion.div
              key="viewby-menu-wrap"
              className={`absolute left-full top-0 z-50 ml-1.5 ${menuWidthClass}`}
              initial={reduceMotion ? { opacity: 0 } : { opacity: 0, x: -6, scale: 0.98 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={reduceMotion ? { opacity: 0 } : { opacity: 0, x: -4, scale: 0.99 }}
              transition={springOpen}
              style={{ transformOrigin: "left center" }}
            >
              <motion.div
                role="listbox"
                aria-label={ariaLabel}
                className={`relative max-h-[min(320px,55vh)] overflow-x-hidden overflow-y-auto rounded-[10px] p-1 ${menuWidthClass}`}
                style={{ ...track }}
                initial={false}
              >
                <div
                  className="pointer-events-none absolute inset-0 rounded-[inherit]"
                  style={{
                    background: trackSheen,
                    mixBlendMode: "soft-light",
                  }}
                  aria-hidden
                />
                <div
                  className="pointer-events-none absolute inset-[4px] rounded-[7px]"
                  style={{
                    boxShadow:
                      trackInnerWellShadow ??
                      "inset 0 1px 8px rgba(0, 0, 0, 0.1), inset 0 0 0 1px rgba(0, 0, 0, 0.05)",
                  }}
                  aria-hidden
                />
                <div className="relative z-[1]">
                  {options.map((opt, index) => {
                    const selected = opt.id === value;
                    const showDivider = index > 0;
                    return (
                      <div key={opt.id}>
                        {showDivider ? (
                          <div className="mx-1.5 h-px bg-white/[0.07]" aria-hidden />
                        ) : null}
                        <motion.button
                          type="button"
                          role="option"
                          aria-selected={selected}
                          onClick={() => select(opt.id)}
                          initial={reduceMotion ? false : { opacity: 0, x: 4 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{
                            opacity: {
                              ...(reduceMotion
                                ? { type: "tween" as const, duration: 0.1, ease: EASE_OUT }
                                : SNAP_SPRING),
                              delay: reduceMotion ? 0 : 0.03 + index * 0.028,
                            },
                            x: {
                              ...(reduceMotion
                                ? { type: "tween" as const, duration: 0.1, ease: EASE_OUT }
                                : SNAP_SPRING),
                              delay: reduceMotion ? 0 : 0.03 + index * 0.028,
                            },
                          }}
                          whileHover={
                            reduceMotion || selected
                              ? undefined
                              : {
                                  backgroundColor: "rgba(255, 255, 255, 0.05)",
                                  color: labelTheme.inactiveHover,
                                }
                          }
                          whileTap={reduceMotion ? undefined : { scale: 0.988 }}
                          className="flex w-full items-start justify-between gap-2 rounded-[7px] px-2 py-1.5 text-left font-[family-name:var(--font-graphik)] outline-none"
                          style={
                            selected
                              ? {
                                  ...thumb,
                                  fontSize: "12px",
                                  lineHeight: 1.35,
                                  fontWeight: 600,
                                  letterSpacing: "-0.02em",
                                  color: labelTheme.active,
                                }
                              : {
                                  fontSize: "12px",
                                  lineHeight: 1.35,
                                  fontWeight: 600,
                                  letterSpacing: "-0.02em",
                                  color: labelTheme.inactive,
                                  backgroundColor: "transparent",
                                  border: "1px solid transparent",
                                }
                          }
                        >
                          <span className="min-w-0 flex-1 whitespace-normal break-words pr-0.5">
                            {opt.label}
                          </span>
                          {selected ? (
                            <Check
                              className="mt-0.5 h-3 w-3 shrink-0"
                              style={{ color: labelTheme.active }}
                              strokeWidth={2.5}
                              aria-hidden
                            />
                          ) : null}
                        </motion.button>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </div>
  );
}
