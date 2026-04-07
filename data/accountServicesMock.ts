import type { PlatformUserWorkflowRole } from "@/types/platformUserContext";
import type {
  AccountActivityRecord,
  AccountServicesEntitlements,
  AccountServicesPortfolioSummary,
  StubAccountRecord,
  StubDepositRecord,
  StubLoanRecord,
} from "@/data/accountServicesTypes";

const MILLION = 1_000_000;

/** Organisation-level totals for financial summary (stub). */
export const ACCOUNT_SERVICES_PORTFOLIO: AccountServicesPortfolioSummary = {
  totalDisplay: "AED 24.6M",
  accountCount: 12,
  currencyCount: 10,
  countryCount: 3,
  topCurrencies: [
    { code: "AED", pct: 62, displayShare: "62%" },
    { code: "USD", pct: 22, displayShare: "22%" },
    { code: "SGD", pct: 10, displayShare: "10%" },
    { code: "EUR", pct: 6, displayShare: "6%" },
  ],
};

export const ACCOUNT_SERVICES_MOCK_DEPOSITS: StubDepositRecord[] = [
  {
    id: "dep_usd_td",
    name: "Time Deposit – USD",
    currency: "USD",
    amount: 2.1 * MILLION,
    maturityDate: "12 Dec 2026",
    interestRatePct: "4.2%",
    status: "active",
    termProgressPct: 38,
  },
  {
    id: "dep_aed_notice",
    name: "Notice Deposit – AED",
    currency: "AED",
    amount: 3_400_000,
    maturityDate: "Rolling 35-day",
    interestRatePct: "3.85%",
    status: "active",
    termProgressPct: 55,
  },
];

export const ACCOUNT_SERVICES_MOCK_LOANS: StubLoanRecord[] = [
  {
    id: "loan_wc",
    name: "Working Capital Loan",
    currency: "AED",
    outstanding: 5.4 * MILLION,
    nextPaymentDate: "28 Mar",
    status: "active",
    repaymentPct: 42,
    riskLabel: "Normal",
  },
  {
    id: "loan_rev",
    name: "Revolving Credit Facility",
    currency: "USD",
    outstanding: 1_200_000,
    nextPaymentDate: "15 Apr",
    status: "active",
    repaymentPct: 18,
    riskLabel: "Low",
  },
];

export const ACCOUNT_SERVICES_MOCK_ACCOUNTS: StubAccountRecord[] = [
  {
    accountId: "acc_uae_main",
    accountName: "FAB UAE Operating Account",
    entityName: "FAB Holdings LLC",
    country: "UAE",
    currency: "AED",
    availableBalance: 8.2 * MILLION,
    currentBalance: 8.5 * MILLION,
    linkedAccountsCount: 4,
    status: "active",
  },
  {
    accountId: "acc_sgd_ops",
    accountName: "Singapore Operations Account",
    entityName: "FAB Holdings LLC",
    country: "Singapore",
    currency: "SGD",
    availableBalance: 1_850_000,
    currentBalance: 1_920_000,
    linkedAccountsCount: 2,
    status: "active",
  },
  {
    accountId: "acc_usd_sub",
    accountName: "USD Collections — Subsidiary A",
    entityName: "FAB Trading Sub A Ltd",
    country: "UAE",
    currency: "USD",
    availableBalance: 420_000,
    currentBalance: 435_000,
    linkedAccountsCount: 1,
    status: "active",
  },
  {
    accountId: "acc_single",
    accountName: "Primary Business Account",
    entityName: "Sole Entity Corp",
    country: "UAE",
    currency: "AED",
    availableBalance: 125_000,
    currentBalance: 128_500,
    linkedAccountsCount: 0,
    status: "active",
  },
];

export const ACCOUNT_SERVICES_MOCK_ACTIVITY: AccountActivityRecord[] = [
  {
    id: "a1",
    type: "statement_downloaded",
    label: "Statement downloaded",
    timestamp: new Date(Date.now() - 8 * 60 * 1000).toISOString(),
  },
  {
    id: "a2",
    type: "service_request",
    label: "Service request submitted",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "a3",
    type: "details_viewed",
    label: "Account details viewed",
    timestamp: new Date(Date.now() - 26 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "a4",
    type: "certificate_requested",
    label: "Balance certificate requested",
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

const ALL_TRUE: AccountServicesEntitlements = {
  primary_details: true,
  primary_transactions: true,
  primary_statements: true,
  primary_requests: true,
  info_details: true,
  info_balances: true,
  info_statements: true,
  info_documents: true,
  maint_update: true,
  maint_signatories: true,
  maint_link: true,
  maint_settings: true,
  req_certificate: true,
  req_service: true,
  req_track: true,
};

/** Stub: role shapes which secondary features are enabled (remaining visible but locked). */
export function mockEntitlementsForRole(role: PlatformUserWorkflowRole | undefined): AccountServicesEntitlements {
  const r = role ?? "MAKER";
  if (r === "MAKER") {
    return {
      ...ALL_TRUE,
      maint_signatories: false,
      maint_link: false,
    };
  }
  if (r === "CHECKER") {
    return {
      ...ALL_TRUE,
      maint_update: false,
      req_service: false,
      req_certificate: false,
    };
  }
  /** ADMIN / default — treat as broad viewer + ops */
  return {
    ...ALL_TRUE,
    primary_requests: false,
    maint_update: false,
    maint_signatories: false,
    maint_link: false,
  };
}

export function mockActivityForAccount(accountId: string): AccountActivityRecord[] {
  return ACCOUNT_SERVICES_MOCK_ACTIVITY.map((row, i) => ({
    ...row,
    id: `${accountId}_${row.id}`,
  }));
}
