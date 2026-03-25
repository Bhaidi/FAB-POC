"use client";

import { AuthSegmentedControl } from "@/components/auth/AuthSegmentedControl";

export type AuthPageMode = "login" | "register";

export type MasterSegmentedToggleProps = {
  value: AuthPageMode;
  onChange: (value: AuthPageMode) => void;
  isDisabled?: boolean;
};

/**
 * Page-level Login / Register switch — visuals live in `authSegmentedControlTheme.ts` only.
 */
export function MasterSegmentedToggle({ value, onChange, isDisabled }: MasterSegmentedToggleProps) {
  return (
    <AuthSegmentedControl
      options={[
        { value: "login", label: "Login" },
        { value: "register", label: "Register" },
      ]}
      value={value}
      onChange={onChange}
      isDisabled={isDisabled}
    />
  );
}
