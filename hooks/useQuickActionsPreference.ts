"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { QuickActionItem } from "@/components/dashboard/home/QuickActionsWidget";
import { QUICK_ACTION_DEFAULTS } from "@/data/quickActionsCatalog";
import type { QuickActionId } from "@/data/quickActionsCatalog";
import { resolveQuickActionDisplayOrder } from "@/lib/dashboardQuickActionsBuild";
import { loadQuickActionsPreference, saveQuickActionsPreference } from "@/lib/quickActionsPreferenceStorage";
import type { PlatformUserWorkflowRole } from "@/types/platformUserContext";

export function useQuickActionsPreference(
  userId: string | null | undefined,
  persona: PlatformUserWorkflowRole,
  eligibleIds: QuickActionId[],
  eligibleMap: Map<QuickActionId, QuickActionItem>
) {
  const storageKeyUser = userId && userId !== "—" ? userId : "anonymous";
  const defaults = QUICK_ACTION_DEFAULTS[persona];

  const [saved, setSaved] = useState<string[] | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const v = await loadQuickActionsPreference(storageKeyUser);
      if (cancelled) return;
      setSaved(v);
      setHydrated(true);
    })();
    return () => {
      cancelled = true;
    };
  }, [storageKeyUser]);

  const validEligible = useMemo(
    () => eligibleIds.filter((id) => eligibleMap.has(id)),
    [eligibleIds, eligibleMap]
  );

  const resolvedOrder = useMemo(
    () => resolveQuickActionDisplayOrder(saved, validEligible, defaults, 4),
    [saved, validEligible, defaults]
  );

  const displayItems = useMemo(() => {
    const out: QuickActionItem[] = [];
    for (const id of resolvedOrder) {
      const item = eligibleMap.get(id);
      if (item) out.push(item);
    }
    return out;
  }, [resolvedOrder, eligibleMap]);

  const persist = useCallback(
    async (ids: QuickActionId[]) => {
      const allowed = new Set(validEligible);
      const cleaned = ids.filter((id) => allowed.has(id)).slice(0, 4);
      setSaved(cleaned);
      await saveQuickActionsPreference(storageKeyUser, cleaned);
    },
    [storageKeyUser, validEligible]
  );

  const resetToDefaults = useCallback(async () => {
    const allowed = new Set(validEligible);
    const cleaned = defaults.filter((id) => allowed.has(id)).slice(0, 4);
    const filled =
      cleaned.length > 0
        ? cleaned
        : resolveQuickActionDisplayOrder(null, validEligible, defaults, 4);
    setSaved(filled);
    await saveQuickActionsPreference(storageKeyUser, filled);
  }, [storageKeyUser, validEligible, defaults]);

  return {
    displayItems,
    /** Ids shown in widget (max 4) after validation. */
    resolvedOrder,
    /** True after localStorage / stub API read attempted. */
    hydrated,
    persist,
    resetToDefaults,
  };
}
