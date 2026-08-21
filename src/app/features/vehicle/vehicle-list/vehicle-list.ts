import { Component, inject, signal, OnInit } from '@angular/core';
import { Vehicle } from '../services/vehicle';
import { VehicleShortResponse } from '../../../shared/models/vehicle-short-response';
import { VehicleForm } from '../vehicle-form/vehicle-form';
import { NotificationService } from '../../../core/services/notification';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-vehicle-list',
  imports: [VehicleForm],
  templateUrl: './vehicle-list.html',
  styleUrl: './vehicle-list.scss'
})
export class VehicleList implements OnInit {
  private vehicleService = inject(Vehicle);
  private notification = inject(NotificationService);

  veiculos = signal<VehicleShortResponse[]>([]);
  modalAberto = signal(false);

  ngOnInit() {
    this.carregarVeiculos();
  }

  carregarVeiculos() {
    this.vehicleService.listar().subscribe({
      next: (response) => this.veiculos.set(response.data)
    });
  }

  abrirModalCriar() {
    this.modalAberto.set(true);
  }

  onSalvo() {
    this.modalAberto.set(false);
    this.carregarVeiculos();
  }

  onCancelado() {
    this.modalAberto.set(false);
  }

  atualizarQuilometragem(veiculo: VehicleShortResponse) {
    const novaQuilometragem = prompt('Nova quilometragem:', veiculo.currentMileage.toString());
    if (novaQuilometragem === null) return;

    const valor = Number(novaQuilometragem);
    if (isNaN(valor) || valor < 0) {
      this.notification.show('Quilometragem inválida.');
      return;
    }

    this.vehicleService.atualizarQuilometragem(veiculo.id, { mileageVehicle: valor }).subscribe({
      next: () => {
        this.carregarVeiculos();
        this.notification.show('Quilometragem atualizada!', 'success');
      },
      error: (err: HttpErrorResponse) => this.tratarErro(err)
    });
  }

  ativar(id: number) {
    this.vehicleService.ativar(id).subscribe({
      next: () => {
        this.carregarVeiculos();
        this.notification.show('Veículo ativado!', 'success');
      },
      error: (err: HttpErrorResponse) => this.tratarErro(err)
    });
  }

  desativar(id: number) {
    this.vehicleService.desativar(id).subscribe({
      next: () => {
        this.carregarVeiculos();
        this.notification.show('Veículo desativado!', 'success');
      },
      error: (err: HttpErrorResponse) => this.tratarErro(err)
    });
  }

  excluir(id: number) {
    if (!confirm('Tem certeza que deseja excluir este veículo? Essa ação não pode ser desfeita.')) return;

    this.vehicleService.excluir(id).subscribe({
      next: () => {
        this.carregarVeiculos();
        this.notification.show('Veículo excluído!', 'success');
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
}