"use client";

import { SidebarContainer } from "@/components/dashboard/sidebar/SidebarContainer";

const SIDEBAR_LS_KEY = "fab_dash_sidebar";

export type DashboardSidebarProps = {
  collapsed: boolean;
  onToggleCollapse: () => void;
  /** Expand from collapsed rail without toggling closed when already expanded. */
  onRequestExpand: () => void;
  /** Collapse when user clicks outside the sidebar (expanded state only). */
  onRequestCollapse: () => void;
};

export function DashboardSidebar({
  collapsed,
  onToggleCollapse,
  onRequestExpand,
  onRequestCollapse,
}: DashboardSidebarProps) {
  return (
    <SidebarContainer
      collapsed={collapsed}
      onToggleCollapse={onToggleCollapse}
      onRequestExpand={onRequestExpand}
      onRequestCollapse={onRequestCollapse}
    />
  );
}

export { SIDEBAR_LS_KEY };
