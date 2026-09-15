import { Injectable, inject } from '@angular/core';
import { ApiService } from '../../../core/services/api.service';
import { PaginatedResponse } from '../../../shared/models/paginated-response';
import { ContractTemplateRequest } from '../../../shared/models/contract-template-request';
import { ContractTemplateResponse } from '../../../shared/models/contract-template-response';

@Injectable({ providedIn: 'root' })
export class ContractTemplate {
  private api = inject(ApiService);

  listar(pageNumber: number = 1, pageSize: number = 10) {
    return this.api.get<PaginatedResponse<ContractTemplateResponse>>('ContractTemplate', { pageNumber, pageSize });
  }

  buscarPorId(id: number) {
    return this.api.get<ContractTemplateResponse>(`ContractTemplate/${id}`);
  }

  criar(template: ContractTemplateRequest) {
    return this.api.post<ContractTemplateResponse>('ContractTemplate', template);
  }

  atualizar(id: number, template: ContractTemplateRequest) {
    return this.api.put<void>(`ContractTemplate/${id}`, template);
  }

  ativar(id: number) {
    return this.api.patch<void>(`ContractTemplate/${id}/Activate`, {});
  }
}
