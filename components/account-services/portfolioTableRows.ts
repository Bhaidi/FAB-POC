import type { StubAccountRecord, StubDepositRecord, StubLoanRecord } from "@/data/accountServicesTypes";
import { ACCOUNT_SERVICES_BASE_PATH } from "@/lib/accountServicesRoutes";
import { formatBalanceCompact } from "@/lib/accountServicesService";
import type { PortfolioTableRow } from "@/components/account-services/portfolioTableTypes";

function statusLabelFor(s: string): string {
  if (s === "active") return "Active";
  if (s === "dormant") return "Dormant";
  return "Restricted";
}

export function buildPortfolioRows(
  accounts: StubAccountRecord[],
  deposits: StubDepositRecord[],
  loans: StubLoanRecord[],
): PortfolioTableRow[] {
  const aRows: PortfolioTableRow[] = accounts.map((a) => ({
    kind: "accounts",
    key: `acc:${a.accountId}`,
    name: a.accountName,
    amountDisplay: formatBalanceCompact(a.availableBalance, a.currency),
    meta: `Entity: ${a.entityName} · ${a.currency} · ${a.country}`,
    statusActive: a.status === "active",
    statusLabel: statusLabelFor(a.status),
    progressPct: null,
    href: `${ACCOUNT_SERVICES_BASE_PATH}/details?accountId=${encodeURIComponent(a.accountId)}`,
  }));
  const dRows: PortfolioTableRow[] = deposits.map((d) => ({
    kind: "deposits",
    key: `dep:${d.id}`,
    name: d.name,
    amountDisplay: formatBalanceCompact(d.amount, d.currency),
    meta: `Maturity: ${d.maturityDate} · Interest: ${d.interestRatePct}`,
    statusActive: d.status === "active",
    statusLabel: statusLabelFor(d.status),
    progressPct: d.termProgressPct,
    href: `${ACCOUNT_SERVICES_BASE_PATH}/workspace?type=deposit&id=${encodeURIComponent(d.id)}`,
  }));
  const lRows: PortfolioTableRow[] = loans.map((loan) => ({
    kind: "loans",
    key: `loan:${loan.id}`,
    name: loan.name,
    amountDisplay: formatBalanceCompact(loan.outstanding, loan.currency),
    meta: `Next payment: ${loan.nextPaymentDate} · Risk: ${loan.riskLabel}`,
    statusActive: loan.status === "active" && loan.riskLabel !== "Elevated",
    statusLabel: statusLabelFor(loan.status),
    progressPct: loan.repaymentPct,
    href: `${ACCOUNT_SERVICES_BASE_PATH}/workspace?type=loan&id=${encodeURIComponent(loan.id)}`,
  }));
  return [...aRows, ...dRows, ...lRows];
}
