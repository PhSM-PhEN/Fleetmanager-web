import { StatusResponse } from './status-response';
export interface VehicleRegisterResponse {
  id: number;
  licensePlate: string;
  model: string;
  currentMileage: number;
  status: StatusResponse;

}