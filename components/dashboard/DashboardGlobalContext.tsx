"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  fetchMarketActivities,
  fetchMarketSummary,
  fetchMarketsList,
  fetchUserContext,
  postUserMarketContext,
} from "@/lib/platformMarketsClient";
import type { MarketActivity, MarketSummary, PlatformMarket } from "@/types/platformMarkets";
import type { PlatformUserContext } from "@/types/platformUserContext";

function isOperationalContextMarket(m: PlatformMarket): boolean {
  return m.selectable && m.operationalStatus === "active";
}

function marketStorageKey(organizationId: string): string {
  return `fab_dashboard_market_${organizationId}`;
}

function formatHeroContext(summary: MarketSummary): string {
  const last = new Date(summary.lastActivityAt);
  if (Number.isNaN(last.getTime())) {
    return "Last activity —";
  }
  // `dateStyle` / `timeStyle` cannot be combined with `timeZoneName` (throws in Safari and per ECMA-402).
  const formatted = new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZoneName: "short",
  }).format(last);
  return `Last activity ${formatted}`;
}

export type DashboardGlobalContextValue = {
  userContext: PlatformUserContext | null;
  organizationId: string | null;
  isGlobalClient: boolean;
  userContextLoading: boolean;
  marketCode: string | null;
  selectedMarketName: string;
  markets: PlatformMarket[];
  summary: MarketSummary | null;
  activities: MarketActivity[];
  marketsLoading: boolean;
  marketDetailLoading: boolean;
  error: string | null;
  selectMarket: (code: string) => Promise<void>;
  heroContextLine: string;
};

const DashboardGlobalContext = createContext<DashboardGlobalContextValue | null>(null);

export function DashboardGlobalContextProvider({ children }: { children: ReactNode }) {
  const [userContext, setUserContext] = useState<PlatformUserContext | null>(null);
  const [organizationId, setOrganizationId] = useState<string | null>(null);
  const [isGlobalClient, setIsGlobalClient] = useState(false);
  const [userContextLoading, setUserContextLoading] = useState(true);
  const [markets, setMarkets] = useState<PlatformMarket[]>([]);
  const [marketCode, setMarketCode] = useState<string | null>(null);
  const [summary, setSummary] = useState<MarketSummary | null>(null);
  const [activities, setActivities] = useState<MarketActivity[]>([]);
  const [marketsLoading, setMarketsLoading] = useState(true);
  const [marketDetailLoading, setMarketDetailLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fetchGen = useRef(0);

  useEffect(() => {
    let cancelled = false;
    setUserContextLoading(true);
    setMarketsLoading(true);
    setError(null);
    (async () => {
      try {
        const uc = await fetchUserContext();
        if (cancelled) return;
        setUserContext(uc);
        const oid = uc.organizationId;
        setOrganizationId(oid);
        setIsGlobalClient(uc.isGlobalClient);
        if (uc.isGlobalClient) {
          const listRes = await fetchMarketsList(oid);
          if (cancelled) return;
          const list = listRes.markets;
          setMarkets(list);
          const apiDefault = listRes.defaultMarket.trim().toUpperCase();
          let stored: string | null = null;
          try {
            stored = typeof window !== "undefined" ? localStorage.getItem(marketStorageKey(oid)) : null;
          } catch {
            /* ignore */
          }
          const normalized = stored?.trim().toUpperCase() ?? "";
          const storedRow = list.find((m) => m.code === normalized);
          const storedOk = storedRow && isOperationalContextMarket(storedRow);
          const defaultRow = list.find((m) => m.code === apiDefault);
          const defaultOk = defaultRow && isOperationalContextMarket(defaultRow);
          const firstOperational = list.find(isOperationalContextMarket)?.code;
          const initial = storedOk ? normalized : defaultOk ? apiDefault : firstOperational ?? apiDefault;
          setMarketCode(initial);
        } else {
          setMarkets([]);
          setMarketCode(uc.defaultMarket.trim().toUpperCase());
        }
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : "Failed to load session context");
          setUserContext(null);
          setOrganizationId(null);
          setIsGlobalClient(false);
          setMarkets([]);
          setMarketCode(null);
        }
      } finally {
        if (!cancelled) {
          setUserContextLoading(false);
          setMarketsLoading(false);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!marketCode || !organizationId) return;
    const gen = ++fetchGen.current;
    setMarketDetailLoading(true);
    setError(null);
    setSummary(null);
    setActivities([]);
    (async () => {
      try {
        const [sum, act] = await Promise.all([
          fetchMarketSummary(marketCode, organizationId),
          fetchMarketActivities(marketCode, organizationId, 3),
        ]);
        if (fetchGen.current !== gen) return;
        setSummary(sum);
        setActivities(act.activities);
      } catch (e) {
        if (fetchGen.current !== gen) return;
        setError(e instanceof Error ? e.message : "Failed to load market context");
        setSummary(null);
        setActivities([]);
      } finally {
        if (fetchGen.current === gen) setMarketDetailLoading(false);
      }
    })();
  }, [marketCode, organizationId]);

  const selectMarket = useCallback(
    async (code: string) => {
      if (!organizationId || !isGlobalClient) return;
      const upper = code.trim().toUpperCase();
      const row = markets.find((m) => m.code === upper);
      if (!row || !row.selectable || row.operationalStatus !== "active") return;
      try {
        await postUserMarketContext(upper, organizationId);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to set market context");
        return;
      }
      try {
        if (typeof window !== "undefined") localStorage.setItem(marketStorageKey(organizationId), upper);
      } catch {
        /* ignore */
      }
      setMarketCode(upper);
    },
    [organizationId, isGlobalClient, markets]
  );

  const selectedMarketName = useMemo(() => {
    if (summary?.marketName) return summary.marketName;
    const m = markets.find((x) => x.code === marketCode);
    return m?.name ?? marketCode ?? "…";
  }, [summary, markets, marketCode]);

  const heroContextLine = useMemo(() => {
    if (!summary) return "";
    return formatHeroContext(summary);
  }, [summary]);

  const value = useMemo<DashboardGlobalContextValue>(
    () => ({
      userContext,
      organizationId,
      isGlobalClient,
      userContextLoading,
      marketCode,
      selectedMarketName,
      markets,
      summary,
      activities,
      marketsLoading,
      marketDetailLoading,
      error,
      selectMarket,
      heroContextLine,
    }),
    [
      userContext,
      organizationId,
      isGlobalClient,
      userContextLoading,
      marketCode,
      selectedMarketName,
      markets,
      summary,
      activities,
      marketsLoading,
      marketDetailLoading,
      error,
      selectMarket,
      heroContextLine,
    ]
  );

  return <DashboardGlobalContext.Provider value={value}>{children}</DashboardGlobalContext.Provider>;
}

export function useDashboardGlobal(): DashboardGlobalContextValue {
  const ctx = useContext(DashboardGlobalContext);
  if (!ctx) {
    throw new Error("useDashboardGlobal must be used within DashboardGlobalContextProvider");
  }
  return ctx;
}
