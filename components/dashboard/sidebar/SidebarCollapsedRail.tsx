"use client";

import { Box, IconButton, Text, Tooltip, VStack } from "@chakra-ui/react";
import { motion } from "framer-motion";
import type { CapabilityMenuItem } from "@/data/dashboardTypes";
import { getDomainNavLabel } from "@/data/domainNavLabels";
import { dashRadius } from "@/components/dashboard/dashboardTokens";
import { useFabTokens } from "@/components/theme/FabTokensContext";
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
        {trail ? (
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
              whileHover={domain.access === "locked" ? undefined : { scale: 1.1 }}
              transition={{ type: "tween", duration: 0.22, ease: [0.42, 0, 0.58, 1] }}
            >
              <DomainNavIcon domainId={domain.id} size={22} />
            </MotionSpan>
          }
          variant="ghost"
          size="sm"
          w="40px"
          h="40px"
          minW="40px"
          borderRadius={dashRadius.surface}
          opacity={domain.access === "locked" ? 0.45 : 1}
          color={trail ? dashColors.text.primary : dashColors.text.secondary}
          bg={trail ? "rgba(0, 98, 255, 0.12)" : "transparent"}
          borderWidth="1px"
          borderColor={trail ? "rgba(0, 98, 255, 0.45)" : "transparent"}
          boxShadow={
            trail
              ? "0 0 22px rgba(0, 98, 255, 0.35), inset 0 0 12px rgba(120, 180, 255, 0.12)"
              : "none"
          }
          filter={trail ? "drop-shadow(0 0 8px rgba(0, 140, 255, 0.55))" : undefined}
          aria-disabled={domain.access === "locked"}
          cursor={domain.access === "locked" ? "not-allowed" : "pointer"}
          transition="background 0.25s ease-in-out, border-color 0.25s ease-in-out, box-shadow 0.25s ease-in-out, filter 0.25s ease-in-out"
          onClick={() => {
            if (domain.access !== "locked") onActivateDomain(domain);
          }}
          _hover={
            domain.access === "locked"
              ? {}
              : {
                  bg: trail ? "rgba(0, 98, 255, 0.16)" : "rgba(1, 5, 145, 0.06)",
                  color: dashColors.text.primary,
                  borderColor: trail ? "rgba(0, 98, 255, 0.35)" : "rgba(1, 5, 145, 0.1)",
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
  return (
    <VStack align="stretch" spacing={2} w="full" py={1}>
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
        <Box w="full" py={2} aria-hidden>
          <Box h="1px" w="full" bg="rgba(1, 5, 145, 0.1)" borderRadius="full" />
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
