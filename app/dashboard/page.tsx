"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Box, Text } from "@chakra-ui/react";
import { DashboardShell } from "@/components/dashboard";
import { DashboardEntryBridge } from "@/components/dashboard/DashboardEntryBridge";
import { SimpleDashboardHome } from "@/components/dashboard/SimpleDashboardHome";
import { DASHBOARD_MOCK_USER } from "@/data/dashboardMock";
import { navRoute } from "@/data/dashboardNav";
import { clearStubAuthSession, readStubAuthSession, type StubAuthSession } from "@/lib/authStubSession";

export default function DashboardPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [session, setSession] = useState<StubAuthSession | null | undefined>(undefined);

  /* Redirect nav IDs that have dedicated pages */
  useEffect(() => {
    const navId = searchParams.get("nav");
    if (navId) {
      const route = navRoute(navId);
      if (route) {
        router.replace(`${route}?nav=${encodeURIComponent(navId)}`);
        return;
      }
    }
  }, [searchParams, router]);

  useEffect(() => {
    const s = readStubAuthSession();
    if (!s) {
      setSession(null);
      router.replace("/login");
      return;
    }
    setSession(s);
  }, [router]);

  const signOut = () => {
    clearStubAuthSession();
    router.push("/login");
  };

  if (session === undefined) {
    return <DashboardEntryBridge />;
  }

  if (session === null) {
    return <DashboardEntryBridge />;
  }

  const corporateId = session.corporateId;
  const userId = session.userId;

  return (
    <DashboardShell
      displayName={DASHBOARD_MOCK_USER.displayName}
      role={DASHBOARD_MOCK_USER.role}
      corporateId={corporateId}
      userId={userId}
      onSignOut={signOut}
    >
      <SimpleDashboardHome
        welcomeName={DASHBOARD_MOCK_USER.homeGreetingName}
        footer={
          session ? (
            <Box flexShrink={0} pb={{ base: 0, md: 0 }}>
              <Text
                fontFamily="var(--font-graphik)"
                fontSize="10px"
                color="rgba(255,255,255,0.35)"
                textAlign="center"
                noOfLines={1}
              >
                Stub session · verified {new Date(session.verifiedAt).toLocaleString()}
              </Text>
            </Box>
          ) : undefined
        }
      />
    </DashboardShell>
  );
}
