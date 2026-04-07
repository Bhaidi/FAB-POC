"use client";

import { useEffect } from "react";
import { useColorMode } from "@chakra-ui/react";
import { dashSurfaceDark } from "@/lib/fabTheme/dashboardPalettes";

/** Matches dashboard light canvas (scroll gutter). */
const LIGHT_DOCUMENT_BG = "#F2F2F3";

/**
 * Dashboard is scrollable (unlike auth). Keeps html/body in sync with the active canvas so no
 * foreign color shows below the viewport when content is short or while scrolling.
 */
export function useDashboardDocumentCanvas() {
  const { colorMode } = useColorMode();

  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    const bg = colorMode === "dark" ? dashSurfaceDark.canvas : LIGHT_DOCUMENT_BG;
    const prev = {
      htmlBg: html.style.backgroundColor,
      bodyBg: body.style.backgroundColor,
      htmlMinH: html.style.minHeight,
      bodyMinH: body.style.minHeight,
    };
    html.style.backgroundColor = bg;
    body.style.backgroundColor = bg;
    html.style.minHeight = "100%";
    body.style.minHeight = "100%";
    return () => {
      html.style.backgroundColor = prev.htmlBg;
      body.style.backgroundColor = prev.bodyBg;
      html.style.minHeight = prev.htmlMinH;
      body.style.minHeight = prev.bodyMinH;
    };
  }, [colorMode]);
}
