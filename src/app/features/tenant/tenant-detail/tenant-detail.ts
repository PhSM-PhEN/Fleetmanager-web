import { Component, inject, input, output, signal, effect } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Tenant } from '../services/tenant';
import { TenantResponse } from '../../../shared/models/tenant-response';
import { NotificationService } from '../../../core/services/notification';

@Component({
  selector: 'app-tenant-detail',
  imports: [],
  templateUrl: './tenant-detail.html',
  styleUrl: './tenant-detail.scss'
})
export class TenantDetail {
  private tenantService = inject(Tenant);
  private notification = inject(NotificationService);

  tenantId = input.required<number>();
  fechado = output<void>();
  atualizado = output<void>();
  editar = output<TenantResponse>();

  cliente = signal<TenantResponse | null>(null);

  constructor() {
    effect(() => {
      const id = this.tenantId();
      this.carregarCliente(id);
    });
  }

  private carregarCliente(id: number) {
    this.tenantService.buscarPorId(id).subscribe({
      next: (c) => this.cliente.set(c)
    });
  }

  onEditar() {
    const cliente = this.cliente();
    if (cliente) this.editar.emit(cliente);
  }

  ativar() {
    const cliente = this.cliente();
    if (!cliente) return;

    this.tenantService.ativar(cliente.id).subscribe({
      next: () => {
        this.notification.show('Cliente ativado!', 'success');
        this.carregarCliente(cliente.id);
        this.atualizado.emit();
      },
      error: (err: HttpErrorResponse) => this.tratarErro(err)
    });
  }

  desativar() {
    const cliente = this.cliente();
    if (!cliente) return;

    this.tenantService.desativar(cliente.id).subscribe({
      next: () => {
        this.notification.show('Cliente desativado!', 'success');
        this.carregarCliente(cliente.id);
        this.atualizado.emit();
      },
      error: (err: HttpErrorResponse) => this.tratarErro(err)
    });
  }

  excluir() {
    const cliente = this.cliente();
    if (!cliente) return;
    if (!confirm('Tem certeza que deseja excluir este cliente?')) return;

    this.tenantService.excluir(cliente.id).subscribe({
      next: () => {
        this.notification.show('Cliente excluído!', 'success');
        this.atualizado.emit();
        this.fechar();
      },
      error: (err: HttpErrorResponse) => this.tratarErro(err)
    });
  }

  private tratarErro(err: HttpErrorResponse) {
    if (err.status === 403) {
      this.notification.show('Você não tem permissão para realizar esta ação.');
      return;
    }
    const mensagens = (err.error?.errorMessage as string[]) ?? ['Erro ao processar ação'];
    this.notification.show(mensagens.join(', '));
  }

  fechar() {
    this.fechado.emit();
  }
}