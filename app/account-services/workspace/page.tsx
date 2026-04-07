"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { AccountServicesStubPage } from "@/components/account-services/AccountServicesStubPage";
import { ACCOUNT_SERVICES_MOCK_DEPOSITS, ACCOUNT_SERVICES_MOCK_LOANS } from "@/data/accountServicesMock";

const KEY_LABELS: Record<string, string> = {
  info_documents: "Documents",
  maint_update: "Update account information",
  maint_signatories: "Manage signatories",
  maint_link: "Link or delink accounts",
  maint_settings: "Account settings",
  req_certificate: "Request statement or certificate",
  req_track: "Track requests",
};

function WorkspaceInner() {
  const sp = useSearchParams();
  const type = sp.get("type");
  const id = sp.get("id") ?? "";

  if (type === "deposit") {
    const row = ACCOUNT_SERVICES_MOCK_DEPOSITS.find((d) => d.id === id);
    return (
      <AccountServicesStubPage
        title={row ? row.name : "Deposit"}
        subtitle={row ? `Maturity ${row.maturityDate} · ${row.currency} ${(row.amount / 1_000_000).toFixed(1)}M equivalent (stub).` : undefined}
      />
    );
  }
  if (type === "loan") {
    const row = ACCOUNT_SERVICES_MOCK_LOANS.find((l) => l.id === id);
    return (
      <AccountServicesStubPage
        title={row ? row.name : "Loan"}
        subtitle={row ? `Outstanding facility · Next payment ${row.nextPaymentDate} (stub).` : undefined}
      />
    );
  }

  const key = sp.get("key") ?? "";
  const title = KEY_LABELS[key] ?? "Workspace";
  return (
    <AccountServicesStubPage
      title={title}
      subtitle="This workspace entry is reserved for a focused flow."
    />
  );
}

export default function AccountServicesWorkspacePage() {
  return (
    <Suspense fallback={null}>
      <WorkspaceInner />
    </Suspense>
  );
}
