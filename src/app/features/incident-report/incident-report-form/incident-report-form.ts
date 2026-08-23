import { Component, inject, output, signal, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { IncidentReport } from '../services/incident-report';
import { Contract } from '../../contract/services/contract';
import { ContractShortResponse } from '../../../shared/models/contract-short-response';
import { NotificationService } from '../../../core/services/notification';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-incident-report-form',
  imports: [ReactiveFormsModule, DatePipe],
  templateUrl: './incident-report-form.html',
  styleUrl: './incident-report-form.scss'
})
export class IncidentReportForm implements OnInit {
  private incidentReportService = inject(IncidentReport);
  private contractService = inject(Contract);
  private notification = inject(NotificationService);

  salvo = output<void>();
  cancelado = output<void>();

  contratos = signal<ContractShortResponse[]>([]);

  incidentForm = new FormGroup({
    contractId: new FormControl<number | null>(null, { validators: [Validators.required] }),
    description: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    incidentRisk: new FormControl('', { nonNullable: true, validators: [Validators.required] })
  });

  ngOnInit() {
    this.contractService.listar(1, 100).subscribe({
      next: (response) => this.contratos.set(response.data)
    });
  }

  onFormSubmit(event: Event) {
    event.preventDefault();
    this.onSubmit();
  }

  onSubmit() {
    const dados = this.incidentForm.getRawValue();

    this.incidentReportService.criar({
      contractId: dados.contractId!,
      description: dados.description,
      incidentRisk: dados.incidentRisk
    }).subscribe({
      next: () => {
        this.salvo.emit();
        this.notification.show('Ocorrência registrada com sucesso!', 'success');
      },
      error: (err: HttpErrorResponse) => this.tratarErro(err)
    });
  }

  private tratarErro(err: HttpErrorResponse) {
    if (err.status === 403) {
      this.notification.show('Você não tem permissão para realizar esta ação.');
      return;
    }
    const mensagens = (err.error?.errorMessage as string[]) ?? ['Erro ao registrar ocorrência'];
    this.notification.show(mensagens.join(', '));
  }

  onCancelar() {
    this.cancelado.emit();
  }
}