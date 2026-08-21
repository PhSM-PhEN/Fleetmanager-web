import { CompanyResponse } from './company-response';

export interface VehicleShortResponse {
  id: number;
  model: string;
  brand: string;
  color: string;
  manufacturingYear: string;
  chassiNumber: string;
  licensePlate: string;
  currentMileage: number;
  isActive: boolean;
  company: CompanyResponse;
}