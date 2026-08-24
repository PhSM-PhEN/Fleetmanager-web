import { Component, inject, signal, effect } from '@angular/core';
import { ReactiveFormsModule, FormControl, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { Vehicle } from '../services/vehicle';
import { VehicleResponse } from '../../../shared/models/vehicle-response';
import { NotificationService } from '../../../core/services/notification';

@Component({
  selector: 'app-vehicle-detail',
  imports: [ReactiveFormsModule],
  templateUrl: './vehicle-detail.html',
  styleUrl: './vehicle-detail.scss'
})
export class VehicleDetail {
  private vehicleService = inject(Vehicle);
  private notification = inject(NotificationService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  veiculo = signal<VehicleResponse | null>(null);
  editandoQuilometragem = signal(false);

  quilometragemControl = new FormControl(0, { nonNullable: true, validators: [Validators.required, Validators.min(0)] });

  constructor() {
    this.recarregarDetalhe();
  }

  abrirEdicaoQuilometragem() {
    const veiculo = this.veiculo();
    if (!veiculo) return;
    this.quilometragemControl.setValue(veiculo.currentMileage);
    this.editandoQuilometragem.set(true);
  }

  cancelarEdicaoQuilometragem() {
    this.editandoQuilometragem.set(false);
  }

  salvarQuilometragem() {
    const veiculo = this.veiculo();
    if (!veiculo || this.quilometragemControl.invalid) return;

    const valor = this.quilometragemControl.getRawValue();

    this.vehicleService.atualizarQuilometragem(veiculo.id, { mileageVehicle: valor }).subscribe({
      next: () => {
        this.notification.show('Quilometragem atualizada!', 'success');
        this.editandoQuilometragem.set(false);
        this.recarregarDetalhe();
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
        this.fechar();
      },
      error: (err: HttpErrorResponse) => this.tratarErro(err)
    });
  }

  private recarregarDetalhe() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.vehicleService.buscarPorId(id).subscribe({
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
    this.router.navigate(['/vehicles']);
  }
}