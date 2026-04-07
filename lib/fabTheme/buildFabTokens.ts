import type { ColorMode } from "@chakra-ui/react";
import {
  authChallengeCardDark,
  authChallengeCardLight,
  authColorsDark,
  authColorsLight,
  authColumnTypographyDark,
  authColumnTypographyLight,
  authHeroTypographyDark,
  authHeroTypographyLight,
  authShadowDark,
  authShadowLight,
} from "@/lib/fabTheme/authPalettes";
import {
  authSegmentedControlCanvasDark,
  authSegmentedControlThemeDark,
  authSegmentedControlThemeLight,
} from "@/lib/fabTheme/authSegmentedPalettes";
import { corpTableDark, corpTableLight } from "@/lib/fabTheme/corpTablePalettes";
import {
  dashEffectsDark,
  dashEffectsLight,
  dashGradientsDark,
  dashGradientsLight,
  dashPrimaryNavChromeDark,
  dashPrimaryNavChromeLight,
  dashShadowExtensionDark,
  dashShadowExtensionLight,
  dashSurfaceDark,
  dashSurfaceLight,
  documentCanvasBg,
  sidebarNavTooltipDark,
  sidebarNavTooltipLight,
} from "@/lib/fabTheme/dashboardPalettes";
import { financialOverviewShellDark, financialOverviewShellLight } from "@/lib/fabTheme/financialOverviewPalettes";
import {
  portfolioOperationalSurfaceSxDark,
  portfolioOperationalSurfaceSxLight,
  portfolioSectionHeadingSxDark,
  portfolioSectionHeadingSxLight,
} from "@/lib/fabTheme/portfolioPalettes";

export type FabTokens = ReturnType<typeof buildFabTokens>;

export function buildFabTokens(colorMode: ColorMode) {
  const dark = colorMode === "dark";
  const authColors = dark ? authColorsDark : authColorsLight;
  const authShadow = { ...(dark ? authShadowDark : authShadowLight) };
  const dashColors = { ...authColors, ...(dark ? dashSurfaceDark : dashSurfaceLight) };
  const dashShadow = { ...authShadow, ...(dark ? dashShadowExtensionDark : dashShadowExtensionLight) };

  return {
    authColors,
    authShadow,
    authChallengeCard: dark ? authChallengeCardDark : authChallengeCardLight,
    authHeroTypography: dark ? authHeroTypographyDark : authHeroTypographyLight,
    authColumnTypography: dark ? authColumnTypographyDark : authColumnTypographyLight,
    authSegmentedControlTheme: dark ? authSegmentedControlThemeDark : authSegmentedControlThemeLight,
    /** In-page capsule (e.g. portfolio module) — light mode matches standard light chrome. */
    authSegmentedControlCanvas: dark ? authSegmentedControlCanvasDark : authSegmentedControlThemeLight,
    dashGradients: dark ? dashGradientsDark : dashGradientsLight,
    dashEffects: dark ? dashEffectsDark : dashEffectsLight,
    dashColors,
    dashShadow,
    dashPrimaryNavChrome: dark ? dashPrimaryNavChromeDark : dashPrimaryNavChromeLight,
    corpTable: dark ? corpTableDark : corpTableLight,
    portfolioSectionHeadingSx: dark ? portfolioSectionHeadingSxDark : portfolioSectionHeadingSxLight,
    portfolioOperationalSurfaceSx: dark ? portfolioOperationalSurfaceSxDark : portfolioOperationalSurfaceSxLight,
    financialOverviewShell: dark ? financialOverviewShellDark : financialOverviewShellLight,
    sidebarNavTooltip: dark ? sidebarNavTooltipDark : sidebarNavTooltipLight,
    documentCanvasBg: dark ? documentCanvasBg.dark : documentCanvasBg.light,
  };
}
