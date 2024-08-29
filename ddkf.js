const conversionRates: { [key: string]: number } = {
    USD: 0.012, // Example conversion rate from INR to USD
    AED: 0.045, // Example conversion rate from INR to AED
    GBP: 0.0095 // Example conversion rate from INR to GBP
};


const convertCurrency = (amount: number, currencyCode: string): string => {
    const conversionRate = conversionRates[currencyCode] || 1; // Default to INR if no conversion rate found
    const convertedAmount = amount * conversionRate;
    return convertedAmount.toLocaleString('en-IN', {
        style: 'currency',
        currency: currencyCode,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
};



const filteredRows = allTransactions.map((item: any, index: number) => ({
    id: index + 1,
    date: item.submittedAt,
    amount: convertCurrency(item.paymentDetails?.paymentAmount, item.paymentCurrency),
    customer: item.additionalDetails.customerReference,
    fileType: item.transactionType?.name,
    status: statusTags[item.transactionStatus.status],
    transactionId: item.transactionId,
    referenceId: item.referenceId,
    total: "-",
    rejection: item.comment || "-"
}));
