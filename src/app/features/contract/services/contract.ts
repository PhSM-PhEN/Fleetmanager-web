import { Injectable, inject } from '@angular/core';
import { ApiService } from '../../../core/services/api.service';
import { PaginatedResponse } from '../../../shared/models/paginated-response';
import { ContractPreviewRequest } from '../../../shared/models/contract-preview-request';
import { ContractPreviewResponse } from '../../../shared/models/contract-preview-response';
import { ContractRequest } from '../../../shared/models/contract-request';
import { ContractShortResponse } from '../../../shared/models/contract-short-response';
import { ContractResponse } from '../../../shared/models/contract-response';
import { ContractFinishUpRequest } from '../../../shared/models/contract-finishup-request';
import { ContractFinishUpResponse } from '../../../shared/models/contract-finishup-response';
import { ContractRenewRequest } from '../../../shared/models/contract-renew-request';

@Injectable({ providedIn: 'root' })
export class Contract {
  private api = inject(ApiService);

  listar(pageNumber: number = 1, pageSize: number = 10) {
    return this.api.get<PaginatedResponse<ContractShortResponse>>('Contract', { pageNumber, pageSize });
  }

  buscarPorId(id: number) {
    return this.api.get<ContractResponse>(`Contract/${id}`);
  }

  preview(dados: ContractPreviewRequest) {
    return this.api.post<ContractPreviewResponse>('Contract/Preview', dados);
  }

  criar(dados: ContractRequest) {
    return this.api.post<ContractShortResponse>('Contract', dados);
  }

  cancelar(id: number) {
    return this.api.patch<void>(`Contract/${id}/Cancel`, {});
  }

  ativar(id: number) {
    return this.api.patch<void>(`Contract/${id}/Activate`, {});
  }

  finalizar(id: number, dados: ContractFinishUpRequest) {
    return this.api.patch<ContractFinishUpResponse>(`Contract/${id}/FinishUp`, dados);
  }

  renovar(id: number, dados: ContractRenewRequest) {
    return this.api.post<ContractShortResponse>(`Contract/${id}/Renew`, dados);
  }

  excluir(id: number) {
    return this.api.delete<void>(`Contract/${id}`);
  }
}