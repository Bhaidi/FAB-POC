"use client";

import Link from "next/link";
import { useReducedMotion } from "framer-motion";
import { motion } from "framer-motion";
import { Box, Flex, IconButton, Text, Tooltip } from "@chakra-ui/react";
import { ChevronRight, SlidersHorizontal } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { dashSpace } from "@/components/dashboard/dashboardTokens";

export type QuickActionItem = {
  id: string;
  label: string;
  href: string;
  icon: LucideIcon;
  /** Optional muted line under the title */
  statusText?: string;
  /** When > 0, shows an animated count pill on the right. When 0, falls back to chevron unless `trailingArrow` is false. */
  count?: number;
  /** When true, always show chevron (e.g. “View all approvals”). */
  trailingArrow?: boolean;
  /** Dim row — e.g. checker section when the approval queue is empty */
  rowVariant?: "default" | "subdued";
};

type QuickActionsWidgetProps = {
  actions: QuickActionItem[];
  /** Opens customize modal (home rail). */
  onCustomizeClick?: () => void;
  customizeAriaLabel?: string;
  /** When `actions` is empty and pool had nothing to show. */
  emptyMessage?: string;
  /** Tighter padding and rows for home sidebar / one-page layouts. */
  compactLayout?: boolean;
  /** Extra-tight home right rail (lighter vertical footprint). */
  denseSidebar?: boolean;
  /** Dashboard home right column: 18px padding, 44px rows, 10px gaps. */
  homeRail?: boolean;
  /** Fill parent grid cell (home: split with Financial). */
  fillCell?: boolean;
};

function CountPill({ value, rail }: { value: number; rail?: boolean }) {
  const reduceMotion = useReducedMotion();
  const rm = reduceMotion === true;
  const r = rail === true;
  return (
    <motion.span
      key={value}
      initial={rm ? false : { opacity: 0.65, scale: 0.88 }}
      animate={rm ? undefined : { opacity: 1, scale: 1 }}
      transition={rm ? undefined : { type: "spring", stiffness: 520, damping: 30 }}
      style={{ display: "inline-flex", lineHeight: 0 }}
    >
      <Box
        as="span"
        minW="1.35rem"
        px={2}
        py="3px"
        borderRadius="full"
        fontFamily="var(--font-graphik)"
        fontSize="11px"
        fontWeight={r ? 500 : 600}
        letterSpacing="-0.02em"
        bg="rgba(96, 165, 250, 0.22)"
        color="rgba(191, 219, 254, 0.98)"
        borderWidth="1px"
        borderColor="rgba(147, 197, 253, 0.35)"
        sx={{ fontVariantNumeric: "tabular-nums" }}
      >
        {value}
      </Box>
    </motion.span>
  );
}

const MotionFlex = motion(Flex);

/**
 * Secondary quick-launch — role-aware, counts from platform stub.
 */
export function QuickActionsWidget({
  actions,
  onCustomizeClick,
  customizeAriaLabel = "Customize quick actions",
  emptyMessage = "No quick actions available for your role",
  compactLayout,
  denseSidebar,
  homeRail,
  fillCell,
}: QuickActionsWidgetProps) {
  const reduceMotion = useReducedMotion();
  const rm = reduceMotion === true;
  const rail = homeRail === true;
  const compact = compactLayout === true;
  const dense = denseSidebar === true && compact;
  const fill = fillCell === true;

  /** Matches `FinancialOverviewWidget` rail glass so the home stack feels like one system. */
  const railGlassSx = {
    WebkitBackdropFilter: "blur(20px)",
    backgroundImage: `
      linear-gradient(168deg, rgba(14, 20, 52, 0.92) 0%, rgba(10, 16, 42, 0.82) 48%, rgba(8, 12, 36, 0.94) 100%),
      linear-gradient(180deg, rgba(255,255,255,0.08) 0%, transparent 36%, rgba(95, 85, 180, 0.055) 100%)
    `,
    boxShadow:
      "0 20px 50px rgba(0, 0, 0, 0.42), 0 0 0 1px rgba(255,255,255,0.09), inset 0 1px 0 rgba(255,255,255,0.16), inset 0 0 0 1px rgba(255,255,255,0.04), inset 0 0 72px rgba(40, 60, 140, 0.06)",
  } as const;

  return (
    <Box
      borderRadius="18px"
      position={rail ? "relative" : undefined}
      overflow={rail ? "hidden" : undefined}
      p={
        rail
          ? undefined
          : dense
            ? { base: "10px", md: "11px" }
            : compact
              ? { base: "12px", md: "14px" }
              : { base: dashSpace.sm, md: "28px" }
      }
      pt={rail ? "8px" : undefined}
      px={rail ? "18px" : undefined}
      pb={rail ? "18px" : undefined}
      bg={rail ? undefined : "rgba(255,255,255,0.035)"}
      backgroundImage={
        rail
          ? undefined
          : "linear-gradient(135deg, rgba(255,255,255,0.02), rgba(255,255,255,0.005))"
      }
      borderWidth={rail ? "1px" : undefined}
      borderColor={rail ? "rgba(255,255,255,0.1)" : undefined}
      backdropFilter={rail ? "blur(20px)" : "blur(14px)"}
      sx={
        rail
          ? railGlassSx
          : { WebkitBackdropFilter: "blur(14px)" }
      }
      boxShadow={
        rail
          ? undefined
          : "0 8px 28px rgba(0, 0, 0, 0.22), 0 0 0 1px rgba(255,255,255,0.05), inset 0 1px 0 rgba(255,255,255,0.05)"
      }
      display="flex"
      flexDirection="column"
      transition={
        rail
          ? "transform 0.28s cubic-bezier(0.33, 1, 0.68, 1), box-shadow 0.32s ease, border-color 0.28s ease"
          : "all 0.2s ease"
      }
      _hover={
        rail
          ? rm
            ? {}
            : {
                transform: "translateY(-2px)",
                borderColor: "rgba(255,255,255,0.17)",
                boxShadow:
                  "0 26px 58px rgba(0, 0, 0, 0.48), 0 0 0 1px rgba(255,255,255,0.11), 0 0 36px rgba(45, 107, 255, 0.14), inset 0 1px 0 rgba(255,255,255,0.18), inset 0 0 80px rgba(50, 75, 160, 0.09)",
              }
          : undefined
      }
      flex={fill && !rail ? "1" : undefined}
      minW={0}
      h={fill && !rail ? "100%" : undefined}
      minH={fill && !rail ? 0 : undefined}
    >
      <Flex
        align="center"
        justify="space-between"
        gap={2}
        mb={rail ? "6px" : dense ? "6px" : compact ? "8px" : dashSpace.sm}
      >
        <Text
          fontFamily="var(--font-graphik)"
          fontSize="11px"
          fontWeight={600}
          letterSpacing="0.14em"
          textTransform="uppercase"
          color={rail ? "rgba(255,255,255,0.6)" : "rgba(255,255,255,0.45)"}
        >
          Quick Actions
        </Text>
        {onCustomizeClick ? (
          <Tooltip label={customizeAriaLabel} placement="top" openDelay={400} fontSize="xs">
            <IconButton
              aria-label={customizeAriaLabel}
              icon={<SlidersHorizontal size={16} strokeWidth={2} />}
              variant="ghost"
              size="xs"
              minW="28px"
              h="28px"
              borderRadius="md"
              color="rgba(255,255,255,0.45)"
              _hover={{ color: "rgba(255,255,255,0.88)", bg: "rgba(255,255,255,0.06)" }}
              onClick={(e) => {
                e.preventDefault();
                onCustomizeClick();
              }}
            />
          </Tooltip>
        ) : null}
      </Flex>

      <Flex
        direction="column"
        gap={rail ? "8px" : dense ? "6px" : compact ? "8px" : "12px"}
        flex={fill && !rail ? "1" : undefined}
        minH={fill && !rail ? 0 : undefined}
        justify={fill && !dense && !rail ? "center" : "flex-start"}
      >
        {actions.length === 0 ? (
          <Text
            fontFamily="var(--font-graphik)"
            fontSize={rail ? "12px" : "13px"}
            fontWeight={500}
            color="rgba(255,255,255,0.42)"
            lineHeight={1.45}
          >
            {emptyMessage}
          </Text>
        ) : null}
        {actions.map(({ id, label, href, icon: Icon, statusText, count, trailingArrow, rowVariant }) => {
          const hasPill = count != null && count > 0 && !trailingArrow;
          const showChevron = trailingArrow === true || !hasPill;
          const subdued = rowVariant === "subdued";

          return (
            <Link key={id} href={href} prefetch={false} scroll={false} style={{ textDecoration: "none", width: "100%" }}>
              <MotionFlex
                align="center"
                gap={rail ? 2 : dense ? 2 : compact ? 2.5 : 3}
                w="full"
                h={rail ? "38px" : undefined}
                minH={rail ? "38px" : dense ? "32px" : compact ? "36px" : "44px"}
                px={rail ? "11px" : dense ? 1.5 : compact ? 2 : 3}
                py={rail ? 0 : dense ? 1 : compact ? 1.25 : 2}
                borderRadius={rail ? "10px" : "12px"}
                bg="rgba(255,255,255,0.04)"
                borderWidth="1px"
                borderColor="rgba(255,255,255,0.06)"
                cursor="pointer"
                sx={{
                  transition:
                    "background 0.2s ease, border-color 0.2s ease, box-shadow 0.22s ease, filter 0.2s ease",
                }}
                opacity={subdued ? 0.6 : 1}
                whileHover={
                  rm
                    ? undefined
                    : {
                        y: rail ? -2 : -3,
                        transition: { type: "spring", stiffness: 420, damping: 28 },
                      }
                }
                whileTap={rm ? undefined : { scale: 0.985 }}
                _hover={{
                  bg: "rgba(255,255,255,0.07)",
                  borderColor: "rgba(255,255,255,0.11)",
                  boxShadow:
                    "0 12px 26px rgba(0, 0, 0, 0.34), 0 0 24px rgba(96, 165, 250, 0.12), 0 0 0 1px rgba(255,255,255,0.06)",
                }}
              >
                <Box
                  flexShrink={0}
                  w={rail ? "26px" : dense ? "28px" : "32px"}
                  h={rail ? "26px" : dense ? "28px" : "32px"}
                  borderRadius={rail ? "8px" : "9px"}
                  bg="rgba(0, 98, 255, 0.18)"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  color="#93c5fd"
                >
                  <Icon size={rail ? 15 : dense ? 16 : 17} strokeWidth={2} aria-hidden />
                </Box>
                <Flex direction="column" gap={0.5} flex="1" minW={0} align="flex-start" justify="center">
                  <Text
                    as="span"
                    fontFamily="var(--font-graphik)"
                    fontSize={rail ? "13px" : "13px"}
                    fontWeight={rail ? 500 : 600}
                    letterSpacing="-0.01em"
                    color="rgba(255,255,255,0.9)"
                    lineHeight={1.2}
                    noOfLines={2}
                  >
                    {label}
                  </Text>
                  {statusText ? (
                    <Text
                      fontFamily="var(--font-graphik)"
                      fontSize="11px"
                      fontWeight={500}
                      color="rgba(255,255,255,0.38)"
                      lineHeight={1.25}
                      noOfLines={2}
                    >
                      {statusText}
                    </Text>
                  ) : null}
                </Flex>
                <Flex flexShrink={0} align="center" justify="flex-end" minW={rail ? "1.5rem" : "1.75rem"}>
                  {hasPill ? (
                    <CountPill value={count!} rail={rail} />
                  ) : showChevron ? (
                    <Box as="span" color="rgba(255,255,255,0.28)" display="flex" aria-hidden>
                      <ChevronRight size={rail ? 16 : 18} strokeWidth={2} />
                    </Box>
                  ) : null}
                </Flex>
              </MotionFlex>
            </Link>
          );
        })}
      </Flex>
    </Box>
  );
}
