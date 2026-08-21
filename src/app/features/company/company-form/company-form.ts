import { Component, inject, input, output, signal, effect } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { Company } from '../services/company';
import { CompanyResponse } from '../../../shared/models/company-response';
import { NotificationService } from '../../../core/services/notification';

@Component({
  selector: 'app-company-form',
  imports: [ReactiveFormsModule],
  templateUrl: './company-form.html',
  styleUrl: './company-form.scss'
})
export class CompanyForm {
  private companyService = inject(Company);
  private notification = inject(NotificationService);

  empresaParaEditar = input<CompanyResponse | null>(null);
  salvo = output<void>();
  cancelado = output<void>();

  empresaForm = new FormGroup({
    name: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    cnpj: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    phoneNumber: new FormControl('', { nonNullable: true, validators: [Validators.required] })
  });

  enderecoForm = new FormGroup({
    street: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    number: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    city: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    state: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    zipCode: new FormControl('', { nonNullable: true, validators: [Validators.required] })
  });

  constructor() {
    effect(() => {
      const empresa = this.empresaParaEditar();
      if (empresa) {
        this.empresaForm.patchValue(empresa);
        this.enderecoForm.patchValue(empresa.address);
      }
    });
  }

  onSubmit() {
    const empresa = this.empresaParaEditar();

    if (empresa) {
      this.companyService.atualizar(empresa.id, this.empresaForm.getRawValue(), empresa.address.id).subscribe({
        next: () => {
          this.salvo.emit();
          this.notification.show('Empresa atualizada com sucesso!', 'success');
        },
        error: (err: HttpErrorResponse) => this.tratarErro(err)
      });
    } else {
      this.companyService.criar(this.empresaForm.getRawValue(), this.enderecoForm.getRawValue()).subscribe({
        next: () => {
          this.salvo.emit();
          this.notification.show('Empresa criada com sucesso!', 'success');
        },
        error: (err: HttpErrorResponse) => this.tratarErro(err)
      });
    }
  }
  onFormSubmit(event: Event) {
    event.preventDefault();
    this.onSubmit();
  }

  private tratarErro(err: HttpErrorResponse) {
    if (err.status === 403) {
      this.notification.show('Você não tem permissão para realizar esta ação.');
      return;
    }
    const mensagens = (err.error?.errorMessage as string[]) ?? ['Erro ao salvar empresa'];
    this.notification.show(mensagens.join(', '));
  }

  onCancelar() {
    this.cancelado.emit();
  }
}