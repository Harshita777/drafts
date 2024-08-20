interface TransactionTypeDTO {
  _id: object;
  TransactionType: string;
}

interface DebitAccountDTO {
  _id: object;
  accountNumber: string;
  accountName: string;
  accountType: string;
  currencyCode: string;
  balance: string;
}

interface BeneficiaryDTO {
  _id: object;
  beneficiaryReferenceId: string;
  beneficiaryAccountType: string;
  beneficiaryAccountNumber: string;
  beneficiaryIBAN: string;
  beneficiaryName: string;
  beneficiaryNickName: string;
  beneficiaryBankName: string;
  beneficiaryCountry: string;
  currencyCode: string;
  beneficiaryAddress: string;
  phoneNumber: string;
  email: string;
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  updatedBy: string;
}

interface PaymentCurrencyDTO {
  _id: object;
  currency: string;
}

interface DealReferenceDTO {
  dealReferenceCode: string;
  dealCode: string;
}

interface TransactionStatusDTO {
  _id: object;
  status: string;
}

interface PaymentDetailsDTO {
  paymentDate: string;
  valueDate: string;
  chargeType: string;
  debitedAmount: number;
  paymentAmount: number;
}

interface BankDetailsDTO {
  bankName: string;
  bankDetails: string;
}

interface SenderCorrespondentDetailsDTO {
  intermediaryBank: BankDetailsDTO;
  correspondentBank: BankDetailsDTO;
}

interface AdditionalDetailsDTO {
  purposeOfTransfer: string;
  paymentDetails: string;
  customerReference: string;
  authoriser: string;
}

interface TransactionDTO {
  transactionType: TransactionTypeDTO;
  debitAccountId: DebitAccountDTO;
  beneficiaryId: BeneficiaryDTO;
  paymentCurrency: PaymentCurrencyDTO;
  dealReference: DealReferenceDTO;
  transactionStatus: TransactionStatusDTO;
  paymentDetails: PaymentDetailsDTO;
  transactionId: string;
  senderCorrespondentDetails: SenderCorrespondentDetailsDTO;
  additionalDetails: AdditionalDetailsDTO;
}

interface TransactionsResponseDTO {
  data: TransactionDTO[];
}
