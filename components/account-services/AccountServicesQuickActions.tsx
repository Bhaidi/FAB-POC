"use client";

import Link from "next/link";
import { Box, Flex, Text } from "@chakra-ui/react";
import type { LucideIcon } from "lucide-react";
import {
  Banknote,
  ChevronRight,
  ClipboardCheck,
  FileUp,
  Inbox,
  ListChecks,
  Send,
  ShieldCheck,
} from "lucide-react";
import { useDashboardGlobal } from "@/components/dashboard/DashboardGlobalContext";
import { dashRadius } from "@/components/dashboard/dashboardTokens";
import { useFabTokens } from "@/components/theme/FabTokensContext";
import type { PlatformUserWorkflowRole } from "@/types/platformUserContext";

type QuickRow = {
  id: string;
  label: string;
  subtext?: string;
  badge?: number;
  href: string;
  icon: LucideIcon;
};

function rowsForRole(role: PlatformUserWorkflowRole | undefined): QuickRow[] {
  const r = role ?? "MAKER";
  if (r === "CHECKER") {
    return [
      {
        id: "approve-pay",
        label: "Approve Payments",
        subtext: "3 pending",
        badge: 3,
        href: "/dashboard?domain=payments&nav=domestic-authorize-payments",
        icon: ShieldCheck,
      },
      {
        id: "review-payroll",
        label: "Review Payroll Files",
        href: "/dashboard?domain=payments&nav=payroll-upload-payment-file",
        icon: FileUp,
      },
      {
        id: "auth-collections",
        label: "Authorize Collections",
        href: "/dashboard?domain=collections&nav=collection-reports-view",
        icon: ClipboardCheck,
      },
      {
        id: "pending-approvals",
        label: "View Pending Approvals",
        badge: 5,
        href: "/dashboard?domain=payments&nav=domestic-authorize-payments",
        icon: ListChecks,
      },
    ];
  }
  /** MAKER + ADMIN */
  return [
    {
      id: "pay",
      label: "Initiate Payment",
      href: "/dashboard?domain=payments&nav=domestic-create-payment",
      icon: Send,
    },
    {
      id: "payroll",
      label: "Upload Payroll File",
      subtext: "Last used: 2d",
      href: "/dashboard?domain=payments&nav=payroll-upload-payment-file",
      icon: FileUp,
    },
    {
      id: "collect",
      label: "Create Collection Request",
      href: "/dashboard?domain=collections&nav=service-requests",
      icon: Banknote,
    },
    {
      id: "drafts",
      label: "View Draft Transactions",
      badge: 4,
      href: "/dashboard?domain=payments&nav=domestic-create-payment",
      icon: Inbox,
    },
  ];
}

export function AccountServicesQuickActions() {
  const { dashShadow } = useFabTokens();
  const { userContext } = useDashboardGlobal();
  const rows = rowsForRole(userContext?.userRole);

  return (
    <Box
      borderRadius="16px"
      borderWidth="1px"
      borderColor="rgba(255,255,255,0.1)"
      bg="rgba(2, 6, 28, 0.55)"
      backdropFilter="blur(18px)"
      sx={{
        WebkitBackdropFilter: "blur(18px)",
        boxShadow: `${dashShadow.cardGlow}, 0 0 0 1px rgba(0,120,255,0.06)`,
      }}
      p={{ base: "20px", md: "24px" }}
    >
      <Text
        fontFamily="var(--font-graphik)"
        fontSize="11px"
        fontWeight={700}
        letterSpacing="0.14em"
        textTransform="uppercase"
        color="rgba(255,255,255,0.5)"
        mb={1}
      >
        Quick actions
      </Text>
      <Flex direction="column" gap={0} mt={4}>
        {rows.map((row) => {
          const Icon = row.icon;
          return (
          <Link
            key={row.id}
            href={row.href}
            style={{ textDecoration: "none" }}
          >
            <Flex
              align="center"
              gap={3}
              minH="56px"
              py={1}
              px={2}
              mx={-2}
              borderRadius={dashRadius.surface}
              transition="background 0.18s ease"
              _hover={{ bg: "rgba(255,255,255,0.06)" }}
            >
              <Flex
                w="36px"
                h="36px"
                borderRadius="9px"
                bg="rgba(0, 98, 255, 0.18)"
                align="center"
                justify="center"
                color="#93c5fd"
                flexShrink={0}
              >
                <Icon size={18} strokeWidth={2} aria-hidden />
              </Flex>
              <Box flex="1" minW={0}>
                <Text fontFamily="var(--font-graphik)" fontSize="14px" fontWeight={600} color="rgba(255,255,255,0.92)">
                  {row.label}
                </Text>
                {row.subtext ? (
                  <Text fontFamily="var(--font-graphik)" fontSize="11px" color="rgba(255,255,255,0.4)" mt={0.5}>
                    {row.subtext}
                  </Text>
                ) : null}
              </Box>
              <Flex align="center" gap={2} flexShrink={0}>
                {row.badge != null && row.badge > 0 ? (
                  <Text
                    as="span"
                    fontFamily="var(--font-graphik)"
                    fontSize="11px"
                    fontWeight={600}
                    px={2}
                    py="3px"
                    borderRadius="full"
                    bg="rgba(96, 165, 250, 0.22)"
                    color="rgba(191, 219, 254, 0.98)"
                    borderWidth="1px"
                    borderColor="rgba(147, 197, 253, 0.35)"
                  >
                    {row.badge}
                  </Text>
                ) : null}
                <Box color="rgba(255,255,255,0.35)" display="flex">
                  <ChevronRight size={18} strokeWidth={2} aria-hidden />
                </Box>
              </Flex>
            </Flex>
          </Link>
          );
        })}
      </Flex>
    </Box>
  );
}
