import { AddressResponse } from './address-response';
import { StatusResponse } from './status-response';
export interface CompanyResponse {
  id: number;
  name: string;
  cnpj: string;
  phoneNumber: string;
  address: AddressResponse;
  status: StatusResponse;
}