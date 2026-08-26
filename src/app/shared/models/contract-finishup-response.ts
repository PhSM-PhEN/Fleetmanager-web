import { StatusResponse } from "./status-response";

export interface ContractFinishUpResponse {
    contractId: number;
    actualReturnDateTime: string;
    finalMileage: number;
    excessMileageFee?: number;
    daysLate: number;
    lateFee?: number;
    totalCharged: number;
    status: StatusResponse;
}