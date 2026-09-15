import { StatusResponse } from "./status-response";

export interface CompanyShortResponse {
    id: number;
    TradeName: string;
    cnpj: string;
    status: StatusResponse;
  }