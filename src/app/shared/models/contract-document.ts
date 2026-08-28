import { ContractResponse } from './contract-response';

export interface ContractDocumentResponse {
    contractId: number;
    templateVersion: number;
    content: string;
    generatedAt: string;
    contract: ContractResponse;
}