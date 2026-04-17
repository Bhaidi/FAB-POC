import type {
  BeneficiaryFormData,
  BeneEntity,
  BeneSummaryRow,
  FabAccountLookupResult,
  SwiftDirectory,
} from "./beneficiaryTypes";
import { iftCountries } from "./iftPaymentMock";

/* ── Re-export countries (shared with IFT) ─── */
export { iftCountries as beneCountries } from "./iftPaymentMock";
export { currencyFlagMap as beneCurrencyFlagMap } from "./iftPaymentMock";

/* ── Country-code phone prefixes ─────────────── */
export const phoneCountryCodes = [
  { code: "+971", label: "🇦🇪 +971", country: "AE" },
  { code: "+44",  label: "🇬🇧 +44",  country: "GB" },
  { code: "+1",   label: "🇺🇸 +1",   country: "US" },
  { code: "+91",  label: "🇮🇳 +91",  country: "IN" },
  { code: "+966", label: "🇸🇦 +966", country: "SA" },
  { code: "+33",  label: "🇫🇷 +33",  country: "FR" },
  { code: "+49",  label: "🇩🇪 +49",  country: "DE" },
  { code: "+65",  label: "🇸🇬 +65",  country: "SG" },
  { code: "+86",  label: "🇨🇳 +86",  country: "CN" },
  { code: "+81",  label: "🇯🇵 +81",  country: "JP" },
  { code: "+852", label: "🇭🇰 +852", country: "HK" },
  { code: "+962", label: "🇯🇴 +962", country: "JO" },
];

/* ── SWIFT Directory ──────────────────────────── */
export const swiftDirectory: SwiftDirectory[] = [
  { code: "BARCGB22XXX", bankName: "Barclays Bank PLC - All UK Offices", branchName: "Churchill Place, London, United Kingdom", bankAddress: "221 Baker Street", city: "London", country: "United Kingdom", countryCode: "GB", isFavorite: true, isRecent: true },
  { code: "NWBKGB2LXXX", bankName: "NatWest Group PLC", branchName: "Head Office, Edinburgh", bankAddress: "36 St Andrew Square", city: "Edinburgh", country: "United Kingdom", countryCode: "GB", isRecent: true },
  { code: "HSBCGB2LXXX", bankName: "HSBC Bank PLC", branchName: "Canary Wharf, London", bankAddress: "8 Canada Square", city: "London", country: "United Kingdom", countryCode: "GB" },
  { code: "LOYDGB2LXXX", bankName: "Lloyds Banking Group", branchName: "Gresham Street, London", bankAddress: "25 Gresham Street", city: "London", country: "United Kingdom", countryCode: "GB" },
  { code: "CHASGB2LXXX", bankName: "JPMorgan Chase Bank, London", branchName: "Victoria, London", bankAddress: "25 Bank Street", city: "London", country: "United Kingdom", countryCode: "GB" },
  { code: "SCBLGB2LXXX", bankName: "Standard Chartered Bank", branchName: "Basinghall Avenue, London", bankAddress: "1 Basinghall Avenue", city: "London", country: "United Kingdom", countryCode: "GB" },
  { code: "CITIUS33XXX", bankName: "Citibank N.A.", branchName: "New York HQ", bankAddress: "388 Greenwich Street", city: "New York", country: "United States", countryCode: "US" },
  { code: "CHASUS33XXX", bankName: "JPMorgan Chase Bank N.A.", branchName: "New York HQ", bankAddress: "383 Madison Avenue", city: "New York", country: "United States", countryCode: "US" },
  { code: "ABORAEADXXX", bankName: "Arab Bank for Investment & Foreign Trade", branchName: "Abu Dhabi Main Branch", bankAddress: "Al Salam Street", city: "Abu Dhabi", country: "United Arab Emirates", countryCode: "AE" },
  { code: "NBABORADXXX", bankName: "First Abu Dhabi Bank PJSC", branchName: "Al Maryah Island", bankAddress: "FAB Building", city: "Abu Dhabi", country: "United Arab Emirates", countryCode: "AE", isFavorite: true },
  { code: "EABORAEAXXX", bankName: "Emirates NBD Bank PJSC", branchName: "Dubai Main Branch", bankAddress: "Baniyas Road", city: "Dubai", country: "United Arab Emirates", countryCode: "AE" },
  { code: "SBININBB104", bankName: "State Bank of India", branchName: "Mumbai Main Branch", bankAddress: "Madam Cama Road", city: "Mumbai", country: "India", countryCode: "IN" },
];

/* ── Entities ─────────────────────────────────── */
export const beneEntities: BeneEntity[] = [
  { id: "ent-1", cifName: "ADNOC Tech", cifCode: "2313123828", logicalEntityName: "ADNOC Group", country: "UK", isFavorite: true },
  { id: "ent-2", cifName: "ADNOC Tech", cifCode: "2313123876", logicalEntityName: "ADNOC Group", country: "UAE", isFavorite: true },
  { id: "ent-3", cifName: "ADNOC Tech", cifCode: "2313123854", logicalEntityName: "ADNOC Group", country: "France" },
  { id: "ent-4", cifName: "ADNOC Tech", cifCode: "2313123832", logicalEntityName: "ADNOC Group", country: "UAE" },
  { id: "ent-5", cifName: "ADNOC Tech", cifCode: "2313123810", logicalEntityName: "ADNOC Group", country: "UK" },
  { id: "ent-6", cifName: "Gulf Petrochemicals", cifCode: "4521098741", logicalEntityName: "Gulf Industries", country: "UAE" },
  { id: "ent-7", cifName: "Gulf Petrochemicals", cifCode: "4521098752", logicalEntityName: "Gulf Industries", country: "Saudi Arabia" },
  { id: "ent-8", cifName: "Emirates Capital", cifCode: "7789012345", logicalEntityName: "Emirates Group", country: "UAE", isFavorite: true },
  { id: "ent-9", cifName: "Shenba Solutions", cifCode: "9901234567", logicalEntityName: "Shenba Tech", country: "India" },
  { id: "ent-10", cifName: "Al Raha Properties", cifCode: "6654321098", logicalEntityName: "Al Raha Holdings", country: "UAE" },
  { id: "ent-11", cifName: "XYZ Holdings", cifCode: "3312345678", logicalEntityName: "XYZ Group", country: "UK" },
  { id: "ent-12", cifName: "ABC Trading LLC", cifCode: "1198765432", logicalEntityName: "ABC Conglomerate", country: "France" },
];

/* ── FAB Account Lookup (mock) ─────────────────── */
const fabAccountDatabase: Record<string, FabAccountLookupResult> = {
  "AE070351234567890123456": {
    found: true,
    bankName: "First Abu Dhabi Bank PJSC",
    branchName: "Al Maryah Island",
    bankAddress: "FAB Building",
    bankCity: "Abu Dhabi",
    swiftCode: "NBABORADXXX",
    beneficiaryName: "Rashed Al Mazrouei",
    beneficiaryNickName: "Rashed",
    currency: "AED",
    buildingNumber: "12",
    streetName: "Corniche Road",
    addressLine: "12 Corniche Road",
    townCityName: "Abu Dhabi",
    countrySubdivision: "Abu Dhabi",
    postalZipCode: "00000",
    contactCountryCode: "+971",
    contactNumber: "501234567",
    beneficiaryEmail: "rashed@fabbank.ae",
    customerIdentificationNumber: "A987654321",
  },
};

export function lookupFabAccount(accountNo: string): Promise<FabAccountLookupResult> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const normalised = accountNo.replace(/\s/g, "").toUpperCase();
      const result = fabAccountDatabase[normalised];
      resolve(result ?? { found: false });
    }, 1500);
  });
}

/* ── Default Form ─────────────────────────────── */
export const beneDefaultFormData: BeneficiaryFormData = {
  autoFillEnabled: true,
  uploadedFileName: undefined,
  invoiceExtractedData: undefined,

  bankCountry: "",
  beneficiaryAccountNo: "",
  beneficiaryCurrency: "",
  isFabAccount: null,
  accountLookupDone: false,
  accountLookupLoading: false,

  swiftCode: "",
  bankName: "",
  branchName: "",
  beneficiaryBankAddress: "",
  bankCity: "",
  routingCode: "",

  beneficiaryNickName: "",
  beneficiaryName: "",
  buildingNumber: "",
  streetName: "",
  addressLine: "",
  townCityName: "",
  countrySubdivision: "",
  postalZipCode: "",
  contactCountryCode: "+971",
  contactNumber: "",
  beneficiaryEmail: "",
  customerIdentificationNumber: "",

  selectedEntities: [],

  intermediarySwiftCode: "",
  intermediaryBankName: "",
  intermediaryCountry: "",
  uploadedDocuments: [],
};

/* ── Summary builder ──────────────────────────── */
export function buildBeneficiarySummary(form: BeneficiaryFormData): BeneSummaryRow[] {
  const rows: BeneSummaryRow[] = [];
  const country = iftCountries.find((c) => c.code === form.bankCountry);

  if (country) rows.push({ label: "Bank Country", value: country.name });
  if (form.beneficiaryAccountNo) rows.push({ label: "Beneficiary Account No", value: form.beneficiaryAccountNo });
  rows.push({ label: "Account Type", value: form.isFabAccount === true ? "FAB Account" : form.isFabAccount === false ? "Non-FAB Account" : "—" });
  if (form.beneficiaryCurrency) {
    const cc = iftCountries.find((c) => c.currency === form.beneficiaryCurrency);
    rows.push({ label: "Beneficiary Account Currency", value: cc ? `${cc.currency} - ${currencyName(cc.currency)}` : form.beneficiaryCurrency });
  }
  if (form.swiftCode) rows.push({ label: "Swift Code", value: form.swiftCode });
  if (form.bankName) rows.push({ label: "Bank Name", value: form.bankName });
  if (form.branchName) rows.push({ label: "Branch Name", value: form.branchName });
  if (form.beneficiaryBankAddress) rows.push({ label: "Beneficiary Bank Address", value: form.beneficiaryBankAddress });
  if (form.beneficiaryNickName) rows.push({ label: "Beneficiary Nick Name", value: form.beneficiaryNickName });
  if (form.selectedEntities.length > 0) {
    rows.push({ label: "Entities", value: form.selectedEntities.length === beneEntities.length ? "All" : form.selectedEntities.map((id) => beneEntities.find((e) => e.id === id)?.cifName).filter(Boolean).join(", ") });
  }
  return rows;
}

function currencyName(code: string): string {
  const map: Record<string, string> = {
    AED: "UAE Dirham", GBP: "British Pound", USD: "US Dollar", EUR: "Euro",
    INR: "Indian Rupee", SAR: "Saudi Riyal", JPY: "Japanese Yen",
    CNY: "Chinese Yuan", HKD: "Hong Kong Dollar", JOD: "Jordanian Dinar",
    SGD: "Singapore Dollar",
  };
  return map[code] ?? code;
}
