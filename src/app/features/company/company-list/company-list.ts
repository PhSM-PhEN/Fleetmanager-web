import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Company } from '../services/company';
import { CompanyShortResponse } from '../../../shared/models/company-short-response';
import { NotificationService } from '../../../core/services/notification';

@Component({
  selector: 'app-company-list',
  imports: [FormsModule],
  templateUrl: './company-list.html',
  styleUrl: './company-list.scss'
})
export class CompanyList implements OnInit {
  private companyService = inject(Company);
  private notification = inject(NotificationService);
  private router = inject(Router);

  empresas = signal<CompanyShortResponse[]>([]);
  termoBusca = signal('');

  empresasFiltradas = computed(() => {
    const termo = this.termoBusca().trim().toLowerCase();
    if (!termo) return this.empresas();

    return this.empresas().filter(
      (empresa) =>
        empresa.TradeName?.toLowerCase().includes(termo) ||
        empresa.cnpj?.toLowerCase().includes(termo)
    );
  });

  ngOnInit() {
    this.carregarEmpresas();
  }

  carregarEmpresas() {
    this.companyService.listar().subscribe({
      next: (response) => this.empresas.set(response),
      error: () => this.notification.show('Erro ao carregar empresas.')
    });
  }

  onBuscar(termo: string) {
    this.termoBusca.set(termo);
  }

  abrirNova() {
    this.router.navigate(['/companies/new']);
  }

  abrirEditar(id: number) {
    this.router.navigate(['/companies', id, 'edit']);
  }

  excluir(id: number) {
    if (!confirm('Tem certeza que deseja excluir esta empresa?')) return;

    this.companyService.excluir(id).subscribe({
      next: () => {
        this.carregarEmpresas();
        this.notification.show('Empresa excluída com sucesso!', 'success');
      },
      error: (err) => {
        if (err.status === 403) {
          this.notification.show('Você não tem permissão para excluir empresas.');
        } else {
          const mensagens = err.error?.errorMessage ?? ['Erro ao excluir empresa'];
          this.notification.show(mensagens.join(', '));
        }
      }
    });
  }
}