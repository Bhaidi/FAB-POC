import type { DomainMenuTemplate, MenuNodeTemplate } from "@/data/dashboardTypes";

const L = (id: string, label: string, children?: MenuNodeTemplate[]): MenuNodeTemplate => ({ id, label, children });
const leaf = (id: string, label: string): MenuNodeTemplate => ({ id, label });

/**
 * Master IA — L1/L2/L3. Access is applied at runtime from `/api/user/entitlements`.
 */
export const DASHBOARD_MENU_DOMAINS: DomainMenuTemplate[] = [
  {
    id: "home-group",
    label: "Home",
    subtitle: "Workspace entry points",
    platformKey: "home",
    tree: [
      L("home-overview", "Overview", [
        leaf("home-dashboard", "Dashboard"),
        leaf("home-announcements", "Announcements"),
        leaf("home-service-status", "Service Status"),
      ]),
    ],
  },
  {
    id: "account-services",
    label: "Account Services",
    subtitle: "Accounts and maintenance",
    platformKey: "account-services",
    tree: [
      L("acct-overview", "Accounts Overview", [
        leaf("acct-overview-view", "View Accounts"),
        leaf("acct-overview-balances", "Balances & Activity"),
        leaf("acct-overview-statements", "Account Statements"),
      ]),
      L("acct-maintenance", "Account Maintenance", [
        leaf("acct-maint-requests", "Service Requests"),
        leaf("acct-maint-docs", "Account Documentation"),
        leaf("acct-maint-preferences", "Account Preferences"),
      ]),
    ],
  },
  {
    id: "payments",
    label: "Payments",
    subtitle: "Domestic, international, bulk, payroll",
    platformKey: "payments",
    tree: [
      L("payments-domestic", "Domestic Payments", [
        leaf("payments-domestic-create", "Create Payment"),
        leaf("payments-domestic-templates", "Payment Templates"),
        leaf("payments-domestic-upload", "Upload File"),
        leaf("payments-domestic-authorise", "Authorise Payments"),
        leaf("payments-domestic-tracking", "Payment Tracking"),
      ]),
      L("payments-international", "International Payments", [
        leaf("payments-intl-create", "Create Cross-Border Payment"),
        leaf("payments-intl-fx", "FX Payment Requests"),
        leaf("payments-intl-templates", "Payment Templates"),
        leaf("payments-intl-upload", "Upload File"),
        leaf("payments-intl-authorise", "Authorise Payments"),
        leaf("payments-intl-tracking", "Payment Tracking"),
      ]),
      L("payments-bulk", "Bulk Payments", [
        leaf("payments-bulk-upload", "Bulk Upload"),
        leaf("payments-bulk-auth", "Batch Authorisation"),
        leaf("payments-bulk-tracking", "Batch Tracking"),
      ]),
      L("payments-payrolls", "Payrolls", [
        leaf("payments-payroll-create", "Create Payroll"),
        leaf("payments-payroll-upload", "Upload Payroll File"),
        leaf("payments-payroll-validate", "Validate Payroll"),
        leaf("payments-payroll-authorise", "Authorise Payroll"),
        leaf("payments-payroll-history", "Payroll History"),
      ]),
      L("payments-control", "Payment Control", [
        leaf("payments-control-beneficiaries", "Beneficiaries"),
        leaf("payments-control-limits", "Limits & Cut-off Times"),
        leaf("payments-control-rejections", "Rejections & Returns"),
      ]),
    ],
  },
  {
    id: "liquidity-management",
    label: "Liquidity Management",
    subtitle: "Cash, sweeps, funding",
    platformKey: "liquidity-management",
    tree: [
      L("liq-cash", "Cash Positioning", [
        leaf("liq-cash-consolidated", "Consolidated Balances"),
        leaf("liq-cash-intraday", "Intraday Position"),
        leaf("liq-cash-forecast", "Cash Forecast"),
      ]),
      L("liq-sweeps", "Sweeps & Pooling", [
        leaf("liq-sweep-structures", "Pool Structures"),
        leaf("liq-sweep-instructions", "Sweep Instructions"),
        leaf("liq-sweep-monitoring", "Sweep Monitoring"),
      ]),
      L("liq-investment", "Investment & Funding", [
        leaf("liq-inv-deposits", "Deposits"),
        leaf("liq-inv-funding", "Funding Requests"),
        leaf("liq-inv-maturity", "Maturity Schedule"),
      ]),
    ],
  },
  {
    id: "trade-finance",
    label: "Trade Finance",
    subtitle: "Guarantees, LCs, documentation",
    platformKey: "trade-finance",
    tree: [
      L("tf-guarantees", "Guarantees", [
        leaf("tf-guarantee-issue", "Issue Guarantee"),
        leaf("tf-guarantee-amend", "Amend Guarantee"),
        leaf("tf-guarantee-claim", "Claim Management"),
      ]),
      L("tf-lc", "Letters of Credit", [
        leaf("tf-lc-import", "Import LC"),
        leaf("tf-lc-export", "Export LC"),
        leaf("tf-lc-amend", "Amendments"),
        leaf("tf-lc-documents", "Document Handling"),
      ]),
      L("tf-loans", "Trade Loans", [leaf("tf-loan-request", "Request Trade Loan"), leaf("tf-loan-tracking", "Loan Tracking")]),
      L("tf-documentation", "Trade Documentation", [
        leaf("tf-doc-submit", "Document Submission"),
        leaf("tf-doc-status", "Status Tracking"),
      ]),
    ],
  },
  {
    id: "supply-chain-finance",
    label: "Supply Chain Finance",
    subtitle: "Programmes and finance",
    platformKey: "supply-chain-finance",
    tree: [
      L("scf-buyer", "Buyer Programmes", [
        leaf("scf-buyer-payables", "Approved Payables"),
        leaf("scf-buyer-onboard", "Supplier Onboarding"),
        leaf("scf-buyer-util", "Programme Utilisation"),
      ]),
      L("scf-supplier", "Supplier Finance", [
        leaf("scf-supplier-request", "Finance Requests"),
        leaf("scf-supplier-settlement", "Settlement Status"),
      ]),
      L("scf-receivables", "Receivables Finance", [
        leaf("scf-recv-submit", "Receivables Submission"),
        leaf("scf-recv-status", "Finance Status"),
      ]),
    ],
  },
  {
    id: "receivables-collections",
    label: "Receivables & Collections",
    subtitle: "Direct debit, invoices, monitoring",
    platformKey: "receivables-collections",
    tree: [
      L("rc-directdebit", "Direct Debit", [
        leaf("rc-dd-mandates", "Mandates"),
        leaf("rc-dd-files", "Collection Files"),
        leaf("rc-dd-returns", "Returns & Rejections"),
      ]),
      L("rc-invoice", "Invoice Presentment", [
        leaf("rc-inv-create", "Create Invoice"),
        leaf("rc-inv-upload", "Upload Invoice File"),
        leaf("rc-inv-tracking", "Invoice Tracking"),
      ]),
      L("rc-monitoring", "Collections Monitoring", [
        leaf("rc-mon-dashboard", "Receivables Dashboard"),
        leaf("rc-mon-allocation", "Allocation Status"),
        leaf("rc-mon-exceptions", "Exceptions"),
      ]),
    ],
  },
  {
    id: "cheque-services",
    label: "Cheque Services",
    subtitle: "Deposit and remote printing",
    platformKey: "cheque-services",
    tree: [
      L("chq-deposit", "Corporate Cheque Deposit", [
        leaf("chq-deposit-submit", "Submit Deposit"),
        leaf("chq-deposit-tracking", "Deposit Tracking"),
        leaf("chq-deposit-history", "Deposit History"),
      ]),
      L("chq-print", "Remote Cheque Printing", [
        leaf("chq-print-queue", "Print Queue"),
        leaf("chq-print-auth", "Print Authorisation"),
        leaf("chq-print-history", "Print History"),
      ]),
    ],
  },
  {
    id: "virtual-accounts",
    label: "Virtual Accounts",
    subtitle: "Structures and reconciliation",
    platformKey: "virtual-accounts",
    tree: [
      L("va-mgmt", "Virtual Account Management", [
        leaf("va-mgmt-create", "Create Virtual Account"),
        leaf("va-mgmt-mapping", "Account Mapping"),
        leaf("va-mgmt-directory", "Account Directory"),
      ]),
      L("va-reconciliation", "Reconciliation", [
        leaf("va-rec-incoming", "Incoming Collections"),
        leaf("va-rec-matching", "Matching Rules"),
        leaf("va-rec-exceptions", "Exceptions"),
      ]),
    ],
  },
  {
    id: "reports-insights",
    label: "Reports & Insights",
    subtitle: "Reporting and audit visibility",
    platformKey: "reports-insights",
    tree: [
      L("rep-standard", "Standard Reports", [
        leaf("rep-std-accounts", "Account Reports"),
        leaf("rep-std-payments", "Payment Reports"),
        leaf("rep-std-liquidity", "Liquidity Reports"),
        leaf("rep-std-trade", "Trade Reports"),
      ]),
      L("rep-scheduled", "Scheduled Reports", [
        leaf("rep-sched-schedules", "Report Schedules"),
        leaf("rep-sched-delivery", "Delivery Preferences"),
      ]),
      L("rep-audit", "Audit & Activity", [
        leaf("rep-audit-users", "User Activity"),
        leaf("rep-audit-approvals", "Approval Audit Trail"),
        leaf("rep-audit-system", "System Events"),
      ]),
    ],
  },
  {
    id: "administration",
    label: "Administration",
    subtitle: "Users, security, company",
    platformKey: "administration",
    tree: [
      L("adm-users", "User Management", [
        leaf("adm-users-list", "Users"),
        leaf("adm-users-roles", "Roles"),
        leaf("adm-users-entitlements", "Entitlements"),
      ]),
      L("adm-security", "Security", [
        leaf("adm-sec-auth", "Authentication Settings"),
        leaf("adm-sec-devices", "Devices"),
        leaf("adm-sec-alerts", "Alerts"),
      ]),
      L("adm-company", "Company Settings", [
        leaf("adm-co-profile", "Organisation Profile"),
        leaf("adm-co-preferences", "Preferences"),
        leaf("adm-co-notifications", "Notification Settings"),
      ]),
    ],
  },
];
