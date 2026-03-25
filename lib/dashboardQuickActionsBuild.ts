import type { QuickActionItem } from "@/components/dashboard/home/QuickActionsWidget";
import {
  getEligibleQuickActionCatalog,
  type QuickActionId,
} from "@/data/quickActionsCatalog";
import type { DashboardQuickActionsPayload } from "@/types/platformDashboard";
import type { PlatformUserWorkflowRole } from "@/types/platformUserContext";
import { firstNavigableL3Href, type TaxonomyMergeResult } from "@/lib/mergeServiceTaxonomy";

export type TaxonomyMergeLike = Pick<TaxonomyMergeResult, "domainByL1"> | null | undefined;

export function buildCardHref(pathname: string, l1Code: string, leafHref: string | null): string {
  const q = new URLSearchParams();
  q.set("domain", l1Code);
  if (leafHref) {
    try {
      const base = typeof window !== "undefined" ? window.location.origin : "http://localhost";
      const u = new URL(leafHref, base);
      const nav = u.searchParams.get("nav");
      if (nav) q.set("nav", nav);
    } catch {
      /* ignore */
    }
  }
  return `${pathname}?${q.toString()}`;
}

const CHECKER_ROW_ACTION_IDS = new Set<QuickActionId>([
  "approve_payments",
  "approve_payroll",
  "review_trade_transactions",
  "view_all_approvals",
  "review_collections",
  "check_exceptions",
  "view_audit_trail",
  "view_payment_status",
]);

/**
 * Runtime quick actions for the signed-in persona: hrefs, counts, and chevron/pill rules.
 */
export function buildEligibleQuickActionItems(
  persona: PlatformUserWorkflowRole,
  pathname: string,
  merge: TaxonomyMergeLike,
  widgetsPayload: DashboardQuickActionsPayload | undefined
): Map<QuickActionId, QuickActionItem> {
  const map = new Map<QuickActionId, QuickActionItem>();
  const catalog = getEligibleQuickActionCatalog(persona);
  const qa = widgetsPayload;
  const countsReady = Boolean(qa);
  const totalCheckerPending =
    qa?.role === "CHECKER" || qa?.role === "ADMIN"
      ? (qa as { pendingPayments: number }).pendingPayments +
        (qa as { pendingPayroll: number }).pendingPayroll +
        (qa as { pendingTrade: number }).pendingTrade
      : 0;
  const showApprovalIdle =
    countsReady && (persona === "CHECKER" || persona === "ADMIN") && totalCheckerPending === 0;
  const checkerRowVariant: "default" | "subdued" | undefined =
    persona === "CHECKER" || persona === "ADMIN"
      ? showApprovalIdle
        ? "subdued"
        : "default"
      : undefined;

  const draftCount =
    qa?.role === "MAKER" || qa?.role === "ADMIN"
      ? (qa as { draftCount: number }).draftCount
      : 0;

  const pending =
    countsReady && (qa?.role === "CHECKER" || qa?.role === "ADMIN")
      ? qa
      : null;
  const checkerPayment = pending && "pendingPayments" in pending ? pending.pendingPayments : 0;
  const checkerPayroll = pending && "pendingPayroll" in pending ? pending.pendingPayroll : 0;
  const checkerTrade = pending && "pendingTrade" in pending ? pending.pendingTrade : 0;

  const trailing = { trailingArrow: true as const };

  for (const def of catalog) {
    const leaf = firstNavigableL3Href(merge?.domainByL1.get(def.domain));
    const href = buildCardHref(pathname, def.domain, leaf);

    let item: QuickActionItem = {
      id: def.id,
      label: def.label,
      href,
      icon: def.icon,
      ...trailing,
    };

    if (CHECKER_ROW_ACTION_IDS.has(def.id) && checkerRowVariant) {
      item = { ...item, rowVariant: checkerRowVariant };
    }

    switch (def.id) {
      case "approve_payments": {
        const showPill = countsReady && checkerPayment > 0;
        item = {
          id: def.id,
          label: def.label,
          href,
          icon: def.icon,
          count: showPill ? checkerPayment : undefined,
          trailingArrow: !showPill,
          rowVariant: checkerRowVariant,
        };
        break;
      }
      case "approve_payroll": {
        const showPill = countsReady && checkerPayroll > 0;
        item = {
          id: def.id,
          label: def.label,
          href,
          icon: def.icon,
          count: showPill ? checkerPayroll : undefined,
          trailingArrow: !showPill,
          rowVariant: checkerRowVariant,
        };
        break;
      }
      case "review_trade_transactions": {
        const showPill = countsReady && checkerTrade > 0;
        item = {
          id: def.id,
          label: def.label,
          href,
          icon: def.icon,
          count: showPill ? checkerTrade : undefined,
          trailingArrow: !showPill,
          rowVariant: checkerRowVariant,
        };
        break;
      }
      case "view_draft_transactions": {
        const showPill = countsReady && draftCount > 0;
        item = {
          id: def.id,
          label: def.label,
          href,
          icon: def.icon,
          count: showPill ? draftCount : undefined,
          trailingArrow: !showPill,
        };
        break;
      }
      default:
        break;
    }

    map.set(def.id, item);
  }

  return map;
}

/**
 * Merge saved order with eligibility and defaults; max `cap` ids (4).
 */
export function resolveQuickActionDisplayOrder(
  saved: string[] | null | undefined,
  eligibleIds: QuickActionId[],
  defaults: QuickActionId[],
  cap = 4
): QuickActionId[] {
  const set = new Set(eligibleIds);
  const fromSaved = [...(saved ?? [])].filter((id): id is QuickActionId => set.has(id as QuickActionId));
  const out: QuickActionId[] = [];
  for (const id of fromSaved) {
    if (out.length >= cap) break;
    if (!out.includes(id)) out.push(id);
  }
  if (out.length < cap) {
    for (const id of defaults) {
      if (out.length >= cap) break;
      if (!set.has(id)) continue;
      if (out.includes(id)) continue;
      out.push(id);
    }
  }
  if (out.length < cap) {
    for (const id of eligibleIds) {
      if (out.length >= cap) break;
      if (!out.includes(id)) out.push(id);
    }
  }
  return out;
}
