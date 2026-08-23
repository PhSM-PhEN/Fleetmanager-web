import { Component, inject, signal, OnInit } from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { Contract } from '../services/contract';
import { ContractShortResponse } from '../../../shared/models/contract-short-response';
import { ContractForm } from '../contract-form/contract-form';
import { NotificationService } from '../../../core/services/notification';
import { ContractResponse } from '../../../shared/models/contract-response';


@Component({
  selector: 'app-contract-list',
  imports: [ContractForm, CurrencyPipe, DatePipe],
  templateUrl: './contract-list.html',
  styleUrl: './contract-list.scss'
})
export class ContractList implements OnInit {
  private contractService = inject(Contract);
  private notification = inject(NotificationService);

  contratos = signal<ContractShortResponse[]>([]);
  modalAberto = signal(false);
  contratoSelecionado = signal<ContractResponse | null>(null);

  ngOnInit() {
    this.carregarContratos();
  }

  carregarContratos() {
    this.contractService.listar().subscribe({
      next: (response) => this.contratos.set(response.data),
      error: () => this.notification.show('Erro ao carregar contratos.')
    });
  }

  abrirModalCriar() {
    this.modalAberto.set(true);
  }

  onSalvo() {
    this.modalAberto.set(false);
    this.carregarContratos();
  }
  abrirModalEditar(contrato: ContractResponse) {
    this.contratoSelecionado.set(contrato);
    this.modalAberto.set(true);
  }
  onCancelado() {
    this.modalAberto.set(false);
  }

  onAtivado() {
    this.carregarContratos();
  }

  onFinalizado() {
    this.carregarContratos();
  }

  onRenovado() {
    this.carregarContratos();
  }

  onExcluido() {
    this.carregarContratos();
  }
}