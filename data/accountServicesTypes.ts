export type AccountServicesStatus = "active" | "dormant" | "restricted";

export type StubAccountRecord = {
  accountId: string;
  accountName: string;
  entityName: string;
  country: string;
  currency: string;
  availableBalance: number;
  currentBalance: number;
  linkedAccountsCount: number;
  status: AccountServicesStatus;
};

export type AccountActivityType =
  | "statement_downloaded"
  | "service_request"
  | "details_viewed"
  | "certificate_requested"
  | "signatory_update";

export type AccountActivityRecord = {
  id: string;
  type: AccountActivityType;
  label: string;
  timestamp: string;
};

/** Feature keys for entitlement checks and workspace deep links */
export type AccountServicesFeatureKey =
  | "primary_details"
  | "primary_transactions"
  | "primary_statements"
  | "primary_requests"
  | "info_details"
  | "info_balances"
  | "info_statements"
  | "info_documents"
  | "maint_update"
  | "maint_signatories"
  | "maint_link"
  | "maint_settings"
  | "req_certificate"
  | "req_service"
  | "req_track";

export type AccountServicesEntitlements = Record<AccountServicesFeatureKey, boolean>;

export type AccountPortfolioCurrencySlice = {
  code: string;
  pct: number;
  displayShare: string;
};

export type AccountServicesPortfolioSummary = {
  /** Display for headline total (stub, “equivalent” basis). */
  totalDisplay: string;
  accountCount: number;
  currencyCount: number;
  countryCount: number;
  topCurrencies: AccountPortfolioCurrencySlice[];
};

export type StubDepositRecord = {
  id: string;
  name: string;
  currency: string;
  amount: number;
  maturityDate: string;
  interestRatePct: string;
  status: AccountServicesStatus;
  /** 0–100 elapsed term for subtle progress */
  termProgressPct: number;
};

export type StubLoanRecord = {
  id: string;
  name: string;
  currency: string;
  outstanding: number;
  nextPaymentDate: string;
  status: AccountServicesStatus;
  /** 0–100 repaid */
  repaymentPct: number;
  riskLabel: "Low" | "Normal" | "Elevated";
};
