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
import { fetchMarketServiceAccess, fetchServiceCatalog } from "@/lib/platformMarketsClient";
import { mergeCatalogWithMarketAccess, type TaxonomyMergeResult } from "@/lib/mergeServiceTaxonomy";
import type { MarketServiceAccessResponse, ServiceCatalogResponse } from "@/types/platformServiceTaxonomy";
import { useDashboardGlobal } from "@/components/dashboard/DashboardGlobalContext";

export type DashboardTaxonomyContextValue = {
  catalog: ServiceCatalogResponse | null;
  serviceAccess: MarketServiceAccessResponse | null;
  merge: TaxonomyMergeResult | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
};

const DashboardTaxonomyContext = createContext<DashboardTaxonomyContextValue | null>(null);

export function DashboardTaxonomyProvider({ children }: { children: ReactNode }) {
  const { organizationId, marketCode } = useDashboardGlobal();
  const [catalog, setCatalog] = useState<ServiceCatalogResponse | null>(null);
  const [serviceAccess, setServiceAccess] = useState<MarketServiceAccessResponse | null>(null);
  const [catalogLoading, setCatalogLoading] = useState(false);
  const [accessLoading, setAccessLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [nonce, setNonce] = useState(0);

  const refetch = useCallback(() => setNonce((n) => n + 1), []);

  useEffect(() => {
    if (!organizationId) {
      setCatalog(null);
      setServiceAccess(null);
      setError(null);
      return;
    }
    let cancelled = false;
    setCatalogLoading(true);
    (async () => {
      try {
        const c = await fetchServiceCatalog();
        if (cancelled) return;
        setCatalog(c);
      } catch (e) {
        if (!cancelled) {
          setCatalog(null);
          setError(e instanceof Error ? e.message : "Failed to load service catalog");
        }
      } finally {
        if (!cancelled) setCatalogLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [organizationId, nonce]);

  useEffect(() => {
    if (!organizationId || !marketCode) {
      setServiceAccess(null);
      return;
    }
    let cancelled = false;
    setAccessLoading(true);
    setServiceAccess(null);
    (async () => {
      try {
        const a = await fetchMarketServiceAccess(marketCode, organizationId);
        if (cancelled) return;
        setServiceAccess(a);
      } catch (e) {
        if (!cancelled) {
          setServiceAccess(null);
          setError(e instanceof Error ? e.message : "Failed to load market service access");
        }
      } finally {
        if (!cancelled) setAccessLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [organizationId, marketCode, nonce]);

  const merge = useMemo(
    () => (catalog && serviceAccess ? mergeCatalogWithMarketAccess(catalog, serviceAccess) : null),
    [catalog, serviceAccess]
  );

  useEffect(() => {
    if (merge) setError(null);
  }, [merge]);

  const loading = catalogLoading || accessLoading;

  const value = useMemo<DashboardTaxonomyContextValue>(
    () => ({
      catalog,
      serviceAccess,
      merge,
      loading,
      error,
      refetch,
    }),
    [catalog, serviceAccess, merge, loading, error, refetch]
  );

  return <DashboardTaxonomyContext.Provider value={value}>{children}</DashboardTaxonomyContext.Provider>;
}

export function useDashboardTaxonomy(): DashboardTaxonomyContextValue {
  const ctx = useContext(DashboardTaxonomyContext);
  if (!ctx) {
    throw new Error("useDashboardTaxonomy must be used within DashboardTaxonomyProvider");
  }
  return ctx;
}
