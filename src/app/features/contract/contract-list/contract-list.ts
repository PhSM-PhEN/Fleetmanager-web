import { Component, inject, signal, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { Contract } from '../services/contract';
import { ContractShortResponse } from '../../../shared/models/contract-short-response';
import { NotificationService } from '../../../core/services/notification';

@Component({
  selector: 'app-contract-list',
  imports: [CurrencyPipe, DatePipe],
  templateUrl: './contract-list.html',
  styleUrl: './contract-list.scss'
})
export class ContractList implements OnInit {
  private contractService = inject(Contract);
  private notification = inject(NotificationService);
  private router = inject(Router);

  contratos = signal<ContractShortResponse[]>([]);

  ngOnInit() {
    this.carregarContratos();
  }

  carregarContratos() {
    this.contractService.listar().subscribe({
      next: (response) => this.contratos.set(response.data),
      error: () => this.notification.show('Erro ao carregar contratos.')
    });
  }

  abrirNovo() {
    this.router.navigate(['/contracts/new']);
  }

  abrirDetalhe(id: number) {
    this.router.navigate(['/contracts', id]);
  }
}