/**
 * Login identifiers: letters and digits only, always normalized to uppercase for display and API payload.
 * Replace rules here if product later allows a wider charset.
 */
export const AUTH_ID_MIN_LENGTH = 2;

/** Strip disallowed characters and uppercase (Corporate ID + User ID). */
export function sanitizeAuthIdInput(raw: string): string {
  return raw.toUpperCase().replace(/[^A-Z0-9]/g, "");
}

export function isAuthIdWellFormed(value: string): boolean {
  const s = sanitizeAuthIdInput(value);
  return s.length >= AUTH_ID_MIN_LENGTH && /^[A-Z0-9]+$/.test(s);
}
