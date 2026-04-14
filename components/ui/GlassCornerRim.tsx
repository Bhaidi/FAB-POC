"use client";

import { Box } from "@chakra-ui/react";
import { useId } from "react";
import { type GlassCornerRimPalette, parseGlassCornerRadiusPx } from "@/lib/fabTheme/glassCornerRim";

export type GlassCornerRimProps = {
  /** CSS radius string, e.g. `24px` — must match the host `border-radius`. */
  radius: string;
  palette: GlassCornerRimPalette;
  /** Matches host border width for stroke centerline alignment (default `1`). */
  borderWidthPx?: number;
  zIndex?: number;
};

const ARC_STROKE_MASKED_PX = 1.05;
const ARC_STROKE_CORE_PX = 0.55;

function pathTopLeftQuarterArc(r: number, borderWidthPx: number): string {
  const inset = borderWidthPx / 2;
  const ra = r - inset;
  if (ra <= 0) {
    return `M ${r} 0 A ${r} ${r} 0 0 1 0 ${r}`;
  }
  return `M ${r} ${inset} A ${ra} ${ra} 0 0 1 ${inset} ${r}`;
}

function CornerStops({ palette }: { palette: GlassCornerRimPalette }) {
  const { base, soft, med, peak } = palette;
  return (
    <>
      <stop offset="0%" stopColor={base} />
      <stop offset="8%" stopColor={base} />
      <stop offset="18%" stopColor={base} />
      <stop offset="26%" stopColor={soft} />
      <stop offset="36%" stopColor={med} />
      <stop offset="50%" stopColor={peak} />
      <stop offset="64%" stopColor={med} />
      <stop offset="74%" stopColor={soft} />
      <stop offset="82%" stopColor={base} />
      <stop offset="92%" stopColor={base} />
      <stop offset="100%" stopColor={base} />
    </>
  );
}

function ThicknessMaskStops() {
  return (
    <>
      <stop offset="0%" stopColor="white" stopOpacity={0} />
      <stop offset="22%" stopColor="white" stopOpacity={0} />
      <stop offset="34%" stopColor="white" stopOpacity={0.28} />
      <stop offset="50%" stopColor="white" stopOpacity={1} />
      <stop offset="66%" stopColor="white" stopOpacity={0.28} />
      <stop offset="78%" stopColor="white" stopOpacity={0} />
      <stop offset="100%" stopColor="white" stopOpacity={0} />
    </>
  );
}

function CornerSvg({
  r,
  d,
  gradId,
  palette,
  borderWidthPx,
}: {
  r: number;
  d: string;
  gradId: string;
  palette: GlassCornerRimPalette;
  borderWidthPx: number;
}) {
  const taperGradId = `${gradId}-thick-taper`;
  const thickMaskId = `${gradId}-thick-mask`;
  const inset = borderWidthPx / 2;
  const gx1 = r;
  const gy1 = inset;
  const gx2 = inset;
  const gy2 = r;

  const pathCommon = {
    d,
    fill: "none" as const,
    stroke: `url(#${gradId})`,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    vectorEffect: "non-scaling-stroke" as const,
  };

  return (
    <svg
      width="100%"
      height="100%"
      viewBox={`0 0 ${r} ${r}`}
      fill="none"
      aria-hidden
      style={{ overflow: "visible", display: "block" }}
    >
      <defs>
        <linearGradient id={gradId} gradientUnits="userSpaceOnUse" x1={gx1} y1={gy1} x2={gx2} y2={gy2}>
          <CornerStops palette={palette} />
        </linearGradient>
        <linearGradient id={taperGradId} gradientUnits="userSpaceOnUse" x1={gx1} y1={gy1} x2={gx2} y2={gy2}>
          <ThicknessMaskStops />
        </linearGradient>
        <mask id={thickMaskId} maskUnits="userSpaceOnUse" x={0} y={0} width={r} height={r}>
          <rect x={0} y={0} width={r} height={r} fill={`url(#${taperGradId})`} />
        </mask>
      </defs>
      <path {...pathCommon} strokeWidth={ARC_STROKE_MASKED_PX} mask={`url(#${thickMaskId})`} />
      <path {...pathCommon} strokeWidth={ARC_STROKE_CORE_PX} />
    </svg>
  );
}

/**
 * TL/BR glass rim accents — same geometry and gradients as login fields; host must be
 * `position: relative` and use matching `border-radius` / 1px border.
 */
export function GlassCornerRim({
  radius,
  palette,
  borderWidthPx = 1,
  zIndex = 3,
}: GlassCornerRimProps) {
  const r = parseGlassCornerRadiusPx(radius);
  const d = pathTopLeftQuarterArc(r, borderWidthPx);
  const uid = useId().replace(/:/g, "");
  const gradTl = `gcr-tl-${uid}`;
  const gradBr = `gcr-br-${uid}`;

  const patchSx = {
    zIndex,
    w: `${r}px`,
    h: `${r}px`,
    pointerEvents: "none" as const,
    shapeRendering: "geometricPrecision" as const,
  };

  const rotate180 = { transform: "rotate(180deg)", transformOrigin: "center center" as const };

  return (
    <>
      <Box position="absolute" top={0} left={0} sx={patchSx} style={rotate180}>
        <CornerSvg r={r} d={d} gradId={gradBr} palette={palette} borderWidthPx={borderWidthPx} />
      </Box>
      <Box position="absolute" bottom={0} right={0} sx={patchSx}>
        <CornerSvg r={r} d={d} gradId={gradTl} palette={palette} borderWidthPx={borderWidthPx} />
      </Box>
    </>
  );
}
