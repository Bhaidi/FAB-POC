"use client";

import {
  createContext,
  useContext,
  useMemo,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react";

type AuthChromeContextValue = {
  segmentedToggleVisible: boolean;
  setSegmentedToggleVisible: Dispatch<SetStateAction<boolean>>;
  /** True while login is submitting — disables segmented control + extra chrome. */
  chromeInteractionLocked: boolean;
  setChromeInteractionLocked: Dispatch<SetStateAction<boolean>>;
};

const AuthChromeContext = createContext<AuthChromeContextValue | null>(null);

export function AuthChromeProvider({ children }: { children: ReactNode }) {
  const [segmentedToggleVisible, setSegmentedToggleVisible] = useState(true);
  const [chromeInteractionLocked, setChromeInteractionLocked] = useState(false);
  const value = useMemo(
    () => ({
      segmentedToggleVisible,
      setSegmentedToggleVisible,
      chromeInteractionLocked,
      setChromeInteractionLocked,
    }),
    [segmentedToggleVisible, chromeInteractionLocked]
  );
  return <AuthChromeContext.Provider value={value}>{children}</AuthChromeContext.Provider>;
}

export function useAuthChrome(): AuthChromeContextValue {
  const ctx = useContext(AuthChromeContext);
  if (!ctx) {
    throw new Error("useAuthChrome must be used within AuthChromeProvider");
  }
  return ctx;
}

/** When no provider, segmented toggle defaults to visible. */
export function useOptionalAuthChrome(): AuthChromeContextValue | null {
  return useContext(AuthChromeContext);
}
