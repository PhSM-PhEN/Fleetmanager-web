import { Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Contract } from '../services/contract';
import { RentalPlan } from '../../rental-plan/services/rental-plan';
import { ContractResponse } from '../../../shared/models/contract-response';
import { RentalPlanResponse } from '../../../shared/models/rental-plan-response';
import { ContractDocumentResponse } from '../../../shared/models/contract-document';
import { NotificationService } from '../../../core/services/notification';

@Component({
  selector: 'app-contract-detail',
  imports: [ReactiveFormsModule, CurrencyPipe, DatePipe],
  templateUrl: './contract-detail.html',
  styleUrl: './contract-detail.scss',
})
export class ContractDetail {
  private contractService = inject(Contract);
  private rentalPlanService = inject(RentalPlan);
  private notification = inject(NotificationService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  contrato = signal<ContractResponse | null>(null);
  planos = signal<RentalPlanResponse[]>([]);

  editandoFinalizacao = signal(false);
  editandoRenovacao = signal(false);

  documento = signal<ContractDocumentResponse | null>(null);
  gerandoDocumento = signal(false);

  finalMileageControl = new FormControl(0, { nonNullable: true, validators: [Validators.required, Validators.min(0)] });

  renewForm = new FormGroup({
    newRentalPlanId: new FormControl<number | null>(null),
    mileageContracted: new FormControl<number | null>(null)
  });

  constructor() {
    this.recarregarDetalhe();
  }

  ativar() {
    const contrato = this.contrato();
    if (!contrato) return;
    this.contractService.ativar(contrato.id).subscribe({
      next: () => {
        this.notification.show('Contrato ativado!', 'success');
        this.recarregarDetalhe();
      },
      error: (err: HttpErrorResponse) => this.tratarErro(err)
    });
  }

  cancelar() {
    const contrato = this.contrato();
    if (!contrato) return;
    if (!confirm('Tem certeza que deseja cancelar este contrato?')) return;

    this.contractService.cancelar(contrato.id).subscribe({
      next: () => {
        this.notification.show('Contrato cancelado!', 'success');
        this.recarregarDetalhe();
      },
      error: (err: HttpErrorResponse) => this.tratarErro(err)
    });
  }

  abrirFinalizacao() {
    const contrato = this.contrato();
    if (!contrato) return;
    this.finalMileageControl.setValue(contrato.startMileage);
    this.editandoFinalizacao.set(true);
  }

  cancelarFinalizacao() {
    this.editandoFinalizacao.set(false);
  }

  confirmarFinalizacao() {
    const contrato = this.contrato();
    if (!contrato || this.finalMileageControl.invalid) return;

    this.contractService.finalizar(contrato.id, { finalMileage: this.finalMileageControl.getRawValue() }).subscribe({
      next: (resultado) => {
        this.notification.show(`Contrato finalizado! Total cobrado: ${resultado.totalCharged}`, 'success');
        this.editandoFinalizacao.set(false);
        this.recarregarDetalhe();
      },
      error: (err: HttpErrorResponse) => this.tratarErro(err)
    });
  }

  abrirRenovacao() {
    this.rentalPlanService.listar(1, 100).subscribe({
      next: (response) => this.planos.set(response.data)
    });
    this.renewForm.reset();
    this.editandoRenovacao.set(true);
  }

  cancelarRenovacao() {
    this.editandoRenovacao.set(false);
  }

  confirmarRenovacao() {
    const contrato = this.contrato();
    if (!contrato) return;

    const dados = this.renewForm.getRawValue();

    this.contractService.renovar(contrato.id, {
      newRentalPlanId: dados.newRentalPlanId ?? undefined,
      mileageContracted: dados.mileageContracted ?? undefined
    }).subscribe({
      next: () => {
        this.notification.show('Contrato renovado com sucesso!', 'success');
        this.editandoRenovacao.set(false);
        this.recarregarDetalhe();
      },
      error: (err: HttpErrorResponse) => this.tratarErro(err)
    });
  }

  gerarDocumento() {
    const contrato = this.contrato();
    if (!contrato) return;

    this.gerandoDocumento.set(true);
    this.contractService.gerarDocumento(contrato.id).subscribe({
      next: (resultado) => {
        this.documento.set(resultado);
        this.gerandoDocumento.set(false);
      },
      error: (err: HttpErrorResponse) => {
        this.gerandoDocumento.set(false);
        this.tratarErro(err);
      }
    });
  }

  fecharDocumento() {
    this.documento.set(null);
  }

  baixarDocumento() {
    const documento = this.documento();
    if (!documento) return;

    const blob = new Blob([documento.content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `contrato-${documento.contractId}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  }

  excluir() {
    const contrato = this.contrato();
    if (!contrato) return;
    if (!confirm('Tem certeza que deseja excluir este contrato? Essa ação não pode ser desfeita.')) return;

    this.contractService.excluir(contrato.id).subscribe({
      next: () => {
        this.notification.show('Contrato excluído!', 'success');
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

  recarregarDetalhe() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.contractService.buscarPorId(id).subscribe({
      next: (c) => this.contrato.set(c),
      error: (err: HttpErrorResponse) => this.tratarErro(err)
    });
  }

  fechar() {
    this.router.navigate(['/contracts']);
  }
}