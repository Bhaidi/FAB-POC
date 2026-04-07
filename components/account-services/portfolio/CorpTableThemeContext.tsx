"use client";

import { createContext, useContext, type ReactNode } from "react";
import { corpTableLight, type CorpTableTheme } from "@/components/account-services/portfolio/corporatePortfolioTableTheme";

const CorpTableThemeContext = createContext<CorpTableTheme>(corpTableLight);

export function CorpTableThemeProvider({ value, children }: { value: CorpTableTheme; children: ReactNode }) {
  return <CorpTableThemeContext.Provider value={value}>{children}</CorpTableThemeContext.Provider>;
}

export function useCorpTableTheme(): CorpTableTheme {
  return useContext(CorpTableThemeContext);
}
