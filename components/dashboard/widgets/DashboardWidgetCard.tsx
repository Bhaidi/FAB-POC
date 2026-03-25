"use client";

import { Box, Link, Text, VStack } from "@chakra-ui/react";
import type { DashboardWidget } from "@/types/platformDashboard";
import { dashColors, dashEffects, dashRadius, dashShadow } from "@/components/dashboard/dashboardTokens";
import { DashboardWidgetBody } from "@/components/dashboard/widgets/DashboardWidgetBody";

export function DashboardWidgetCard({ widget, compact = false }: { widget: DashboardWidget; compact?: boolean }) {
  const primary = widget.emphasis === "primary";

  return (
    <Box
      role="group"
      borderRadius={dashRadius.panel}
      border="1px solid"
      borderColor={primary ? "rgba(0, 98, 255, 0.35)" : "rgba(255,255,255,0.1)"}
      bg={primary ? "rgba(0, 40, 120, 0.22)" : dashColors.cardBg}
      backdropFilter={dashEffects.surfaceBlur}
      sx={{ WebkitBackdropFilter: dashEffects.surfaceBlur }}
      boxShadow={dashShadow.cardGlow}
      p={compact ? { base: 2.5, md: 3 } : { base: 4, md: 5 }}
      minH={compact ? 0 : "140px"}
      h={compact ? "full" : undefined}
      display="flex"
      flexDirection="column"
      minW={0}
      overflow={compact ? "hidden" : undefined}
      transition="box-shadow 0.28s cubic-bezier(0.33, 1, 0.68, 1), transform 0.28s cubic-bezier(0.33, 1, 0.68, 1), border-color 0.28s ease"
      _hover={{
        boxShadow: dashShadow.cardGlowHover,
        transform: compact ? "translateY(-1px)" : "translateY(-2px)",
        borderColor: primary ? "rgba(0, 120, 255, 0.5)" : "rgba(255,255,255,0.14)",
      }}
    >
      <VStack align="stretch" spacing={compact ? 2 : 3} flex={1} minH={0}>
        <Box flexShrink={0}>
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
