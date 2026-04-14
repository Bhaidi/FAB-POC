"use client";

import type { ReactNode } from "react";
import { useCallback, useEffect, useState } from "react";
import { Box, Flex } from "@chakra-ui/react";
import { DashboardBackground } from "@/components/dashboard/DashboardBackground";
import { DashboardPrimaryNav } from "@/components/dashboard/DashboardPrimaryNav";
import { DashboardEntitlementsProvider } from "@/components/dashboard/DashboardEntitlementsContext";
import { DashboardGlobalContextProvider } from "@/components/dashboard/DashboardGlobalContext";
import { DashboardMarketContentTransition } from "@/components/dashboard/DashboardMarketContentTransition";
import { DashboardTaxonomyProvider } from "@/components/dashboard/DashboardTaxonomyContext";
import { DashboardSidebar, SIDEBAR_LS_KEY } from "@/components/dashboard/DashboardSidebar";
import { dashLayout } from "@/components/dashboard/dashboardTokens";
import { useDashboardDocumentCanvas } from "@/components/dashboard/useDashboardDocumentCanvas";
import { useFabTokens } from "@/components/theme/FabTokensContext";

export type DashboardShellProps = {
  displayName: string;
  role: string;
  corporateId: string;
  userId: string;
  onSignOut: () => void;
  children: ReactNode;
  /** Pass false for routes where content should sit directly on the gradient (no extra canvas overlay). */
  ambientBackgroundOverlay?: boolean;
};

export function DashboardShell({
  displayName,
  role,
  corporateId,
  userId,
  onSignOut,
  children,
  ambientBackgroundOverlay = true,
}: DashboardShellProps) {
  useDashboardDocumentCanvas();
  const { dashColors } = useFabTokens();

  /** Default collapsed on load; localStorage `"0"` restores expanded if the user left it open. */
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);

  useEffect(() => {
    try {
      if (typeof window !== "undefined" && localStorage.getItem(SIDEBAR_LS_KEY) === "0") {
        setSidebarCollapsed(false);
      }
    } catch {
      /* ignore */
    }
  }, []);

  const toggleSidebar = useCallback(() => {
    setSidebarCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(SIDEBAR_LS_KEY, next ? "1" : "0");
      } catch {
        /* ignore */
      }
      return next;
    });
  }, []);

  const expandSidebar = useCallback(() => {
    setSidebarCollapsed(false);
    try {
      localStorage.setItem(SIDEBAR_LS_KEY, "0");
    } catch {
      /* ignore */
    }
  }, []);

  const collapseSidebar = useCallback(() => {
    setSidebarCollapsed(true);
    try {
      localStorage.setItem(SIDEBAR_LS_KEY, "1");
    } catch {
      /* ignore */
    }
  }, []);

  return (
    <Box position="relative" minH="100dvh" w="100%" maxW="100vw" sx={{ overflowX: "clip" }}>
      <DashboardBackground ambientOverlay={ambientBackgroundOverlay} />
      <Flex position="relative" zIndex={1} direction="column" align="stretch" minH="100dvh">
        <DashboardGlobalContextProvider>
          <DashboardTaxonomyProvider>
            <DashboardPrimaryNav
              displayName={displayName}
              role={role}
              corporateId={corporateId}
              userId={userId}
              onSignOut={onSignOut}
            />
            <DashboardEntitlementsProvider>
              <Flex direction={{ base: "column", md: "row" }} align="stretch" flex="1" minH={0}>
                <DashboardSidebar
                  collapsed={sidebarCollapsed}
                  onToggleCollapse={toggleSidebar}
                  onRequestExpand={expandSidebar}
                  onRequestCollapse={collapseSidebar}
                />
                <Flex direction="column" flex="1" minW={0} minH={{ base: "auto", md: 0 }}>
                  <Box
                    as="main"
                    flex="1"
                    w="full"
                    maxW="none"
                    mx={0}
                    px={{ base: 4, md: 6, lg: 8 }}
                    pt={{ base: 0, md: 2, lg: 2 }}
                    pb={{ base: 6, md: 10, lg: 4 }}
                    display="flex"
                    flexDirection="column"
                    minH={0}
                    position="relative"
                    sx={{
                      ...(dashColors.mainWellInsetShadow && dashColors.mainWellInsetShadow !== "none"
                        ? { boxShadow: dashColors.mainWellInsetShadow }
                        : {}),
                    }}
                  >
                    <DashboardMarketContentTransition>{children}</DashboardMarketContentTransition>
                  </Box>
                </Flex>
              </Flex>
            </DashboardEntitlementsProvider>
          </DashboardTaxonomyProvider>
        </DashboardGlobalContextProvider>
      </Flex>
    </Box>
  );
}
