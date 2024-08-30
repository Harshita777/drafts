function formatCurrency(amount: number, currency: string) {
    let locales;
    
    // Determine the locale based on the currency
    switch(currency) {
        case 'INR':
            locales = 'en-IN'; // Indian formatting
            break;
        case 'USD':
            locales = 'en-US'; // US formatting
            break;
        case 'AED':
            locales = 'ar-AE'; // UAE formatting (for example)
            break;
        default:
            locales = 'en-US'; // Default to US formatting
    }
    
    // Format the amount according to the locale without the currency symbol
    const formattedAmount = new Intl.NumberFormat(locales, { 
        minimumFractionDigits: 2, 
        maximumFractionDigits: 2 
    }).format(amount);
    
    // Return the formatted amount with the currency code on the right side
    return `${formattedAmount} ${currency}`;
}
