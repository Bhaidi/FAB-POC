"use client";

import { useDashboardGlobal } from "@/components/dashboard/DashboardGlobalContext";
import { useDashboardTaxonomy } from "@/components/dashboard/DashboardTaxonomyContext";

/**
 * Single gate for “shell has settled” so hero and service cards don’t reveal
 * on staggered timers (which reads as flashing / out of order).
 */
export function useDashboardSurfaceReady(): boolean {
  const { userContextLoading, marketDetailLoading, organizationId } = useDashboardGlobal();
  const { merge, loading: taxonomyLoading, error: taxonomyError } = useDashboardTaxonomy();

  if (userContextLoading) return false;
  if (marketDetailLoading) return false;
  if (taxonomyLoading) return false;
  if (organizationId && merge === null && taxonomyError === null) return false;
  return true;
}
