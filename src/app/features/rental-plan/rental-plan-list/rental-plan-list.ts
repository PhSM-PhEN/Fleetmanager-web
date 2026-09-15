import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CurrencyPipe } from '@angular/common';
import { RentalPlan } from '../services/rental-plan';
import { RentalPlanResponse } from '../../../shared/models/rental-plan-response';
import { NotificationService } from '../../../core/services/notification';

@Component({
  selector: 'app-rental-plan-list',
  imports: [CurrencyPipe, FormsModule],
  templateUrl: './rental-plan-list.html',
  styleUrl: './rental-plan-list.scss'
})
export class RentalPlanList implements OnInit {
  private rentalPlanService = inject(RentalPlan);
  private notification = inject(NotificationService);
  private router = inject(Router);

  planos = signal<RentalPlanResponse[]>([]);
  termoBusca = signal('');

  planosFiltrados = computed(() => {
    const termo = this.termoBusca().trim().toLowerCase();
    if (!termo) return this.planos();

    return this.planos().filter(
      (plano) => plano.name?.toLowerCase().includes(termo)
    );
  });

  ngOnInit() {
    this.carregarPlanos();
  }

  carregarPlanos() {
    this.rentalPlanService.listar(1, 100).subscribe({
      next: (response) => this.planos.set(response.data),
      error: () => this.notification.show('Erro ao carregar planos de locação.')
    });
  }

  onBuscar(termo: string) {
    this.termoBusca.set(termo);
  }

  abrirNovo() {
    this.router.navigate(['/rental-plans/new']);
  }

  abrirEditar(id: number) {
    this.router.navigate(['/rental-plans', id, 'edit']);
  }

  excluir(id: number) {
    if (!confirm('Tem certeza que deseja excluir este plano?')) return;

    this.rentalPlanService.excluir(id).subscribe({
      next: () => {
        this.carregarPlanos();
        this.notification.show('Plano excluído com sucesso!', 'success');
      },
      error: (err) => {
        if (err.status === 403) {
          this.notification.show('Você não tem permissão para excluir planos.');
        } else {
          const mensagens = err.error?.errorMessage ?? ['Erro ao excluir plano'];
          this.notification.show(mensagens.join(', '));
        }
      }
    });
  }
}