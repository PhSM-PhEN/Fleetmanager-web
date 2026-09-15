import { Component, inject, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
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
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  cliente = signal<TenantResponse | null>(null);

  constructor() {
    this.recarregarDetalhe();
  }

  private recarregarDetalhe() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.carregarCliente(id);
  }

  private carregarCliente(id: number) {
    this.tenantService.buscarPorId(id).subscribe({
      next: (c) => this.cliente.set(c),
      error: (err: HttpErrorResponse) => this.tratarErro(err)
    });
  }

  abrirEdicao() {
    const c = this.cliente();
    if (!c) return;
    this.router.navigate(['/clients', c.id, 'edit']);
  }

  ativar() {
    const cliente = this.cliente();
    if (!cliente) return;

    this.tenantService.ativar(cliente.id).subscribe({
      next: () => {
        this.notification.show('Cliente ativado!', 'success');
        this.recarregarDetalhe();
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
        this.recarregarDetalhe();
      },
      error: (err: HttpErrorResponse) => this.tratarErro(err)
    });
  }

  excluir() {
    const cliente = this.cliente();
    if (!cliente) return;
    if (!confirm('Tem certeza que deseja excluir este cliente? Essa ação não pode ser desfeita.')) return;

    this.tenantService.excluir(cliente.id).subscribe({
      next: () => {
        this.notification.show('Cliente excluído!', 'success');
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
    this.router.navigate(['/clients']);
  }
}