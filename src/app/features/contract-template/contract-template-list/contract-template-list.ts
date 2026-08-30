import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { ContractTemplate } from '../services/contract-template';
import { ContractTemplateResponse } from '../../../shared/models/contract-template-response';
import { NotificationService } from '../../../core/services/notification';

@Component({
  selector: 'app-contract-template-list',
  imports: [FormsModule],
  templateUrl: './contract-template-list.html',
  styleUrl: './contract-template-list.scss'
})
export class ContractTemplateList implements OnInit {
  private contractTemplateService = inject(ContractTemplate);
  private notification = inject(NotificationService);
  private router = inject(Router);

  templates = signal<ContractTemplateResponse[]>([]);
  termoBusca = signal('');

  templatesFiltrados = computed(() => {
    const termo = this.termoBusca().trim().toLowerCase();
    if (!termo) return this.templates();

    return this.templates().filter((template) =>
      template.name.toLowerCase().includes(termo)
    );
  });

  ngOnInit() {
    this.carregarTemplates();
  }

  carregarTemplates() {
    this.contractTemplateService.listar().subscribe({
      next: (response) => this.templates.set(response.data)
    });
  }

  onBuscar(termo: string) {
    this.termoBusca.set(termo);
  }

  abrirNovo() {
    this.router.navigate(['/contract-templates/new']);
  }

  abrirEdicao(template: ContractTemplateResponse) {
    this.router.navigate(['/contract-templates', template.id, 'edit']);
  }

  ativar(template: ContractTemplateResponse) {
    if (template.isActive) return;

    if (!confirm(`Ativar o template "${template.name}"? O template ativo atual será desativado automaticamente.`)) {
      return;
    }

    this.contractTemplateService.ativar(template.id).subscribe({
      next: () => {
        this.carregarTemplates();
        this.notification.show('Template ativado com sucesso!', 'success');
      },
      error: (err: HttpErrorResponse) => {
        if (err.status === 403) {
          this.notification.show('Você não tem permissão para ativar templates.');
        } else {
          const mensagens = (err.error?.errorMessage as string[]) ?? ['Erro ao ativar template'];
          this.notification.show(mensagens.join(', '));
        }
      }
    });
  }
}