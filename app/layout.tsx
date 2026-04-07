import type { Metadata } from "next";
import localFont from "next/font/local";
import { ChakraColorModeScript } from "@/components/ChakraColorModeScript";
import { Providers } from "@/components/providers";
import "./globals.css";

/**
 * Graphik (Commercial Type) — self-hosted under public/fonts.
 * We only ship Thin + Regular files here; 500/600 reuse Regular until Medium/Semibold are added.
 */
const graphik = localFont({
  src: [
    { path: "../public/fonts/Graphik-Thin.ttf", weight: "300", style: "normal" },
    { path: "../public/fonts/Graphik-Regular.ttf", weight: "400", style: "normal" },
    { path: "../public/fonts/Graphik-Regular.ttf", weight: "500", style: "normal" },
    { path: "../public/fonts/Graphik-Regular.ttf", weight: "600", style: "normal" },
  ],
  variable: "--font-graphik",
  display: "swap",
  preload: true,
  /** No Arial/system metrics fallback — stack is Graphik only (see globals.css + theme). */
  adjustFontFallback: false,
});

export const metadata: Metadata = {
  title: "FAB Access Portal",
  description: "Corporate portal frontend",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={graphik.variable}>
      <body className={graphik.className}>
        <ChakraColorModeScript />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
