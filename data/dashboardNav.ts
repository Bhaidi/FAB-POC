/** Stable dashboard deep link for capability stubs. */
export function nav(id: string): string {
  return `/dashboard?nav=${encodeURIComponent(id)}`;
}
