"use client";

import { useCallback, useEffect, useState } from "react";
import { fetchDashboardWidgets } from "@/lib/platformMarketsClient";
import type { DashboardWidgetsResponse } from "@/types/platformDashboard";

export function useDashboardWidgets(organizationId: string | null, marketCode: string | null) {
  const [data, setData] = useState<DashboardWidgetsResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const refresh = useCallback(() => {
    setRefreshKey((k) => k + 1);
  }, []);

  useEffect(() => {
    if (!organizationId || !marketCode) {
      setData(null);
      setError(null);
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    setError(null);
    void fetchDashboardWidgets(organizationId, marketCode)
      .then((res) => {
        if (!cancelled) {
          setData(res);
          setError(null);
        }
      })
      .catch((e: unknown) => {
        if (!cancelled) {
          setData(null);
          setError(e instanceof Error ? e.message : "Failed to load dashboard");
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [organizationId, marketCode, refreshKey]);

  return { data, loading, error, refresh, refreshKey };
}
