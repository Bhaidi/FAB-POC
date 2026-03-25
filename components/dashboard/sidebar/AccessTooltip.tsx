"use client";

import type { ReactElement } from "react";
import { Tooltip } from "@chakra-ui/react";
import type { CapabilityAccess } from "@/data/dashboardTypes";
import { SIDEBAR_NAV_TOOLTIP_PROPS } from "@/components/dashboard/sidebar/sidebarNavTokens";

const PARTIAL = "Limited access for your role.";
const LOCKED = "Access not enabled for your role";

export type AccessTooltipProps = {
  access: CapabilityAccess;
  children: ReactElement;
  /** When false, no tooltip (e.g. full access). */
  enabled?: boolean;
  /** Override default copy (e.g. collapsed rail). */
  labelOverride?: string;
};

export function AccessTooltip({ access, children, enabled = true, labelOverride }: AccessTooltipProps) {
  if (!enabled || access === "full") {
    return children;
  }

  const label = labelOverride ?? (access === "partial" ? PARTIAL : LOCKED);

  return (
    <Tooltip
      label={label}
      placement="right"
      hasArrow
      openDelay={200}
      gutter={12}
      shouldWrapChildren
      {...SIDEBAR_NAV_TOOLTIP_PROPS}
      px={3}
      py={2}
      fontSize="13px"
      maxW="260px"
    >
      {children}
    </Tooltip>
  );
}
