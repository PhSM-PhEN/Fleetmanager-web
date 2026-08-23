import { Component, inject, input, output, signal, effect } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Contract } from '../services/contract';
import { ContractResponse } from '../../../shared/models/contract-response';
import { NotificationService } from '../../../core/services/notification';
import { HttpErrorResponse } from '@angular/common/http';
@Component({
  selector: 'app-contract-detail',
  imports: [ReactiveFormsModule],
  templateUrl: './contract-detail.html',
  styleUrl: './contract-detail.scss',
})
export class ContractDetail {

  private contractService = inject(Contract);
  private notification = inject(NotificationService);

  contractId = input.required<number>();
  fechado = output<void>();
  atualizado = output<void>();

  contrato = signal<ContractResponse | null>(null);

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
    this.contractService.cancelar(contrato.id).subscribe({
      next: () => {
        this.notification.show('Contrato cancelado!', 'success');
        this.recarregarDetalhe();
        this.atualizado.emit();
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
