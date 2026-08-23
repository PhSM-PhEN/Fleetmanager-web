export interface IncidentReportShortResponse {
    id: number;
    contractId: number;
    vehicleId: number;
    description: string;
    incidentRisk: string;
    reportedAt: string;
    status: string;
}
