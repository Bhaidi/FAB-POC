"use client";

import { motion } from "framer-motion";
import type { Transition } from "framer-motion";
import type { CapabilityMenuItem } from "@/data/dashboardTypes";
import { SidebarLeafNavRow } from "@/components/dashboard/sidebar/SidebarLeafNavRow";
import {
  SIDEBAR_L3_ITEM_DURATION,
  SIDEBAR_L3_ITEM_EASE,
  SIDEBAR_L3_STAGGER_MS,
} from "@/components/dashboard/sidebar/sidebarNavStyles";

function subItemTransition(delay: number): Transition {
  return {
    duration: SIDEBAR_L3_ITEM_DURATION,
    ease: SIDEBAR_L3_ITEM_EASE,
    delay,
  };
}

export type SidebarSubItemProps = {
  item: CapabilityMenuItem;
  index: number;
  onNavigate: (item: CapabilityMenuItem) => void;
  activeNavId: string | null;
};

export function SidebarSubItem({ item, index, onNavigate, activeNavId }: SidebarSubItemProps) {
  const locked = item.access === "locked";
  const partial = item.access === "partial";
  const isActive = !!activeNavId && item.id === activeNavId;

  return (
    <motion.div
      style={{ width: "100%" }}
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={subItemTransition(index * SIDEBAR_L3_STAGGER_MS)}
    >
      <SidebarLeafNavRow
        variant="l3"
        label={item.label}
        isActive={isActive}
        locked={locked}
        partial={partial}
        onClick={locked ? undefined : () => onNavigate(item)}
      />
    </motion.div>
  );
}
