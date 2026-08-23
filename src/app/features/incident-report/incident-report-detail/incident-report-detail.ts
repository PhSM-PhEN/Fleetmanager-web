import { Component, inject, input, output, signal, effect } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { IncidentReport } from '../services/incident-report';
import { IncidentReportResponse } from '../../../shared/models/incident-report-response';
import { NotificationService } from '../../../core/services/notification';

@Component({
  selector: 'app-incident-report-detail',
  imports: [],
  templateUrl: './incident-report-detail.html',
  styleUrl: './incident-report-detail.scss'
})
export class IncidentReportDetail {
  private incidentReportService = inject(IncidentReport);
  private notification = inject(NotificationService);

  incidentId = input.required<number>();
  fechado = output<void>();
  atualizado = output<void>();

  ocorrencia = signal<IncidentReportResponse | null>(null);

  constructor() {
    effect(() => {
      const id = this.incidentId();
      this.carregar(id);
    });
  }

  private carregar(id: number) {
    this.incidentReportService.buscarPorId(id).subscribe({
      next: (o) => this.ocorrencia.set(o)
    });
  }

  resolver() {
    const ocorrencia = this.ocorrencia();
    if (!ocorrencia) return;

    this.incidentReportService.resolver(ocorrencia.id).subscribe({
      next: () => {
        this.notification.show('Ocorrência marcada como resolvida!', 'success');
        this.carregar(ocorrencia.id);
        this.atualizado.emit();
      },
      error: (err: HttpErrorResponse) => this.tratarErro(err)
    });
  }

  excluir() {
    const ocorrencia = this.ocorrencia();
    if (!ocorrencia) return;
    if (!confirm('Tem certeza que deseja excluir esta ocorrência?')) return;

    this.incidentReportService.excluir(ocorrencia.id).subscribe({
      next: () => {
        this.notification.show('Ocorrência excluída!', 'success');
        this.atualizado.emit();
        this.fechar();
      },
      error: (err: HttpErrorResponse) => this.tratarErro(err)
    });
  }

  private tratarErro(err: HttpErrorResponse) {
    if (err.status === 403) {
      this.notification.show('Você não tem permissão para realizar esta ação.');
      return;
    }
    const mensagens = (err.error?.errorMessage as string[]) ?? ['Erro ao processar ação'];
    this.notification.show(mensagens.join(', '));
  }

  fechar() {
    this.fechado.emit();
  }
}