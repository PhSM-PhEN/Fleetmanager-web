import { Component, inject, input, output, signal, effect } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Vehicle } from '../services/vehicle';
import { VehicleResponse } from '../../../shared/models/vehicle-response';
import { NotificationService } from '../../../core/services/notification';

@Component({
  selector: 'app-vehicle-detail',
  imports: [],
  templateUrl: './vehicle-detail.html',
  styleUrl: './vehicle-detail.scss'
})
export class VehicleDetail {
  private vehicleService = inject(Vehicle);
  private notification = inject(NotificationService);

  vehicleId = input.required<number>();
  fechado = output<void>();
  atualizado = output<void>();

  veiculo = signal<VehicleResponse | null>(null);

  constructor() {
    effect(() => {
      const id = this.vehicleId();
      this.vehicleService.buscarPorId(id).subscribe({
        next: (v) => this.veiculo.set(v)
      });
    });
  }

  atualizarQuilometragem() {
    const veiculo = this.veiculo();
    if (!veiculo) return;

    const novaQuilometragem = prompt('Nova quilometragem:', veiculo.currentMileage.toString());
    if (novaQuilometragem === null) return;

    const valor = Number(novaQuilometragem);
    if (isNaN(valor) || valor < 0) {
      this.notification.show('Quilometragem inválida.');
      return;
    }

    this.vehicleService.atualizarQuilometragem(veiculo.id, { mileageVehicle: valor }).subscribe({
      next: () => {
        this.notification.show('Quilometragem atualizada!', 'success');
        this.recarregarDetalhe();
        this.atualizado.emit();
      },
      error: (err: HttpErrorResponse) => this.tratarErro(err)
    });
  }

  ativar() {
    const veiculo = this.veiculo();
    if (!veiculo) return;

    this.vehicleService.ativar(veiculo.id).subscribe({
      next: () => {
        this.notification.show('Veículo ativado!', 'success');
        this.recarregarDetalhe();
        this.atualizado.emit();
      },
      error: (err: HttpErrorResponse) => this.tratarErro(err)
    });
  }

  desativar() {
    const veiculo = this.veiculo();
    if (!veiculo) return;

    this.vehicleService.desativar(veiculo.id).subscribe({
      next: () => {
        this.notification.show('Veículo desativado!', 'success');
        this.recarregarDetalhe();
        this.atualizado.emit();
      },
      error: (err: HttpErrorResponse) => this.tratarErro(err)
    });
  }

  excluir() {
    const veiculo = this.veiculo();
    if (!veiculo) return;
    if (!confirm('Tem certeza que deseja excluir este veículo? Essa ação não pode ser desfeita.')) return;

    this.vehicleService.excluir(veiculo.id).subscribe({
      next: () => {
        this.notification.show('Veículo excluído!', 'success');
        this.atualizado.emit();
        this.fechar();
      },
      error: (err: HttpErrorResponse) => this.tratarErro(err)
    });
  }

  private recarregarDetalhe() {
    this.vehicleService.buscarPorId(this.vehicleId()).subscribe({
      next: (v) => this.veiculo.set(v)
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