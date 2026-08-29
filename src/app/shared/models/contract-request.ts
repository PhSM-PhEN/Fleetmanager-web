export interface ContractRequest {
    vehicleId: number;
    tenantId: number;
    rentalPlanId: number;
    rentalType: string;
    totalAmount: number;
    pickupDateTime: string;
    returnDueDateTime?: string;
}