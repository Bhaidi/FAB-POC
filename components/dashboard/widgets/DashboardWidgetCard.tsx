"use client";

import { Box, Link, Text, useColorMode, VStack } from "@chakra-ui/react";
import type { DashboardWidget } from "@/types/platformDashboard";
import { dashRadius, figmaHomeServiceCard } from "@/components/dashboard/dashboardTokens";
import { DashboardWidgetBody } from "@/components/dashboard/widgets/DashboardWidgetBody";
import { dashboardDarkCardSurface } from "@/lib/dashboardDarkCardSurface";
import { useFabTokens } from "@/components/theme/FabTokensContext";

/** Dark widget rail — aligned with Figma `558:17644` service cards: 24px radius, 24px pad, 5% fill. */

/** Primary heading — ~2rem, medium weight. */
const WIDGET_HEADING_DARK = {
  fontFamily: "var(--font-graphik)",
  fontSize: { base: "20px", md: "2rem" },
  fontWeight: 500,
  lineHeight: "normal",
  letterSpacing: "0",
  color: "var(--text-white, #ffffff)",
} as const;

/** Description — slightly smaller, muted white. */
const WIDGET_DESC_DARK = {
  fontFamily: "var(--font-graphik)",
  fontSize: { base: "11px", md: "1.05rem" },
  fontWeight: 400,
  lineHeight: "normal",
  letterSpacing: "0",
  color: "rgba(255, 255, 255, 0.78)",
} as const;

export function DashboardWidgetCard({ widget, compact = false }: { widget: DashboardWidget; compact?: boolean }) {
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";
  const { dashColors, dashEffects, dashShadow } = useFabTokens();
  const primary = widget.emphasis === "primary";

  return (
    <Box
      role="group"
      borderRadius={isDark ? figmaHomeServiceCard.radius : dashRadius.panel}
      border="1px solid"
      borderColor={
        primary
          ? "rgba(0, 98, 255, 0.35)"
          : isDark
            ? dashboardDarkCardSurface.border
            : dashColors.cardBorder
      }
      bg={
        primary
          ? isDark
            ? "linear-gradient(165deg, rgba(0, 72, 160, 0.45) 0%, rgba(14, 20, 44, 0.88) 100%)"
            : "rgba(0, 40, 120, 0.22)"
          : isDark
            ? figmaHomeServiceCard.fill
            : dashColors.cardBg
      }
      backdropFilter={isDark ? dashboardDarkCardSurface.backdrop : dashEffects.surfaceBlur}
      sx={{ WebkitBackdropFilter: isDark ? dashboardDarkCardSurface.backdrop : dashEffects.surfaceBlur }}
      boxShadow={isDark ? dashboardDarkCardSurface.motionRest : dashShadow.cardGlow}
      p={
        isDark
          ? compact
            ? { base: 2.5, md: 3 }
            : figmaHomeServiceCard.padding
          : compact
            ? { base: 2.5, md: 3 }
            : { base: 4, md: 5 }
      }
      minH={compact ? 0 : "140px"}
      h={compact ? "full" : undefined}
      display="flex"
      flexDirection="column"
      minW={0}
      overflow={compact ? "hidden" : undefined}
      transition="box-shadow 0.28s cubic-bezier(0.33, 1, 0.68, 1), transform 0.28s cubic-bezier(0.33, 1, 0.68, 1), border-color 0.28s ease"
      _hover={{
        boxShadow: isDark ? dashboardDarkCardSurface.motionHover : dashShadow.cardGlowHover,
        transform: compact ? "translateY(-1px)" : "translateY(-2px)",
        borderColor: primary
          ? "rgba(0, 120, 255, 0.5)"
          : isDark
            ? dashboardDarkCardSurface.borderHover
            : dashColors.cardBorderHover,
      }}
    >
      <VStack align="stretch" spacing={compact ? 2 : 3} flex={1} minH={0}>
        <Box flexShrink={0}>
          {isDark ? (
            <VStack align="stretch" spacing={3}>
              <Text {...WIDGET_HEADING_DARK} fontSize={compact ? "16px" : WIDGET_HEADING_DARK.fontSize} noOfLines={compact ? 2 : undefined}>
                {widget.title}
              </Text>
              {widget.subtitle ? (
                <Text {...WIDGET_DESC_DARK} fontSize={compact ? "10px" : WIDGET_DESC_DARK.fontSize} noOfLines={compact ? 3 : undefined}>
                  {widget.subtitle}
                </Text>
              ) : null}
            </VStack>
          ) : (
            <>
              <Text
                fontFamily="var(--font-graphik)"
                fontSize={compact ? "9px" : "11px"}
                fontWeight={600}
                letterSpacing="0.1em"
                textTransform="uppercase"
                color={dashColors.text.muted}
                mb={compact ? 0.5 : 1}
                noOfLines={compact ? 2 : undefined}
              >
                {widget.title}
              </Text>
              {widget.subtitle ? (
                <Text
                  fontFamily="var(--font-graphik)"
                  fontSize={compact ? { base: "13px", md: "14px" } : { base: "16px", md: "17px" }}
                  fontWeight={500}
                  color={dashColors.text.primary}
                  lineHeight={1.2}
                  noOfLines={compact ? 2 : undefined}
                >
                  {widget.subtitle}
                </Text>
              ) : null}
            </>
          )}
        </Box>

        <Box flex={1} minH={0} overflow="hidden">
          <DashboardWidgetBody widget={widget} compact={compact} />
        </Box>

        {widget.cta ? (
          <Link
            href={widget.cta.href ?? "#"}
            fontFamily="var(--font-graphik)"
            fontSize={compact ? "11px" : "13px"}
            fontWeight={600}
            color={dashColors.accent}
            _hover={{ color: "rgba(0, 98, 255, 0.85)", textDecoration: "none" }}
            onClick={(e) => {
              e.preventDefault();
              if (typeof window !== "undefined" && process.env.NODE_ENV === "development" && widget.cta?.actionId) {
                // eslint-disable-next-line no-console
                console.log("[dashboard:cta]", widget.cta.actionId);
              }
            }}
          >
            {widget.cta.label}
          </Link>
        ) : null}
      </VStack>
    </Box>
  );
}
