"use client";

import { useMemo, useState } from "react";
import { Box, Flex, Heading, Text, useBreakpointValue, useColorMode, VStack } from "@chakra-ui/react";
import { motion } from "framer-motion";
import Link from "next/link";
import { HiArrowRight } from "react-icons/hi2";
import { DomainNavIcon } from "@/components/dashboard/sidebar/sidebarDomainIcons";
import { dashRadius, figmaHomeServiceCard } from "@/components/dashboard/dashboardTokens";
import type { PlatformDefinition } from "@/data/dashboardPlatforms";
import type { PlatformHealth } from "@/data/dashboardStubApi";
import { nav } from "@/data/dashboardNav";
import {
  dashboardBankHomeHover,
  dashboardCardCtaSlide,
  makeDashboardCardHover,
  makeDashboardGlassCardHover,
  makeDashboardLaunchModuleHover,
  makeIosGlassHomeTileHover,
} from "@/lib/dashboardCardAnimations";
import { dashboardDarkCardSurface } from "@/lib/dashboardDarkCardSurface";
import { iosGlassHomeServiceCard } from "@/lib/iosGlassHomeServiceCard";
import { useFabTokens } from "@/components/theme/FabTokensContext";

const MotionDiv = motion.div;
const MotionBox = motion(Box);

/** Figma dark home tiles — hex in `sx` so Chakra `Heading`/`Text` base styles don’t override CSS vars. */
const FIGMA_HOME_CARD_INK = "#ffffff";
/** Brand white for body line under title (DS `neutral-white`). */
const BRAND_WHITE = "#ffffff";

/** Aligned with `ServiceTile` / FABAccess API `AnimatedAPICard`. */
const TITLE_COLOR = "#010591";
const CTA_BG = "#000245";
const BORDER_HOVER = "#0f62fe";

/** Dashboard home launchpad — fixed height for uniform tiles, top-stacked copy. */
const HOME_LAUNCHPAD_TILE_H = "188px";

export type PlatformCardProps = {
  platform: PlatformDefinition;
  index: number;
  isEnabled: boolean;
  health: PlatformHealth;
  hoverImage: string;
  /** When set, used instead of `nav(platform.defaultNavId)`. */
  href?: string;
  /** Short supporting line under the title (L1 service description). */
  description?: string;
  /** Overrides the status pill label for secondary / restricted tiles. */
  statusLabelOverride?: string;
  /**
   * Ghost loading: real tile chrome, faint copy, slow sheen — not a skeleton block.
   * Non-interactive; no link.
   */
  ghost?: boolean;
  /** Dense tile for legacy compact grids (fills parent height). */
  compact?: boolean;
  /**
   * `launchModule` — dense home module tiles.
   * `bankHome` — softer secondary L1 tiles (structured banking home).
   */
  moduleStyle?: "default" | "launchModule" | "bankHome";
  /** When home grid has few cards: slightly taller tile + roomier padding. */
  bankHomeComfortable?: boolean;
  /**
   * Dashboard home: fixed-height launchpad tile (same dimensions for every product).
   */
  uniformGridCell?: boolean;
  /** Single low-contrast line under description (bank home only). */
  microHint?: string;
};

function statusDotColor(isEnabled: boolean, health: PlatformHealth): string {
  if (!isEnabled) return "#f87171";
  if (health === "degraded") return "#fbbf24";
  if (health === "unavailable") return "#f87171";
  return "#34d399";
}

function statusLabel(isEnabled: boolean, health: PlatformHealth, override?: string): string {
  if (override) return override;
  if (!isEnabled) return "Restricted";
  if (health === "degraded") return "Partial";
  if (health === "unavailable") return "Unavailable";
  return "Available";
}

/**
 * White API-style tile: L1 title only (no body copy); hover image + CTA overlay on desktop.
 */
export function PlatformCard({
  platform,
  index,
  isEnabled,
  health,
  hoverImage,
  href: hrefProp,
  description,
  statusLabelOverride,
  ghost = false,
  compact = false,
  moduleStyle = "default",
  bankHomeComfortable = false,
  uniformGridCell = false,
  microHint,
}: PlatformCardProps) {
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";
  const { dashShadow } = useFabTokens();
  const bh = moduleStyle === "bankHome";
  const uniform = bh && uniformGridCell;
  const figmaUniformDark = uniform && isDark;
  const lm = moduleStyle === "launchModule";
  const cardMotion = useMemo(() => {
    if (figmaUniformDark) return makeIosGlassHomeTileHover();
    if (isDark) return makeDashboardGlassCardHover();
    if (bh) return dashboardBankHomeHover;
    if (lm) return makeDashboardLaunchModuleHover(dashShadow.cardGlow, dashShadow.cardGlowHover);
    return makeDashboardCardHover(dashShadow.cardGlow, dashShadow.cardGlowHover);
  }, [bh, figmaUniformDark, isDark, lm, dashShadow.cardGlow, dashShadow.cardGlowHover]);
  const resolvedHref = hrefProp ?? nav(platform.defaultNavId);
  const [isHovered, setIsHovered] = useState(false);
  const isMobile = useBreakpointValue({ base: true, md: false });
  const dot = statusDotColor(isEnabled, health);
  const label = statusLabel(isEnabled, health, statusLabelOverride);
  const ctaLabel = "Open";
  const interactive = isEnabled && !ghost;

  const uniformTileH = figmaUniformDark ? figmaHomeServiceCard.height : HOME_LAUNCHPAD_TILE_H;
  const cardBackdrop = figmaUniformDark
    ? iosGlassHomeServiceCard.backdrop
    : isDark
      ? dashboardDarkCardSurface.backdrop
      : bh
        ? "blur(12px)"
        : "blur(14px)";
  const cardBg = figmaUniformDark
    ? iosGlassHomeServiceCard.fill
    : isDark
      ? dashboardDarkCardSurface.fill
      : bh
        ? "rgba(255,255,255,0.92)"
        : "#FFF";
  const cardRadius = figmaUniformDark
    ? figmaHomeServiceCard.radius
    : isDark
      ? dashboardDarkCardSurface.radius
      : bh || lm
        ? "16px"
        : dashRadius.panel;
  const cardBorder = figmaUniformDark
    ? {
        base: `1px solid ${iosGlassHomeServiceCard.border}`,
        md:
          ghost || !interactive
            ? `1px solid ${iosGlassHomeServiceCard.border}`
            : `1px solid ${isHovered ? iosGlassHomeServiceCard.borderHover : iosGlassHomeServiceCard.border}`,
      }
    : isDark
      ? {
          base: `1px solid ${dashboardDarkCardSurface.border}`,
          md:
            ghost || !interactive
              ? `1px solid ${dashboardDarkCardSurface.border}`
              : isHovered
                ? `1px solid ${dashboardDarkCardSurface.borderHover}`
                : `1px solid ${dashboardDarkCardSurface.border}`,
        }
      : {
          base: bh ? "1px solid rgba(255,255,255,0.08)" : "none",
          md: bh
            ? "1px solid rgba(255,255,255,0.08)"
            : ghost || !interactive
              ? "1px solid rgba(255,255,255,0.12)"
              : isHovered
                ? `1px solid ${BORDER_HOVER}`
                : "1px solid rgba(255,255,255,0.12)",
        };
  const cardPad = (() => {
    if (figmaUniformDark) return figmaHomeServiceCard.padding;
    if (isDark && uniform) return dashboardDarkCardSurface.padComfortable;
    if (!isDark && uniform) return "16px";
    if (isDark) {
      if (compact) return { base: 3, md: 3.5 };
      return dashboardDarkCardSurface.padComfortable;
    }
    if (bh) return bankHomeComfortable ? "24px" : "22px";
    if (lm) return "24px";
    if (compact) return { base: 3, md: 3.5 };
    return { base: 5, md: 6 };
  })();
  const outerGap = isDark && uniform && !figmaUniformDark ? 10 : uniform ? 0 : bh ? "8px" : lm ? 3 : compact ? 2 : 4;
  const innerColumnGap = isDark && uniform && !figmaUniformDark ? 10 : uniform ? 0 : bh ? 0 : lm ? 2 : compact ? 2 : 3;

  const handleMouseEnter = () => {
    if (!isMobile && interactive) setIsHovered(true);
  };

  const handleMouseLeave = () => {
    if (!isMobile) setIsHovered(false);
  };

  const cardInner = (
        <MotionBox
          position="relative"
          backdropFilter={cardBackdrop}
          bg={cardBg}
          border={cardBorder}
          display="flex"
          flexDirection="column"
          alignItems="flex-start"
          justifyContent={figmaUniformDark ? "flex-start" : uniform ? "flex-start" : "space-between"}
          overflow="hidden"
          w={figmaUniformDark ? { base: "full", lg: figmaHomeServiceCard.width } : "full"}
          maxW={figmaUniformDark ? figmaHomeServiceCard.width : undefined}
          mx={figmaUniformDark ? { base: 0, lg: "auto" } : undefined}
          h={
            uniform
              ? uniformTileH
              : bh
                ? "auto"
                : lm
                  ? "156px"
                  : "full"
          }
          minH={
            uniform
              ? uniformTileH
              : bh
                ? bankHomeComfortable
                  ? "160px"
                  : "148px"
                : lm
                  ? "156px"
                  : compact
                    ? 0
                    : { base: "132px", md: "148px" }
          }
          maxH={uniform ? uniformTileH : lm ? "160px" : undefined}
          p={cardPad}
          gap={outerGap}
          borderRadius={cardRadius}
          cursor={ghost ? "default" : isEnabled ? "pointer" : "not-allowed"}
          opacity={ghost ? 1 : isEnabled ? 1 : 0.72}
          variants={cardMotion}
          initial="rest"
          whileHover={ghost || isMobile || !interactive ? "rest" : "hover"}
          whileFocus={ghost || isMobile || !interactive ? "rest" : "hover"}
          whileTap={interactive ? { scale: 0.995 } : undefined}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          sx={{
            WebkitBackdropFilter: cardBackdrop,
            isolation: figmaUniformDark ? "isolate" : undefined,
            transition:
              figmaUniformDark || bh || lm
                ? "transform 0.32s cubic-bezier(0.33, 1, 0.68, 1), border-color 0.28s ease, box-shadow 0.32s ease, backdrop-filter 0.28s ease"
                : undefined,
          }}
        >
          {ghost ? <span className="fab-ghost-card-sheen" aria-hidden /> : null}
          <Flex
            direction="column"
            flex="1"
            w="full"
            minH={0}
            justify={figmaUniformDark ? "flex-start" : uniform ? "flex-start" : "space-between"}
            gap={figmaUniformDark ? figmaHomeServiceCard.gapIconToText : innerColumnGap}
            position="relative"
            zIndex={10}
            minW={0}
            overflow="hidden"
            opacity={ghost ? 0.92 : 1}
          >
            <Flex
              align="center"
              justify="space-between"
              gap={uniform ? 2 : 3}
              w="full"
              flexShrink={0}
              minH={figmaUniformDark ? "28px" : uniform ? "32px" : undefined}
            >
              <Box
                w={
                  figmaUniformDark
                    ? "28px"
                    : uniform
                      ? "32px"
                      : bh
                        ? "36px"
                        : lm
                          ? "40px"
                          : compact
                            ? "36px"
                            : "44px"
                }
                h={
                  figmaUniformDark
                    ? "28px"
                    : uniform
                      ? "32px"
                      : bh
                        ? "36px"
                        : lm
                          ? "40px"
                          : compact
                            ? "36px"
                            : "44px"
                }
                flexShrink={0}
                borderRadius={figmaUniformDark ? "10px" : bh || lm ? "12px" : compact ? "10px" : "12px"}
                bg={
                  figmaUniformDark
                    ? iosGlassHomeServiceCard.iconChipBg
                    : isDark
                      ? dashboardDarkCardSurface.iconBoxBg
                      : bh
                        ? "rgba(0, 6, 80, 0.055)"
                        : "rgba(0, 6, 80, 0.06)"
                }
                border={
                  figmaUniformDark
                    ? `1px solid ${iosGlassHomeServiceCard.iconChipBorder}`
                    : isDark
                      ? `1px solid ${dashboardDarkCardSurface.iconBoxBorder}`
                      : "1px solid rgba(0, 6, 80, 0.08)"
                }
                display="flex"
                alignItems="center"
                justifyContent="center"
                color={figmaUniformDark ? FIGMA_HOME_CARD_INK : isDark ? dashboardDarkCardSurface.title : TITLE_COLOR}
                opacity={ghost ? 0.42 : 1}
                sx={
                  ghost
                    ? { filter: "saturate(0.92)", ...(figmaUniformDark ? { color: `${FIGMA_HOME_CARD_INK} !important` } : {}) }
                    : figmaUniformDark
                      ? { color: `${FIGMA_HOME_CARD_INK} !important` }
                      : undefined
                }
              >
                <DomainNavIcon
                  domainId={platform.id}
                  size={figmaUniformDark ? 18 : uniform ? 20 : bh ? 22 : lm ? 24 : compact ? 22 : 26}
                />
              </Box>
              <Box
                as="span"
                w="8px"
                h="8px"
                borderRadius="full"
                flexShrink={0}
                mt={uniform ? 0 : 1}
                bg={dot}
                boxShadow={isDark ? "0 0 0 2px rgba(0,0,0,0.45)" : "0 0 0 2px #ffffff"}
                opacity={ghost ? 0.35 : 1}
                aria-hidden
              />
            </Flex>

            {figmaUniformDark ? (
              <VStack align="stretch" spacing={figmaHomeServiceCard.gapTitleToBody} w="full" minW={0} flex="1">
                <Heading
                  as="h3"
                  fontFamily='"Graphik Trial", var(--font-graphik), system-ui, sans-serif'
                  fontStyle="normal"
                  fontWeight={400}
                  fontSize="24px"
                  lineHeight={1.25}
                  letterSpacing="normal"
                  noOfLines={1}
                  opacity={ghost ? 0.36 : 1}
                  sx={{
                    color: `${FIGMA_HOME_CARD_INK} !important`,
                    ...(ghost ? { filter: "blur(0.35px)" } : {}),
                  }}
                >
                  {platform.title}
                </Heading>
                {description ? (
                  <Text
                    fontFamily='"Graphik Trial", var(--font-graphik), system-ui, sans-serif'
                    fontStyle="normal"
                    fontSize="12px"
                    fontWeight={300}
                    lineHeight={1.35}
                    letterSpacing="normal"
                    noOfLines={2}
                    flexShrink={0}
                    w="full"
                    sx={{
                      color: `var(--neutral-white, ${BRAND_WHITE}) !important`,
                      ...(ghost ? { filter: "blur(0.35px)" } : {}),
                    }}
                  >
                    {description}
                  </Text>
                ) : null}
              </VStack>
            ) : (
              <>
                <Heading
                  as="h3"
                  fontFamily="var(--font-graphik)"
                  fontWeight={isDark ? 500 : uniform ? 500 : bh ? 500 : 600}
                  fontSize={
                    isDark && uniform
                      ? { base: "22px", md: "24px" }
                      : uniform
                        ? { base: "20px", md: "22px" }
                        : bh
                          ? "16px"
                          : lm
                            ? "19px"
                            : compact
                              ? { base: "14px", md: "15px" }
                              : { base: "17px", md: "19px" }
                  }
                  lineHeight={uniform ? 1.25 : bh ? 1.3 : lm ? 1.2 : "1.25"}
                  letterSpacing={isDark ? "0" : "-0.02em"}
                  color={isDark ? dashboardDarkCardSurface.title : TITLE_COLOR}
                  noOfLines={uniform ? 2 : bh || lm ? 2 : compact ? 2 : 3}
                  flex={uniform ? undefined : "1"}
                  mt={uniform && !isDark ? "14px" : bh && !isDark ? "12px" : undefined}
                  opacity={ghost ? 0.36 : 1}
                  sx={ghost ? { filter: "blur(0.35px)" } : undefined}
                >
                  {platform.title}
                </Heading>
                {uniform && description && !figmaUniformDark ? (
                  <Box flex="1" minH={0} minW={0} aria-hidden />
                ) : null}
                {description ? (
                  <Text
                    fontFamily="var(--font-graphik)"
                    fontSize={isDark && uniform ? "12px" : uniform ? "12px" : bh || lm ? "13px" : compact ? "11px" : "13px"}
                    fontWeight={isDark ? 300 : uniform ? 400 : undefined}
                    lineHeight={uniform ? 1.45 : bh ? 1.4 : lm ? 1.35 : "1.35"}
                    color={
                      isDark
                        ? dashboardDarkCardSurface.body
                        : uniform
                          ? TITLE_COLOR
                          : bh
                            ? "rgba(1, 5, 145, 0.65)"
                            : "rgba(1, 5, 145, 0.55)"
                    }
                    opacity={ghost ? 0.34 : !isDark && uniform ? 0.76 : 1}
                    noOfLines={uniform ? 2 : bh || lm ? 2 : compact ? 2 : 3}
                    flexShrink={0}
                    mt={uniform ? 0 : bh ? "8px" : undefined}
                    maxW={uniform ? "34ch" : undefined}
                    sx={ghost ? { filter: "blur(0.35px)" } : undefined}
                  >
                    {description}
                  </Text>
                ) : null}
                {bh && microHint && !uniform ? (
                  <Text
                    mt="10px"
                    fontFamily="var(--font-graphik)"
                    fontSize="11px"
                    fontWeight={500}
                    lineHeight={1.35}
                    letterSpacing="0.01em"
                    color={isDark ? dashboardDarkCardSurface.bodySubtle : "rgba(1, 5, 145, 0.4)"}
                    noOfLines={1}
                    opacity={ghost ? 0.28 : 1}
                  >
                    {microHint}
                  </Text>
                ) : null}
              </>
            )}
          </Flex>

          <Flex
            alignItems="center"
            position="relative"
            flexShrink={0}
            zIndex={10}
            display={
              uniform ? "none" : { base: interactive ? "flex" : "none", md: "none" }
            }
          >
            <Text
              fontFamily="var(--font-graphik)"
              fontWeight={500}
              lineHeight="none"
              color={isDark ? "rgba(96, 170, 238, 0.95)" : BORDER_HOVER}
              fontSize="16px"
              letterSpacing="0.5px"
            >
              {ctaLabel}
            </Text>
            <Box
              as="span"
              display="flex"
              alignItems="center"
              justifyContent="center"
              w="24px"
              h="24px"
              ml="4px"
              color={isDark ? "rgba(96, 170, 238, 0.95)" : BORDER_HOVER}
            >
              <HiArrowRight size={20} strokeWidth={2} aria-hidden />
            </Box>
          </Flex>

          <Box
            position="absolute"
            inset={0}
            display={{ base: "none", md: ghost ? "none" : "block" }}
            zIndex={20}
            pointerEvents="none"
            borderRadius={cardRadius}
            overflow="hidden"
          >
            <MotionDiv
              style={{ position: "absolute", inset: 0 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: isHovered ? 1 : 0 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
              <Box as="img" alt="" position="absolute" inset={0} w="full" h="full" objectFit="cover" src={hoverImage} />
            </MotionDiv>
          </Box>

          <Box
            as={motion.div}
            position="absolute"
            inset={0}
            display={{ base: "none", md: !ghost && isEnabled && isHovered ? "flex" : "none" }}
            alignItems="center"
            justifyContent="center"
            zIndex={30}
            pointerEvents="none"
            borderRadius={cardRadius}
            px={3}
            bg="transparent"
          >
            <MotionBox
              variants={dashboardCardCtaSlide}
              initial="hidden"
              animate={isHovered ? "visible" : "hidden"}
              pointerEvents="none"
              bg={CTA_BG}
              display="flex"
              alignItems="center"
              justifyContent="center"
              pl="24px"
              pr="16px"
              py="12px"
              minH="40px"
              w="full"
              maxW="280px"
              borderRadius="100px"
              flexShrink={0}
            >
              <Flex gap="4px" alignItems="center">
                <Text fontFamily="var(--font-graphik)" fontWeight={500} lineHeight="24px" fontSize="14px" color="white">
                  {ctaLabel}
                </Text>
                <Box as="span" display="flex" w="24px" h="24px" color="white">
                  <HiArrowRight size={22} strokeWidth={2} aria-hidden />
                </Box>
              </Flex>
            </MotionBox>
          </Box>
        </MotionBox>
  );

  const uniformFillStyle = uniform
    ? {
        display: "block",
        width: "100%",
        height: uniformTileH,
      }
    : { height: "100%" };

  const uniformLinkStyle = uniform
    ? {
        display: "block",
        height: "100%",
        width: "100%",
        textDecoration: "none" as const,
        color: "inherit" as const,
      }
    : {
        display: "block",
        height: "100%",
        textDecoration: "none" as const,
        color: "inherit" as const,
      };

  return (
    <motion.div
      initial={false}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: [0.33, 1, 0.68, 1] }}
      style={uniformFillStyle}
    >
      {ghost ? (
        <Box
          role="status"
          aria-busy
          aria-label="Loading services"
          {...(uniform ? { h: uniformTileH, w: "full" } : { h: "full" })}
        >
          {cardInner}
        </Box>
      ) : isEnabled ? (
        <Link
          href={resolvedHref}
          prefetch={false}
          scroll={false}
          style={uniformLinkStyle}
          aria-label={`${platform.title}. ${label}.`}
        >
          {cardInner}
        </Link>
      ) : (
        <Box
          role="group"
          aria-label={`${platform.title}. ${label}.`}
          {...(uniform ? { h: uniformTileH, w: "full" } : { h: "full" })}
          cursor="not-allowed"
        >
          {cardInner}
        </Box>
      )}
    </motion.div>
  );
}
