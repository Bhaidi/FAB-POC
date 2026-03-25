import type { ServiceCatalogResponse } from "@/types/platformServiceTaxonomy";

/** Canonical L1→L2→L3 taxonomy — single source of truth for catalog API and merges. */
export const SERVICE_CATALOG_RESPONSE: ServiceCatalogResponse = {
  "version": "1.0.0",
  "domains": [
    {
      "l1Code": "accounts",
      "l1Name": "Accounts",
      "description": "Balances, statements, and account services",
      "icon": "wallet",
      "l2Items": [
        {
          "l2Code": "account-overview",
          "l2Name": "Account Overview",
          "l3Items": [
            {
              "l3Code": "view-balances",
              "l3Name": "View Balances",
              "route": "/dashboard?nav=view-balances"
            },
            {
              "l3Code": "account-details",
              "l3Name": "Account Details",
              "route": "/dashboard?nav=account-details"
            }
          ]
        },
        {
          "l2Code": "account-statements",
          "l2Name": "Account Statements",
          "l3Items": [
            {
              "l3Code": "download-statements",
              "l3Name": "Download Statements",
              "route": "/dashboard?nav=download-statements"
            },
            {
              "l3Code": "scheduled-statements",
              "l3Name": "Scheduled Statements",
              "route": "/dashboard?nav=scheduled-statements"
            }
          ]
        },
        {
          "l2Code": "account-services",
          "l2Name": "Account Services",
          "l3Items": [
            {
              "l3Code": "service-requests",
              "l3Name": "Service Requests",
              "route": "/dashboard?nav=service-requests"
            }
          ]
        },
        {
          "l2Code": "account-maintenance",
          "l2Name": "Account Maintenance",
          "l3Items": [
            {
              "l3Code": "update-account-details",
              "l3Name": "Update Account Details",
              "route": "/dashboard?nav=update-account-details"
            },
            {
              "l3Code": "account-preferences",
              "l3Name": "Account Preferences",
              "route": "/dashboard?nav=account-preferences"
            }
          ]
        }
      ]
    },
    {
      "l1Code": "payments",
      "l1Name": "Payments",
      "description": "Domestic, international, and bulk payments",
      "icon": "payments",
      "l2Items": [
        {
          "l2Code": "domestic-payments",
          "l2Name": "Domestic Payments",
          "l3Items": [
            {
              "l3Code": "domestic-create-payment",
              "l3Name": "Create Payment",
              "route": "/dashboard?nav=domestic-create-payment"
            },
            {
              "l3Code": "domestic-upload-payment-file",
              "l3Name": "Upload Payment File",
              "route": "/dashboard?nav=domestic-upload-payment-file"
            },
            {
              "l3Code": "domestic-authorize-payments",
              "l3Name": "Authorize Payments",
              "route": "/dashboard?nav=domestic-authorize-payments"
            },
            {
              "l3Code": "domestic-payment-history",
              "l3Name": "Payment History",
              "route": "/dashboard?nav=domestic-payment-history"
            }
          ]
        },
        {
          "l2Code": "international-payments",
          "l2Name": "International Payments",
          "l3Items": [
            {
              "l3Code": "intl-create-payment",
              "l3Name": "Create Payment",
              "route": "/dashboard?nav=intl-create-payment"
            },
            {
              "l3Code": "intl-upload-payment-file",
              "l3Name": "Upload Payment File",
              "route": "/dashboard?nav=intl-upload-payment-file"
            },
            {
              "l3Code": "intl-authorize-payments",
              "l3Name": "Authorize Payments",
              "route": "/dashboard?nav=intl-authorize-payments"
            },
            {
              "l3Code": "intl-payment-status",
              "l3Name": "Payment Status",
              "route": "/dashboard?nav=intl-payment-status"
            }
          ]
        },
        {
          "l2Code": "bulk-payments",
          "l2Name": "Bulk Payments",
          "l3Items": [
            {
              "l3Code": "bulk-upload-payment-file",
              "l3Name": "Upload Payment File",
              "route": "/dashboard?nav=bulk-upload-payment-file"
            },
            {
              "l3Code": "bulk-authorize-payments",
              "l3Name": "Authorize Payments",
              "route": "/dashboard?nav=bulk-authorize-payments"
            },
            {
              "l3Code": "bulk-payment-history",
              "l3Name": "Payment History",
              "route": "/dashboard?nav=bulk-payment-history"
            }
          ]
        },
        {
          "l2Code": "payroll",
          "l2Name": "Payroll",
          "l3Items": [
            {
              "l3Code": "payroll-upload-payment-file",
              "l3Name": "Upload Payment File",
              "route": "/dashboard?nav=payroll-upload-payment-file"
            },
            {
              "l3Code": "payroll-authorize-payments",
              "l3Name": "Authorize Payments",
              "route": "/dashboard?nav=payroll-authorize-payments"
            },
            {
              "l3Code": "payroll-payment-status",
              "l3Name": "Payment Status",
              "route": "/dashboard?nav=payroll-payment-status"
            }
          ]
        },
        {
          "l2Code": "payment-templates",
          "l2Name": "Templates",
          "l3Items": [
            {
              "l3Code": "manage-templates",
              "l3Name": "Manage Templates",
              "route": "/dashboard?nav=manage-templates"
            }
          ]
        },
        {
          "l2Code": "payment-tracking",
          "l2Name": "Payment Tracking",
          "l3Items": [
            {
              "l3Code": "tracking-payment-status",
              "l3Name": "Payment Status",
              "route": "/dashboard?nav=tracking-payment-status"
            },
            {
              "l3Code": "tracking-payment-history",
              "l3Name": "Payment History",
              "route": "/dashboard?nav=tracking-payment-history"
            }
          ]
        }
      ]
    },
    {
      "l1Code": "liquidity",
      "l1Name": "Liquidity",
      "description": "Cash positioning, sweeps, and forecasting",
      "icon": "liquidity",
      "l2Items": [
        {
          "l2Code": "cash-position",
          "l2Name": "Cash Position",
          "l3Items": [
            {
              "l3Code": "view-cash-position",
              "l3Name": "View Cash Position",
              "route": "/dashboard?nav=view-cash-position"
            },
            {
              "l3Code": "liquidity-dashboard",
              "l3Name": "Liquidity Dashboard",
              "route": "/dashboard?nav=liquidity-dashboard"
            }
          ]
        },
        {
          "l2Code": "cash-concentration",
          "l2Name": "Cash Concentration",
          "l3Items": [
            {
              "l3Code": "setup-sweeps-concentration",
              "l3Name": "Setup Sweeps",
              "route": "/dashboard?nav=setup-sweeps-concentration"
            }
          ]
        },
        {
          "l2Code": "sweeps-transfers",
          "l2Name": "Sweeps & Transfers",
          "l3Items": [
            {
              "l3Code": "execute-transfers",
              "l3Name": "Execute Transfers",
              "route": "/dashboard?nav=execute-transfers"
            },
            {
              "l3Code": "setup-sweeps-transfers",
              "l3Name": "Setup Sweeps",
              "route": "/dashboard?nav=setup-sweeps-transfers"
            }
          ]
        },
        {
          "l2Code": "forecasting",
          "l2Name": "Forecasting",
          "l3Items": [
            {
              "l3Code": "forecast-reports",
              "l3Name": "Forecast Reports",
              "route": "/dashboard?nav=forecast-reports"
            }
          ]
        },
        {
          "l2Code": "intercompany-funding",
          "l2Name": "Intercompany Funding",
          "l3Items": [
            {
              "l3Code": "ic-execute-transfers",
              "l3Name": "Execute Transfers",
              "route": "/dashboard?nav=ic-execute-transfers"
            },
            {
              "l3Code": "ic-forecast-reports",
              "l3Name": "Forecast Reports",
              "route": "/dashboard?nav=ic-forecast-reports"
            }
          ]
        }
      ]
    },
    {
      "l1Code": "trade-finance",
      "l1Name": "Trade Finance",
      "description": "Guarantees, letters of credit, and trade flows",
      "icon": "trade",
      "l2Items": [
        {
          "l2Code": "guarantees",
          "l2Name": "Guarantees",
          "l3Items": [
            {
              "l3Code": "issue-guarantee",
              "l3Name": "Issue Guarantee",
              "route": "/dashboard?nav=issue-guarantee"
            },
            {
              "l3Code": "amend-trade-instrument-guarantee",
              "l3Name": "Amend Trade Instrument",
              "route": "/dashboard?nav=amend-trade-instrument-guarantee"
            }
          ]
        },
        {
          "l2Code": "letters-of-credit",
          "l2Name": "Letters of Credit",
          "l3Items": [
            {
              "l3Code": "request-lc",
              "l3Name": "Request LC",
              "route": "/dashboard?nav=request-lc"
            },
            {
              "l3Code": "amend-trade-instrument-lc",
              "l3Name": "Amend Trade Instrument",
              "route": "/dashboard?nav=amend-trade-instrument-lc"
            },
            {
              "l3Code": "submit-documents-lc",
              "l3Name": "Submit Documents",
              "route": "/dashboard?nav=submit-documents-lc"
            }
          ]
        },
        {
          "l2Code": "trade-collections",
          "l2Name": "Trade Collections",
          "l3Items": [
            {
              "l3Code": "submit-documents-collection",
              "l3Name": "Submit Documents",
              "route": "/dashboard?nav=submit-documents-collection"
            },
            {
              "l3Code": "track-trade-transaction-collection",
              "l3Name": "Track Trade Transaction",
              "route": "/dashboard?nav=track-trade-transaction-collection"
            }
          ]
        },
        {
          "l2Code": "trade-tracking",
          "l2Name": "Trade Tracking",
          "l3Items": [
            {
              "l3Code": "track-trade-transaction",
              "l3Name": "Track Trade Transaction",
              "route": "/dashboard?nav=track-trade-transaction"
            }
          ]
        }
      ]
    },
    {
      "l1Code": "collections",
      "l1Name": "Collections",
      "description": "Receivables, direct debit, and reconciliation",
      "icon": "collections",
      "l2Items": [
        {
          "l2Code": "direct-debit",
          "l2Name": "Direct Debit",
          "l3Items": [
            {
              "l3Code": "setup-direct-debit",
              "l3Name": "Setup Direct Debit",
              "route": "/dashboard?nav=setup-direct-debit"
            }
          ]
        },
        {
          "l2Code": "incoming-payments",
          "l2Name": "Incoming Payments",
          "l3Items": [
            {
              "l3Code": "view-incoming-payments",
              "l3Name": "View Incoming Payments",
              "route": "/dashboard?nav=view-incoming-payments"
            }
          ]
        },
        {
          "l2Code": "reconciliation",
          "l2Name": "Reconciliation",
          "l3Items": [
            {
              "l3Code": "reconciliation-dashboard",
              "l3Name": "Reconciliation Dashboard",
              "route": "/dashboard?nav=reconciliation-dashboard"
            }
          ]
        },
        {
          "l2Code": "collection-reports",
          "l2Name": "Collection Reports",
          "l3Items": [
            {
              "l3Code": "collection-reports-view",
              "l3Name": "Collection Reports",
              "route": "/dashboard?nav=collection-reports-view"
            }
          ]
        }
      ]
    },
    {
      "l1Code": "supply-chain-finance",
      "l1Name": "Supply Chain Finance",
      "description": "Buyer and supplier financing programs",
      "icon": "scf",
      "l2Items": [
        {
          "l2Code": "scf-programs",
          "l2Name": "Programs",
          "l3Items": [
            {
              "l3Code": "view-programs",
              "l3Name": "View Programs",
              "route": "/dashboard?nav=view-programs"
            }
          ]
        },
        {
          "l2Code": "buyer-finance",
          "l2Name": "Buyer Finance",
          "l3Items": [
            {
              "l3Code": "buyer-finance-requests",
              "l3Name": "Finance Requests",
              "route": "/dashboard?nav=buyer-finance-requests"
            },
            {
              "l3Code": "buyer-track-utilization",
              "l3Name": "Track Utilization",
              "route": "/dashboard?nav=buyer-track-utilization"
            }
          ]
        },
        {
          "l2Code": "supplier-finance",
          "l2Name": "Supplier Finance",
          "l3Items": [
            {
              "l3Code": "supplier-finance-requests",
              "l3Name": "Finance Requests",
              "route": "/dashboard?nav=supplier-finance-requests"
            },
            {
              "l3Code": "supplier-track-utilization",
              "l3Name": "Track Utilization",
              "route": "/dashboard?nav=supplier-track-utilization"
            }
          ]
        },
        {
          "l2Code": "invoice-management",
          "l2Name": "Invoice Management",
          "l3Items": [
            {
              "l3Code": "upload-invoices",
              "l3Name": "Upload Invoices",
              "route": "/dashboard?nav=upload-invoices"
            }
          ]
        }
      ]
    },
    {
      "l1Code": "virtual-accounts",
      "l1Name": "Virtual Accounts",
      "description": "Structured receivables and reconciliation",
      "icon": "virtual-accounts",
      "l2Items": [
        {
          "l2Code": "va-account-structure",
          "l2Name": "Account Structure",
          "l3Items": [
            {
              "l3Code": "create-virtual-account",
              "l3Name": "Create Virtual Account",
              "route": "/dashboard?nav=create-virtual-account"
            },
            {
              "l3Code": "manage-structure",
              "l3Name": "Manage Structure",
              "route": "/dashboard?nav=manage-structure"
            }
          ]
        },
        {
          "l2Code": "va-allocation-rules",
          "l2Name": "Allocation Rules",
          "l3Items": [
            {
              "l3Code": "configure-rules",
              "l3Name": "Configure Rules",
              "route": "/dashboard?nav=configure-rules"
            }
          ]
        },
        {
          "l2Code": "va-reconciliation",
          "l2Name": "Reconciliation",
          "l3Items": [
            {
              "l3Code": "va-reconciliation-view",
              "l3Name": "Reconciliation View",
              "route": "/dashboard?nav=va-reconciliation-view"
            }
          ]
        },
        {
          "l2Code": "va-reports",
          "l2Name": "Virtual Account Reports",
          "l3Items": [
            {
              "l3Code": "va-reports-reconciliation-view",
              "l3Name": "Reconciliation View",
              "route": "/dashboard?nav=va-reports-reconciliation-view"
            }
          ]
        }
      ]
    },
    {
      "l1Code": "host-to-host",
      "l1Name": "Host-to-Host",
      "description": "Direct system integration and file exchange",
      "icon": "host",
      "l2Items": [
        {
          "l2Code": "h2h-file-upload",
          "l2Name": "File Upload",
          "l3Items": [
            {
              "l3Code": "h2h-upload-files",
              "l3Name": "Upload Files",
              "route": "/dashboard?nav=h2h-upload-files"
            }
          ]
        },
        {
          "l2Code": "h2h-file-download",
          "l2Name": "File Download",
          "l3Items": [
            {
              "l3Code": "h2h-download-reports",
              "l3Name": "Download Reports",
              "route": "/dashboard?nav=h2h-download-reports"
            }
          ]
        },
        {
          "l2Code": "h2h-integration-setup",
          "l2Name": "Integration Setup",
          "l3Items": [
            {
              "l3Code": "integration-configuration",
              "l3Name": "Integration Configuration",
              "route": "/dashboard?nav=integration-configuration"
            }
          ]
        },
        {
          "l2Code": "h2h-message-tracking",
          "l2Name": "Message Tracking",
          "l3Items": [
            {
              "l3Code": "message-status",
              "l3Name": "Message Status",
              "route": "/dashboard?nav=message-status"
            },
            {
              "l3Code": "error-logs",
              "l3Name": "Error Logs",
              "route": "/dashboard?nav=error-logs"
            }
          ]
        }
      ]
    },
    {
      "l1Code": "reports-insights",
      "l1Name": "Reports & Insights",
      "description": "Reports, analytics, and dashboards",
      "icon": "reports",
      "l2Items": [
        {
          "l2Code": "standard-reports",
          "l2Name": "Standard Reports",
          "l3Items": [
            {
              "l3Code": "generate-reports",
              "l3Name": "Generate Reports",
              "route": "/dashboard?nav=generate-reports"
            },
            {
              "l3Code": "download-reports",
              "l3Name": "Download Reports",
              "route": "/dashboard?nav=download-reports"
            }
          ]
        },
        {
          "l2Code": "custom-reports",
          "l2Name": "Custom Reports",
          "l3Items": [
            {
              "l3Code": "create-custom-reports",
              "l3Name": "Create Custom Reports",
              "route": "/dashboard?nav=create-custom-reports"
            }
          ]
        },
        {
          "l2Code": "dashboards",
          "l2Name": "Dashboards",
          "l3Items": [
            {
              "l3Code": "view-dashboards",
              "l3Name": "View Dashboards",
              "route": "/dashboard?nav=view-dashboards"
            }
          ]
        },
        {
          "l2Code": "scheduled-reports",
          "l2Name": "Scheduled Reports",
          "l3Items": [
            {
              "l3Code": "schedule-reports",
              "l3Name": "Schedule Reports",
              "route": "/dashboard?nav=schedule-reports"
            }
          ]
        }
      ]
    },
    {
      "l1Code": "administration",
      "l1Name": "Administration",
      "description": "Users, access, and system configuration",
      "icon": "admin",
      "l2Items": [
        {
          "l2Code": "user-management",
          "l2Name": "User Management",
          "l3Items": [
            {
              "l3Code": "create-users",
              "l3Name": "Create Users",
              "route": "/dashboard?nav=create-users"
            }
          ]
        },
        {
          "l2Code": "roles-permissions",
          "l2Name": "Roles & Permissions",
          "l3Items": [
            {
              "l3Code": "manage-roles",
              "l3Name": "Manage Roles",
              "route": "/dashboard?nav=manage-roles"
            }
          ]
        },
        {
          "l2Code": "approval-matrix",
          "l2Name": "Approval Matrix",
          "l3Items": [
            {
              "l3Code": "configure-approvals",
              "l3Name": "Configure Approvals",
              "route": "/dashboard?nav=configure-approvals"
            }
          ]
        },
        {
          "l2Code": "system-settings",
          "l2Name": "System Settings",
          "l3Items": [
            {
              "l3Code": "update-preferences",
              "l3Name": "Update Preferences",
              "route": "/dashboard?nav=update-preferences"
            },
            {
              "l3Code": "audit-logs",
              "l3Name": "Audit Logs",
              "route": "/dashboard?nav=audit-logs"
            }
          ]
        }
      ]
    }
  ]
};
