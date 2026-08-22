export interface ContractRequest {
    vehicleId: number;
    tenantId: number;
    rentalPlanId: number;
    rentalType: string;
    mileageContracted: number;
    totalAmount: number;
    pickupDateTime: string;
    returnDueDateTime?: string;
}