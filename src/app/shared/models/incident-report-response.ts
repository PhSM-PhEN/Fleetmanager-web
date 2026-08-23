import { VehicleResponse } from "./vehicle-response";
import { ContractResponse } from "./contract-response";

export interface IncidentReportResponse {
    id: number;
    description: string;
    contract: ContractResponse;
    vehicle: VehicleResponse;
    incidentRisk: string;
    reportedAt: string;
    status: string;
}
