export interface ContractPreviewRequest {
    vehicleId: number;
    tenantId: number;
    rentalType: string;
    pickupDateTime: string;
    returnDueDateTime?: string;
    desiredExcessMileage: number;
}