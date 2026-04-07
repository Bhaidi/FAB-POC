import type { PlatformUserWorkflowRole } from "@/types/platformUserContext";
import {
  ACCOUNT_SERVICES_MOCK_ACCOUNTS,
  ACCOUNT_SERVICES_MOCK_DEPOSITS,
  ACCOUNT_SERVICES_MOCK_LOANS,
  ACCOUNT_SERVICES_PORTFOLIO,
  mockActivityForAccount,
  mockEntitlementsForRole,
} from "@/data/accountServicesMock";
import { CORPORATE_ACCOUNTS_PORTFOLIO_MOCK } from "@/data/corporateAccountPortfolioMock";
import type {
  AccountActivityRecord,
  AccountServicesEntitlements,
  AccountServicesPortfolioSummary,
  StubAccountRecord,
  StubDepositRecord,
  StubLoanRecord,
} from "@/data/accountServicesTypes";

export function listStubAccounts(): StubAccountRecord[] {
  return [...ACCOUNT_SERVICES_MOCK_ACCOUNTS];
}

export function listStubDeposits(): StubDepositRecord[] {
  return [...ACCOUNT_SERVICES_MOCK_DEPOSITS];
}

export function listStubLoans(): StubLoanRecord[] {
  return [...ACCOUNT_SERVICES_MOCK_LOANS];
}

export function getStubAccount(accountId: string): StubAccountRecord | null {
  const legacy = ACCOUNT_SERVICES_MOCK_ACCOUNTS.find((a) => a.accountId === accountId);
  if (legacy) return legacy;
  const corp = CORPORATE_ACCOUNTS_PORTFOLIO_MOCK.find((r) => r.id === accountId);
  if (!corp) return null;
  return {
    accountId: corp.id,
    accountName: corp.accountName,
    entityName: corp.entity,
    country: corp.accountCountryName,
    currency: corp.accountCcy,
    availableBalance: corp.balanceAed,
    currentBalance: corp.balanceAed,
    linkedAccountsCount: 0,
    status: "active",
  };
}

export function getStubEntitlements(persona: PlatformUserWorkflowRole | undefined): AccountServicesEntitlements {
  return mockEntitlementsForRole(persona);
}

export function getStubActivity(accountId: string): AccountActivityRecord[] {
  return mockActivityForAccount(accountId);
}

export function getStubPortfolioSummary(): AccountServicesPortfolioSummary {
  return ACCOUNT_SERVICES_PORTFOLIO;
}

export function formatBalanceCompact(amount: number, currency: string): string {
  const abs = Math.abs(amount);
  if (abs >= 1_000_000) {
    return `${currency} ${(amount / 1_000_000).toFixed(1)}M`;
  }
  if (abs >= 1_000) {
    return `${currency} ${(amount / 1_000).toFixed(1)}K`;
  }
  return `${currency} ${amount.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
}
