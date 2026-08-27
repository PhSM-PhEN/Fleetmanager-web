import { StatusResponse } from "./status-response";

export interface TenantShortResponse {
    id: number;
    name: string;
    phoneNumber: string;
    status: StatusResponse;
}