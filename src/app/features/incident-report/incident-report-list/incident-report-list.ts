import { Component, inject, signal, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { IncidentReport } from '../services/incident-report';
import { IncidentReportShortResponse } from '../../../shared/models/incident-report-short-response';
import { IncidentReportForm } from '../incident-report-form/incident-report-form';
import { IncidentReportDetail } from '../incident-report-detail/incident-report-detail';
import { NotificationService } from '../../../core/services/notification';

@Component({
  selector: 'app-incident-report-list',
  imports: [IncidentReportForm, IncidentReportDetail, DatePipe],
  templateUrl: './incident-report-list.html',
  styleUrl: './incident-report-list.scss'
})
export class IncidentReportList implements OnInit {
  private incidentReportService = inject(IncidentReport);
  private notification = inject(NotificationService);

  ocorrencias = signal<IncidentReportShortResponse[]>([]);
  modalAberto = signal(false);
  ocorrenciaDetalheId = signal<number | null>(null);

  ngOnInit() {
    this.carregarOcorrencias();
  }

  carregarOcorrencias() {
    this.incidentReportService.listar().subscribe({
      next: (response) => this.ocorrencias.set(response.data),
      error: () => this.notification.show('Erro ao carregar ocorrências.')
    });
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
    this.ocorrenciaDetalheId.set(id);
  }

  fecharDetalhe() {
    this.ocorrenciaDetalheId.set(null);
  }

  onDetalheAtualizado() {
    this.carregarOcorrencias();
  }
}