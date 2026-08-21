import { Injectable, inject } from '@angular/core';
import { switchMap } from 'rxjs';
import { ApiService } from '../../../core/services/api.service';
import { Address } from '../../address/services/address';
import { AddressRequest } from '../../../shared/models/address-request';
import { CompanyRequest } from '../../../shared/models/company-request';
import { CompanyResponse } from '../../../shared/models/company-response';
import { CompanyShortResponse } from '../../../shared/models/company-short-response';

@Injectable({ providedIn: 'root' })
export class Company {
  private api = inject(ApiService);
  private addressService = inject(Address);

  listar() {
    return this.api.get<CompanyShortResponse[]>('Company');
  }

  buscarPorId(id: number) {
    return this.api.get<CompanyResponse>(`Company/${id}`);
  }

  criar(dadosEmpresa: Omit<CompanyRequest, 'addressId'>, endereco: AddressRequest) {
    return this.addressService.criar(endereco).pipe(
      switchMap((address) =>
        this.api.post<CompanyShortResponse>('Company', { ...dadosEmpresa, addressId: address.id })
      )
    );
  }

  atualizar(id: number, dadosEmpresa: Omit<CompanyRequest, 'addressId'>, addressId: number) {
    return this.api.put<void>(`Company/${id}`, { ...dadosEmpresa, addressId });
  }

  excluir(id: number) {
    return this.api.delete<void>(`Company/${id}`);
  }
}