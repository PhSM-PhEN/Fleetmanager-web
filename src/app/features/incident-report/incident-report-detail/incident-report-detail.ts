import { Component, inject, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { IncidentReport } from '../services/incident-report';
import { IncidentReportResponse } from '../../../shared/models/incident-report-response';
import { NotificationService } from '../../../core/services/notification';

@Component({
  selector: 'app-incident-report-detail',
  imports: [DatePipe],
  templateUrl: './incident-report-detail.html',
  styleUrl: './incident-report-detail.scss'
})
export class IncidentReportDetail {
  private incidentReportService = inject(IncidentReport);
  private notification = inject(NotificationService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  ocorrencia = signal<IncidentReportResponse | null>(null);

  constructor() {
    this.recarregarDetalhe();
  }

  private recarregarDetalhe() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.carregarOcorrencia(id);
  }

  private carregarOcorrencia(id: number) {
    this.incidentReportService.buscarPorId(id).subscribe({
      next: (o) => this.ocorrencia.set(o),
      error: (err: HttpErrorResponse) => this.tratarErro(err)
    });
  }

  resolver() {
    const ocorrencia = this.ocorrencia();
    if (!ocorrencia) return;

    this.incidentReportService.resolver(ocorrencia.id).subscribe({
      next: () => {
        this.notification.show('Ocorrência marcada como resolvida!', 'success');
        this.recarregarDetalhe();
      },
      error: (err: HttpErrorResponse) => this.tratarErro(err)
    });
  }

  excluir() {
    const ocorrencia = this.ocorrencia();
    if (!ocorrencia) return;
    if (!confirm('Tem certeza que deseja excluir esta ocorrência? Essa ação não pode ser desfeita.')) return;

    this.incidentReportService.excluir(ocorrencia.id).subscribe({
      next: () => {
        this.notification.show('Ocorrência excluída!', 'success');
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
    this.router.navigate(['/incident-reports']);
  }
}