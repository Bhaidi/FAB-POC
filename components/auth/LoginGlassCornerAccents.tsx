"use client";

import { GlassCornerRim } from "@/components/ui/GlassCornerRim";
import { glassCornerRimPaletteAuth } from "@/lib/fabTheme/glassCornerRim";

type LoginGlassCornerAccentsProps = {
  radius: string;
};

/** Login credential fields — TL/BR rim accents; see {@link GlassCornerRim}. */
export function LoginGlassCornerAccents({ radius }: LoginGlassCornerAccentsProps) {
  return <GlassCornerRim radius={radius} palette={glassCornerRimPaletteAuth} />;
}
