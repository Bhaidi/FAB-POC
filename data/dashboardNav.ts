/** Route overrides for leaf IDs that have dedicated Next.js pages. */
const LEAF_ROUTES: Record<string, string> = {
  "payments-intl-create": "/dashboard/international-payments/create",
  "intl-create-payment": "/dashboard/international-payments/create",
  "beneficiary-add": "/dashboard/beneficiary-management/add",
};

/** Returns the dedicated page route for a nav ID, or null if none. */
export function navRoute(id: string): string | null {
  return LEAF_ROUTES[id] ?? null;
}

/** Stable dashboard deep link for capability stubs. */
export function nav(id: string): string {
  if (LEAF_ROUTES[id]) return `${LEAF_ROUTES[id]}?nav=${encodeURIComponent(id)}`;
  return `/dashboard?nav=${encodeURIComponent(id)}`;
}
