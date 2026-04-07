"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { AccountServicesStubPage } from "@/components/account-services/AccountServicesStubPage";
import { getStubAccount } from "@/lib/accountServicesService";

function DetailsInner() {
  const sp = useSearchParams();
  const id = sp.get("accountId");
  const a = id ? getStubAccount(id) : null;
  return (
    <AccountServicesStubPage
      title={a?.accountName ?? "Account details"}
      subtitle={
        a
          ? `${a.currency} · ${a.country} · ${a.entityName} — stub detail view.`
          : "Review account information, ownership, and linked relationships for the selected account."
      }
    />
  );
}

export default function AccountServicesDetailsPage() {
  return (
    <Suspense fallback={null}>
      <DetailsInner />
    </Suspense>
  );
}
