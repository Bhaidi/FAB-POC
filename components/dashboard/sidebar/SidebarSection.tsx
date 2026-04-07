"use client";

import { Box, Collapse, Flex, Text, Tooltip } from "@chakra-ui/react";
import { ChevronDown } from "lucide-react";
import { motion } from "framer-motion";
import type { CapabilityMenuItem } from "@/data/dashboardTypes";
import { getDomainNavLabel } from "@/data/domainNavLabels";
import { dashRadius } from "@/components/dashboard/dashboardTokens";
import { useFabTokens } from "@/components/theme/FabTokensContext";
import { AccessTooltip } from "@/components/dashboard/sidebar/AccessTooltip";
import { DomainNavIcon } from "@/components/dashboard/sidebar/sidebarDomainIcons";
import { LockIndicator } from "@/components/dashboard/sidebar/LockIndicator";
import { SidebarItem } from "@/components/dashboard/sidebar/SidebarItem";
import {
  SIDEBAR_CHEVRON_TRANSITION,
  SIDEBAR_EXPAND_CHEVRON_CELL,
  SIDEBAR_EXPAND_CHEVRON_SIZE,
  SIDEBAR_L1_ACCENT_W,
  SIDEBAR_L2_STACK_INSET,
  SIDEBAR_NAV_TOOLTIP_LABEL_COLOR,
  SIDEBAR_NAV_TOOLTIP_PROPS,
} from "@/components/dashboard/sidebar/sidebarNavTokens";
import { sidebarCollapseTransition } from "@/components/dashboard/sidebar/sidebarNavStyles";
import { domainContainsActiveItem } from "@/lib/sidebarNavUtils";

const MotionBox = motion(Box);

export type SidebarSectionProps = {
  domain: CapabilityMenuItem;
  menu: CapabilityMenuItem[];
  isOpen: boolean;
  /** Label and chevron both invoke this — same seamless row. */
  onToggle: () => void;
  openL2Ids: Record<string, boolean>;
  onToggleL2: (l2Id: string) => void;
  onNavigate: (item: CapabilityMenuItem) => void;
  activeNavId: string | null;
  pathname?: string | null;
};

export function SidebarSection({
  domain,
  menu,
  isOpen,
  onToggle,
  openL2Ids,
  onToggleL2,
  onNavigate,
  activeNavId,
  pathname,
}: SidebarSectionProps) {
  const { dashColors } = useFabTokens();
  const locked = domain.access === "locked";
  const partial = domain.access === "partial";
  const children = domain.children ?? [];
  const trailActive = domainContainsActiveItem(domain, activeNavId, menu, pathname);
  const navLabel = getDomainNavLabel(domain.id, domain.label);
  const iconTip = domain.subtitle ? `${navLabel} — ${domain.subtitle}` : navLabel;

  if (locked) {
    return (
      <AccessTooltip access="locked">
        <Box
          role="group"
          w="full"
          borderRadius={dashRadius.surface}
          px={2}
          py={2.5}
          opacity={0.48}
          cursor="not-allowed"
          borderLeftWidth={SIDEBAR_L1_ACCENT_W}
          borderLeftColor="transparent"
          bg="rgba(1, 5, 145, 0.03)"
          tabIndex={0}
          _focusVisible={{ outline: "none", boxShadow: "0 0 0 2px rgba(0, 98, 255, 0.35)" }}
        >
          <Flex align="flex-start" justify="space-between" gap={2.5} pointerEvents="none">
            <Tooltip
              label={iconTip}
              placement="right"
              hasArrow
              openDelay={400}
              gutter={10}
              borderRadius="md"
              px={2}
              py={1.5}
              {...SIDEBAR_NAV_TOOLTIP_PROPS}
            >
              <Box
                flexShrink={0}
                w="32px"
                h="32px"
                display="flex"
                alignItems="center"
                justifyContent="center"
                borderRadius="md"
                color={dashColors.text.faint}
              >
                <DomainNavIcon domainId={domain.id} size={22} />
              </Box>
            </Tooltip>
            <Box minW={0} flex="1">
              <Text
                fontFamily="var(--font-graphik)"
                fontSize="12px"
                fontWeight={700}
                letterSpacing="0.12em"
                textTransform="uppercase"
                color={dashColors.text.secondary}
                noOfLines={2}
              >
                {navLabel}
              </Text>
              {domain.subtitle ? (
                <Text mt={1} fontFamily="var(--font-graphik)" fontSize="11px" lineHeight="1.35" color={dashColors.text.muted} noOfLines={2}>
                  {domain.subtitle}
                </Text>
              ) : null}
            </Box>
            <LockIndicator />
          </Flex>
        </Box>
      </AccessTooltip>
    );
  }

  const shellStyles = {
    align: "center" as const,
    gap: 2.5 as const,
    w: "full" as const,
    px: 2.5,
    py: 3,
    borderRadius: "10px",
    borderLeftWidth: SIDEBAR_L1_ACCENT_W,
    borderLeftColor: trailActive ? dashColors.sidebarBeam : isOpen ? "rgba(0, 98, 255, 0.4)" : "transparent",
    boxShadow: trailActive ? "0 0 20px rgba(0, 98, 255, 0.12), inset 0 0 0 1px rgba(1, 5, 145, 0.06)" : isOpen ? dashColors.sidebarBeamSoft : "none",
    bg: trailActive ? "rgba(0, 98, 255, 0.12)" : isOpen ? "rgba(0, 98, 255, 0.06)" : "transparent",
    transition: "background 0.25s ease-in-out, border-color 0.25s ease-in-out, box-shadow 0.25s ease-in-out",
  };

  const titleBlock = (
    <Box as="span" display="block" w="full" minW={0} textAlign="left">
      <Text
        fontFamily="var(--font-graphik)"
        fontSize="12px"
        fontWeight={700}
        letterSpacing="0.12em"
        textTransform="uppercase"
        color={
          trailActive ? dashColors.text.primary : partial ? dashColors.text.tertiary : dashColors.text.secondary
        }
        noOfLines={2}
        transition="color 0.2s ease-in-out, font-weight 0.15s ease-in-out"
      >
        {navLabel}
      </Text>
      {domain.subtitle ? (
        <Text mt={1} fontFamily="var(--font-graphik)" fontSize="11px" lineHeight="1.4" color={dashColors.text.muted} noOfLines={2}>
          {domain.subtitle}
        </Text>
      ) : null}
    </Box>
  );

  const chevronVisual = (
    <Flex
      w={SIDEBAR_EXPAND_CHEVRON_CELL}
      h={SIDEBAR_EXPAND_CHEVRON_CELL}
      align="center"
      justify="center"
      flexShrink={0}
      aria-hidden
      pointerEvents="none"
    >
      <Box
        color={dashColors.text.muted}
        lineHeight={0}
        transition={SIDEBAR_CHEVRON_TRANSITION}
        transform={isOpen ? "rotate(180deg)" : "rotate(0deg)"}
      >
        <ChevronDown size={SIDEBAR_EXPAND_CHEVRON_SIZE} strokeWidth={2} aria-hidden />
      </Box>
    </Flex>
  );

  const iconCell = (
    <Tooltip
      label={
        <Text fontSize="12px" fontFamily="var(--font-graphik)" lineHeight={1.45} color={SIDEBAR_NAV_TOOLTIP_LABEL_COLOR}>
          {iconTip}
        </Text>
      }
      placement="right"
      hasArrow
      openDelay={280}
      gutter={12}
      px={3}
      py={2}
      {...SIDEBAR_NAV_TOOLTIP_PROPS}
    >
      <MotionBox
        flexShrink={0}
        w="32px"
        h="32px"
        display="flex"
        alignItems="center"
        justifyContent="center"
        borderRadius="md"
        color={
          trailActive ? dashColors.text.primary : partial ? dashColors.text.tertiary : dashColors.text.secondary
        }
        filter={
          trailActive
            ? "drop-shadow(0 0 6px rgba(0, 98, 255, 0.25)) drop-shadow(0 0 2px rgba(120, 190, 255, 0.2))"
            : undefined
        }
        transition={{ type: "tween", duration: 0.22, ease: [0.42, 0, 0.58, 1] }}
        whileHover={{ scale: 1.1 }}
        style={{ transformOrigin: "center center" }}
      >
        <DomainNavIcon domainId={domain.id} size={22} />
      </MotionBox>
    </Tooltip>
  );

  const expandRow = (
    <Box
      as="button"
      type="button"
      w="full"
      p={0}
      border="none"
      bg="transparent"
      cursor="pointer"
      borderRadius={dashRadius.surface}
      onClick={onToggle}
      aria-expanded={isOpen}
      aria-label={isOpen ? `Collapse ${navLabel}` : `Expand ${navLabel}`}
      _hover={{
        bg: "rgba(1, 5, 145, 0.04)",
        boxShadow: "0 0 20px rgba(0, 98, 255, 0.08), inset 0 0 0 1px rgba(1, 5, 145, 0.05)",
      }}
      _focusVisible={{ outline: "none", boxShadow: "0 0 0 2px rgba(0, 98, 255, 0.45)" }}
    >
      <Flex {...shellStyles}>
        {iconCell}
        <Box flex="1" minW={0}>
          {titleBlock}
        </Box>
        {chevronVisual}
      </Flex>
    </Box>
  );

  const headerRow = partial ? <AccessTooltip access="partial">{expandRow}</AccessTooltip> : expandRow;

  return (
    <Box w="full" pb={2} mb={3} borderBottomWidth="1px" borderColor="rgba(1, 5, 145, 0.06)">
      {headerRow}
      <Collapse in={isOpen} animateOpacity unmountOnExit transition={sidebarCollapseTransition}>
        <Box pt={4} display="flex" flexDirection="column" gap={3} {...SIDEBAR_L2_STACK_INSET}>
          {children.map((l2) => (
            <SidebarItem
              key={l2.id}
              item={l2}
              domainId={domain.id}
              menu={menu}
              l2Open={!!openL2Ids[l2.id]}
              onToggleL2={() => onToggleL2(l2.id)}
              onNavigate={onNavigate}
              activeNavId={activeNavId}
            />
          ))}
        </Box>
      </Collapse>
    </Box>
  );
}
