import { VehicleResponse } from "./vehicle-response";
import { ContractResponse } from "./contract-response";
import { StatusResponse } from "./status-response";

export interface IncidentReportResponse {
    id: number;
    description: string;
    contract: ContractResponse;
    vehicle: VehicleResponse;
    incidentRisk: string;
    reportedAt: string;
    status: StatusResponse;
}
