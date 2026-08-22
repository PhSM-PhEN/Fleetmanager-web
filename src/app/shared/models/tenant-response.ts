import { AddressResponse } from './address-response';

export interface TenantResponse {
    id: number;
    name: string;
    cpf: string;
    rg: string;
    driverLicenseNumber: string;
    driverLicenseCategory: string;
    phoneNumber: string;
    isActive: boolean;
    email?: string;
    address: AddressResponse;
}