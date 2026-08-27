import { VehicleShortResponse } from './vehicle-short-response';
import { TenantResponse } from './tenant-response';
import { StatusResponse } from './status-response';

export interface ContractResponse {
    id: number;
    rentalType: string;
    contractStatus: string;
    pickupDateTime: string;
    returnDueDateTime: string;
    actualReturnDateTime?: string;
    totalDays: number;
    startMileage: number;
    expectedEndMileage: number;
    finalMileage?: number;
    excessMileageFee?: number;
    mileageContracted: number;
    snapshotPriceDailyRate: number;
    snapshotPriceMonthlyRate: number;
    snapshotPricePerExtraMileage: number;
    totalAmount: number;
    vehicle: VehicleShortResponse;
    tenant: TenantResponse;
    status: StatusResponse;
}