"use client";

import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Box, Flex, IconButton, Text, useColorMode, VStack } from "@chakra-ui/react";
import { ChevronsLeft, ChevronsRight } from "lucide-react";
import type { CapabilityMenuItem } from "@/data/dashboardTypes";
import { useDashboardEntitlements } from "@/components/dashboard/DashboardEntitlementsContext";
import { useDashboardGlobal } from "@/components/dashboard/DashboardGlobalContext";
import { useDashboardTaxonomy } from "@/components/dashboard/DashboardTaxonomyContext";
import { dashLayout } from "@/components/dashboard/dashboardTokens";
import { GlassSurface } from "@/components/ui/GlassSurface";
import { useFabTokens } from "@/components/theme/FabTokensContext";
import { SidebarCollapsedRail } from "@/components/dashboard/sidebar/SidebarCollapsedRail";
import { SidebarSection } from "@/components/dashboard/sidebar/SidebarSection";
import { resolveSelectedL1Code } from "@/lib/taxonomyNavUtils";
import { findActiveBranchIds } from "@/lib/sidebarNavUtils";
import { glassTokens } from "@/lib/glassTokens";
import {
  ACCOUNT_SERVICES_BASE_PATH,
  expandedL2IdsForAccountDomain,
  filterAccountServicesDomains,
  findAccountServicesDomain,
  isAccountServicesPath,
} from "@/lib/accountServicesRoutes";

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
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";
  const { dashColors, dashEffects, dashShadow } = useFabTokens();
  const navLayoutReserve = isDark ? dashLayout.primaryNavLayoutReserve : dashLayout.primaryNavLayoutReserveLight;
  const router = useRouter();
  const pathname = usePathname() || "";
  const inAccountServices = isAccountServicesPath(pathname);
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
    if (pathname.startsWith(ACCOUNT_SERVICES_BASE_PATH)) return;
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
  }, [taxonomyShellActive, taxonomyMenuReady, taxonomyTrailKey, marketCode, domainParam, activeNavId, pathname]);

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
      if ((!taxonomyShellActive || !taxonomyMerge) && !pathname.startsWith(ACCOUNT_SERVICES_BASE_PATH)) {
        setOpenL1Id(null);
        setOpenL2Ids({});
      }
    }
  }, [collapsed, taxonomyShellActive, taxonomyMerge, pathname]);

  /** Accordion L1: switching domain closes the previous tree; one L2 open at a time. */
  const toggleL1 = useCallback((id: string) => {
    setOpenL1Id((prev) => (prev === id ? null : id));
    setOpenL2Ids({});
  }, []);

  const toggleL2 = useCallback(
    (l2Id: string) => {
      if (pathname.startsWith(ACCOUNT_SERVICES_BASE_PATH)) {
        setOpenL2Ids((prev) => ({ ...prev, [l2Id]: !prev[l2Id] }));
        return;
      }
      setOpenL2Ids((prev) => {
        if (prev[l2Id]) return {};
        return { [l2Id]: true };
      });
    },
    [pathname],
  );

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
            if (pathname.startsWith("/account-services")) {
              router.push(`/dashboard?${q.toString()}`);
              return;
            }
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
      if (domain.id === "accounts" || domain.id === "account-services") {
        router.push(ACCOUNT_SERVICES_BASE_PATH);
        return;
      }
      if (taxonomyShellActive && taxonomyMerge) {
        const q = new URLSearchParams();
        q.set("domain", domain.id);
        const target = pathname.startsWith("/account-services") ? `/dashboard?${q.toString()}` : `${pathname}?${q.toString()}`;
        router.push(target);
        return;
      }
      setOpenL1Id(domain.id);
    },
    [taxonomyShellActive, taxonomyMerge, onRequestExpand, router, pathname]
  );

  const sidebarTrackW = collapsed
    ? {
        base: dashLayout.sidebarWidthCollapsed,
        md: `calc(${dashLayout.sidebarWidthCollapsed} + ${dashLayout.sidebarCollapsedFloatInset} + ${dashLayout.sidebarCollapsedFloatInset})`,
      }
    : dashLayout.sidebarWidthExpanded;

  const railEntitled = useMemo(() => {
    let base: CapabilityMenuItem[];
    if (!taxonomyShellActive) base = menuEntitled;
    else if (taxonomyMerge?.railDomains?.length) base = taxonomyMerge.railDomains;
    else base = menuEntitled;
    return inAccountServices ? filterAccountServicesDomains(base, true) : base;
  }, [taxonomyShellActive, taxonomyMerge, menuEntitled, inAccountServices]);

  const railAvailable = taxonomyShellActive ? [] : menuAvailable;
  const railAvailableFiltered = inAccountServices ? filterAccountServicesDomains(railAvailable, true) : railAvailable;
  const sidebarFullMenu = taxonomyShellActive && taxonomyMerge ? fullMenuForTaxonomy : legacyFullMenu;

  const combinedDomainList = useMemo(() => {
    if (taxonomyShellActive && sidebarFullMenu.length > 0) return sidebarFullMenu;
    return [...menuEntitled, ...menuAvailable];
  }, [taxonomyShellActive, sidebarFullMenu, menuEntitled, menuAvailable]);

  const accountServicesDomain = useMemo(
    () => findAccountServicesDomain(combinedDomainList),
    [combinedDomainList],
  );

  const menuEntitledFiltered = inAccountServices ? filterAccountServicesDomains(menuEntitled, true) : menuEntitled;
  const menuAvailableFiltered = inAccountServices ? filterAccountServicesDomains(menuAvailable, true) : menuAvailable;
  const sidebarFullMenuFiltered = inAccountServices ? filterAccountServicesDomains(sidebarFullMenu, true) : sidebarFullMenu;

  const prevAccountServicesRef = useRef(false);
  useEffect(() => {
    const on = pathname.startsWith(ACCOUNT_SERVICES_BASE_PATH);
    if (on && !prevAccountServicesRef.current && collapsed) onRequestExpand();
    prevAccountServicesRef.current = on;
  }, [pathname, collapsed, onRequestExpand]);

  useEffect(() => {
    if (!pathname.startsWith(ACCOUNT_SERVICES_BASE_PATH) || !accountServicesDomain) return;
    setOpenL1Id(accountServicesDomain.id);
    setOpenL2Ids(expandedL2IdsForAccountDomain(accountServicesDomain));
  }, [pathname, accountServicesDomain]);

  const isDomainDrawerOpen = useCallback(
    (domainId: string) => {
      if (inAccountServices && accountServicesDomain?.id === domainId) return true;
      return openL1Id === domainId;
    },
    [inAccountServices, accountServicesDomain, openL1Id],
  );

  const onDomainToggle = useCallback(
    (domainId: string) => {
      if (inAccountServices && accountServicesDomain?.id === domainId) return;
      toggleL1(domainId);
    },
    [inAccountServices, accountServicesDomain, toggleL1],
  );

  const renderLegacyDomain = (domain: CapabilityMenuItem) => (
    <SidebarSection
      key={domain.id}
      domain={domain}
      menu={legacyFullMenu}
      isOpen={isDomainDrawerOpen(domain.id)}
      onToggle={() => onDomainToggle(domain.id)}
      openL2Ids={openL2Ids}
      onToggleL2={toggleL2}
      onNavigate={onNavigate}
      activeNavId={activeNavId}
      pathname={pathname}
    />
  );

  const renderTaxonomyDomain = (domain: CapabilityMenuItem) => (
    <SidebarSection
      key={domain.id}
      domain={domain}
      menu={sidebarFullMenu}
      isOpen={isDomainDrawerOpen(domain.id)}
      onToggle={() => onDomainToggle(domain.id)}
      openL2Ids={openL2Ids}
      onToggleL2={toggleL2}
      onNavigate={onNavigate}
      activeNavId={activeNavId}
      pathname={pathname}
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
    if (taxonomyMerge && sidebarFullMenuFiltered.length > 0) {
      return <>{sidebarFullMenuFiltered.map(renderTaxonomyDomain)}</>;
    }
    if (taxonomyMerge && sidebarFullMenu.length === 0) {
      return (
        <Text fontFamily="var(--font-graphik)" fontSize="xs" color={dashColors.text.muted} px={2} py={1}>
          No service domain is available for this market.
        </Text>
      );
    }
    return (
      <>
        {menuEntitledFiltered.map(renderLegacyDomain)}
        {menuAvailableFiltered.length > 0 ? (
          <Box w="full" pt={1}>
            <Text
              fontFamily="var(--font-graphik)"
              fontSize="10px"
              fontWeight={700}
              letterSpacing="0.16em"
              textTransform="uppercase"
              color={dashColors.text.muted}
              px={2}
              mb={1}
            >
              Available Services
            </Text>
            <VStack align="stretch" spacing={6}>
              {menuAvailableFiltered.map(renderLegacyDomain)}
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

  /** Figma `558:17725` — collapsed rail is a floating rounded shell (md+). */
  const collapsedFloat = collapsed;
  const collapsedRailComfort = collapsedFloat && isDark;
  /** Figma `558:17874` — light launch: navy collapsed rail (same affordances as dark glass rail). */
  const collapsedRailLightNavy = collapsedFloat && !isDark;

  const railBody = (
      <VStack
        align="stretch"
        spacing={0}
        minH={
          collapsedFloat
            ? { md: 0 }
            : { md: `calc(100dvh - ${navLayoutReserve} - 24px)` }
        }
        flex={{ md: 1 }}
        py={collapsedRailComfort || collapsedRailLightNavy ? 6 : { base: 2, md: 3 }}
        px={collapsed ? 2 : { base: 3, md: 3.5 }}
      >
        <Flex
          justify={collapsed ? "center" : "flex-end"}
          flexShrink={0}
          pr={collapsed ? 0 : 0.5}
          pt={0}
          pb={collapsedRailComfort || collapsedRailLightNavy ? `${glassTokens.sidebarRail.collapsedChevronGapPx}px` : 2}
        >
          <IconButton
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            icon={
              collapsed ? (
                <ChevronsRight
                  size={collapsedRailComfort || collapsedRailLightNavy ? 24 : 16}
                  strokeWidth={2}
                  aria-hidden
                />
              ) : (
                <ChevronsLeft size={16} strokeWidth={2} aria-hidden />
              )
            }
            variant="ghost"
            size="sm"
            w={collapsedRailComfort || collapsedRailLightNavy ? "40px" : "32px"}
            h={collapsedRailComfort || collapsedRailLightNavy ? "40px" : "32px"}
            minW={collapsedRailComfort || collapsedRailLightNavy ? "40px" : "32px"}
            borderRadius="md"
            color={
              collapsedRailComfort || collapsedRailLightNavy
                ? "rgba(255, 255, 255, 0.72)"
                : dashColors.text.secondary
            }
            _hover={
              collapsedRailComfort || collapsedRailLightNavy
                ? { bg: "rgba(255, 255, 255, 0.08)", color: "rgba(255, 255, 255, 0.92)" }
                : { bg: "rgba(1, 5, 145, 0.06)", color: dashColors.text.primary }
            }
            onClick={onToggleCollapse}
          />
        </Flex>

        {collapsed ? (
          <Box flex="1" minH={0} overflowY="auto" overflowX="hidden" sx={{ scrollbarGutter: "stable" }}>
            <SidebarCollapsedRail
              activeNavId={activeNavId}
              entitledDomains={railEntitled}
              availableDomains={railAvailableFiltered}
              fullMenu={sidebarFullMenu}
              onActivateDomain={onCollapsedDomainActivate}
              pathname={pathname}
            />
          </Box>
        ) : (
          <Box flex="1" minH={0} overflowY="auto" overflowX="hidden" pr={1} sx={{ scrollbarGutter: "stable" }}>
            <VStack align="stretch" spacing={6} pb={2}>
              {inAccountServices && !accountServicesDomain ? (
                <Text fontFamily="var(--font-graphik)" fontSize="sm" color={dashColors.text.muted} px={2} lineHeight={1.5}>
                  Account Services isn’t listed for this market profile. Use{" "}
                  <Text as="span" fontWeight={600} color={dashColors.text.secondary}>
                    Command centre
                  </Text>{" "}
                  in the top bar to return to the dashboard.
                </Text>
              ) : taxonomyShellActive ? (
                renderTaxonomyExpanded()
              ) : (
                <>
                  {menuEntitledFiltered.map(renderLegacyDomain)}
                  {menuAvailableFiltered.length > 0 ? (
                    <Box w="full" pt={1}>
                      <Text
                        fontFamily="var(--font-graphik)"
                        fontSize="10px"
                        fontWeight={700}
                        letterSpacing="0.16em"
                        textTransform="uppercase"
                        color={dashColors.text.muted}
                        px={2}
                        mb={1}
                      >
                        Available Services
                      </Text>
                      <VStack align="stretch" spacing={6}>
                        {menuAvailableFiltered.map(renderLegacyDomain)}
                      </VStack>
                    </Box>
                  ) : null}
                </>
              )}
            </VStack>
          </Box>
        )}
      </VStack>
  );

  const shellRadius = collapsed ? dashLayout.sidebarCollapsedOuterRadius : 0;
  const floatShadow = isDark ? "none" : collapsed
    ? `${dashShadow.sidebarCapability}, 0 16px 40px rgba(1, 5, 145, 0.12)`
    : dashShadow.sidebarCapability;

  return (
    <Box
      ref={asideRef}
      as="aside"
      data-fab-sidebar="true"
      className={navBootSoft ? "fab-sidebar-boot-soft" : undefined}
      w={sidebarTrackW}
      flexShrink={0}
      minH={{ base: "auto", md: `calc(100dvh - ${navLayoutReserve})` }}
      position={{ base: "relative", md: "sticky" }}
      top={{ md: navLayoutReserve }}
      alignSelf={{ md: "flex-start" }}
      zIndex={2}
      transition="width 0.24s ease, padding 0.24s ease"
      overflow={collapsedFloat ? { base: "hidden", md: "visible" } : "hidden"}
      display={{ md: collapsedFloat ? "flex" : "block" }}
      flexDirection={{ md: collapsedFloat ? "column" : undefined }}
      pl={collapsedFloat ? { base: 0, md: dashLayout.sidebarCollapsedFloatInset } : 0}
      pr={collapsedFloat ? { base: 0, md: dashLayout.sidebarCollapsedFloatInset } : 0}
      pt={collapsedFloat ? { base: 0, md: dashLayout.sidebarCollapsedFloatInset } : 0}
      pb={collapsedFloat ? { base: 0, md: dashLayout.sidebarCollapsedFloatInset } : 0}
    >
      {isDark ? (
        <GlassSurface
          variant="shell"
          w={collapsedFloat ? { base: "full", md: dashLayout.sidebarWidthCollapsed } : "full"}
          flex={collapsedFloat ? { md: 1 } : undefined}
          minH={
            collapsedFloat
              ? { base: "auto", md: 0 }
              : { base: "auto", md: `calc(100dvh - ${navLayoutReserve})` }
          }
          borderRadius={shellRadius}
          display={collapsedFloat ? { md: "flex" } : undefined}
          flexDirection={collapsedFloat ? { md: "column" } : undefined}
          sx={{
            ...(collapsedFloat
              ? {
                  border: "none",
                }
              : {
                  border: "none",
                  borderRight: "none",
                }),
            boxShadow: floatShadow,
            h: collapsedFloat ? { base: "auto", md: "full" } : { base: "auto", md: "full" },
          }}
        >
          {railBody}
        </GlassSurface>
      ) : (
        <Box
          h="full"
          w={collapsedFloat ? { base: "full", md: dashLayout.sidebarWidthCollapsed } : "full"}
          flex={collapsedFloat ? { md: 1 } : undefined}
          minH={
            collapsedFloat
              ? { base: "auto", md: 0 }
              : { base: "auto", md: `calc(100dvh - ${navLayoutReserve})` }
          }
          display={collapsedFloat ? { md: "flex" } : undefined}
          flexDirection={collapsedFloat ? { md: "column" } : undefined}
          overflow="hidden"
          borderWidth={collapsedFloat ? "1px" : undefined}
          borderColor={collapsedFloat ? dashColors.sidebarBorder : undefined}
          borderRightWidth={collapsedFloat ? undefined : "1px"}
          borderRightColor={collapsedFloat ? undefined : dashColors.sidebarBorder}
          borderRadius={shellRadius}
          bg={collapsed ? dashColors.sidebarRailSolid : dashColors.sidebarGlass}
          backgroundBlendMode="normal"
          backdropFilter={collapsed ? undefined : dashEffects.surfaceBlur}
          sx={{
            WebkitBackdropFilter: collapsed ? undefined : dashEffects.surfaceBlur,
            boxShadow: floatShadow,
          }}
        >
          {railBody}
        </Box>
      )}
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
