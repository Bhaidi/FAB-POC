"use client";

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { useDashboardGlobal } from "@/components/dashboard/DashboardGlobalContext";
import type { AccountServicesEntitlements, StubAccountRecord } from "@/data/accountServicesTypes";
import {
  getStubAccount,
  getStubActivity,
  getStubEntitlements,
  listStubAccounts,
} from "@/lib/accountServicesService";

type AccountServicesContextValue = {
  accounts: StubAccountRecord[];
  selectedAccountId: string;
  selectedAccount: StubAccountRecord;
  setSelectedAccountId: (id: string) => void;
  entitlements: AccountServicesEntitlements;
  personaLabel: string;
};

const AccountServicesContext = createContext<AccountServicesContextValue | null>(null);

export function AccountServicesProvider({ children }: { children: ReactNode }) {
  const { userContext } = useDashboardGlobal();
  const accounts = useMemo(() => listStubAccounts(), []);
  const [selectedAccountId, setSelectedAccountIdState] = useState(() => accounts[0]?.accountId ?? "");

  const setSelectedAccountId = useCallback((id: string) => {
    if (getStubAccount(id)) setSelectedAccountIdState(id);
  }, []);

  const selectedAccount = useMemo(() => {
    return getStubAccount(selectedAccountId) ?? accounts[0]!;
  }, [accounts, selectedAccountId]);

  const entitlements = useMemo(
    () => getStubEntitlements(userContext?.userRole),
    [userContext?.userRole]
  );

  const personaLabel = userContext?.userRole ?? "MAKER";

  const value = useMemo(
    () => ({
      accounts,
      selectedAccountId: selectedAccount.accountId,
      selectedAccount,
      setSelectedAccountId,
      entitlements,
      personaLabel,
    }),
    [accounts, entitlements, personaLabel, selectedAccount, setSelectedAccountId]
  );

  return <AccountServicesContext.Provider value={value}>{children}</AccountServicesContext.Provider>;
}

export function useAccountServicesModule(): AccountServicesContextValue {
  const ctx = useContext(AccountServicesContext);
  if (!ctx) {
    throw new Error("useAccountServicesModule must be used within AccountServicesProvider");
  }
  return ctx;
}

export function useAccountServicesActivity() {
  const { selectedAccountId } = useAccountServicesModule();
  return useMemo(() => getStubActivity(selectedAccountId), [selectedAccountId]);
}
