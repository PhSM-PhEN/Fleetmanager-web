import { Component, inject, signal, OnInit } from '@angular/core';
import { Vehicle } from '../services/vehicle';
import { VehicleShortResponse } from '../../../shared/models/vehicle-short-response';
import { VehicleForm } from '../vehicle-form/vehicle-form';
import { VehicleDetail } from '../vehicle-detail/vehicle-detail';


@Component({
  selector: 'app-vehicle-list',
  imports: [VehicleForm, VehicleDetail],
  templateUrl: './vehicle-list.html',
  styleUrl: './vehicle-list.scss'
})
export class VehicleList implements OnInit {
  private vehicleService = inject(Vehicle);
  

  veiculos = signal<VehicleShortResponse[]>([]);
  modalAberto = signal(false);
  veiculoDetalheId = signal<number | null>(null);

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

  abrirDetalhe(id: number) {
    this.veiculoDetalheId.set(id);
  }

  fecharDetalhe() {
    this.veiculoDetalheId.set(null);
  }

  onAtualizadoNoDetalhe() {
    this.carregarVeiculos();
  }
}