import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { Tenant } from '../services/tenant';
import { TenantShortResponse } from '../../../shared/models/tenant-short-response';
import { TenantResponse } from '../../../shared/models/tenant-response';
import { TenantForm } from '../tenant-form/tenant-form';
import { TenantEditForm } from '../tenant-edit-form/tenant-edit-form';
import { NotificationService } from '../../../core/services/notification';

@Component({
  selector: 'app-tenant-list',
  imports: [TenantForm, TenantEditForm, FormsModule],
  templateUrl: './tenant-list.html',
  styleUrl: './tenant-list.scss'
})
export class TenantList implements OnInit {
  private tenantService = inject(Tenant);
  private notification = inject(NotificationService);
  private router = inject(Router);

  clientes = signal<TenantShortResponse[]>([]);
  modalCriarAberto = signal(false);
  clienteParaEditar = signal<TenantResponse | null>(null);
  termoBusca = signal('');

  clientesFiltrados = computed(() => {
    const termo = this.termoBusca().trim().toLowerCase();
    if (!termo) return this.clientes();

    return this.clientes().filter(
      (cliente) =>
        cliente.name?.toLowerCase().includes(termo) ||
        cliente.phoneNumber?.toLowerCase().includes(termo)
    );
  });

  ngOnInit() {
    this.carregarClientes();
  }

  carregarClientes() {
    this.tenantService.listar().subscribe({
      next: (response) => this.clientes.set(response.data),
      error: () => this.notification.show('Erro ao carregar clientes.')
    });
  }

  onBuscar(termo: string) {
    this.termoBusca.set(termo);
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

  abrirDetalhe(id: number) {
    this.router.navigate(['/clients', id]);
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