import { Component, ElementRef, ViewChild, inject, input, output, signal, effect } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { ContractTemplate } from '../services/contract-template';
import { ContractTemplateResponse } from '../../../shared/models/contract-template-response';
import { NotificationService } from '../../../core/services/notification';

// Placeholders reconhecidos pelo backend ao gerar o documento do contrato
// (FleetManager.Application.UseCase.ToContract.GenerateDocument.ContractPlaceholders).
// Mantidos em grupos só para facilitar a escolha de quem está editando o template.
export const PLACEHOLDER_GROUPS: { label: string; placeholders: string[] }[] = [
  {
    label: 'Locadora',
    placeholders: [
      '{{CompanyName}}',
      '{{CompanyCnpj}}',
      '{{CompanyPhone}}',
      '{{CompanyAddressStreet}}',
      '{{CompanyAddressNumber}}',
      '{{CompanyAddressCity}}',
      '{{CompanyAddressState}}',
      '{{CompanyAddressZipCode}}'
    ]
  },
  {
    label: 'Locatário',
    placeholders: [
      '{{TenantName}}',
      '{{TenantCpf}}',
      '{{TenantRg}}',
      '{{TenantDriverLicense}}',
      '{{TenantDriverLicenseCategory}}',
      '{{TenantPhone}}',
      '{{TenantEmail}}',
      '{{TenantAddressStreet}}',
      '{{TenantAddressNumber}}',
      '{{TenantAddressCity}}',
      '{{TenantAddressState}}',
      '{{TenantAddressZipCode}}'
    ]
  },
  {
    label: 'Veículo',
    placeholders: [
      '{{VehicleBrand}}',
      '{{VehicleModel}}',
      '{{VehicleColor}}',
      '{{VehicleManufacturingYear}}',
      '{{VehiclePlate}}',
      '{{VehicleChassis}}',
      '{{VehicleCurrentMileage}}'
    ]
  },
  {
    label: 'Entrega / devolução',
    placeholders: [
      '{{ExpectedMileageReturn}}',
      '{{MileageAtReturn}}',
      '{{StartDate}}',
      '{{ExpectedReturnDate}}'
    ]
  },
  {
    label: 'Prazo',
    placeholders: [
      '{{RentalPeriod}}',
      '{{RentalPeriodInDays}}',
      '{{RentalPeriodDescription}}'
    ]
  },
  {
    label: 'Valores',
    placeholders: [
      '{{TotalPrice}}',
      '{{TotalPriceInWords}}',
      '{{DailyPrice}}',
      '{{DailyPriceInWords}}',
      '{{RentalMode}}'
    ]
  },
  {
    label: 'Quilometragem',
    placeholders: [
      '{{IncludedKm}}',
      '{{ExcessKmPrice}}',
      '{{ExcessKmPriceInWords}}',
      '{{ContractedMileage}}'
    ]
  },
  {
    label: 'Local e data',
    placeholders: ['{{ContractCity}}', '{{ContractState}}', '{{ContractDate}}']
  },
  {
    label: 'Controle',
    placeholders: ['{{ContractNumber}}', '{{ContractStatus}}']
  }
];

@Component({
  selector: 'app-contract-template-form',
  imports: [ReactiveFormsModule],
  templateUrl: './contract-template-form.html',
  styleUrl: './contract-template-form.scss'
})
export class ContractTemplateForm {
  private contractTemplateService = inject(ContractTemplate);
  private notification = inject(NotificationService);

  @ViewChild('contentField') contentField?: ElementRef<HTMLTextAreaElement>;

  templateParaEditar = input<ContractTemplateResponse | null>(null);
  salvo = output<void>();
  cancelado = output<void>();

  errorMessage = signal('');
  grupos = PLACEHOLDER_GROUPS;

  templateForm = new FormGroup({
    name: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    content: new FormControl('', { nonNullable: true, validators: [Validators.required] })
  });

  // Um template ativo não pode ser editado no backend (é usado para gerar contratos);
  // é preciso desativá-lo (ativando outro) ou cadastrar uma nova versão.
  get bloqueadoPorEstarAtivo(): boolean {
    return !!this.templateParaEditar()?.isActive;
  }

  constructor() {
    effect(() => {
      const template = this.templateParaEditar();
      if (template) {
        this.templateForm.patchValue(template);
      }

      if (this.bloqueadoPorEstarAtivo) {
        this.templateForm.disable();
      } else {
        this.templateForm.enable();
      }
    });
  }

  inserirPlaceholder(placeholder: string) {
    const textarea = this.contentField?.nativeElement;
    const conteudoAtual = this.templateForm.controls.content.value;

    if (!textarea) {
      this.templateForm.controls.content.setValue(conteudoAtual + placeholder);
      return;
    }

    const inicio = textarea.selectionStart ?? conteudoAtual.length;
    const fim = textarea.selectionEnd ?? conteudoAtual.length;
    const novoConteudo = conteudoAtual.slice(0, inicio) + placeholder + conteudoAtual.slice(fim);

    this.templateForm.controls.content.setValue(novoConteudo);

    queueMicrotask(() => {
      textarea.focus();
      const novaPosicao = inicio + placeholder.length;
      textarea.setSelectionRange(novaPosicao, novaPosicao);
    });
  }

  onSubmit() {
    if (this.bloqueadoPorEstarAtivo) return;

    this.errorMessage.set('');
    const dados = this.templateForm.getRawValue();
    const template = this.templateParaEditar();

    if (template) {
      this.contractTemplateService.atualizar(template.id, dados).subscribe({
        next: () => this.salvo.emit(),
        error: (err: HttpErrorResponse) => this.tratarErro(err)
      });
    } else {
      this.contractTemplateService.criar(dados).subscribe({
        next: () => this.salvo.emit(),
        error: (err: HttpErrorResponse) => this.tratarErro(err)
      });
    }
  }

  private tratarErro(err: HttpErrorResponse) {
    if (err.status === 403) {
      this.notification.show('Você não tem permissão para realizar esta ação.');
      return;
    }

    if (err.status === 409) {
      const mensagem = (err.error?.errorMessage as string[])?.join(', ')
        ?? 'Não é possível editar um template ativo. Ative outro template ou cadastre uma nova versão.';
      this.notification.show(mensagem);
      return;
    }

    const mensagens = (err.error?.errorMessage as string[]) ?? ['Erro ao salvar template'];
    this.notification.show(mensagens.join(', '));
  }

  onCancelar() {
    this.cancelado.emit();
  }
}
