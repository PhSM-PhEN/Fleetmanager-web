export interface TenantRequest {
    name: string;
    cpf: string;
    rg: string;
    driverLicenseNumber: string;
    driverLicenseCategory: string;
    phoneNumber: string;
    email?: string;
    addressId: number;
}