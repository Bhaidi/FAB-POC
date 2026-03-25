const LS_PREFIX = "fab.dashboard.quickActions.v1";

export function quickActionsStorageKey(userId: string): string {
  return `${LS_PREFIX}:${userId}`;
}

export async function loadQuickActionsPreference(userId: string): Promise<string[] | null> {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(quickActionsStorageKey(userId));
    if (raw) {
      const parsed = JSON.parse(raw) as unknown;
      if (Array.isArray(parsed) && parsed.every((x) => typeof x === "string")) {
        return parsed;
      }
    }
  } catch {
    /* ignore */
  }

  try {
    const r = await fetch("/api/user/quick-actions", { cache: "no-store" });
    if (r.ok) {
      const j = (await r.json()) as { selectedQuickActions?: unknown };
      if (Array.isArray(j.selectedQuickActions) && j.selectedQuickActions.every((x) => typeof x === "string")) {
        return j.selectedQuickActions;
      }
    }
  } catch {
    /* ignore — offline or unimplemented */
  }

  return null;
}

export async function saveQuickActionsPreference(userId: string, ids: string[]): Promise<void> {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(quickActionsStorageKey(userId), JSON.stringify(ids));
  } catch {
    /* ignore quota */
  }

  try {
    await fetch("/api/user/quick-actions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ selectedQuickActions: ids }),
    });
  } catch {
    /* ignore */
  }
}
