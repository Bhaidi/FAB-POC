"use client";

import { useEffect } from "react";

/** Matches dashboard gradient end (`#000107`). */
const BG = "#000107";

/**
 * Dashboard is scrollable (unlike auth). Ensures html/body match the dark canvas so no
 * neutral Chakra page color shows below the viewport when content is short or while scrolling.
 */
export function useDashboardDocumentCanvas() {
  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    const prev = {
      htmlBg: html.style.backgroundColor,
      bodyBg: body.style.backgroundColor,
      htmlMinH: html.style.minHeight,
      bodyMinH: body.style.minHeight,
    };
    html.style.backgroundColor = BG;
    body.style.backgroundColor = BG;
    html.style.minHeight = "100%";
    body.style.minHeight = "100%";
    return () => {
      html.style.backgroundColor = prev.htmlBg;
      body.style.backgroundColor = prev.bodyBg;
      html.style.minHeight = prev.htmlMinH;
      body.style.minHeight = prev.bodyMinH;
    };
  }, []);
}
