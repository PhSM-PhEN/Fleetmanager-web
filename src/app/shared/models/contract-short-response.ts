export interface ContractShortResponse {
    id: number;
    pickupDateTime: string;
    returnDueDateTime: string;
    totalDays: number;
    totalAmount: number;
    contractStatus: string;
}