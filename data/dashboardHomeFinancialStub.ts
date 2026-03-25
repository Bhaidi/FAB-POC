/**
 * Dashboard home “Total Balance” rail — stubbed until treasury aggregate APIs exist.
 * Keyed by `organizationId` from platform user-context.
 */

export type DashboardFinancialCurrencyRow = {
  code: string;
  displayAmount: string;
  /** Relative scale for bar chart proportion */
  scale: number;
};

export type DashboardHomeFinancialStub = {
  /** Hero headline amount in millions (AED) */
  heroMillions: number;
  accountCount: number;
  currencyRows: DashboardFinancialCurrencyRow[];
  countriesTooltip: string;
  countryCount: number;
};

const MAX_CURRENCIES: DashboardFinancialCurrencyRow[] = [
  { code: "AED", displayAmount: "62.8M", scale: 62.8 },
  { code: "USD", displayAmount: "24.1M", scale: 24.1 },
  { code: "EUR", displayAmount: "18.6M", scale: 18.6 },
  { code: "GBP", displayAmount: "11.2M", scale: 11.2 },
  { code: "SGD", displayAmount: "9.4M", scale: 9.4 },
  { code: "CHF", displayAmount: "7.8M", scale: 7.8 },
  { code: "SAR", displayAmount: "14.2M", scale: 14.2 },
  { code: "HKD", displayAmount: "8.1M", scale: 8.1 },
  { code: "JPY", displayAmount: "6.4M", scale: 6.4 },
  { code: "AUD", displayAmount: "5.9M", scale: 5.9 },
];

const MIN_CURRENCIES: DashboardFinancialCurrencyRow[] = [
  { code: "AED", displayAmount: "2.1M", scale: 2.1 },
];

const CHECKER_CURRENCIES: DashboardFinancialCurrencyRow[] = [
  { code: "AED", displayAmount: "28.4M", scale: 28.4 },
  { code: "USD", displayAmount: "6.2M", scale: 6.2 },
  { code: "GBP", displayAmount: "2.8M", scale: 2.8 },
  { code: "SGD", displayAmount: "3.1M", scale: 3.1 },
  { code: "EUR", displayAmount: "1.9M", scale: 1.9 },
];

export const DASHBOARD_HOME_FINANCIAL_BY_ORG: Record<string, DashboardHomeFinancialStub> = {
  "org-9001": {
    heroMillions: 156.4,
    accountCount: 128,
    currencyRows: MAX_CURRENCIES,
    countriesTooltip:
      "UAE (52 accounts)\nUK (31 accounts)\nSingapore (18 accounts)\nHong Kong (15 accounts)\nFrance (12 accounts)",
    countryCount: 5,
  },
  "org-9002": {
    heroMillions: 2.1,
    accountCount: 1,
    currencyRows: MIN_CURRENCIES,
    countriesTooltip: "UAE (1 account)",
    countryCount: 1,
  },
  "org-9003": {
    heroMillions: 41.2,
    accountCount: 56,
    currencyRows: CHECKER_CURRENCIES,
    countriesTooltip: "UAE (31 accounts)\nUK (15 accounts)\nSingapore (10 accounts)",
    countryCount: 3,
  },
};

export const DEFAULT_DASHBOARD_FINANCIAL_ORG_ID = "org-9001";

export function getDashboardHomeFinancialStub(organizationId: string | undefined): DashboardHomeFinancialStub {
  const id = organizationId?.trim();
  if (id && DASHBOARD_HOME_FINANCIAL_BY_ORG[id]) {
    return DASHBOARD_HOME_FINANCIAL_BY_ORG[id]!;
  }
  return DASHBOARD_HOME_FINANCIAL_BY_ORG[DEFAULT_DASHBOARD_FINANCIAL_ORG_ID]!;
}
