import { Injectable, inject } from '@angular/core';
import { ApiService } from '../../../core/services/api.service';
import { PaginatedResponse } from '../../../shared/models/paginated-response';
import { VehicleRequest } from '../../../shared/models/vehicle-request';
import { VehicleMileageRequest } from '../../../shared/models/vehicle-mileage-request';
import { VehicleRegisterResponse } from '../../../shared/models/vehicle-register-response';
import { VehicleShortResponse } from '../../../shared/models/vehicle-short-response';
import { VehicleResponse } from '../../../shared/models/vehicle-response';

@Injectable({ providedIn: 'root' })
export class Vehicle {
  private api = inject(ApiService);

  listar(pageNumber: number = 1, pageSize: number = 10) {
    return this.api.get<PaginatedResponse<VehicleShortResponse>>('Vehicle', { pageNumber, pageSize });
  }

  buscarPorId(id: number) {
    return this.api.get<VehicleResponse>(`Vehicle/${id}`);
  }

  criar(veiculo: VehicleRequest) {
    return this.api.post<VehicleRegisterResponse>('Vehicle', veiculo);
  }

  atualizarQuilometragem(id: number, dados: VehicleMileageRequest) {
    return this.api.put<void>(`Vehicle/${id}`, dados);
  }

  ativar(id: number) {
    return this.api.patch<void>(`Vehicle/${id}/Activate`, {});
  }

  desativar(id: number) {
    return this.api.patch<void>(`Vehicle/${id}/Deactivate`, {});
  }

  excluir(id: number) {
    return this.api.delete<void>(`Vehicle/${id}`);
  }
}