import { CompanyResponse } from './company-response';
import { StatusResponse } from './status-response';

export interface VehicleShortResponse {
  id: number;
  model: string;
  brand: string;
  color: string;
  manufacturingYear: string;
  chassiNumber: string;
  licensePlate: string;
  currentMileage: number;
  company: CompanyResponse;
  status: StatusResponse;
}