"use client";

import type { ReactNode } from "react";
import { Box, Collapse, Flex, Text } from "@chakra-ui/react";
import { ChevronDown } from "lucide-react";
import type { CapabilityMenuItem } from "@/data/dashboardTypes";
import { dashRadius } from "@/components/dashboard/dashboardTokens";
import { useFabTokens } from "@/components/theme/FabTokensContext";
import { SidebarLeafNavRow } from "@/components/dashboard/sidebar/SidebarLeafNavRow";
import { AccessTooltip } from "@/components/dashboard/sidebar/AccessTooltip";
import { LockIndicator } from "@/components/dashboard/sidebar/LockIndicator";
import { SidebarSubItem } from "@/components/dashboard/sidebar/SidebarSubItem";
import {
  SIDEBAR_CHEVRON_TRANSITION,
  SIDEBAR_EXPAND_CHEVRON_CELL,
  SIDEBAR_EXPAND_CHEVRON_SIZE,
  SIDEBAR_L3_GROUP_MARGIN,
  SIDEBAR_L3_INNER_GAP,
} from "@/components/dashboard/sidebar/sidebarNavTokens";
import { sidebarCollapseTransition } from "@/components/dashboard/sidebar/sidebarNavStyles";
import { l2ContainsActiveItem } from "@/lib/sidebarNavUtils";

export type SidebarItemProps = {
  item: CapabilityMenuItem;
  domainId: string;
  menu: CapabilityMenuItem[];
  l2Open: boolean;
  onToggleL2: () => void;
  onNavigate: (item: CapabilityMenuItem) => void;
  activeNavId: string | null;
};

function L2LeafRow({
  item,
  onNavigate,
  activeNavId,
}: {
  item: CapabilityMenuItem;
  onNavigate: (item: CapabilityMenuItem) => void;
  activeNavId: string | null;
}) {
  const locked = item.access === "locked";
  const partial = item.access === "partial";
  const isActive = activeNavId === item.id;

  return (
    <Box w="full">
      <SidebarLeafNavRow
        variant="l2"
        label={item.label}
        isActive={isActive}
        locked={locked}
        partial={partial}
        onClick={locked ? undefined : () => onNavigate(item)}
      />
    </Box>
  );
}

export function SidebarItem({ item, domainId, menu, l2Open, onToggleL2, onNavigate, activeNavId }: SidebarItemProps) {
  const { dashColors } = useFabTokens();
  const children = item.children;
  const locked = item.access === "locked";
  const partial = item.access === "partial";
  const l2Trail = l2ContainsActiveItem(item, domainId, activeNavId, menu);

  if (!children?.length) {
    return <L2LeafRow item={item} onNavigate={onNavigate} activeNavId={activeNavId} />;
  }

  const headerOpacity = locked ? 0.48 : partial ? 0.9 : 1;

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
        color={dashColors.text.faint}
        lineHeight={0}
        transition={SIDEBAR_CHEVRON_TRANSITION}
        transform={l2Open ? "rotate(180deg)" : "rotate(0deg)"}
      >
        <ChevronDown size={SIDEBAR_EXPAND_CHEVRON_SIZE} strokeWidth={2} aria-hidden />
      </Box>
    </Flex>
  );

  const rowInner = (
    <Flex
      align="center"
      gap={1.5}
      w="full"
      minH={SIDEBAR_EXPAND_CHEVRON_CELL}
      px={1.5}
      py={1.5}
      borderRadius="md"
      borderWidth="1px"
      borderColor={l2Trail ? "rgba(0, 98, 255, 0.22)" : "rgba(1, 5, 145, 0.06)"}
      bg={l2Trail ? "rgba(0, 98, 255, 0.1)" : "transparent"}
      opacity={headerOpacity}
      transition="background 0.2s ease, border-color 0.2s ease, opacity 0.2s ease"
      role="group"
      _hover={
        locked
          ? {}
          : {
              bg: l2Trail ? "rgba(0, 98, 255, 0.12)" : "rgba(1, 5, 145, 0.04)",
              borderColor: l2Trail ? "rgba(0, 98, 255, 0.28)" : "rgba(1, 5, 145, 0.08)",
            }
      }
    >
      <Text
        fontFamily="var(--font-graphik)"
        fontSize="12px"
        fontWeight={l2Trail ? 600 : 500}
        lineHeight="1.4"
        letterSpacing="0.01em"
        color={l2Trail ? dashColors.text.primary : dashColors.text.secondary}
        textAlign="left"
        noOfLines={2}
        flex="1"
        minW={0}
      >
        {item.label}
      </Text>
      {locked ? <LockIndicator /> : chevronVisual}
    </Flex>
  );

  const expandButton = (
    <Box
      as="button"
      type="button"
      w="full"
      p={0}
      border="none"
      bg="transparent"
      cursor={locked ? "not-allowed" : "pointer"}
      borderRadius={dashRadius.surface}
      disabled={locked}
      onClick={locked ? undefined : onToggleL2}
      aria-expanded={l2Open}
      aria-label={l2Open ? `Collapse ${item.label}` : `Expand ${item.label}`}
      _focusVisible={
        locked ? undefined : { outline: "none", boxShadow: "0 0 0 2px rgba(0, 98, 255, 0.45)" }
      }
    >
      {rowInner}
    </Box>
  );

  let headerRow: ReactNode;
  if (locked) {
    headerRow = (
      <AccessTooltip access="locked">
        <Box as="span" display="block" w="full">
          {expandButton}
        </Box>
      </AccessTooltip>
    );
  } else if (partial) {
    headerRow = <AccessTooltip access="partial">{expandButton}</AccessTooltip>;
  } else {
    headerRow = expandButton;
  }

  return (
    <Box w="full">
      {headerRow}
      <Collapse in={l2Open} animateOpacity unmountOnExit transition={sidebarCollapseTransition}>
        <Box
          mt={2}
          mb={0.5}
          py={2}
          px={2}
          borderRadius="8px"
          bg="rgba(1, 5, 145, 0.03)"
          borderWidth="1px"
          borderColor="rgba(1, 5, 145, 0.06)"
          boxShadow="inset 0 1px 0 rgba(255,255,255,0.9)"
          {...SIDEBAR_L3_GROUP_MARGIN}
          display="flex"
          flexDirection="column"
          gap={SIDEBAR_L3_INNER_GAP}
        >
          {children.map((child, i) => (
            <SidebarSubItem key={child.id} item={child} index={i} onNavigate={onNavigate} activeNavId={activeNavId} />
          ))}
        </Box>
      </Collapse>
    </Box>
  );
}
