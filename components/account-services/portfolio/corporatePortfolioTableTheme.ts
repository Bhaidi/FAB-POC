import { corpTableDark, corpTableLight } from "@/lib/fabTheme/corpTablePalettes";

export type CorpTableTheme = typeof corpTableDark | typeof corpTableLight;

export { corpTableDark, corpTableLight };

/**
 * Prefer `useFabTokens().corpTable` so dark/light match the dashboard.
 * Exported for tests and non-React call sites that default to light.
 */
export const corpTable = corpTableLight;

export function corpChromeTypographyFrom(c: CorpTableTheme) {
  return {
    fontFamily: c.chromeFontFamily,
    fontWeight: c.chromeFontWeight,
    fontSize: c.chromeFontSize,
    letterSpacing: c.chromeLetterSpacing,
    color: c.chromeText,
  } as const;
}

/** @deprecated Prefer `corpChromeTypographyFrom(useFabTokens().corpTable)` */
export const corpChromeTypography = corpChromeTypographyFrom(corpTableLight);
