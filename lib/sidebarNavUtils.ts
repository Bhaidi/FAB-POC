import type { CapabilityMenuItem } from "@/data/dashboardTypes";

export function findMenuItemById(nodes: CapabilityMenuItem[], id: string): CapabilityMenuItem | null {
  for (const n of nodes) {
    if (n.id === id) return n;
    if (n.children?.length) {
      const f = findMenuItemById(n.children, id);
      if (f) return f;
    }
  }
  return null;
}

/** Returns [l1Id, l2Id?, l3Id?] for the deepest match (leaf preferred). */
export function findActiveBranchIds(
  menu: CapabilityMenuItem[],
  activeNavId: string | null
): { l1: string | null; l2: string | null; l3: string | null } {
  if (!activeNavId) return { l1: null, l2: null, l3: null };

  const walk = (
    nodes: CapabilityMenuItem[],
    ancestors: string[]
  ): { l1: string | null; l2: string | null; l3: string | null } | null => {
    for (const n of nodes) {
      const chain = [...ancestors, n.id];
      if (n.id === activeNavId) {
        const l1 = chain[0] ?? null;
        if (chain.length <= 1) return { l1, l2: null, l3: null };
        if (chain.length === 2) return { l1, l2: chain[1]!, l3: null };
        return { l1, l2: chain[1]!, l3: chain[2]! };
      }
      if (n.children?.length) {
        const hit = walk(n.children, chain);
        if (hit) return hit;
      }
    }
    return null;
  };

  const hit = walk(menu, []);
  return hit ?? { l1: null, l2: null, l3: null };
}

export function findFirstNavigableLeaf(item: CapabilityMenuItem): CapabilityMenuItem | null {
  if (item.access === "locked") {
    if (!item.children?.length) return null;
    for (const c of item.children) {
      const x = findFirstNavigableLeaf(c);
      if (x) return x;
    }
    return null;
  }
  if (!item.children?.length) {
    return item.href ? item : null;
  }
  for (const c of item.children) {
    const x = findFirstNavigableLeaf(c);
    if (x) return x;
  }
  return null;
}

export function domainContainsActiveItem(
  domain: CapabilityMenuItem,
  activeNavId: string | null,
  menu: CapabilityMenuItem[],
  pathname?: string | null
): boolean {
  if (
    pathname?.startsWith("/account-services") &&
    (domain.id === "accounts" || domain.id === "account-services")
  ) {
    return true;
  }
  if (!activeNavId) return false;
  const branch = findActiveBranchIds(menu, activeNavId);
  return branch.l1 === domain.id;
}

export function l2ContainsActiveItem(
  l2: CapabilityMenuItem,
  domainId: string,
  activeNavId: string | null,
  menu: CapabilityMenuItem[]
): boolean {
  if (!activeNavId) return false;
  const b = findActiveBranchIds(menu, activeNavId);
  if (b.l1 !== domainId) return false;
  return b.l2 === l2.id || b.l3 === activeNavId;
}
