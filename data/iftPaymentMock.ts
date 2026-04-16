import type {
  IftBeneficiary,
  IftChargeOption,
  IftCountry,
  IftDebitAccount,
  IftFormData,
  IftInvoiceExtractedData,
  IftPurpose,
  IftSummaryRow,
} from "./iftPaymentTypes";

/* ── Countries (grouped by region per screenshot) ── */

export const iftCountries: IftCountry[] = [
  { code: "AE", name: "United Arab Emirates", flagEmoji: "🇦🇪", currency: "AED", region: "Middle East & Africa" },
  { code: "SA", name: "Saudi Arabia", flagEmoji: "🇸🇦", currency: "SAR", region: "Middle East & Africa" },
  { code: "JO", name: "Jordan", flagEmoji: "🇯🇴", currency: "JOD", region: "Middle East & Africa" },
  { code: "GB", name: "United Kingdom", flagEmoji: "🇬🇧", currency: "GBP", region: "Europe" },
  { code: "FR", name: "France", flagEmoji: "🇫🇷", currency: "EUR", region: "Europe" },
  { code: "DE", name: "Germany", flagEmoji: "🇩🇪", currency: "EUR", region: "Europe" },
  { code: "IN", name: "India", flagEmoji: "🇮🇳", currency: "INR", region: "Asia Pacific" },
  { code: "SG", name: "Singapore", flagEmoji: "🇸🇬", currency: "EUR", region: "Asia Pacific" },
  { code: "CN", name: "China", flagEmoji: "🇨🇳", currency: "CNY", region: "Asia Pacific" },
  { code: "JP", name: "Japan", flagEmoji: "🇯🇵", currency: "JPY", region: "Asia Pacific" },
  { code: "HK", name: "Hong Kong", flagEmoji: "🇭🇰", currency: "HKD", region: "Asia Pacific" },
  { code: "US", name: "United States", flagEmoji: "🇺🇸", currency: "USD", region: "Americas" },
];

/* ── Currency flag map ────────────────────────── */

export const currencyFlagMap: Record<string, string> = {
  EUR: "🇪🇺",
  USD: "🇺🇸",
  GBP: "🇬🇧",
  AED: "🇦🇪",
  INR: "🇮🇳",
  SGD: "🇸🇬",
  SAR: "🇸🇦",
  JPY: "🇯🇵",
  CNY: "🇨🇳",
  HKD: "🇭🇰",
  JOD: "🇯🇴",
};

/* ── FX Rates ─────────────────────────────────── */

export const iftFxRates: Record<string, Record<string, number>> = {
  EUR: { AED: 4.02, USD: 1.08, GBP: 0.86, INR: 89.5, SAR: 4.05 },
  USD: { AED: 3.67, EUR: 0.93, GBP: 0.79, INR: 83.2, SAR: 3.75 },
  AED: { EUR: 0.249, USD: 0.272, GBP: 0.215, INR: 22.65, SAR: 1.02 },
  GBP: { AED: 4.65, EUR: 1.16, USD: 1.27, INR: 104.5, SAR: 4.72 },
};

/* ── Debit Accounts ───────────────────────────── */

export const iftDebitAccounts: IftDebitAccount[] = [
  {
    id: "da-1",
    accountNumber: "4451000040007851",
    accountName: "FGB Scramble",
    currency: "EUR",
    balance: 39_248.82,
    country: "France",
    countryCode: "FR",
    entityName: "FAB France S.A.",
    iban: "5011006001264016",
    overdraftLimit: 0,
    frozenAmount: 0,
    isFavorite: true,
    isRecent: true,
  },
  {
    id: "da-2",
    accountNumber: "4451000040033488",
    accountName: "OFSAA Testing",
    currency: "USD",
    balance: 3_500_000.0,
    country: "France",
    countryCode: "FR",
    entityName: "Société Générale Paris",
    isRecent: true,
  },
  {
    id: "da-3",
    accountNumber: "4451000040033499",
    accountName: "Treasury Europe",
    currency: "GBP",
    balance: 750_000.0,
    country: "France",
    countryCode: "FR",
    entityName: "BNP Paribas",
    isRecent: true,
  },
  {
    id: "da-4",
    accountNumber: "4451000040008923",
    accountName: "FAB Corporate Operations",
    currency: "EUR",
    balance: 2_100_000.0,
    country: "France",
    countryCode: "FR",
    entityName: "FAB France S.A.",
    isFavorite: true,
  },
  {
    id: "da-5",
    accountNumber: "4451000040009715",
    accountName: "Trade Finance Pool",
    currency: "USD",
    balance: 750_000.0,
    country: "France",
    countryCode: "FR",
    entityName: "Crédit Agricole CIB",
  },
  {
    id: "da-6",
    accountNumber: "4451000040010201",
    accountName: "Treasury Operations",
    currency: "EUR",
    balance: 980_000.0,
    country: "France",
    countryCode: "FR",
    entityName: "FAB Paris Branch",
    isFavorite: true,
  },
  {
    id: "da-7",
    accountNumber: "4451000040010345",
    accountName: "Payroll Account",
    currency: "EUR",
    balance: 4_200_000.0,
    country: "France",
    countryCode: "FR",
    entityName: "FAB France S.A.",
    isRecent: true,
  },
  {
    id: "da-8",
    accountNumber: "4451000040010467",
    accountName: "Vendor Settlement",
    currency: "CHF",
    balance: 1_890_000.0,
    country: "France",
    countryCode: "FR",
    entityName: "Natixis",
  },
  {
    id: "da-9",
    accountNumber: "4451000040010589",
    accountName: "Capital Reserve",
    currency: "EUR",
    balance: 5_600_000.0,
    country: "France",
    countryCode: "FR",
    entityName: "FAB Paris Branch",
  },
  {
    id: "da-10",
    accountNumber: "4451000040010612",
    accountName: "Escrow Holdings",
    currency: "USD",
    balance: 320_000.0,
    country: "France",
    countryCode: "FR",
    entityName: "BNP Paribas",
    isFavorite: true,
  },
  {
    id: "da-11",
    accountNumber: "4451000040010734",
    accountName: "Investment Returns",
    currency: "JPY",
    balance: 175_000_000.0,
    country: "France",
    countryCode: "FR",
    entityName: "Société Générale Paris",
  },
  {
    id: "da-12",
    accountNumber: "4451000040010856",
    accountName: "Export Proceeds",
    currency: "EUR",
    balance: 45_000_000.0,
    country: "France",
    countryCode: "FR",
    entityName: "FAB France S.A.",
    isRecent: true,
  },
  {
    id: "da-13",
    accountNumber: "4451000040010978",
    accountName: "Import Payments",
    currency: "GBP",
    balance: 890_000.0,
    country: "France",
    countryCode: "FR",
    entityName: "Crédit Agricole CIB",
  },
  {
    id: "da-14",
    accountNumber: "4451000040011090",
    accountName: "FX Trading Account",
    currency: "USD",
    balance: 2_340_000.0,
    country: "France",
    countryCode: "FR",
    entityName: "FAB Paris Branch",
    isFavorite: true,
  },
  {
    id: "da-15",
    accountNumber: "4451000040011123",
    accountName: "Dividend Distribution",
    currency: "EUR",
    balance: 670_000.0,
    country: "France",
    countryCode: "FR",
    entityName: "Natixis",
  },
  {
    id: "da-16",
    accountNumber: "4451000040011245",
    accountName: "Insurance Premium",
    currency: "AED",
    balance: 1_440_000.0,
    country: "France",
    countryCode: "FR",
    entityName: "FAB France S.A.",
  },
  {
    id: "da-17",
    accountNumber: "4451000040011367",
    accountName: "Loan Disbursement",
    currency: "EUR",
    balance: 7_800_000.0,
    country: "France",
    countryCode: "FR",
    entityName: "BNP Paribas",
    isRecent: true,
  },
  {
    id: "da-18",
    accountNumber: "4451000040011489",
    accountName: "Project Funding",
    currency: "SAR",
    balance: 1_150_000.0,
    country: "France",
    countryCode: "FR",
    entityName: "FAB Paris Branch",
  },
  {
    id: "da-19",
    accountNumber: "4451000040011601",
    accountName: "Intercompany Transfer",
    currency: "EUR",
    balance: 3_200_000.0,
    country: "France",
    countryCode: "FR",
    entityName: "Société Générale Paris",
    isFavorite: true,
  },
  {
    id: "da-20",
    accountNumber: "4451000040011723",
    accountName: "Petty Cash Pool",
    currency: "EUR",
    balance: 95_000.0,
    country: "France",
    countryCode: "FR",
    entityName: "FAB France S.A.",
  },
];

/* ── Beneficiaries ────────────────────────────── */

export const iftBeneficiaries: IftBeneficiary[] = [
  {
    id: "ben-1",
    name: "John Doe",
    nickName: "John",
    accountNumber: "AE070331234567890123456",
    bankName: "Emirates NBD",
    swiftCode: "EBILAEAD",
    bankBranch: "Al meydan",
    bankCity: "Dubai",
    country: "United Arab Emirates",
    countryCode: "AE",
    verificationStatus: "Verified",
    isFavorite: true,
    isRecent: true,
  },
  {
    id: "ben-2",
    name: "AL DAHRA1 920",
    accountNumber: "7131004000445641",
    bankName: "Alkeon Capital Management",
    swiftCode: "AAGCUS32XXX",
    country: "United States",
    countryCode: "US",
    isRecent: true,
  },
  {
    id: "ben-3",
    name: "Société Générale FR",
    accountNumber: "FR7630006000011234567890189",
    iban: "FR7630006000011234567890189",
    bankName: "Société Générale",
    swiftCode: "SOGEFRPP",
    country: "France",
    countryCode: "FR",
    isFavorite: true,
  },
  {
    id: "ben-4",
    name: "AGRITRADE INTERNATIONAL PTE LTD",
    accountNumber: "SG8810009876543210",
    bankName: "DBS Bank",
    swiftCode: "DBSSSGSG",
    country: "Singapore",
    countryCode: "SG",
    isRecent: true,
  },
  {
    id: "ben-5",
    name: "Deutsche Industriewerke GmbH",
    accountNumber: "DE89370400440532013000",
    iban: "DE89370400440532013000",
    bankName: "Commerzbank",
    swiftCode: "COBADEFF",
    country: "Germany",
    countryCode: "DE",
    isFavorite: true,
  },
  {
    id: "ben-6",
    name: "Tata Consultancy Services",
    accountNumber: "IN501234567890123",
    bankName: "HDFC Bank",
    swiftCode: "HDFCINBB",
    country: "India",
    countryCode: "IN",
    isRecent: true,
  },
  {
    id: "ben-7",
    name: "Saudi Aramco Supplies",
    accountNumber: "SA0380000000608010167519",
    iban: "SA0380000000608010167519",
    bankName: "Saudi National Bank",
    swiftCode: "NCBKSAJE",
    country: "Saudi Arabia",
    countryCode: "SA",
  },
  {
    id: "ben-8",
    name: "China National Petroleum",
    accountNumber: "CN1234567890123456789",
    bankName: "Bank of China",
    swiftCode: "BKCHCNBJ",
    country: "China",
    countryCode: "CN",
  },
  {
    id: "ben-9",
    name: "Toyota Motor Corp",
    accountNumber: "JP0076543210987654321",
    bankName: "MUFG Bank",
    swiftCode: "BOTKJPJT",
    country: "Japan",
    countryCode: "JP",
    isFavorite: true,
    isRecent: true,
  },
  {
    id: "ben-10",
    name: "Hong Kong Trading Co",
    accountNumber: "HK8012345678901234",
    bankName: "HSBC Hong Kong",
    swiftCode: "HSBCHKHH",
    country: "Hong Kong",
    countryCode: "HK",
  },
  {
    id: "ben-11",
    name: "Jordan Phosphate Mines",
    accountNumber: "JO94CBJO0010000000000131000302",
    iban: "JO94CBJO0010000000000131000302",
    bankName: "Arab Bank",
    swiftCode: "ARABJOAX",
    country: "Jordan",
    countryCode: "JO",
    isRecent: true,
  },
  {
    id: "ben-12",
    name: "BP Global Trading",
    accountNumber: "GB29NWBK60161331926819",
    iban: "GB29NWBK60161331926819",
    bankName: "NatWest",
    swiftCode: "NWBKGB2L",
    country: "United Kingdom",
    countryCode: "GB",
    isFavorite: true,
  },
  {
    id: "ben-13",
    name: "Emirates Steel Industries",
    accountNumber: "AE090260001015432167890",
    bankName: "Emirates NBD",
    swiftCode: "EABOREAD",
    country: "United Arab Emirates",
    countryCode: "AE",
  },
  {
    id: "ben-14",
    name: "Reliance Industries Ltd",
    accountNumber: "IN601234567891234",
    bankName: "ICICI Bank",
    swiftCode: "ABORINBB",
    country: "India",
    countryCode: "IN",
  },
  {
    id: "ben-15",
    name: "Samsung Electronics",
    accountNumber: "KR1234567890123456",
    bankName: "Shinhan Bank",
    swiftCode: "SHBKKRSE",
    country: "Singapore",
    countryCode: "SG",
    isFavorite: true,
  },
  {
    id: "ben-16",
    name: "ADNOC Distribution",
    accountNumber: "AE450230000001000312456",
    bankName: "First Abu Dhabi Bank",
    swiftCode: "NBADAEAA",
    country: "United Arab Emirates",
    countryCode: "AE",
    isRecent: true,
  },
  {
    id: "ben-17",
    name: "Siemens AG",
    accountNumber: "DE75512108001245126199",
    iban: "DE75512108001245126199",
    bankName: "Deutsche Bank",
    swiftCode: "DEUTDEFF",
    country: "Germany",
    countryCode: "DE",
  },
  {
    id: "ben-18",
    name: "Apple Operations Europe",
    accountNumber: "IE64IRCE92050112345678",
    iban: "IE64IRCE92050112345678",
    bankName: "Bank of Ireland",
    swiftCode: "BOFIIE2D",
    country: "France",
    countryCode: "FR",
  },
  {
    id: "ben-19",
    name: "Mitsubishi Corporation",
    accountNumber: "JP0098765432101234567",
    bankName: "Sumitomo Mitsui Banking",
    swiftCode: "SMBCJPJT",
    country: "Japan",
    countryCode: "JP",
  },
  {
    id: "ben-20",
    name: "Glencore International AG",
    accountNumber: "CH9300762011623852957",
    iban: "CH9300762011623852957",
    bankName: "UBS AG",
    swiftCode: "UBSWCHZH",
    country: "United Kingdom",
    countryCode: "GB",
  },
];

/* ── Purposes ─────────────────────────────────── */

export const iftPurposes: IftPurpose[] = [
  { code: "FIS", label: "FIS - Financial Services" },
  { code: "GDS", label: "GDS - Goods" },
  { code: "SRV", label: "SRV - Services" },
  { code: "TRD", label: "TRD - Trade" },
  { code: "SAL", label: "SAL - Salary" },
];

export const iftBeneficiaryPurposes: IftPurpose[] = [
  { code: "EXP", label: "Export of Goods" },
  { code: "IMP", label: "Import of Goods" },
  { code: "SRV", label: "Services Payment" },
  { code: "INV", label: "Investment" },
];

/* ── Charge options (with descriptions per screenshot) ── */

export const iftChargeOptions: IftChargeOption[] = [
  { value: "BEN", label: "BEN", description: "All Charges Borne By Beneficiary" },
  { value: "SHA", label: "SHA", description: "Charges To Be Shared By Both Parties" },
  { value: "OUR", label: "OUR", description: "All Charges Borne By Sender" },
];

/* ── Default form state ───────────────────────── */

export const iftDefaultFormData: IftFormData = {
  orderingCountry: "FR",
  orderingCurrency: "EUR",
  autoFillEnabled: true,
  debitAccountId: "",
  beneficiaryId: "",
  uploadedFileName: undefined,
  invoiceExtractedData: undefined,
  paymentType: "one-time",
  paymentDate: new Date().toISOString().slice(0, 10),
  firstPaymentDate: "",
  executionFrequency: "",
  numberOfPayments: "",
  lastPaymentDate: "",
  paymentAmount: "",
  paymentCurrency: "EUR",
  debitAmount: "",
  debitCurrency: "EUR",
  fxReferenceEnabled: false,
  fxReferenceNumber: "",
  lastEditedAmountField: "payment",
  purposeOfPayment: "",
  beneficiaryPurpose: "",
  customerReference: "",
  paymentDetails: "",
  chargeType: "OUR",
  chargeAccountNumber: "",
  intermediarySwiftCode: "",
  intermediaryBankName: "",
  intermediaryCountry: "",
  sendAdviceEmails: "",
  uploadedDocuments: ["Invoice_45821_March2026.pdf", "Agreement_AGRITRADE.xlsx"],
};

/* ── Mock invoice extraction data ─────────────── */

export const iftMockInvoiceExtraction: IftInvoiceExtractedData = {
  beneficiaryName: "John Doe",
  beneficiaryAccountNumber: "7123214219128112",
  paymentAmount: "1,00,000.00",
  paymentCurrency: "AED",
  beneficiaryBankBranch: "Al meydan",
  beneficiaryBankCountry: "UAE",
  paymentPurpose: "Good & Services",
};

/* ── Summary builder (flat rows, progressive) ─── */

export function buildIftSummary(
  form: IftFormData,
  accounts: IftDebitAccount[],
  beneficiaries: IftBeneficiary[],
  countries: IftCountry[],
): IftSummaryRow[] {
  const debitAcc = accounts.find((a) => a.id === form.debitAccountId);
  const bene = beneficiaries.find((b) => b.id === form.beneficiaryId);
  const country = countries.find((c) => c.code === form.orderingCountry);

  const rows: IftSummaryRow[] = [
    { label: "Payment Reference No.", value: "ST102321343423" },
  ];

  if (country) {
    rows.push({ label: "Country", value: country.name });
  }
  if (form.paymentType && debitAcc && bene) {
    /* Determine IFT vs Domestic:
       - Same country + same currency → Domestic Fund Transfer
       - Same country + different currency → International Fund Transfer (IFT)
       - Different country → International Fund Transfer (IFT) */
    const orderingCountry = form.orderingCountry;
    const beneCountry = bene?.countryCode;
    const isSameCountry = beneCountry === orderingCountry;
    const isSameCurrency = form.paymentCurrency === form.debitCurrency;
    const isDomestic = isSameCountry && isSameCurrency;
    const typePrefix = isDomestic ? "Domestic" : "International";
    const typeSuffix = form.paymentType === "one-time" ? "Fund Transfer" : "Recurring Transfer";
    const typeLabel = isDomestic ? `${typePrefix} ${typeSuffix}` : `${typePrefix} ${typeSuffix} (IFT)`;
    rows.push({
      label: "Transaction Type",
      value: typeLabel,
    });
  }
  if (debitAcc) {
    rows.push(
      { label: "Debit Account Name", value: debitAcc.accountName },
      { label: "Debit Account Number", value: debitAcc.accountNumber },
    );
  }
  if (bene) {
    rows.push(
      { label: "Beneficiary Name", value: bene.name },
      { label: "Beneficiary Account", value: bene.iban ?? bene.accountNumber },
    );
  }
  if (form.paymentDate && form.paymentAmount) {
    rows.push({ label: "Payment Date", value: form.paymentDate });
  }
  if (form.paymentAmount) {
    rows.push({
      label: "Payment Amount",
      value: `${form.paymentCurrency} ${form.paymentAmount}`,
      highlight: true,
    });
  }
  if (form.debitAmount) {
    rows.push({
      label: "Debit Amount",
      value: `${form.debitCurrency} ${form.debitAmount}`,
      highlight: true,
    });
  }
  return rows;
}

/* ── Limits / info banner data ────────────────── */

export const iftLimitsInfo = {
  cutOffTime: "06:01 AM (14:00 CET)",
  availableLimit: "AED 999,999,999,854.00",
  utilisedLimit: "AED 0.00",
  fxRate: "1 EUR = 4.23 AED (Indicative)",
};
