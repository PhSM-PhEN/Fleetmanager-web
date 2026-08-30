export interface ContractPreviewResponse {
    vehicleId: number;
    tenantId: number;
    rentalPlanId: number;
    rentalType: string;
    pickupDateTime: string;
    returnDueDateTime: string;
    totalDays: number;
    mileageContracted: number;
    totalAmount: number;
}