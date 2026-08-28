import { StatusResponse } from "./status-response";

export interface ContractShortResponse {
    id: number;
    pickupDateTime: string;
    returnDueDateTime: string;
    totalDays: number;
    totalAmount: number;
<<<<<<< HEAD
    status: StatusResponse; 
=======
    status: StatusResponse;
>>>>>>> restaurado
}