import { StatusResponse } from "./status-response";

export interface CompanyShortResponse {
    id: number;
    name: string;
    cnpj: string;
    status: StatusResponse;
  }