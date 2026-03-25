/** Contracts for `/api/v1/platform/*` — treasury / multi-market context. */

/** Infrastructure / channel health on summary payloads (distinct from market operational state). */
export type MarketStatus = "operational" | "degraded" | "attention";

export type MarketVisibility = "visible" | "hidden";

export type MarketOperationalStatus = "active" | "inactive" | "restricted";

export type MarketOnboardingStatus = "completed" | "in_progress" | "not_started" | "not_applicable";

/** Row from GET `/api/v1/platform/markets` (after server filters `accessible` + `visibility`). */
export type PlatformMarket = {
  code: string;
  name: string;
  type: string;
  visibility: MarketVisibility;
  operationalStatus: MarketOperationalStatus;
  onboardingStatus: MarketOnboardingStatus;
  accessible: boolean;
  selectable: boolean;
  /** Optional row hints from API (e.g. enabled service count). */
  availableServices?: number;
  pendingActions?: number;
};

/** Alias for selector / dropdown rows — same shape as `PlatformMarket`. */
export type MarketOption = PlatformMarket;

export type MarketSummary = {
  marketCode: string;
  marketName: string;
  status: MarketStatus;
  connectedAccounts: number;
  availableServices: number;
  pendingActions: number;
  lastActivityAt: string;
  enabledModules: string[];
};

export type ServiceItemStatus = "active" | "available";

/** L1 = tile headline; L2+ = detail copy (not shown on dashboard cards). */
export type ServicePresentation = {
  l1: string;
  l2: string;
};

/** Market-scoped banking product / capability row from `/markets/{code}/services`. */
export type ServiceItem = {
  id: string;
  presentation: ServicePresentation;
  status: ServiceItemStatus;
  category: string;
  updatedAt: string;
};

export type ActivitySeverity = "info" | "low" | "medium" | "high";

/** Recent activity from `/markets/{code}/activities`. */
export type ActivityItem = {
  id: string;
  title: string;
  description: string;
  occurredAt: string;
  actor?: string;
  severity: ActivitySeverity;
};

/** @deprecated Use `ServiceItem`. */
export type MarketService = ServiceItem;
/** @deprecated Use `ActivityItem`. */
export type MarketActivity = ActivityItem;

export type MarketsListResponse = {
  defaultMarket: string;
  markets: PlatformMarket[];
};

export type MarketSummaryResponse = MarketSummary;

/** Services use `presentation.l1` on tiles; `presentation.l2` for detail surfaces only. */
export type MarketServicesResponse = {
  services: MarketService[];
};

export type MarketActivitiesResponse = {
  activities: MarketActivity[];
};

export type UserMarketContextRequest = {
  marketCode: string;
};

export type UserMarketContextResponse = {
  ok: boolean;
  marketCode: string;
};
