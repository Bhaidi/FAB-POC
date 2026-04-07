import type { PortfolioModuleTab } from "@/data/portfolioSummaryTypes";

/** Row discriminator for consolidated portfolio grid */
export type CorporateBankingProductLine = "account" | "deposit" | "loan";

/** @deprecated Use CORPORATE_GRID_PRODUCT_TYPES — kept for existing imports */
export type CorporateAccountType = "Current" | "Savings" | "External" | "Call" | "Time Deposit";

export type CorporateGridProductType =
  | CorporateAccountType
  | "Term Deposit"
  | "Notice"
  | "Islamic Deposit"
  | "Revolving Credit"
  | "Term Loan"
  | "Working Capital"
  | "Overdraft";

/**
 * Unified corporate banking grid row — wide shape with view-specific fields populated per mode.
 * Enables modular column sets (Portfolio / Accounts / Deposits / Loans / future: Trade Finance, …).
 */
export type CorporateBankingGridRow = {
  id: string;
  /** Source product line when row appears in consolidated Portfolio view */
  productLine: CorporateBankingProductLine;
  entity: string;
  customerId: string;
  accountCountryCode: string;
  accountCountryName: string;
  accountName: string;
  accountCcy: string;
  accountNumber: string;
  iban: string;
  accountType: CorporateGridProductType;
  status: string;

  /** AED equivalent for summaries / rollups */
  balanceAed: number;

  // —— Portfolio (consolidated) ——
  productTypeLabel?: string;
  /** Account / facility display name in portfolio */
  facilityDisplayName?: string;
  balance?: number;
  availableBalance?: number;
  utilisedAmount?: number;
  exposure?: number;
  lastActivityDate?: string;
  netPosition?: number;
  liquidityImpact?: "Positive" | "Neutral" | "Negative";
  riskFlag?: "Low" | "Medium" | "High";

  // —— Accounts ——
  currentBalance?: number;
  blockedAmount?: number;
  lastTransactionDate?: string;
  dailyMovement?: number;
  thirtyDayAvgBalance?: number;

  // —— Deposits ——
  depositId?: string;
  depositType?: string;
  principalAmount?: number;
  interestRatePct?: number;
  startDate?: string;
  maturityDate?: string;
  remainingDays?: number;
  accruedInterest?: number;
  maturityValue?: number;
  autoRenewalFlag?: boolean;
  maturityRisk?: boolean;
  renewalPending?: boolean;

  // —— Loans ——
  loanId?: string;
  facilityName?: string;
  approvedLimit?: number;
  outstandingAmount?: number;
  availableLimit?: number;
  loanInterestRatePct?: number;
  nextRepaymentDate?: string;
  nextRepaymentAmount?: number;
  tenor?: string;
  collateralType?: string;
  riskRating?: string;
  repaymentDueSoon?: boolean;
};

/** Same row type exposed under the legacy name */
export type CorporateAccountPortfolioRow = CorporateBankingGridRow;

export const CORPORATE_PORTFOLIO_TAB_COUNTS = {
  accounts: 76,
  deposits: 390,
  loans: 24,
  portfolio: 76 + 390 + 24,
} as const;

/** Extensible view keys for future modules */
export type CorporateBankingViewId = PortfolioModuleTab | "tradeFinance" | "guarantees" | "virtualAccounts";
