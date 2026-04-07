"use client";

import { Box } from "@chakra-ui/react";
import { motion, useReducedMotion } from "framer-motion";

const BAR_MAX_W = 132;
const BAR_H = 9;

export function DistributionBarCell({
  widthPercent,
  isFirstRow,
  isHovered,
}: {
  /** 0–100 fill within the bar track */
  widthPercent: number;
  isFirstRow: boolean;
  isHovered: boolean;
}) {
  const reduceMotion = useReducedMotion() === true;
  const w = Math.min(100, Math.max(0, widthPercent));
  const fill = isFirstRow ? "rgba(126, 188, 255, 0.88)" : "rgba(90, 169, 255, 0.42)";
  const fillHover = isFirstRow ? "rgba(165, 215, 255, 0.95)" : "rgba(125, 195, 255, 0.58)";

  return (
    <Box w={`${BAR_MAX_W}px`} maxW="100%" flexShrink={0} aria-hidden>
      <Box
        h={`${BAR_H}px`}
        w="full"
        borderRadius="full"
        bg="rgba(255,255,255,0.06)"
        overflow="hidden"
        className="bd-bar-track"
      >
        <motion.div
          className="bd-bar-fill"
          style={{
            height: BAR_H,
            width: `${w}%`,
            minWidth: w > 0 ? 2 : 0,
            borderRadius: 9999,
            transformOrigin: "left center",
          }}
          initial={reduceMotion ? false : { scaleX: 0.06, opacity: 0.9 }}
          animate={{
            scaleX: 1,
            opacity: 1,
            backgroundColor: isHovered ? fillHover : fill,
            boxShadow: isHovered ? "0 0 12px rgba(60, 140, 220, 0.25)" : "none",
          }}
          transition={{
            scaleX: { duration: reduceMotion ? 0 : 0.22, ease: [0.33, 1, 0.68, 1] },
            opacity: { duration: reduceMotion ? 0 : 0.18 },
            backgroundColor: { duration: 0.16 },
            boxShadow: { duration: 0.16 },
          }}
        />
      </Box>
    </Box>
  );
}
