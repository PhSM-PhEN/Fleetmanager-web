import { Injectable, inject } from '@angular/core';
import { switchMap } from 'rxjs';
import { ApiService } from '../../../core/services/api.service';
import { Address } from '../../address/services/address';
import { AddressRequest } from '../../../shared/models/address-request';
import { PaginatedResponse } from '../../../shared/models/paginated-response';
import { TenantRequest } from '../../../shared/models/tenant-request';
import { TenantUpdateRequest } from '../../../shared/models/tenant-update-request';
import { TenantShortResponse } from '../../../shared/models/tenant-short-response';
import { TenantResponse } from '../../../shared/models/tenant-response';

@Injectable({ providedIn: 'root' })
export class Tenant {
  private api = inject(ApiService);
  private addressService = inject(Address);

  listar(pageNumber: number = 1, pageSize: number = 10) {
    return this.api.get<PaginatedResponse<TenantShortResponse>>('Tenant', { pageNumber, pageSize });
  }

  buscarPorId(id: number) {
    return this.api.get<TenantResponse>(`Tenant/${id}`);
  }

  criar(dadosCliente: Omit<TenantRequest, 'addressId'>, endereco: AddressRequest) {
    return this.addressService.criar(endereco).pipe(
      switchMap((address) =>
        this.api.post<TenantShortResponse>('Tenant', { ...dadosCliente, addressId: address.id })
      )
    );
  }

  atualizar(id: number, dados: TenantUpdateRequest) {
    return this.api.put<void>(`Tenant/${id}`, dados);
  }

  ativar(id: number) {
    return this.api.patch<void>(`Tenant/${id}/Activate`, {});
  }

  desativar(id: number) {
    return this.api.patch<void>(`Tenant/${id}/Deactivate`, {});
  }

  excluir(id: number) {
    return this.api.delete<void>(`Tenant/${id}`);
  }
}