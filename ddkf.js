interface TransactionType {
  name: string;
}

interface DealReference {
  dealReferenceCode: string;
  dealRate: string;
}

interface TransactionStatus {
  status: string;
}

interface PaymentDetails {
  paymentDate: string;
  valueDate: string;
  chargeType: string;
  debitedAmount: number;
  paymentAmount: number;
  paymentDetails: string;
  paymentCurrency: string;
}

interface DebitAccount {
  accountNumber: string;
  accountName: string;
  accountType: string;
  balance: number;
  currencyCode: string;
}

interface Beneficiary {
  beneficiaryAccountNumber: string;
  beneficiaryIBAN: string;
  beneficiaryName: string;
  beneficiaryNickName: string;
  beneficiaryBankName: string;
  beneficiaryCountry: string;
  currencyCode: string;
}

interface AdditionalDetails {
  purposeOfTransfer: string;
  purposeOfPayment: string;
  customerReference: string;
  authoriser: string;
  applicableCharges: number;
  disclaimerText: string;
  authoriserRules: string;
}

interface TransactionDTO {
  transactionType: TransactionType;
  conversionRate: number;
  dealReference: DealReference;
  transactionStatus: TransactionStatus;
  paymentDetails: PaymentDetails;
  transactionId: string;
  referenceId: string;
  submittedAt: string;
  debitAccount: DebitAccount;
  beneficiary: Beneficiary;
  additionalDetails: AdditionalDetails;
}
