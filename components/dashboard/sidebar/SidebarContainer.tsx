"use client";

import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Box, Flex, IconButton, Text, VStack } from "@chakra-ui/react";
import { ChevronsLeft, ChevronsRight } from "lucide-react";
import type { CapabilityMenuItem } from "@/data/dashboardTypes";
import { useDashboardEntitlements } from "@/components/dashboard/DashboardEntitlementsContext";
import { useDashboardGlobal } from "@/components/dashboard/DashboardGlobalContext";
import { useDashboardTaxonomy } from "@/components/dashboard/DashboardTaxonomyContext";
import { dashColors, dashEffects, dashLayout, dashShadow } from "@/components/dashboard/dashboardTokens";
import { SidebarCollapsedRail } from "@/components/dashboard/sidebar/SidebarCollapsedRail";
import { SidebarSection } from "@/components/dashboard/sidebar/SidebarSection";
import { resolveSelectedL1Code } from "@/lib/taxonomyNavUtils";
import { findActiveBranchIds } from "@/lib/sidebarNavUtils";

export type SidebarContainerProps = {
  collapsed: boolean;
  onToggleCollapse: () => void;
  onRequestExpand: () => void;
  onRequestCollapse: () => void;
};

type SidebarNavProps = SidebarContainerProps & {
  activeNavId: string | null;
  domainParam: string | null;
};

function SidebarNav({
  collapsed,
  onToggleCollapse,
  onRequestExpand,
  onRequestCollapse,
  activeNavId,
  domainParam,
}: SidebarNavProps) {
  const router = useRouter();
  const pathname = usePathname();
  const asideRef = useRef<HTMLElement | null>(null);
  const prevCollapsedRef = useRef(collapsed);
  const skipExpandResetRef = useRef(false);
  const { organizationId, marketCode } = useDashboardGlobal();
  const { menuEntitled, menuAvailable, fullMenu: legacyFullMenu } = useDashboardEntitlements();
  const { merge: taxonomyMerge, error: taxonomyError } = useDashboardTaxonomy();

  const taxonomyShellActive = Boolean(organizationId && marketCode);

  const fullMenuForTaxonomy = useMemo(() => {
    if (!taxonomyMerge) return [];
    return Array.from(taxonomyMerge.domainByL1.values());
  }, [taxonomyMerge]);

  const selectedL1Code = useMemo(() => {
    if (!taxonomyMerge) return "";
    return resolveSelectedL1Code(taxonomyMerge, domainParam, activeNavId);
  }, [taxonomyMerge, domainParam, activeNavId]);

  const [openL1Id, setOpenL1Id] = useState<string | null>(null);
  const [openL2Ids, setOpenL2Ids] = useState<Record<string, boolean>>({});

  const taxonomyMergeRef = useRef(taxonomyMerge);
  taxonomyMergeRef.current = taxonomyMerge;
  const taxonomyTrailKey = `${domainParam ?? ""}\0${activeNavId ?? ""}`;
  const taxonomyMenuReady = Boolean(taxonomyMerge?.domainByL1.size);

  /**
   * Taxonomy: expand/collapse from URL only (deps avoid merge object identity so refetches
   * don’t wipe manual expansion on plain /dashboard). No `domain`/`nav` → collapse all.
   */
  useEffect(() => {
    if (!taxonomyShellActive || !taxonomyMenuReady) return;
    const tm = taxonomyMergeRef.current;
    if (!tm) return;

    if (!domainParam && !activeNavId) {
      setOpenL1Id(null);
      setOpenL2Ids({});
      return;
    }

    const fullMenu = Array.from(tm.domainByL1.values());
    const branch = findActiveBranchIds(fullMenu, activeNavId);
    const l1FromParam = domainParam && tm.domainByL1.has(domainParam) ? domainParam : null;
    const l1 = branch.l1 ?? l1FromParam;
    if (!l1) return;

    setOpenL1Id(l1);
    if (branch.l2 && branch.l1 === l1) {
      setOpenL2Ids({ [branch.l2]: true });
    } else {
      setOpenL2Ids({});
    }
  }, [taxonomyShellActive, taxonomyMenuReady, taxonomyTrailKey, marketCode, domainParam, activeNavId]);

  useEffect(() => {
    if (collapsed) return;
    const root = asideRef.current;
    if (!root) return;

    const onPointerDown = (e: PointerEvent) => {
      const t = e.target;
      if (!(t instanceof Node)) return;
      if (root.contains(t)) return;
      onRequestCollapse();
    };

    document.addEventListener("pointerdown", onPointerDown, true);
    return () => document.removeEventListener("pointerdown", onPointerDown, true);
  }, [collapsed, onRequestCollapse]);

  useEffect(() => {
    const wasCollapsed = prevCollapsedRef.current;
    prevCollapsedRef.current = collapsed;
    if (wasCollapsed && !collapsed) {
      if (skipExpandResetRef.current) {
        skipExpandResetRef.current = false;
        return;
      }
      if (!taxonomyShellActive || !taxonomyMerge) {
        setOpenL1Id(null);
        setOpenL2Ids({});
      }
    }
  }, [collapsed, taxonomyShellActive, taxonomyMerge]);

  /** Accordion L1: switching domain closes the previous tree; one L2 open at a time. */
  const toggleL1 = useCallback((id: string) => {
    setOpenL1Id((prev) => (prev === id ? null : id));
    setOpenL2Ids({});
  }, []);

  const toggleL2 = useCallback((l2Id: string) => {
    setOpenL2Ids((prev) => {
      if (prev[l2Id]) return {};
      return { [l2Id]: true };
    });
  }, []);

  const onNavigate = useCallback(
    (item: CapabilityMenuItem) => {
      if (item.access === "locked") return;
      const href = item.href;
      if (href && href !== "#") {
        if (taxonomyShellActive && taxonomyMerge && selectedL1Code) {
          try {
            const base = typeof window !== "undefined" ? window.location.origin : "http://localhost";
            const u = new URL(href, base);
            const nav = u.searchParams.get("nav") ?? item.id;
            const q = new URLSearchParams();
            q.set("domain", selectedL1Code);
            q.set("nav", nav);
            router.push(`${pathname}?${q.toString()}`);
            return;
          } catch {
            router.push(href);
            return;
          }
        }
        router.push(href);
        return;
      }
      if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
        // eslint-disable-next-line no-console
        console.log("[capability nav]", item.id, pathname);
      }
    },
    [router, pathname, taxonomyShellActive, taxonomyMerge, selectedL1Code]
  );

  const onCollapsedDomainActivate = useCallback(
    (domain: CapabilityMenuItem) => {
      skipExpandResetRef.current = true;
      onRequestExpand();
      if (taxonomyShellActive && taxonomyMerge) {
        // Only set L1 in the URL — do not deep-link to a leaf. User expands L2 → L3 in the sidebar.
        const q = new URLSearchParams();
        q.set("domain", domain.id);
        router.push(`${pathname}?${q.toString()}`);
        return;
      }
      setOpenL1Id(domain.id);
    },
    [taxonomyShellActive, taxonomyMerge, onRequestExpand, router, pathname]
  );

  const sidebarW = collapsed ? dashLayout.sidebarWidthCollapsed : dashLayout.sidebarWidthExpanded;

  const renderLegacyDomain = (domain: CapabilityMenuItem) => (
    <SidebarSection
      key={domain.id}
      domain={domain}
      menu={legacyFullMenu}
      isOpen={openL1Id === domain.id}
      onToggle={() => toggleL1(domain.id)}
      openL2Ids={openL2Ids}
      onToggleL2={toggleL2}
      onNavigate={onNavigate}
      activeNavId={activeNavId}
    />
  );

  const railEntitled = useMemo(() => {
    if (!taxonomyShellActive) return menuEntitled;
    if (taxonomyMerge?.railDomains?.length) return taxonomyMerge.railDomains;
    return menuEntitled;
  }, [taxonomyShellActive, taxonomyMerge, menuEntitled]);

  const railAvailable = taxonomyShellActive ? [] : menuAvailable;
  const sidebarFullMenu = taxonomyShellActive && taxonomyMerge ? fullMenuForTaxonomy : legacyFullMenu;

  const renderTaxonomyDomain = (domain: CapabilityMenuItem) => (
    <SidebarSection
      key={domain.id}
      domain={domain}
      menu={sidebarFullMenu}
      isOpen={openL1Id === domain.id}
      onToggle={() => toggleL1(domain.id)}
      openL2Ids={openL2Ids}
      onToggleL2={toggleL2}
      onNavigate={onNavigate}
      activeNavId={activeNavId}
    />
  );

  const renderTaxonomyExpanded = () => {
    if (taxonomyError) {
      return (
        <Text fontFamily="var(--font-graphik)" fontSize="xs" color="rgba(245, 158, 11, 0.9)" px={2} py={1}>
          {taxonomyError}
        </Text>
      );
    }
    if (taxonomyMerge && sidebarFullMenu.length > 0) {
      return <>{sidebarFullMenu.map(renderTaxonomyDomain)}</>;
    }
    if (taxonomyMerge && sidebarFullMenu.length === 0) {
      return (
        <Text fontFamily="var(--font-graphik)" fontSize="xs" color="rgba(255,255,255,0.45)" px={2} py={1}>
          No service domain is available for this market.
        </Text>
      );
    }
    return (
      <>
        {menuEntitled.map(renderLegacyDomain)}
        {menuAvailable.length > 0 ? (
          <Box w="full" pt={1}>
            <Text
              fontFamily="var(--font-graphik)"
              fontSize="10px"
              fontWeight={700}
              letterSpacing="0.16em"
              textTransform="uppercase"
              color="rgba(255,255,255,0.36)"
              px={2}
              mb={1}
            >
              Available Services
            </Text>
            <VStack align="stretch" spacing={6}>
              {menuAvailable.map(renderLegacyDomain)}
            </VStack>
          </Box>
        ) : null}
      </>
    );
  };

  const [navBootSoft, setNavBootSoft] = useState(true);
  useEffect(() => {
    const t = window.setTimeout(() => setNavBootSoft(false), 280) as unknown as number;
    return () => window.clearTimeout(t);
  }, []);

  return (
    <Box
      ref={asideRef}
      as="aside"
      data-fab-sidebar="true"
      className={navBootSoft ? "fab-sidebar-boot-soft" : undefined}
      w={sidebarW}
      flexShrink={0}
      minH={{ base: "auto", md: `calc(100dvh - ${dashLayout.primaryNavLayoutReserve})` }}
      position={{ base: "relative", md: "sticky" }}
      top={{ md: dashLayout.primaryNavLayoutReserve }}
      alignSelf={{ md: "flex-start" }}
      zIndex={2}
      transition="width 0.24s ease, padding 0.24s ease"
      overflow="hidden"
      borderRightWidth="1px"
      borderColor={dashColors.sidebarBorder}
      bg={dashColors.sidebarGlass}
      backgroundBlendMode="normal"
      backdropFilter={dashEffects.surfaceBlur}
      sx={{
        WebkitBackdropFilter: dashEffects.surfaceBlur,
        boxShadow: dashShadow.sidebarCapability,
      }}
    >
      <VStack
        align="stretch"
        spacing={0}
        minH={{ md: `calc(100dvh - ${dashLayout.primaryNavLayoutReserve} - 24px)` }}
        py={{ base: 2, md: 3 }}
        px={collapsed ? 2 : { base: 3, md: 3.5 }}
      >
        <Flex justify={collapsed ? "center" : "flex-end"} flexShrink={0} pr={collapsed ? 0 : 0.5} pt={0} pb={2}>
          <IconButton
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            icon={
              collapsed ? <ChevronsRight size={16} strokeWidth={2} aria-hidden /> : <ChevronsLeft size={16} strokeWidth={2} aria-hidden />
            }
            variant="ghost"
            size="sm"
            w="32px"
            h="32px"
            minW="32px"
            borderRadius="md"
            color={dashColors.text.secondary}
            _hover={{ bg: "rgba(255,255,255,0.12)", color: dashColors.text.primary }}
            onClick={onToggleCollapse}
          />
        </Flex>

        {collapsed ? (
          <Box flex="1" minH={0} overflowY="auto" overflowX="hidden" sx={{ scrollbarGutter: "stable" }}>
            <SidebarCollapsedRail
              activeNavId={activeNavId}
              entitledDomains={railEntitled}
              availableDomains={railAvailable}
              fullMenu={sidebarFullMenu}
              onActivateDomain={onCollapsedDomainActivate}
            />
          </Box>
        ) : (
          <Box flex="1" minH={0} overflowY="auto" overflowX="hidden" pr={1} sx={{ scrollbarGutter: "stable" }}>
            <VStack align="stretch" spacing={6} pb={2}>
              {taxonomyShellActive ? (
                renderTaxonomyExpanded()
              ) : (
                <>
                  {menuEntitled.map(renderLegacyDomain)}
                  {menuAvailable.length > 0 ? (
                    <Box w="full" pt={1}>
                      <Text
                        fontFamily="var(--font-graphik)"
                        fontSize="10px"
                        fontWeight={700}
                        letterSpacing="0.16em"
                        textTransform="uppercase"
                        color="rgba(255,255,255,0.36)"
                        px={2}
                        mb={1}
                      >
                        Available Services
                      </Text>
                      <VStack align="stretch" spacing={6}>
                        {menuAvailable.map(renderLegacyDomain)}
                      </VStack>
                    </Box>
                  ) : null}
                </>
              )}
            </VStack>
          </Box>
        )}
      </VStack>
    </Box>
  );
}

function SidebarNavWithSearchParams(props: SidebarContainerProps) {
  const searchParams = useSearchParams();
  const activeNavId = searchParams.get("nav");
  const domainParam = searchParams.get("domain");
  return <SidebarNav {...props} activeNavId={activeNavId} domainParam={domainParam} />;
}

export function SidebarContainer(props: SidebarContainerProps) {
  return (
    <Suspense fallback={<SidebarNav {...props} activeNavId={null} domainParam={null} />}>
      <SidebarNavWithSearchParams {...props} />
    </Suspense>
  );
}
