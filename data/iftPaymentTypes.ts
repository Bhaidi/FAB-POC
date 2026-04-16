/** IFT (International Fund Transfer) — domain types */

export interface IftCountry {
  code: string;
  name: string;
  flagEmoji: string;
  currency: string;
  region: string;
}

export interface IftDebitAccount {
  id: string;
  accountNumber: string;
  accountName: string;
  currency: string;
  balance: number;
  country: string;
  countryCode: string;
  entityName: string;
  iban?: string;
  overdraftLimit?: number;
  frozenAmount?: number;
  isFavorite?: boolean;
  isRecent?: boolean;
}

export interface IftBeneficiary {
  id: string;
  name: string;
  nickName?: string;
  accountNumber: string;
  iban?: string;
  bankName: string;
  swiftCode: string;
  bankBranch?: string;
  bankCity?: string;
  country: string;
  countryCode: string;
  verificationStatus?: "Verified" | "Pending" | "Unverified";
  isFavorite?: boolean;
  isRecent?: boolean;
}

export interface IftChargeOption {
  value: string;
  label: string;
  description: string;
}

export interface IftPurpose {
  code: string;
  label: string;
}

export type IftPaymentType = "one-time" | "recurring";

export interface IftInvoiceExtractedData {
  beneficiaryName: string;
  beneficiaryAccountNumber: string;
  paymentAmount: string;
  paymentCurrency: string;
  beneficiaryBankBranch: string;
  beneficiaryBankCountry: string;
  paymentPurpose: string;
}

export interface IftFormData {
  /** Step 1 — Country & Account selection */
  orderingCountry: string;
  orderingCurrency: string;
  autoFillEnabled: boolean;
  debitAccountId: string;
  beneficiaryId: string;

  /** Invoice auto-fill */
  uploadedFileName?: string;
  invoiceExtractedData?: IftInvoiceExtractedData;

  /** Step 2 — Payment details */
  paymentType: IftPaymentType;
  paymentDate: string;
  /** Recurring-only fields */
  firstPaymentDate: string;
  executionFrequency: string;
  numberOfPayments: string;
  lastPaymentDate: string;
  paymentAmount: string;
  paymentCurrency: string;
  debitAmount: string;
  debitCurrency: string;
  fxReferenceEnabled: boolean;
  fxReferenceNumber: string;
  lastEditedAmountField: "payment" | "debit";

  /** Purpose & Charges */
  purposeOfPayment: string;
  beneficiaryPurpose: string;
  customerReference: string;
  paymentDetails: string;
  chargeType: string;
  chargeAccountNumber: string;

  /** Intermediary Bank */
  intermediarySwiftCode: string;
  intermediaryBankName: string;
  intermediaryCountry: string;

  /** Documents & Advice */
  sendAdviceEmails: string;
  uploadedDocuments?: string[];
}

export interface IftSummaryRow {
  label: string;
  value: string;
  highlight?: boolean;
}
