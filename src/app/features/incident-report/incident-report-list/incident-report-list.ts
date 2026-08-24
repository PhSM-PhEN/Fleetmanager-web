import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { IncidentReport } from '../services/incident-report';
import { IncidentReportShortResponse } from '../../../shared/models/incident-report-short-response';
import { IncidentReportForm } from '../incident-report-form/incident-report-form';
import { NotificationService } from '../../../core/services/notification';

@Component({
  selector: 'app-incident-report-list',
  imports: [IncidentReportForm, DatePipe, FormsModule],
  templateUrl: './incident-report-list.html',
  styleUrl: './incident-report-list.scss'
})
export class IncidentReportList implements OnInit {
  private incidentReportService = inject(IncidentReport);
  private notification = inject(NotificationService);
  private router = inject(Router);

  ocorrencias = signal<IncidentReportShortResponse[]>([]);
  modalAberto = signal(false);
  termoBusca = signal('');

  ocorrenciasFiltradas = computed(() => {
    const termo = this.termoBusca().trim().toLowerCase();
    if (!termo) return this.ocorrencias();

    return this.ocorrencias().filter((ocorrencia) => {
      const riscoTexto = ocorrencia.incidentRisk === 'Low' ? 'baixo' : 'alto';
      return (
        String(ocorrencia.contractId).includes(termo) ||
        ocorrencia.status?.toLowerCase().includes(termo) ||
        ocorrencia.incidentRisk?.toLowerCase().includes(termo) ||
        riscoTexto.includes(termo)
      );
    });
  });

  ngOnInit() {
    this.carregarOcorrencias();
  }

  carregarOcorrencias() {
    this.incidentReportService.listar().subscribe({
      next: (response) => this.ocorrencias.set(response.data),
      error: () => this.notification.show('Erro ao carregar ocorrências.')
    });
  }

  onBuscar(termo: string) {
    this.termoBusca.set(termo);
  }

  abrirModalCriar() {
    this.modalAberto.set(true);
  }

  onSalvo() {
    this.modalAberto.set(false);
    this.carregarOcorrencias();
  }

  onCancelado() {
    this.modalAberto.set(false);
  }

  abrirDetalhe(id: number) {
    this.router.navigate(['/incident-reports', id]);
  }
}