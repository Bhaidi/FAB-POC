"use client";

import {
  Banknote,
  BarChart3,
  Landmark,
  LayoutDashboard,
  Layers2,
  PieChart,
  ReceiptText,
  Server,
  Settings,
  Ship,
  Truck,
  type LucideIcon,
} from "lucide-react";
import { IconCashBanknote } from "@tabler/icons-react";

const STROKE = 2;

/** 24px grid, 2px stroke — Lucide primary; Tabler for cheque / cash imagery. */
const DOMAIN_LUCIDE: Record<string, LucideIcon> = {
  "home-group": LayoutDashboard,
  accounts: Landmark,
  "account-services": Landmark,
  payments: Banknote,
  liquidity: PieChart,
  "liquidity-management": PieChart,
  "trade-finance": Ship,
  collections: ReceiptText,
  "receivables-collections": ReceiptText,
  "supply-chain-finance": Truck,
  "virtual-accounts": Layers2,
  "host-to-host": Server,
  "reports-insights": BarChart3,
  administration: Settings,
};

export function DomainNavIcon({
  domainId,
  size = 24,
  className,
}: {
  domainId: string;
  size?: number;
  className?: string;
}) {
  if (domainId === "cheque-services") {
    return (
      <IconCashBanknote
        size={size}
        stroke={STROKE}
        aria-hidden
        className={className}
      />
    );
  }

  const Icon = DOMAIN_LUCIDE[domainId] ?? LayoutDashboard;
  return <Icon size={size} strokeWidth={STROKE} aria-hidden className={className} />;
}
