import { countryCodeToFlagEmoji } from "@/components/account-services/portfolio/cells/countryFlagEmoji";

/**
 * Breakdown rows often use short labels (UAE, KSA) rather than ISO codes.
 * Maps common aliases → alpha-2; two-letter uppercase names are treated as ISO.
 */
const COUNTRY_LABEL_TO_ISO: Record<string, string> = {
  UAE: "AE",
  "U.A.E.": "AE",
  KSA: "SA",
  "SAUDI ARABIA": "SA",
  UK: "GB",
  "UNITED KINGDOM": "GB",
  GB: "GB",
  SG: "SG",
  SINGAPORE: "SG",
  US: "US",
  USA: "US",
  IN: "IN",
  INDIA: "IN",
  EG: "EG",
  EGYPT: "EG",
  HK: "HK",
  CH: "CH",
  CN: "CN",
  JP: "JP",
  DE: "DE",
  FR: "FR",
};

/** Flag emoji for a country breakdown row label, or null if unknown. */
export function breakdownCountryLabelToFlagEmoji(label: string): string | null {
  const raw = String(label ?? "").trim();
  if (!raw) return null;
  const upper = raw.toUpperCase();
  if (/^[A-Z]{2}$/.test(upper)) {
    return countryCodeToFlagEmoji(upper);
  }
  const iso = COUNTRY_LABEL_TO_ISO[upper];
  return iso ? countryCodeToFlagEmoji(iso) : null;
}
