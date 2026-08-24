import { Component, inject, signal, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { IncidentReport } from '../services/incident-report';
import { IncidentReportShortResponse } from '../../../shared/models/incident-report-short-response';
import { IncidentReportForm } from '../incident-report-form/incident-report-form';
import { NotificationService } from '../../../core/services/notification';

@Component({
  selector: 'app-incident-report-list',
  imports: [IncidentReportForm, DatePipe],
  templateUrl: './incident-report-list.html',
  styleUrl: './incident-report-list.scss'
})
export class IncidentReportList implements OnInit {
  private incidentReportService = inject(IncidentReport);
  private notification = inject(NotificationService);
  private router = inject(Router);

  ocorrencias = signal<IncidentReportShortResponse[]>([]);
  modalAberto = signal(false);

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
    this.router.navigate(['/incident-reports', id]);
  }
}