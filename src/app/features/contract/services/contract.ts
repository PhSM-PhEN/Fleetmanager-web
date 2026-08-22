import { Injectable, inject } from '@angular/core';
import { ApiService } from '../../../core/services/api.service';
import { PaginatedResponse } from '../../../shared/models/paginated-response';
import { ContractPreviewRequest } from '../../../shared/models/contract-preview-request';
import { ContractPreviewResponse } from '../../../shared/models/contract-preview-response';
import { ContractRequest } from '../../../shared/models/contract-request';
import { ContractShortResponse } from '../../../shared/models/contract-short-response';
import { ContractResponse } from '../../../shared/models/contract-response';

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
}