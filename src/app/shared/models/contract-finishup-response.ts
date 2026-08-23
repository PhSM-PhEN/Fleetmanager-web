export interface ContractFinishUpResponse {
    contractId: number;
    actualReturnDateTime: string;
    finalMileage: number;
    excessMileageFee?: number;
    daysLate: number;
    lateFee?: number;
    totalCharged: number;
}