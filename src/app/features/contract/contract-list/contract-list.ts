import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { Contract } from '../services/contract';
import { ContractShortResponse } from '../../../shared/models/contract-short-response';
import { NotificationService } from '../../../core/services/notification';

@Component({
  selector: 'app-contract-list',
  imports: [CurrencyPipe, DatePipe, FormsModule],
  templateUrl: './contract-list.html',
  styleUrl: './contract-list.scss'
})
export class ContractList implements OnInit {
  private contractService = inject(Contract);
  private notification = inject(NotificationService);
  private router = inject(Router);

  contratos = signal<ContractShortResponse[]>([]);
  termoBusca = signal('');

  contratosFiltrados = computed(() => {
    const termo = this.termoBusca().trim().toLowerCase();
    if (!termo) return this.contratos();

    return this.contratos().filter(
      (contrato) =>
        contrato.status.label.toLowerCase().includes(termo) ||
        String(contrato.id).includes(termo) ||
        String(contrato.totalAmount).includes(termo)
    );
  });

  ngOnInit() {
    this.carregarContratos();
  }

  carregarContratos() {
    this.contractService.listar().subscribe({
      next: (response) => this.contratos.set(response.data),
      error: () => this.notification.show('Erro ao carregar contratos.')
    });
  }

  onBuscar(termo: string) {
    this.termoBusca.set(termo);
  }

  abrirNovo() {
    this.router.navigate(['/contracts/new']);
  }

  abrirDetalhe(id: number) {
    this.router.navigate(['/contracts', id]);
  }
}