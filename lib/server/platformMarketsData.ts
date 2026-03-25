/**
 * @deprecated Prefer `@/lib/server/platformStubRepository` for org-scoped data.
 * Kept for re-exports used by older imports.
 */
export {
  ALL_MARKET_CODES,
  canLoadOperationalMarketData,
  canOrganizationSwitchToMarket,
  findMarketForOrganization,
  getMarketActivitiesForOrganization,
  getMarketServicesForOrganization,
  getMarketSummaryForOrganization,
  getMarketsResponseForOrganization,
  getUserContext,
  isMarketAccessibleForOrganization,
  isValidMarketCode,
  KNOWN_ORG_IDS,
  normalizeMarketCode,
  resolveOrganizationId,
} from "@/lib/server/platformStubRepository";
