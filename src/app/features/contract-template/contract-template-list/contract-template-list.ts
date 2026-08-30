import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { ContractTemplate } from '../services/contract-template';
import { ContractTemplateResponse } from '../../../shared/models/contract-template-response';
import { ContractTemplateForm } from '../contract-template-form/contract-template-form';
import { NotificationService } from '../../../core/services/notification';

@Component({
  selector: 'app-contract-template-list',
  imports: [ContractTemplateForm, FormsModule],
  templateUrl: './contract-template-list.html',
  styleUrl: './contract-template-list.scss'
})
export class ContractTemplateList implements OnInit {
  private contractTemplateService = inject(ContractTemplate);
  private notification = inject(NotificationService);

  templates = signal<ContractTemplateResponse[]>([]);
  modalAberto = signal(false);
  templateSelecionado = signal<ContractTemplateResponse | null>(null);
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

  abrirModalCriar() {
    this.templateSelecionado.set(null);
    this.modalAberto.set(true);
  }

  abrirModalEditar(template: ContractTemplateResponse) {
    this.templateSelecionado.set(template);
    this.modalAberto.set(true);
  }

  onSalvo() {
    this.modalAberto.set(false);
    this.carregarTemplates();
    this.notification.show('Template salvo com sucesso!', 'success');
  }

  onCancelado() {
    this.modalAberto.set(false);
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
