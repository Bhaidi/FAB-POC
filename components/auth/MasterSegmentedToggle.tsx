"use client";

import { AuthSegmentedControl } from "@/components/auth/AuthSegmentedControl";

export type AuthPageMode = "login" | "register";

export type MasterSegmentedToggleProps = {
  value: AuthPageMode;
  onChange: (value: AuthPageMode) => void;
  isDisabled?: boolean;
};

const LOGIN_REGISTER_OPTIONS = [
  { value: "login" as const, label: "Login" },
  { value: "register" as const, label: "Register" },
] as const;

/**
 * Page-level Login / Register switch — same segmented control + theme pipeline as account services.
 */
export function MasterSegmentedToggle({ value, onChange, isDisabled }: MasterSegmentedToggleProps) {
  return (
    <AuthSegmentedControl
      options={LOGIN_REGISTER_OPTIONS}
      value={value}
      onChange={onChange}
      isDisabled={isDisabled}
      surface="standard"
      layout="auth"
      ariaLabel="Sign in or register"
    />
  );
}
