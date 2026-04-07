"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { DashboardShell } from "@/components/dashboard";
import { DashboardEntryBridge } from "@/components/dashboard/DashboardEntryBridge";
import { AccountServicesProvider } from "@/components/account-services/AccountServicesContext";
import { DASHBOARD_MOCK_USER } from "@/data/dashboardMock";
import { clearStubAuthSession, readStubAuthSession, type StubAuthSession } from "@/lib/authStubSession";

export default function AccountServicesLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [session, setSession] = useState<StubAuthSession | null | undefined>(undefined);

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

  if (session === undefined || session === null) {
    return <DashboardEntryBridge />;
  }

  return (
    <DashboardShell
      displayName={DASHBOARD_MOCK_USER.displayName}
      role={DASHBOARD_MOCK_USER.role}
      corporateId={session.corporateId}
      userId={session.userId}
      onSignOut={signOut}
      ambientBackgroundOverlay={false}
    >
      <AccountServicesProvider>{children}</AccountServicesProvider>
    </DashboardShell>
  );
}
