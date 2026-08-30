import { ContractTemplateRequest } from './contract-template-request';

export interface ContractTemplateResponse extends ContractTemplateRequest {
  id: number;
  version: number;
  isActive: boolean;
}
