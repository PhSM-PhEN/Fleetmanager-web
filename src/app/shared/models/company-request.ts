export interface CompanyRequest {
  cnpj: string;
  legalName?: string | null;
  tradeName: string;
  stateRegistration?: string | null;
  municipalRegistration?: string | null;
  phoneNumber: string;
  taxRegime?: string | null;
  email?: string | null;
  primaryCnae?: string | null;
  addressId: number;
}