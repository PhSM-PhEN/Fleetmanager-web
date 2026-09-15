import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Tenant } from '../services/tenant';
import { TenantShortResponse } from '../../../shared/models/tenant-short-response';
import { NotificationService } from '../../../core/services/notification';

@Component({
  selector: 'app-tenant-list',
  imports: [FormsModule],
  templateUrl: './tenant-list.html',
  styleUrl: './tenant-list.scss'
})
export class TenantList implements OnInit {
  private tenantService = inject(Tenant);
  private notification = inject(NotificationService);
  private router = inject(Router);

  clientes = signal<TenantShortResponse[]>([]);
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

  abrirNovo() {
    this.router.navigate(['/clients/new']);
  }

  abrirDetalhe(id: number) {
    this.router.navigate(['/clients', id]);
  }
}