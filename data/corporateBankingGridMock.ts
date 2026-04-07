import type { CorporateBankingGridRow, CorporateGridProductType } from "@/data/corporateBankingGridTypes";
import { CORPORATE_PORTFOLIO_TAB_COUNTS } from "@/data/corporateBankingGridTypes";
import { formatCustomerId, ibanFor, listCorporateAccountsPortfolio, seededOffset } from "@/data/corporateAccountPortfolioMock";
import type { PortfolioModuleTab } from "@/data/portfolioSummaryTypes";

const ENTITIES = [
  "FAB Holdings LLC",
  "FAB Trading Sub A Ltd",
  "MENA Treasury SPV",
  "Singapore Operations Pte Ltd",
  "UK Financing Limited",
  "LuxCo Treasury S.à r.l.",
  "India Collections Pvt Ltd",
  "US Collections — Subsidiary A",
  "GCC Project Co LLC",
  "Europe Liquidity DAC",
] as const;

const COUNTRIES: { code: string; name: string; ccy: string }[] = [
  { code: "AE", name: "United Arab Emirates", ccy: "AED" },
  { code: "SG", name: "Singapore", ccy: "SGD" },
  { code: "GB", name: "United Kingdom", ccy: "GBP" },
  { code: "US", name: "United States", ccy: "USD" },
  { code: "SA", name: "Saudi Arabia", ccy: "SAR" },
  { code: "EG", name: "Egypt", ccy: "EGP" },
  { code: "IN", name: "India", ccy: "INR" },
  { code: "HK", name: "Hong Kong", ccy: "HKD" },
  { code: "LU", name: "Luxembourg", ccy: "EUR" },
  { code: "CH", name: "Switzerland", ccy: "CHF" },
];

const DEPOSIT_TYPES = ["Term Deposit", "Notice", "Islamic Deposit", "Call"] as const;

function buildDepositRow(i: number): CorporateBankingGridRow {
  const seed = i + 1;
  const country = COUNTRIES[seededOffset(seed * 5, COUNTRIES.length)];
  const entity = ENTITIES[seededOffset(seed * 7, ENTITIES.length)];
  const depositType = DEPOSIT_TYPES[seededOffset(seed * 11, DEPOSIT_TYPES.length)];
  const ccy = country.ccy;
  const principal = 500_000 + ((seed * 1103515245) % 120_000_000_000);
  const rate = 2.5 + seededOffset(seed * 13, 350) / 100;
  const days = 30 + seededOffset(seed * 17, 730);
  const start = new Date(Date.UTC(2024, seededOffset(seed, 11), 1 + seededOffset(seed * 2, 25)));
  const maturity = new Date(start.getTime() + days * 86400000);
  const remaining = Math.max(0, Math.ceil((maturity.getTime() - Date.UTC(2026, 2, 28)) / 86400000));
  const accrued = Math.round(principal * (rate / 100) * (days / 365));
  const maturityValue = principal + accrued;
  const statuses = ["Active", "Matured", "Renewed", "Pending"] as const;
  const status = statuses[seededOffset(seed * 19, statuses.length)];
  const accountType: CorporateGridProductType = "Time Deposit";

  return {
    id: `corp-dep-${seed}`,
    productLine: "deposit",
    entity,
    customerId: formatCustomerId(seed * 91),
    accountCountryCode: country.code,
    accountCountryName: country.name,
    accountName: `Deposit — ${entity.split(" ")[0]} ${ccy} (${seed})`,
    accountCcy: ccy,
    accountNumber: String(2000000000 + ((seed * 7919) % 899999999)),
    iban: ibanFor(seed * 3, country.code),
    accountType,
    status,
    balanceAed: Math.round(principal * 3.67),
    depositId: `DEP-${String(900000 + seed).padStart(7, "0")}`,
    depositType,
    productTypeLabel: depositType,
    facilityDisplayName: `Deposit — ${entity.split(" ")[0]} ${ccy} (${seed})`,
    principalAmount: principal,
    interestRatePct: rate,
    startDate: start.toISOString().slice(0, 10),
    maturityDate: maturity.toISOString().slice(0, 10),
    remainingDays: remaining,
    accruedInterest: accrued,
    maturityValue,
    autoRenewalFlag: seededOffset(seed * 23, 2) === 0,
    maturityRisk: remaining <= 30 && remaining > 0,
    renewalPending: seededOffset(seed * 29, 5) === 0,
    balance: principal,
    availableBalance: principal,
    exposure: principal,
    lastActivityDate: start.toISOString().slice(0, 10),
    netPosition: principal,
    liquidityImpact: seededOffset(seed * 31, 3) === 0 ? "Negative" : "Neutral",
    riskFlag: remaining <= 14 ? "Medium" : "Low",
  };
}

const LOAN_TYPES: CorporateGridProductType[] = ["Revolving Credit", "Term Loan", "Working Capital", "Overdraft"];

function buildLoanRow(i: number): CorporateBankingGridRow {
  const seed = i + 1;
  const country = COUNTRIES[seededOffset(seed * 6, COUNTRIES.length)];
  const entity = ENTITIES[seededOffset(seed * 8, ENTITIES.length)];
  const loanProduct = LOAN_TYPES[seededOffset(seed * 9, LOAN_TYPES.length)];
  const facilityName = `${loanProduct} — ${entity.split(" ")[0]}`;
  const ccy = country.ccy;
  const approved = 5_000_000 + ((seed * 1103515245) % 400_000_000_000);
  const out = Math.round(approved * (0.35 + seededOffset(seed * 11, 55) / 100));
  const avail = Math.max(0, approved - out);
  const rate = 3.2 + seededOffset(seed * 13, 280) / 100;
  const nextRepay = new Date(Date.UTC(2026, seededOffset(seed, 11), 5 + seededOffset(seed * 3, 20)));
  const repayAmt = Math.round(out * (seededOffset(seed * 17, 5) + 1) / 400);
  const tenor = `${12 + seededOffset(seed * 19, 48)} months`;
  const collaterals = ["Cash", "Property", "Guarantee", "Receivables", "Mixed"] as const;
  const ratings = ["AAA", "AA", "A", "BBB", "BB"] as const;
  const statuses = ["Active", "Active", "Watchlist"] as const;
  const daysToRepay = Math.ceil((nextRepay.getTime() - Date.UTC(2026, 2, 28)) / 86400000);

  return {
    id: `corp-loan-${seed}`,
    productLine: "loan",
    entity,
    customerId: formatCustomerId(seed * 89),
    accountCountryCode: country.code,
    accountCountryName: country.name,
    accountName: facilityName,
    accountCcy: ccy,
    accountNumber: String(3000000000 + ((seed * 7919) % 899999999)),
    iban: ibanFor(seed * 5, country.code),
    accountType: loanProduct,
    status: statuses[seededOffset(seed * 21, statuses.length)],
    balanceAed: Math.round(out * 3.67),
    loanId: `LN-${String(700000 + seed).padStart(7, "0")}`,
    facilityName,
    productTypeLabel: loanProduct,
    facilityDisplayName: facilityName,
    approvedLimit: approved,
    outstandingAmount: out,
    availableLimit: avail,
    loanInterestRatePct: rate,
    nextRepaymentDate: nextRepay.toISOString().slice(0, 10),
    nextRepaymentAmount: repayAmt,
    tenor,
    collateralType: collaterals[seededOffset(seed * 27, collaterals.length)],
    riskRating: ratings[seededOffset(seed * 29, ratings.length)],
    repaymentDueSoon: daysToRepay >= 0 && daysToRepay <= 14,
    balance: out,
    availableBalance: avail,
    utilisedAmount: out,
    exposure: out,
    lastActivityDate: nextRepay.toISOString().slice(0, 10),
    netPosition: -out,
    liquidityImpact: out > approved * 0.85 ? "Negative" : "Neutral",
    riskFlag: out > approved * 0.9 ? "High" : "Medium",
  };
}

const DEPOSIT_MOCK: CorporateBankingGridRow[] = Array.from({ length: CORPORATE_PORTFOLIO_TAB_COUNTS.deposits }, (_, i) =>
  buildDepositRow(i),
);

const LOAN_MOCK: CorporateBankingGridRow[] = Array.from({ length: CORPORATE_PORTFOLIO_TAB_COUNTS.loans }, (_, i) =>
  buildLoanRow(i),
);

export function listCorporateDepositsGrid(): CorporateBankingGridRow[] {
  return [...DEPOSIT_MOCK];
}

export function listCorporateLoansGrid(): CorporateBankingGridRow[] {
  return [...LOAN_MOCK];
}

/** Consolidated portfolio: accounts + deposits + loans (deterministic ordering) */
export function listCorporatePortfolioGrid(): CorporateBankingGridRow[] {
  return [...listCorporateAccountsPortfolio(), ...DEPOSIT_MOCK, ...LOAN_MOCK];
}

export function listCorporateBankingGridForModule(module: PortfolioModuleTab): CorporateBankingGridRow[] {
  if (module === "portfolio") return listCorporatePortfolioGrid();
  if (module === "accounts") return listCorporateAccountsPortfolio();
  if (module === "deposits") return listCorporateDepositsGrid();
  return listCorporateLoansGrid();
}
