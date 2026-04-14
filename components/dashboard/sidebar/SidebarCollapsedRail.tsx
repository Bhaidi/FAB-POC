"use client";

import { Box, IconButton, Text, Tooltip, useColorMode, VStack } from "@chakra-ui/react";
import { motion } from "framer-motion";
import type { CapabilityMenuItem } from "@/data/dashboardTypes";
import { getDomainNavLabel } from "@/data/domainNavLabels";
import { useFabTokens } from "@/components/theme/FabTokensContext";
import { glassTokens } from "@/lib/glassTokens";
import { DomainNavIcon } from "@/components/dashboard/sidebar/sidebarDomainIcons";
import { SIDEBAR_NAV_TOOLTIP_LABEL_COLOR, SIDEBAR_NAV_TOOLTIP_PROPS } from "@/components/dashboard/sidebar/sidebarNavTokens";
import { domainContainsActiveItem } from "@/lib/sidebarNavUtils";

const MotionSpan = motion.span;

export type SidebarCollapsedRailProps = {
  activeNavId: string | null;
  entitledDomains: CapabilityMenuItem[];
  availableDomains: CapabilityMenuItem[];
  fullMenu: CapabilityMenuItem[];
  onActivateDomain: (domain: CapabilityMenuItem) => void;
  pathname?: string | null;
};

function RailDomainButton({
  domain,
  activeNavId,
  fullMenu,
  onActivateDomain,
  pathname,
}: {
  domain: CapabilityMenuItem;
  activeNavId: string | null;
  fullMenu: CapabilityMenuItem[];
  onActivateDomain: (domain: CapabilityMenuItem) => void;
  pathname?: string | null;
}) {
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";
  const { dashColors } = useFabTokens();
  const trail = domainContainsActiveItem(domain, activeNavId, fullMenu, pathname);
  const navLabel = getDomainNavLabel(domain.id, domain.label);
  const subtitle = domain.subtitle ?? "";
  const tip = `${navLabel}${subtitle ? ` · ${subtitle}` : ""}${trail ? "\n(Current section)" : ""}`;

  return (
    <Tooltip
      label={
        <Text
          as="span"
          whiteSpace="pre-line"
          fontSize="12px"
          lineHeight={1.45}
          fontFamily="var(--font-graphik)"
          color={SIDEBAR_NAV_TOOLTIP_LABEL_COLOR}
        >
          {tip}
        </Text>
      }
      placement="right"
      hasArrow
      openDelay={280}
      gutter={14}
      px={3}
      py={2}
      {...SIDEBAR_NAV_TOOLTIP_PROPS}
    >
      <Box position="relative" display="flex" justifyContent="center" w="full">
        {trail && isDark ? (
          <Box
            position="absolute"
            left="-4px"
            top="50%"
            transform="translateY(-50%)"
            w="3px"
            h="22px"
            borderRadius="full"
            bg={dashColors.sidebarBeam}
            boxShadow="0 0 14px rgba(0, 120, 255, 0.95)"
            pointerEvents="none"
            aria-hidden
          />
        ) : null}
        <IconButton
          aria-label={navLabel}
          icon={
            <MotionSpan
              style={{ display: "inline-flex", transformOrigin: "center center" }}
              whileHover={domain.access === "locked" ? undefined : { scale: 1.06 }}
              transition={{ type: "tween", duration: 0.22, ease: [0.42, 0, 0.58, 1] }}
            >
              <DomainNavIcon domainId={domain.id} size={!isDark && trail ? 24 : 22} />
            </MotionSpan>
          }
          variant="ghost"
          size="sm"
          w={
            isDark ? "48px" : trail ? "56px" : "40px"
          }
          h={
            isDark ? "48px" : trail ? "56px" : "40px"
          }
          minW={
            isDark ? "48px" : trail ? "56px" : "40px"
          }
          borderRadius={isDark ? "14px" : trail ? "16px" : glassTokens.radius.iconButton}
          opacity={domain.access === "locked" ? 0.45 : 1}
          color={
            isDark
              ? trail
                ? "#ffffff"
                : "rgba(255, 255, 255, 0.55)"
              : trail
                ? dashColors.homeWelcomeAccent
                : "rgba(255, 255, 255, 0.88)"
          }
          bg={
            isDark
              ? trail
                ? glassTokens.sidebarRail.activeBg
                : "transparent"
              : trail
                ? "#FFFFFF"
                : "transparent"
          }
          borderWidth={0}
          borderColor="transparent"
          boxShadow={trail && isDark ? glassTokens.sidebarRail.activeShadow : "none"}
          filter={trail ? "none" : undefined}
          backdropFilter={isDark && trail ? glassTokens.sidebarRail.tileBlur : undefined}
          aria-disabled={domain.access === "locked"}
          cursor={domain.access === "locked" ? "not-allowed" : "pointer"}
          transition="background 0.25s ease-in-out, border-color 0.25s ease-in-out, box-shadow 0.25s ease-in-out, filter 0.25s ease-in-out, backdrop-filter 0.25s ease-in-out"
          onClick={() => {
            if (domain.access !== "locked") onActivateDomain(domain);
          }}
          sx={{
            ...(isDark && trail ? { WebkitBackdropFilter: glassTokens.sidebarRail.tileBlur } : {}),
          }}
          _hover={
            domain.access === "locked"
              ? {}
              : isDark
                ? {
                    bg: trail ? glassTokens.sidebarRail.activeBg : glassTokens.sidebarRail.hoverBg,
                    color: trail ? "#ffffff" : "rgba(255, 255, 255, 0.85)",
                    borderColor: trail
                      ? glassTokens.sidebarRail.activeBorder
                      : glassTokens.sidebarRail.hoverBorder,
                    backdropFilter: glassTokens.sidebarRail.tileBlur,
                    WebkitBackdropFilter: glassTokens.sidebarRail.tileBlur,
                    boxShadow: trail ? glassTokens.sidebarRail.activeShadow : "none",
                  }
                : {
                    bg: trail ? "#F2F6FF" : "rgba(255, 255, 255, 0.12)",
                    color: trail ? dashColors.homeWelcomeAccent : "rgba(255, 255, 255, 0.96)",
                    borderColor: "transparent",
                  }
          }
        />
      </Box>
    </Tooltip>
  );
}

export function SidebarCollapsedRail({
  activeNavId,
  entitledDomains,
  availableDomains,
  fullMenu,
  onActivateDomain,
  pathname,
}: SidebarCollapsedRailProps) {
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";
  const itemGap = isDark ? `${glassTokens.sidebarRail.collapsedItemGapPx}px` : 2;

  return (
    <VStack align="stretch" spacing={itemGap} w="full" py={isDark ? 0 : 1}>
      {entitledDomains.map((domain) => (
        <RailDomainButton
          key={domain.id}
          domain={domain}
          activeNavId={activeNavId}
          fullMenu={fullMenu}
          onActivateDomain={onActivateDomain}
          pathname={pathname}
        />
      ))}
      {availableDomains.length > 0 ? (
        <Box w="full" py={isDark ? 1 : 2} aria-hidden>
          <Box
            h="1px"
            w="full"
            bg={isDark ? "rgba(1, 5, 145, 0.1)" : "rgba(255, 255, 255, 0.22)"}
            borderRadius="full"
          />
        </Box>
      ) : null}
      {availableDomains.map((domain) => (
        <RailDomainButton
          key={domain.id}
          domain={domain}
          activeNavId={activeNavId}
          fullMenu={fullMenu}
          onActivateDomain={onActivateDomain}
          pathname={pathname}
        />
      ))}
    </VStack>
  );
}
