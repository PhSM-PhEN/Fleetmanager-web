export interface RentalPlanRequest {
  name: string;
  dailyPrice: number;
  monthlyPrice: number;
  excessMileageRate: number;
  mileagePerDay: number;
  mileagePerMonthly: number;
}