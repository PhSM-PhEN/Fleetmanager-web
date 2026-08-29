import { CompanyResponse } from './company-response';
import { RentalPlanResponse } from './rental-plan-response';
import { StatusResponse } from './status-response';

export interface VehicleResponse {
  id: number;
  brand: string;
  model: string;
  color: string;
  manufacturingYear: string;
  renavam: string;
  chassiNumber: string;
  licensePlate: string;
  currentMileage: number;
  company: CompanyResponse;
  rentalPlan: RentalPlanResponse;
  status: StatusResponse;
}