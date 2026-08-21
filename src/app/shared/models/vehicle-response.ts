import { CompanyResponse } from './company-response';
import { RentalPlanResponse } from './rental-plan-response';

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
  isActive: boolean;
  company: CompanyResponse;
  rentalPlan: RentalPlanResponse;

}