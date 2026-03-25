"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { buildCapabilityMenu, partitionMenuByAccess } from "@/data/applyMenuEntitlements";
import type { CapabilityMenuItem } from "@/data/dashboardTypes";
import {
  stubPlatformStatuses,
  stubUserEntitlements,
  type PlatformHealth,
} from "@/data/dashboardStubApi";

export type DashboardEntitlementsContextValue = {
  menuEntitled: CapabilityMenuItem[];
  menuAvailable: CapabilityMenuItem[];
  fullMenu: CapabilityMenuItem[];
  enabledPlatformIds: Set<string>;
  statuses: Record<string, PlatformHealth>;
  loading: boolean;
  error: string | null;
  refetch: () => void;
};

const DashboardEntitlementsContext = createContext<DashboardEntitlementsContextValue | null>(null);

function buildFromStub() {
  const full = buildCapabilityMenu(stubUserEntitlements);
  const { entitled, available } = partitionMenuByAccess(full);
  return {
    fullMenu: full,
    menuEntitled: entitled,
    menuAvailable: available,
    enabledPlatformIds: new Set(stubUserEntitlements.enabledPlatformIds),
    statuses: stubPlatformStatuses as Record<string, PlatformHealth>,
    error: null as string | null,
  };
}

export function DashboardEntitlementsProvider({ children }: { children: ReactNode }) {
  const [nonce, setNonce] = useState(0);
  const initial = useMemo(() => buildFromStub(), []);
  const [remote, setRemote] = useState<ReturnType<typeof buildFromStub> | null>(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setFetchError(null);
    try {
      const [eRes, sRes] = await Promise.all([
        fetch("/api/user/entitlements", { cache: "no-store" }),
        fetch("/api/platform/status", { cache: "no-store" }),
      ]);
      if (!eRes.ok || !sRes.ok) throw new Error("Failed to load entitlements");
      const ent = (await eRes.json()) as { enabledPlatformIds?: string[]; itemAccess?: Record<string, string> };
      const st = (await sRes.json()) as { statuses?: Record<string, PlatformHealth> };
      const full = buildCapabilityMenu({
        enabledPlatformIds: ent.enabledPlatformIds ?? [],
        itemAccess: ent.itemAccess as Record<string, "full" | "partial" | "locked"> | undefined,
      });
      const { entitled, available } = partitionMenuByAccess(full);
      setRemote({
        fullMenu: full,
        menuEntitled: entitled,
        menuAvailable: available,
        enabledPlatformIds: new Set(ent.enabledPlatformIds ?? []),
        statuses: st.statuses ?? {},
        error: null,
      });
      setFetchError(null);
    } catch {
      setRemote(buildFromStub());
      setFetchError("Could not load entitlements. Using offline defaults.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load, nonce]);

  const refetch = useCallback(() => setNonce((n) => n + 1), []);

  const value = useMemo<DashboardEntitlementsContextValue>(() => {
    const base = remote ?? initial;
    return {
      ...base,
      loading,
      error: fetchError ?? base.error,
      refetch,
    };
  }, [remote, initial, loading, fetchError, refetch]);

  return (
    <DashboardEntitlementsContext.Provider value={value}>{children}</DashboardEntitlementsContext.Provider>
  );
}

export function useDashboardEntitlements(): DashboardEntitlementsContextValue {
  const ctx = useContext(DashboardEntitlementsContext);
  if (!ctx) {
    throw new Error("useDashboardEntitlements must be used within DashboardEntitlementsProvider");
  }
  return ctx;
}
