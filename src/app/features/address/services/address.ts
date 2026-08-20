import { Injectable, inject } from '@angular/core';
import { ApiService } from '../../../core/services/api.service';
import { AddressRequest } from '../../../shared/models/address-request';
import { AddressResponse } from '../../../shared/models/address-response';

@Injectable({ providedIn: 'root' })
export class Address {
  private api = inject(ApiService);

  criar(address: AddressRequest) {
    return this.api.post<AddressResponse>('Address', address);
  }
}