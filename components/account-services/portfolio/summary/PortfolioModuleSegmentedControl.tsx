"use client";

import { AuthSegmentedControl } from "@/components/auth/AuthSegmentedControl";
import type { AuthSegmentedControlSurface } from "@/components/auth/AuthSegmentedControl";
import type { PortfolioModuleTab } from "@/data/portfolioSummaryTypes";

const OPTIONS = [
  { value: "portfolio" as const, label: "Portfolio" },
  { value: "accounts" as const, label: "Accounts" },
  { value: "deposits" as const, label: "Deposits" },
  { value: "loans" as const, label: "Loans" },
] as const;

export type PortfolioModuleSegmentedControlProps = {
  value: PortfolioModuleTab;
  onChange: (value: PortfolioModuleTab) => void;
  isDisabled?: boolean;
  /**
   * `canvas` — same control as login/register, tuned for in-page headers (see `authSegmentedControlCanvas` in theme).
   * `standard` — full login-style capsule (rare; e.g. previews).
   */
  surface?: AuthSegmentedControlSurface;
};

/**
 * Portfolio / Accounts / Deposits / Loans — reuses `AuthSegmentedControl` with global light/dark tokens.
 */
export function PortfolioModuleSegmentedControl({
  value,
  onChange,
  isDisabled,
  surface = "canvas",
}: PortfolioModuleSegmentedControlProps) {
  return (
    <AuthSegmentedControl
      options={OPTIONS}
      value={value}
      onChange={onChange}
      isDisabled={isDisabled}
      surface={surface}
      layout="toolbar"
      ariaLabel="Portfolio module"
    />
  );
}
