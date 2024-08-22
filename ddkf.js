interface TransactionDTO {
  transactionType: {
    name: string;
  };
  debitedAmount: number;
  paymentAmount: number;
  paymentCurrency: string;
  transactionStatus: {
    status: string;
  };
  transactionId: string;
  referenceId: string;
  initiateDate: string; // Consider using Date if you plan to handle this as a Date object.
}
