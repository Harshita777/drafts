export interface DailyLimitDTO {
    status: string;
    dailyLimit: DailyLimitDetail;
    errors: any[];
}

export interface DailyLimitDetail {
    _id: object; // Replace with the actual type if known (e.g., string, number, etc.)
    subscriptionID: string;
    cif: string;
    userId: string;
    userName: string;
    role: string;
    emailID: string;
    phoneNumber: string;
    idNumber: string;
    idProofType: string;
    expiryDate: string; // ISO date string, consider converting to Date type if needed
    isDeleted: boolean;
    dailyLimit: string;
}
