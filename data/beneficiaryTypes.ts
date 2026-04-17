/** Add New Beneficiary — domain types */

export interface BeneficiaryFormData {
  /* Auto-fill */
  autoFillEnabled: boolean;
  uploadedFileName?: string;
  invoiceExtractedData?: Record<string, string>;

  /* Step 1 — Account */
  bankCountry: string;
  beneficiaryAccountNo: string;
  beneficiaryCurrency: string;
  isFabAccount: boolean | null; // null = not yet looked up
  accountLookupDone: boolean;
  accountLookupLoading: boolean;

  /* Step 2 — Bank */
  swiftCode: string;
  bankName: string;
  branchName: string;
  beneficiaryBankAddress: string;
  bankCity: string;
  routingCode: string;

  /* Step 3 — Beneficiary Details */
  beneficiaryNickName: string;
  beneficiaryName: string;
  buildingNumber: string;
  streetName: string;
  addressLine: string;
  townCityName: string;
  countrySubdivision: string;
  postalZipCode: string;
  contactCountryCode: string;
  contactNumber: string;
  beneficiaryEmail: string;
  customerIdentificationNumber: string;

  /* Step 4 — Entity */
  selectedEntities: string[];

  /* Step 5 — Additional */
  intermediarySwiftCode: string;
  intermediaryBankName: string;
  intermediaryCountry: string;
  uploadedDocuments?: string[];
}

export interface SwiftDirectory {
  code: string;
  bankName: string;
  branchName: string;
  bankAddress: string;
  city: string;
  country: string;
  countryCode: string;
  isFavorite?: boolean;
  isRecent?: boolean;
}

export interface BeneEntity {
  id: string;
  cifName: string;
  cifCode: string;
  logicalEntityName: string;
  country: string;
  isFavorite?: boolean;
}

export interface FabAccountLookupResult {
  found: boolean;
  bankName?: string;
  branchName?: string;
  bankAddress?: string;
  bankCity?: string;
  swiftCode?: string;
  beneficiaryName?: string;
  beneficiaryNickName?: string;
  currency?: string;
  buildingNumber?: string;
  streetName?: string;
  addressLine?: string;
  townCityName?: string;
  countrySubdivision?: string;
  postalZipCode?: string;
  contactCountryCode?: string;
  contactNumber?: string;
  beneficiaryEmail?: string;
  customerIdentificationNumber?: string;
}

export interface BeneSummaryRow {
  label: string;
  value: string;
}
