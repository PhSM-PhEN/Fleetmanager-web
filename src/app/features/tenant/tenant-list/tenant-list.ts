import { Component, inject, signal, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Tenant } from '../services/tenant';
import { TenantShortResponse } from '../../../shared/models/tenant-short-response';
import { TenantResponse } from '../../../shared/models/tenant-response';
import { TenantForm } from '../tenant-form/tenant-form';
import { TenantEditForm } from '../tenant-edit-form/tenant-edit-form';
import { NotificationService } from '../../../core/services/notification';
import { TenantDetail } from "../tenant-detail/tenant-detail";

@Component({
  selector: 'app-tenant-list',
  imports: [TenantForm, TenantEditForm, TenantDetail],
  templateUrl: './tenant-list.html',
  styleUrl: './tenant-list.scss'
})
export class TenantList implements OnInit {
  private tenantService = inject(Tenant);
  private notification = inject(NotificationService);

  clientes = signal<TenantShortResponse[]>([]);
  modalCriarAberto = signal(false);
  clienteParaEditar = signal<TenantResponse | null>(null);

  ngOnInit() {
    this.carregarClientes();
  }

  carregarClientes() {
    this.tenantService.listar().subscribe({
      next: (response) => this.clientes.set(response.data),
      error: () => this.notification.show('Erro ao carregar clientes.')
    });
  }

  abrirModalCriar() {
    this.modalCriarAberto.set(true);
  }

  abrirModalEditar(cliente: TenantShortResponse) {
    this.tenantService.buscarPorId(cliente.id).subscribe({
      next: (clienteCompleto) => this.clienteParaEditar.set(clienteCompleto),
      error: () => this.notification.show('Erro ao carregar dados do cliente.')
    });
  }

  onCriarSalvo() {
    this.modalCriarAberto.set(false);
    this.carregarClientes();
  }

  onCriarCancelado() {
    this.modalCriarAberto.set(false);
  }

  onEditarSalvo() {
    this.clienteParaEditar.set(null);
    this.carregarClientes();
  }

  onEditarCancelado() {
    this.clienteParaEditar.set(null);
  }

  clienteDetalheId = signal<number | null>(null);

  abrirDetalhe(id: number) {
    this.clienteDetalheId.set(id);
  }

  fecharDetalhe() {
    this.clienteDetalheId.set(null);
  }

  onDetalheAtualizado() {
    this.carregarClientes();
  }

  onEditarPeloDetalhe(cliente: TenantResponse) {
    this.clienteDetalheId.set(null);
    this.clienteParaEditar.set(cliente);
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