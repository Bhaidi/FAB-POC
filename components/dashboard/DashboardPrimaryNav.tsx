"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import {
  Box,
  Flex,
  HStack,
  Icon,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Kbd,
  useColorMode,
} from "@chakra-ui/react";
import { GlassCredentialFieldFrame } from "@/components/auth/GlassCredentialFieldFrame";
import Link from "next/link";
import { Bell, LayoutGrid, LogOut, Search } from "lucide-react";
import { dashLayout, dashRadius } from "@/components/dashboard/dashboardTokens";
import { GlassSurface } from "@/components/ui/GlassSurface";
import { glassTokens } from "@/lib/glassTokens";
import { useDashboardGlobal } from "@/components/dashboard/DashboardGlobalContext";
import { useDashboardSurfaceReady } from "@/components/dashboard/useDashboardSurfaceReady";
import { GlobalContextControl } from "@/components/dashboard/GlobalContextControl";
import { CommandCentreBackButton } from "@/components/dashboard/CommandCentreBackButton";
import { UserProfileMenu } from "@/components/dashboard/UserProfileMenu";
import { FabThemeToggle } from "@/components/theme/FabThemeToggle";
import { useFabTokens } from "@/components/theme/FabTokensContext";
import { isAccountServicesPath } from "@/lib/accountServicesRoutes";
import { getDsGlassTextFieldInnerStyles } from "@/lib/fabTheme/dsTextField";

export type DashboardPrimaryNavProps = {
  displayName: string;
  role: string;
  corporateId: string;
  userId: string;
  onSignOut: () => void;
};

export function DashboardPrimaryNav({
  displayName,
  role,
  corporateId,
  userId,
  onSignOut,
}: DashboardPrimaryNavProps) {
  const pathname = usePathname() ?? "";
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";
  const { dashColors, dashEffects, dashPrimaryNavChrome, dashShadow } = useFabTokens();
  const lightSearchInputStyles = dashPrimaryNavChrome.search;
  const iconBtnProps = dashPrimaryNavChrome.iconButton;

  const { isGlobalClient, userContextLoading } = useDashboardGlobal();
  const surfaceReady = useDashboardSurfaceReady();
  const [query, setQuery] = useState("");
  const [searchKbdHint, setSearchKbdHint] = useState("⌘K");
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (typeof navigator === "undefined") return;
    const mac = /Mac|iPhone|iPod|iPad/i.test(navigator.platform ?? navigator.userAgent);
    setSearchKbdHint(mac ? "⌘K" : "Ctrl+K");
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && (e.key === "k" || e.key === "K")) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const onSearchSubmit = useCallback(() => {
    const q = query.trim();
    if (!q) return;
    if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
      // eslint-disable-next-line no-console
      console.log("[dashboard search]", q);
    }
  }, [query]);

  const brand = (
    <Link
      href="/dashboard"
      prefetch={false}
      aria-label="FAB Access — go to dashboard home"
      style={{ textDecoration: "none", color: "inherit" }}
    >
      <Flex
        align="center"
        gap={{ base: 1, sm: 1.5 }}
        minW={0}
        cursor="pointer"
        rounded="md"
        transition="opacity 0.2s ease"
        _hover={{ opacity: 0.92 }}
        _focusVisible={{ outline: "2px solid", outlineColor: "rgba(0, 98, 255, 0.65)", outlineOffset: "2px" }}
      >
        <Box
          position="relative"
          h={{ base: "42px", md: "52px" }}
          w={{ base: "104px", md: "132px" }}
          flexShrink={0}
        >
          <Image
            src={isDark ? "/assets/fab-logo.svg" : "/images/fablogoblue.png"}
            alt=""
            fill
            sizes="(max-width: 768px) 104px, 132px"
            style={{ objectFit: "contain", objectPosition: "left center" }}
            priority
          />
        </Box>
        <Box
          as="span"
          display={{ base: "none", sm: "inline" }}
          fontFamily="var(--font-graphik)"
          fontSize={{ sm: "22px", md: "26px" }}
          fontWeight={500}
          letterSpacing="-0.04em"
          lineHeight={1}
          color={dashPrimaryNavChrome.brandWordmark}
          whiteSpace="nowrap"
        >
          Access
        </Box>
      </Flex>
    </Link>
  );

  const commandCenter =
    !isAccountServicesPath(pathname) && !isDark ? (
      <Link
        href="/dashboard"
        prefetch={false}
        aria-label="Command Center"
        style={{ textDecoration: "none" }}
      >
        <Flex
          align="center"
          gap={3}
          h="46px"
          px={4}
          borderRadius="9999px"
          border="1px solid"
          borderColor={dashPrimaryNavChrome.commandCenterBorder}
          transition="background 0.2s ease, border-color 0.2s ease"
          _hover={{ bg: "rgba(0, 98, 255, 0.06)" }}
        >
          <Icon as={LayoutGrid} boxSize="20px" color="#383A3F" aria-hidden />
          <Box
            as="span"
            fontFamily="var(--font-graphik)"
            fontSize="14px"
            fontWeight={500}
            lineHeight="20px"
            color="#383A3F"
            whiteSpace="nowrap"
          >
            Command Center
          </Box>
        </Flex>
      </Link>
    ) : null;

  const search = isDark ? (
    <Box maxW={{ base: "full", md: "420px" }} w={{ base: "full", md: "420px" }}>
      <GlassCredentialFieldFrame height="40px" w="100%" maxW="100%">
        <Flex align="center" w="full" minW={0} pl="10px" pr={2} gap={2}>
          <Box
            as="span"
            display="flex"
            alignItems="center"
            flexShrink={0}
            pointerEvents="none"
            color={dashPrimaryNavChrome.searchIcon}
            aria-hidden
          >
            <Search size={18} strokeWidth={2} />
          </Box>
          <Input
            ref={searchInputRef}
            variant="unstyled"
            placeholder="Search services, payments, reports, or accounts"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") onSearchSubmit();
            }}
            aria-label="Search"
            {...getDsGlassTextFieldInnerStyles({ paddingX: false })}
          />
          <Flex
            display={{ base: "none", md: "flex" }}
            alignItems="center"
            flexShrink={0}
            pointerEvents="none"
          >
            <Kbd
              fontFamily="var(--font-graphik)"
              fontSize="11px"
              fontWeight={500}
              px={2}
              py={1}
              borderRadius="md"
              borderWidth="1px"
              {...dashPrimaryNavChrome.kbd}
            >
              {searchKbdHint}
            </Kbd>
          </Flex>
        </Flex>
      </GlassCredentialFieldFrame>
    </Box>
  ) : (
    <InputGroup maxW={{ base: "full", md: "496px" }} w={{ base: "full", md: "496px" }}>
      <InputLeftElement h="46px" w="46px" pointerEvents="none" color={dashPrimaryNavChrome.searchIcon}>
        <Search size={20} strokeWidth={2} aria-hidden />
      </InputLeftElement>
      <Input
        {...lightSearchInputStyles}
        ref={searchInputRef}
        placeholder="Search payments, services, accounts, reports...etc"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") onSearchSubmit();
        }}
        aria-label="Search"
      />
      <InputRightElement
        h="46px"
        w="auto"
        pr={3}
        display={{ base: "none", md: "flex" }}
        alignItems="center"
        pointerEvents="none"
      >
        <Kbd
          fontFamily="var(--font-graphik)"
          fontSize="11px"
          fontWeight={500}
          px={2}
          py={1}
          borderRadius="md"
          borderWidth="1px"
          {...dashPrimaryNavChrome.kbd}
        >
          {searchKbdHint}
        </Kbd>
      </InputRightElement>
    </InputGroup>
  );

  const utilities = (
    <Flex align="center" gap={{ base: 2, md: 3 }}>
      {userContextLoading ? (
        <HStack spacing={0} align="center" flexShrink={0} aria-busy aria-label="Loading market context">
          <Box
            className="fab-ghost-market-pill"
            w={{ base: "120px", md: "140px" }}
            h="34px"
            flexShrink={0}
            aria-hidden
          />
          <Box
            display={{ base: "none", md: "block" }}
            w="1px"
            h="28px"
            bg={dashPrimaryNavChrome.divider}
            flexShrink={0}
            alignSelf="center"
            ml={3}
            aria-hidden
          />
        </HStack>
      ) : isGlobalClient ? (
        <>
          <Box
            flexShrink={0}
            opacity={surfaceReady ? 1 : 0.42}
            filter={surfaceReady ? "none" : "blur(0.4px)"}
            transition="opacity 0.36s cubic-bezier(0.33, 1, 0.68, 1), filter 0.36s cubic-bezier(0.33, 1, 0.68, 1)"
            pointerEvents={surfaceReady ? "auto" : "none"}
            aria-busy={!surfaceReady}
          >
            <GlobalContextControl />
          </Box>
          <Box
            display={{ base: "none", md: "block" }}
            w="1px"
            h="28px"
            bg={dashPrimaryNavChrome.divider}
            flexShrink={0}
            alignSelf="center"
            aria-hidden
          />
        </>
      ) : null}
      <FabThemeToggle variant="nav" />
      <Box position="relative">
        <IconButton
          {...iconBtnProps}
          aria-label="Notifications"
          icon={<Bell size={20} strokeWidth={2} aria-hidden />}
          onClick={() => {
            if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
              // eslint-disable-next-line no-console
              console.log("[dashboard] notifications");
            }
          }}
        />
        <Box
          position="absolute"
          top="9px"
          right="9px"
          w="7px"
          h="7px"
          borderRadius="full"
          bg="#DA291C"
          border="2px solid"
          borderColor={dashPrimaryNavChrome.notifDotBorder}
          pointerEvents="none"
          aria-hidden
        />
      </Box>
      <HStack spacing={1} align="center" px={0.5}>
        <UserProfileMenu
          displayName={displayName}
          role={role}
          corporateId={corporateId}
          userId={userId}
          onSignOut={onSignOut}
          avatarOnly
        />
      </HStack>
      <IconButton
        {...iconBtnProps}
        aria-label="Log out"
        icon={<LogOut size={20} strokeWidth={2} aria-hidden />}
        onClick={onSignOut}
      />
    </Flex>
  );

  const headerInner = (
    <Flex
      align="center"
      w="full"
      columnGap={{ base: 3, md: 6 }}
      rowGap={3}
      flexWrap={{ base: "wrap", md: "nowrap" }}
    >
      <Flex align="center" gap={{ base: 2, md: 6 }} flexShrink={0} minW={0} flexWrap="wrap">
        {brand}
        {commandCenter}
        {isAccountServicesPath(pathname) ? <CommandCentreBackButton /> : null}
      </Flex>

      <Box flex="1" minW={0} order={{ base: 2, md: 1 }} w={{ base: "100%", md: "auto" }}>
        <Flex justify={{ base: "stretch", md: "center" }} w="full">
          {search}
        </Flex>
      </Box>

      <Flex flexShrink={0} order={{ base: 1, md: 2 }} ml={{ base: "auto", md: 0 }} align="center">
        {utilities}
      </Flex>
    </Flex>
  );

  return (
    <Box
      position="sticky"
      top={{ base: dashLayout.primaryNavFloatInset, lg: dashLayout.primaryNavFloatInset }}
      zIndex={100}
      flexShrink={0}
      mt={dashLayout.primaryNavFloatInset}
      mx={{ base: dashLayout.primaryNavFloatInset, lg: 6 }}
      mb={dashLayout.primaryNavFloatBottom}
      alignSelf="stretch"
    >
      {isDark ? (
        <GlassSurface variant="shell" w="full" borderRadius={glassTokens.radius.shell}>
          <Flex
            as="header"
            align="center"
            minH={dashLayout.primaryNavMinH}
            px={{ base: 4, md: "24px", lg: "32px" }}
            py={{ base: 3, md: 0 }}
          >
            {headerInner}
          </Flex>
        </GlassSurface>
      ) : (
        <Flex
          as="header"
          align="center"
          minH={dashLayout.primaryNavMinHLight}
          px={{ base: 4, md: "24px", lg: "32px" }}
          py={{ base: 3, md: 0 }}
          borderRadius={dashRadius.panel}
          borderBottom="1px solid"
          borderColor={dashColors.primaryNavBorder}
          bg={dashColors.primaryNavBg}
          backdropFilter={dashEffects.primaryNavBlur === "none" ? undefined : dashEffects.primaryNavBlur}
          sx={{
            WebkitBackdropFilter:
              dashEffects.primaryNavBlur === "none" ? undefined : dashEffects.primaryNavBlur,
          }}
          boxShadow={dashShadow.primaryNavFloat}
        >
          {headerInner}
        </Flex>
      )}
    </Box>
  );
}
