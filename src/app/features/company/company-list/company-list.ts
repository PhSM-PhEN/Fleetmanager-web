import { Component, inject, signal, OnInit } from '@angular/core';
import { Company } from '../services/company';
import { CompanyShortResponse } from '../../../shared/models/company-short-response';
import { CompanyResponse } from '../../../shared/models/company-response';
import { CompanyForm } from '../company-form/company-form';
import { NotificationService } from '../../../core/services/notification';

@Component({
  selector: 'app-company-list',
  imports: [CompanyForm],
  templateUrl: './company-list.html',
  styleUrl: './company-list.scss'
})
export class CompanyList implements OnInit {
  private companyService = inject(Company);
  private notification = inject(NotificationService);

  empresas = signal<CompanyShortResponse[]>([]);
  modalAberto = signal(false);
  empresaSelecionada = signal<CompanyResponse | null>(null);

  ngOnInit() {
    this.carregarEmpresas();
  }

  carregarEmpresas() {
    this.companyService.listar().subscribe({
      next: (response) => this.empresas.set(response)
    });
  }

  abrirModalCriar() {
    this.empresaSelecionada.set(null);
    this.modalAberto.set(true);
  }

  abrirModalEditar(empresa: CompanyShortResponse) {
    this.companyService.buscarPorId(empresa.id).subscribe({
      next: (empresaCompleta) => {
        this.empresaSelecionada.set(empresaCompleta);
        this.modalAberto.set(true);
      }
    });
  }

  onSalvo() {
    this.modalAberto.set(false);
    this.carregarEmpresas();
  }

  onCancelado() {
    this.modalAberto.set(false);
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