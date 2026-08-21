import { AddressResponse } from './address-response';

export interface CompanyResponse {
  id: number;
  name: string;
  cnpj: string;
  phoneNumber: string;
  address: AddressResponse;
}