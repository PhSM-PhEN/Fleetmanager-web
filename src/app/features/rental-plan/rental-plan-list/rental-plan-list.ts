import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

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

    if (!termo) {
      return this.planos();
    }

    return this.planos().filter(plano =>
      plano.name.toLowerCase().includes(termo)
    );
  });

  ngOnInit(): void {
    this.carregarPlanos();
  }

  carregarPlanos(): void {
    this.rentalPlanService.listar().subscribe({
      next: (response) => {
        this.planos.set(response.data);
      }
    });
  }

  onBuscar(termo: string): void {
    this.termoBusca.set(termo);
  }

  abrirNovo(): void {
    this.router.navigate(['/rental-plans/new']);
  }

  abrirEdicao(plano: RentalPlanResponse): void {
    this.router.navigate(['/rental-plans/edit', plano.id]);
  }

  excluir(id: number): void {
    if (!confirm('Tem certeza que deseja excluir este plano?')) {
      return;
    }

    this.rentalPlanService.excluir(id).subscribe({
      next: () => {
        this.carregarPlanos();

        this.notification.show(
          'Plano excluído com sucesso!',
          'success'
        );
      },

      error: (err: HttpErrorResponse) => {
        if (err.status === 403) {
          this.notification.show(
            'Você não tem permissão para excluir planos.'
          );
        } else {
          const mensagens =
            (err.error?.errorMessage as string[]) ??
            ['Erro ao excluir plano'];

          this.notification.show(mensagens.join(', '));
        }
      }
    });
  }
}