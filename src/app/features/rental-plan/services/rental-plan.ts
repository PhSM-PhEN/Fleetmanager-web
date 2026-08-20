import { Injectable, inject } from '@angular/core';
import { ApiService } from '../../../core/services/api.service';
import { PaginatedResponse } from '../../../shared/models/paginated-response';
import { RentalPlanRequest } from '../../../shared/models/rental-plan-request';
import { RentalPlanResponse } from '../../../shared/models/rental-plan-response';

@Injectable({ providedIn: 'root' })
export class RentalPlan {
  private api = inject(ApiService);

  listar(pageNumber: number = 1, pageSize: number = 10) {
    return this.api.get<PaginatedResponse<RentalPlanResponse>>('RentalPlan', { pageNumber, pageSize });
  }

  buscarPorId(id: number) {
    return this.api.get<RentalPlanResponse>(`RentalPlan/${id}`);
  }

  criar(plano: RentalPlanRequest) {
    return this.api.post<RentalPlanResponse>('RentalPlan', plano);
  }

  atualizar(id: number, plano: RentalPlanRequest) {
    return this.api.put<void>(`RentalPlan/${id}`, plano);
  }

  excluir(id: number) {
    return this.api.delete<void>(`RentalPlan/${id}`);
  }
}