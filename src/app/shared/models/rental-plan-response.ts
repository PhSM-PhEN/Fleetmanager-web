import { RentalPlanRequest } from "./rental-plan-request";

export interface RentalPlanResponse extends RentalPlanRequest {
  id: number;
}