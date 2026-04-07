import { countryCodeToFlagEmoji } from "@/components/account-services/portfolio/cells/countryFlagEmoji";

/** Map ISO 4217 currency → representative ISO 3166-1 alpha-2 for flag display */
export const ISO_CURRENCY_TO_REGION: Record<string, string> = {
  AED: "AE",
  SGD: "SG",
  GBP: "GB",
  USD: "US",
  SAR: "SA",
  EGP: "EG",
  INR: "IN",
  HKD: "HK",
  EUR: "LU",
  CHF: "CH",
};

export function currencyCodeToFlagEmoji(code: string): string {
  const ccy = String(code ?? "")
    .trim()
    .toUpperCase();
  if (!ccy) return "🌐";
  const region = ISO_CURRENCY_TO_REGION[ccy];
  return region ? countryCodeToFlagEmoji(region) : "🌐";
}
