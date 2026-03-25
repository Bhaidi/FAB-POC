import { nav } from "@/data/dashboardNav";
import type {
  CapabilityAccess,
  CapabilityMenuItem,
  DomainMenuTemplate,
  MenuNodeTemplate,
  UserEntitlementsPayload,
} from "@/data/dashboardTypes";
import { DASHBOARD_MENU_DOMAINS } from "@/data/dashboardMenuTemplate";

function childAccess(
  parent: CapabilityAccess,
  nodeId: string,
  itemAccess?: Record<string, CapabilityAccess>
): CapabilityAccess {
  if (parent === "locked") return "locked";
  const o = itemAccess?.[nodeId];
  if (o) return o;
  if (parent === "partial") return "partial";
  return "full";
}

function rollupAccess(children: CapabilityMenuItem[]): CapabilityAccess {
  const set = new Set(children.map((c) => c.access));
  if (set.has("locked") && (set.has("full") || set.has("partial"))) return "partial";
  if (set.has("partial") && set.has("full")) return "partial";
  if (set.size === 1) return children[0]!.access;
  if (set.has("partial")) return "partial";
  return "full";
}

function platformEnabled(platformKey: string, enabled: Set<string>): boolean {
  if (platformKey === "home") return true;
  if (platformKey === "cheque-services") {
    return (
      enabled.has("cheque-services") ||
      enabled.has("corporate-cheque-deposit") ||
      enabled.has("remote-cheque-printing")
    );
  }
  return enabled.has(platformKey);
}

function l1BaseAccess(domain: DomainMenuTemplate, enabled: Set<string>): CapabilityAccess {
  if (!platformEnabled(domain.platformKey, enabled)) return "locked";
  return "full";
}

function buildNode(
  t: MenuNodeTemplate,
  parentAccess: CapabilityAccess,
  itemAccess?: Record<string, CapabilityAccess>
): CapabilityMenuItem {
  const inherited = childAccess(parentAccess, t.id, itemAccess);

  if (!t.children?.length) {
    return { id: t.id, label: t.label, access: inherited, href: nav(t.id) };
  }

  const children = t.children.map((c) => buildNode(c, inherited, itemAccess));
  const access = rollupAccess(children);
  return { id: t.id, label: t.label, access, children };
}

function buildDomain(
  d: DomainMenuTemplate,
  enabled: Set<string>,
  itemAccess?: Record<string, CapabilityAccess>
): CapabilityMenuItem {
  const base = l1BaseAccess(d, enabled);
  const children = d.tree.map((t) => buildNode(t, base, itemAccess));
  const access = rollupAccess(children);
  return {
    id: d.id,
    label: d.label,
    subtitle: d.subtitle,
    access,
    children,
  };
}

/** Build full sidebar tree from master template + entitlement payload. */
export function buildCapabilityMenu(payload: UserEntitlementsPayload): CapabilityMenuItem[] {
  const enabled = new Set(payload.enabledPlatformIds);
  return DASHBOARD_MENU_DOMAINS.map((d) => buildDomain(d, enabled, payload.itemAccess));
}

export function partitionMenuByAccess(menu: CapabilityMenuItem[]): {
  entitled: CapabilityMenuItem[];
  available: CapabilityMenuItem[];
} {
  const entitled = menu.filter((d) => d.access !== "locked");
  const available = menu.filter((d) => d.access === "locked");
  return { entitled, available };
}
