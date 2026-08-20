import { Component, inject, signal, OnInit } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { RentalPlan } from '../services/rental-plan';
import { RentalPlanResponse } from '../../../shared/models/rental-plan-response';
import { RentalPlanForm } from '../rental-plan-form/rental-plan-form';

@Component({
  selector: 'app-rental-plan-list',
  imports: [RentalPlanForm, CurrencyPipe],
  templateUrl: './rental-plan-list.html',
  styleUrl: './rental-plan-list.scss'
})

export class RentalPlanList implements OnInit {
  private rentalPlanService = inject(RentalPlan);

  planos = signal<RentalPlanResponse[]>([]);
  modalAberto = signal(false);
  planoSelecionado = signal<RentalPlanResponse | null>(null);

  ngOnInit() {
    this.carregarPlanos();
  }

  carregarPlanos() {
    this.rentalPlanService.listar().subscribe({
      next: (response) => this.planos.set(response.data)
    });
  }

  abrirModalCriar() {
    this.planoSelecionado.set(null);
    this.modalAberto.set(true);
  }

  abrirModalEditar(plano: RentalPlanResponse) {
    this.planoSelecionado.set(plano);
    this.modalAberto.set(true);
  }

  onSalvo() {
    this.modalAberto.set(false);
    this.carregarPlanos();
  }

  onCancelado() {
    this.modalAberto.set(false);
  }

  excluir(id: number) {
    if (!confirm('Tem certeza que deseja excluir este plano?')) return;

    this.rentalPlanService.excluir(id).subscribe({
      next: () => this.carregarPlanos()
    });
  }
}