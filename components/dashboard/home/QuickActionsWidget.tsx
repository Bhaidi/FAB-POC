"use client";

import Link from "next/link";
import { useReducedMotion } from "framer-motion";
import { motion } from "framer-motion";
import { Box, Flex, IconButton, Text, Tooltip, useColorMode, VStack } from "@chakra-ui/react";
import { ChevronRight, SlidersHorizontal } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { dashSpace, figmaHomeLayoutDark } from "@/components/dashboard/dashboardTokens";
import { iosGlassQuickActionTile } from "@/lib/iosGlassHomeServiceCard";
import { useFabTokens } from "@/components/theme/FabTokensContext";

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
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";
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
        bg={isDark ? "rgba(0, 98, 255, 0.28)" : "rgba(0, 98, 255, 0.12)"}
        color={isDark ? "rgba(255, 255, 255, 0.95)" : "#010591"}
        borderWidth="1px"
        borderColor={isDark ? "rgba(0, 98, 255, 0.4)" : "rgba(0, 98, 255, 0.22)"}
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
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";
  const { financialOverviewShell, dashColors } = useFabTokens();
  const rail = homeRail === true;
  const compact = compactLayout === true;
  const dense = denseSidebar === true && compact;
  const fill = fillCell === true;

  /** Figma `558:17853+` — 90×90 glass tiles, label below; customize control top-right. */
  if (rail && isDark) {
    const tiles = actions.slice(0, 4);
    return (
      <Box w="full" minW={0}>
        <Flex
          align="center"
          justify="space-between"
          gap={10}
          mb={figmaHomeLayoutDark.quickActionsTitleToTiles}
          w="full"
        >
          <Text
            fontFamily="var(--font-graphik)"
            fontSize="14px"
            fontWeight={300}
            letterSpacing="0.1em"
            textTransform="uppercase"
            sx={{ color: "#ffffff !important" }}
          >
            Quick Actions
          </Text>
          {onCustomizeClick ? (
            <Tooltip label={customizeAriaLabel} placement="top" openDelay={400} fontSize="xs">
              <IconButton
                aria-label={customizeAriaLabel}
                icon={<SlidersHorizontal size={22} strokeWidth={1.75} />}
                variant="ghost"
                size="sm"
                minW="32px"
                h="32px"
                borderRadius="md"
                color="rgba(255,255,255,0.88)"
                _hover={{
                  bg: "rgba(255, 255, 255, 0.08)",
                  color: "#ffffff",
                }}
                onClick={(e) => {
                  e.preventDefault();
                  onCustomizeClick();
                }}
              />
            </Tooltip>
          ) : null}
        </Flex>

        {tiles.length === 0 ? (
          <Text
            fontFamily="var(--font-graphik)"
            fontSize="13px"
            fontWeight={500}
            lineHeight={1.45}
            sx={{ color: "#ffffff !important" }}
          >
            {emptyMessage}
          </Text>
        ) : (
          <Flex
            justify="space-between"
            align="flex-start"
            gap={figmaHomeLayoutDark.quickActionsTileGap}
            w="full"
          >
            {tiles.map(({ id, label, href, icon: Icon }) => (
              <Link
                key={id}
                href={href}
                prefetch={false}
                scroll={false}
                style={{
                  textDecoration: "none",
                  color: "inherit",
                  flex: "1 1 0",
                  minWidth: 0,
                  maxWidth: "91px",
                }}
              >
                <VStack spacing={3} align="center" w="full">
                  <Box
                    w={{ base: "80px", sm: "90px", md: iosGlassQuickActionTile.size }}
                    h={{ base: "80px", sm: "90px", md: iosGlassQuickActionTile.size }}
                    maxW={iosGlassQuickActionTile.size}
                    mx="auto"
                    borderRadius={iosGlassQuickActionTile.radius}
                    bg={iosGlassQuickActionTile.fill}
                    backdropFilter={iosGlassQuickActionTile.backdrop}
                    borderWidth="0"
                    boxShadow="none"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    overflow="hidden"
                    transition="transform 0.28s ease"
                    sx={{ WebkitBackdropFilter: iosGlassQuickActionTile.backdrop }}
                    _hover={{
                      transform: "translateY(-2px)",
                    }}
                  >
                    <Box
                      as="span"
                      color="#ffffff"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                    >
                      <Icon size={19} strokeWidth={2} aria-hidden />
                    </Box>
                  </Box>
                  <Text
                    fontFamily="var(--font-graphik)"
                    fontSize="14px"
                    fontWeight={400}
                    lineHeight={1.35}
                    textAlign="center"
                    whiteSpace="pre-wrap"
                    wordBreak="break-word"
                    px={0.5}
                    noOfLines={3}
                    sx={{ color: "#ffffff !important" }}
                  >
                    {label}
                  </Text>
                </VStack>
              </Link>
            ))}
          </Flex>
        )}
      </Box>
    );
  }

  /** Same shell tokens as `FinancialOverviewWidget` rail — dark + light from `financialOverviewPalettes`. */
  const railGlassSx = rail
    ? {
        WebkitBackdropFilter: financialOverviewShell.WebkitBackdropFilter,
        backgroundImage: financialOverviewShell.backgroundImage,
        boxShadow: financialOverviewShell.boxShadow,
      }
    : {};

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
      bg={rail ? undefined : "#F2F2F3"}
      backgroundImage={
        rail
          ? undefined
          : "linear-gradient(135deg, rgba(255,255,255,0.95), rgba(242,242,243,0.98))"
      }
      borderWidth={rail ? "1px" : undefined}
      borderColor={rail ? financialOverviewShell.border : undefined}
      backdropFilter={rail ? financialOverviewShell.backdropFilter : "blur(10px)"}
      sx={
        rail ? railGlassSx : { WebkitBackdropFilter: "blur(10px)" }
      }
      boxShadow={
        rail
          ? undefined
          : "0 8px 28px rgba(1, 5, 145, 0.06), 0 0 0 1px rgba(1, 5, 145, 0.06), inset 0 1px 0 rgba(255,255,255,0.9)"
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
                borderColor: financialOverviewShell.hoverBorder,
                boxShadow: financialOverviewShell.hoverBoxShadow,
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
          color={rail ? dashColors.text.tertiary : "rgba(72, 82, 94, 0.55)"}
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
              color={dashColors.text.muted}
              _hover={{
                color: dashColors.text.primary,
                bg: isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(1, 5, 145, 0.05)",
              }}
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
            color={dashColors.text.muted}
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
                bg={rail && isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(255, 255, 255, 0.85)"}
                borderWidth="1px"
                borderColor={
                  rail && isDark ? "rgba(255, 255, 255, 0.12)" : "rgba(1, 5, 145, 0.08)"
                }
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
                  bg: rail && isDark ? "rgba(255, 255, 255, 0.12)" : "#FFFFFF",
                  borderColor: "rgba(0, 98, 255, 0.2)",
                  boxShadow:
                    rail && isDark
                      ? "0 12px 28px rgba(0, 0, 0, 0.35), 0 0 20px rgba(0, 98, 255, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.1)"
                      : "0 12px 26px rgba(1, 5, 145, 0.08), 0 0 20px rgba(0, 98, 255, 0.08), 0 0 0 1px rgba(1, 5, 145, 0.05)",
                }}
              >
                <Box
                  flexShrink={0}
                  w={rail ? "26px" : dense ? "28px" : "32px"}
                  h={rail ? "26px" : dense ? "28px" : "32px"}
                  borderRadius={rail ? "8px" : "9px"}
                  bg={rail && isDark ? "rgba(0, 98, 255, 0.25)" : "rgba(0, 98, 255, 0.12)"}
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  color={rail && isDark ? "rgba(255, 255, 255, 0.95)" : "#010591"}
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
                    color={dashColors.text.secondary}
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
                      color={dashColors.text.muted}
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
                    <Box as="span" color={dashColors.text.faint} display="flex" aria-hidden>
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
