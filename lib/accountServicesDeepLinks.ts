import { ACCOUNT_SERVICES_BASE_PATH } from "@/lib/accountServicesRoutes";

/** Secondary toolbox routes — placeholder workspace until individual flows ship. */
export function accountWorkspaceHref(featureKey: string): string {
  return `${ACCOUNT_SERVICES_BASE_PATH}/workspace?key=${encodeURIComponent(featureKey)}`;
}
