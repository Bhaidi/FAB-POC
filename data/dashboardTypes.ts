export type CapabilityAccess = "full" | "partial" | "locked";

export type CapabilityMenuItem = {
  id: string;
  label: string;
  access: CapabilityAccess;
  subtitle?: string;
  href?: string;
  children?: CapabilityMenuItem[];
};

/** API contract for `/api/user/entitlements` (stub or live). */
export type UserEntitlementsPayload = {
  enabledPlatformIds: string[];
  /** Optional overrides per menu node id. */
  itemAccess?: Record<string, CapabilityAccess>;
};

export type MenuNodeTemplate = {
  id: string;
  label: string;
  children?: MenuNodeTemplate[];
};

export type DomainMenuTemplate = {
  id: string;
  label: string;
  subtitle?: string;
  /** Entitlement key; `home` is always on. */
  platformKey: string;
  tree: MenuNodeTemplate[];
};
