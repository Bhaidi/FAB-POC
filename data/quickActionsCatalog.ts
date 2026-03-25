import type { LucideIcon } from "lucide-react";
import {
  AlertCircle,
  Banknote,
  BarChart3,
  Briefcase,
  CheckCircle,
  FileCheck2,
  FilePenLine,
  FileText,
  History,
  Landmark,
  ListChecks,
  Receipt,
  ScrollText,
  Settings,
  Shield,
  Upload,
  UserPlus,
  Users,
} from "lucide-react";
import type { PlatformUserWorkflowRole } from "@/types/platformUserContext";

/** Stable ids — match API contract (`snake_case`). */
export type QuickActionId =
  | "initiate_payment"
  | "upload_payroll_file"
  | "create_collection_request"
  | "view_draft_transactions"
  | "manage_beneficiaries"
  | "view_payment_history"
  | "create_direct_debit_request"
  | "view_account_statements"
  | "approve_payments"
  | "approve_payroll"
  | "review_trade_transactions"
  | "view_all_approvals"
  | "review_collections"
  | "check_exceptions"
  | "view_audit_trail"
  | "view_payment_status"
  | "manage_users"
  | "assign_roles"
  | "review_access_requests"
  | "system_settings";

export type QuickActionCatalogEntry = {
  id: QuickActionId;
  label: string;
  description: string;
  icon: LucideIcon;
  /** L1 domain key for navigation */
  domain: string;
};

/** Maker-eligible pool (spec + domain wiring). */
const MAKER_POOL: QuickActionCatalogEntry[] = [
  {
    id: "initiate_payment",
    label: "Initiate Payment",
    description: "Start a domestic or international payment",
    icon: Banknote,
    domain: "payments",
  },
  {
    id: "upload_payroll_file",
    label: "Upload Payroll File",
    description: "Submit payroll via host-to-host",
    icon: Upload,
    domain: "host-to-host",
  },
  {
    id: "create_collection_request",
    label: "Create Collection Request",
    description: "Request collections from customers",
    icon: Landmark,
    domain: "collections",
  },
  {
    id: "view_draft_transactions",
    label: "View Draft Transactions",
    description: "Resume or submit queued drafts",
    icon: FilePenLine,
    domain: "payments",
  },
  {
    id: "manage_beneficiaries",
    label: "Manage Beneficiaries",
    description: "Add or update beneficiary records",
    icon: UserPlus,
    domain: "payments",
  },
  {
    id: "view_payment_history",
    label: "View Payment History",
    description: "Search and filter past payments",
    icon: History,
    domain: "payments",
  },
  {
    id: "create_direct_debit_request",
    label: "Create Direct Debit Request",
    description: "Set up direct debit mandates",
    icon: Receipt,
    domain: "collections",
  },
  {
    id: "view_account_statements",
    label: "View Account Statements",
    description: "Download statements by period",
    icon: FileText,
    domain: "accounts",
  },
];

/** Checker-eligible pool. */
const CHECKER_POOL: QuickActionCatalogEntry[] = [
  {
    id: "approve_payments",
    label: "Approve Payments",
    description: "Release payments pending approval",
    icon: CheckCircle,
    domain: "payments",
  },
  {
    id: "approve_payroll",
    label: "Approve Payroll",
    description: "Confirm payroll batches",
    icon: FileCheck2,
    domain: "host-to-host",
  },
  {
    id: "review_trade_transactions",
    label: "Review Trade Transactions",
    description: "LC, guarantees, and trade finance",
    icon: Briefcase,
    domain: "trade-finance",
  },
  {
    id: "view_all_approvals",
    label: "View All Approvals",
    description: "Unified approval queue",
    icon: ListChecks,
    domain: "administration",
  },
  {
    id: "review_collections",
    label: "Review Collections",
    description: "Collections pending sign-off",
    icon: Landmark,
    domain: "collections",
  },
  {
    id: "check_exceptions",
    label: "Check Exceptions",
    description: "Investigate failed or held items",
    icon: AlertCircle,
    domain: "payments",
  },
  {
    id: "view_audit_trail",
    label: "View Audit Trail",
    description: "Immutable activity history",
    icon: ScrollText,
    domain: "administration",
  },
  {
    id: "view_payment_status",
    label: "View Payment Status",
    description: "Track processing and settlements",
    icon: BarChart3,
    domain: "payments",
  },
];

/** Admin-only entries (defaults are drawn from here). */
const ADMIN_ONLY: QuickActionCatalogEntry[] = [
  {
    id: "manage_users",
    label: "Manage Users",
    description: "Corporate user directory",
    icon: Users,
    domain: "administration",
  },
  {
    id: "assign_roles",
    label: "Assign Roles",
    description: "Workflow and signing permissions",
    icon: Shield,
    domain: "administration",
  },
  {
    id: "review_access_requests",
    label: "Review Access Requests",
    description: "Provisioning and entitlements",
    icon: UserPlus,
    domain: "administration",
  },
  {
    id: "system_settings",
    label: "System Settings",
    description: "Tenant preferences and limits",
    icon: Settings,
    domain: "administration",
  },
];

export const QUICK_ACTION_DEFAULTS: Record<PlatformUserWorkflowRole, QuickActionId[]> = {
  MAKER: [
    "initiate_payment",
    "upload_payroll_file",
    "create_collection_request",
    "view_draft_transactions",
  ],
  CHECKER: [
    "approve_payments",
    "approve_payroll",
    "review_trade_transactions",
    "view_all_approvals",
  ],
  ADMIN: ["manage_users", "assign_roles", "review_access_requests", "system_settings"],
};

const BY_ID: Record<QuickActionId, QuickActionCatalogEntry> = [...MAKER_POOL, ...CHECKER_POOL, ...ADMIN_ONLY].reduce(
  (acc, e) => {
    acc[e.id] = e;
    return acc;
  },
  {} as Record<QuickActionId, QuickActionCatalogEntry>
);

export function getCatalogEntry(id: string): QuickActionCatalogEntry | undefined {
  return BY_ID[id as QuickActionId];
}

/** Eligible catalog rows for customize UI + runtime (order preserved). */
export function getEligibleQuickActionCatalog(persona: PlatformUserWorkflowRole): QuickActionCatalogEntry[] {
  if (persona === "ADMIN") {
    const seen = new Set<string>();
    const out: QuickActionCatalogEntry[] = [];
    for (const e of [...ADMIN_ONLY, ...MAKER_POOL, ...CHECKER_POOL]) {
      if (seen.has(e.id)) continue;
      seen.add(e.id);
      out.push(e);
    }
    return out;
  }
  if (persona === "CHECKER") {
    return [...CHECKER_POOL];
  }
  return [...MAKER_POOL];
}
