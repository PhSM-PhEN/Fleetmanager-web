import { Component, inject, input, output, signal, effect } from '@angular/core';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { CurrencyPipe } from '@angular/common';
import { Contract } from '../services/contract';
import { RentalPlan } from '../../rental-plan/services/rental-plan';
import { ContractResponse } from '../../../shared/models/contract-response';
import { RentalPlanResponse } from '../../../shared/models/rental-plan-response';
import { NotificationService } from '../../../core/services/notification';

@Component({
  selector: 'app-contract-detail',
  imports: [ReactiveFormsModule, CurrencyPipe],
  templateUrl: './contract-detail.html',
  styleUrl: './contract-detail.scss',
})
export class ContractDetail {
  private contractService = inject(Contract);
  private rentalPlanService = inject(RentalPlan);
  private notification = inject(NotificationService);

  contractId = input.required<number>();
  fechado = output<void>();
  atualizado = output<void>();

  contrato = signal<ContractResponse | null>(null);
  planos = signal<RentalPlanResponse[]>([]);

  editandoFinalizacao = signal(false);
  editandoRenovacao = signal(false);

  finalMileageControl = new FormControl(0, { nonNullable: true, validators: [Validators.required, Validators.min(0)] });

  renewForm = new FormGroup({
    newRentalPlanId: new FormControl<number | null>(null),
    mileageContracted: new FormControl<number | null>(null)
  });

  constructor() {
    effect(() => {
      const id = this.contractId();
      this.contractService.buscarPorId(id).subscribe({
        next: (c) => this.contrato.set(c)
      });
    });
  }

  ativar() {
    const contrato = this.contrato();
    if (!contrato) return;
    this.contractService.ativar(contrato.id).subscribe({
      next: () => {
        this.notification.show('Contrato ativado!', 'success');
        this.recarregarDetalhe();
        this.atualizado.emit();
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
        this.atualizado.emit();
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
        this.atualizado.emit();
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
        this.atualizado.emit();
        this.fechar();
      },
      error: (err: HttpErrorResponse) => this.tratarErro(err)
    });
  }

  excluir() {
    const contrato = this.contrato();
    if (!contrato) return;
    if (!confirm('Tem certeza que deseja excluir este contrato? Essa ação não pode ser desfeita.')) return;

    this.contractService.excluir(contrato.id).subscribe({
      next: () => {
        this.notification.show('Contrato excluído!', 'success');
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

  recarregarDetalhe() {
    this.contractService.buscarPorId(this.contractId()).subscribe({
      next: (c) => this.contrato.set(c)
    });
  }

  fechar() {
    this.fechado.emit();
  }
}