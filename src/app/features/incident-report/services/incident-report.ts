import { Injectable, inject } from '@angular/core';
import { ApiService } from '../../../core/services/api.service';
import { PaginatedResponse } from '../../../shared/models/paginated-response';
import { IncidentReportRequest } from '../../../shared/models/incident-report-request';
import { IncidentReportShortResponse } from '../../../shared/models/incident-report-short-response';
import { IncidentReportResponse } from '../../../shared/models/incident-report-response';

@Injectable({ providedIn: 'root' })
export class IncidentReport {
  private api = inject(ApiService);

  listar(pageNumber: number = 1, pageSize: number = 10) {
    return this.api.get<PaginatedResponse<IncidentReportShortResponse>>('IncidentReport', { pageNumber, pageSize });
  }

  buscarPorId(id: number) {
    return this.api.get<IncidentReportResponse>(`IncidentReport/${id}`);
  }

  criar(dados: IncidentReportRequest) {
    return this.api.post<IncidentReportShortResponse>('IncidentReport', dados);
  }

  resolver(id: number) {
    return this.api.patch<void>(`IncidentReport/${id}/Resolve`, {});
  }

  excluir(id: number) {
    return this.api.delete<void>(`IncidentReport/${id}`);
  }
}