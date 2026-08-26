import { AddressResponse } from './address-response';
import { StatusResponse } from './status-response';

export interface TenantResponse {
    id: number;
    name: string;
    cpf: string;
    rg: string;
    driverLicenseNumber: string;
    driverLicenseCategory: string;
    phoneNumber: string;
    status: StatusResponse;
    email?: string;
    address: AddressResponse;
}