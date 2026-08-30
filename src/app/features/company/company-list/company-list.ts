import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
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
        empresa.name?.toLowerCase().includes(termo) ||
        empresa.cnpj?.toLowerCase().includes(termo)
    );
  });

  ngOnInit() {
    this.carregarEmpresas();
  }

  carregarEmpresas() {
    this.companyService.listar().subscribe({
      next: (response) => this.empresas.set(response)
    });
  }

  onBuscar(termo: string) {
    this.termoBusca.set(termo);
  }

  abrirNovo() {
    this.router.navigate(['/companies/new']);
  }

  abrirEdicao(empresa: CompanyShortResponse) {
    this.router.navigate(['/companies', empresa.id, 'edit']);
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