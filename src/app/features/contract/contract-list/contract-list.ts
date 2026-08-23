import { Component, inject, signal, OnInit } from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { Contract } from '../services/contract';
import { ContractShortResponse } from '../../../shared/models/contract-short-response';
import { ContractForm } from '../contract-form/contract-form';
import { ContractDetail } from '../contract-detail/contract-detail';
import { NotificationService } from '../../../core/services/notification';

@Component({
  selector: 'app-contract-list',
  imports: [ContractForm, ContractDetail, CurrencyPipe, DatePipe],
  templateUrl: './contract-list.html',
  styleUrl: './contract-list.scss'
})
export class ContractList implements OnInit {
  private contractService = inject(Contract);
  private notification = inject(NotificationService);

  contratos = signal<ContractShortResponse[]>([]);
  modalAberto = signal(false);
  contratoDetalheId = signal<number | null>(null);

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

  onCancelado() {
    this.modalAberto.set(false);
  }

  abrirDetalhe(id: number) {
    this.contratoDetalheId.set(id);
  }

  fecharDetalhe() {
    this.contratoDetalheId.set(null);
  }
  onDetalheAtualizado() {
    this.carregarContratos();
  }
}