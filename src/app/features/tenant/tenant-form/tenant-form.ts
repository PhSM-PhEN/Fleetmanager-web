import { Component, inject, output, signal } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { Tenant } from '../services/tenant';
import { NotificationService } from '../../../core/services/notification';

@Component({
  selector: 'app-tenant-form',
  imports: [ReactiveFormsModule],
  templateUrl: './tenant-form.html',
  styleUrl: './tenant-form.scss'
})
export class TenantForm {
  private tenantService = inject(Tenant);
  private notification = inject(NotificationService);

  salvo = output<void>();
  cancelado = output<void>();

  clienteForm = new FormGroup({
    name: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    cpf: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    rg: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    driverLicenseNumber: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    driverLicenseCategory: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    phoneNumber: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    email: new FormControl('', { nonNullable: true, validators: [Validators.email] })
  });

  enderecoForm = new FormGroup({
    street: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    number: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    city: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    state: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    zipCode: new FormControl('', { nonNullable: true, validators: [Validators.required] })
  });

  onFormSubmit(event: Event) {
    event.preventDefault();
    this.onSubmit();
  }

  onSubmit() {
    const dados = this.clienteForm.getRawValue();

    this.tenantService.criar(
      { ...dados, email: dados.email || undefined },
      this.enderecoForm.getRawValue()
    ).subscribe({
      next: () => {
        this.salvo.emit();
        this.notification.show('Cliente cadastrado com sucesso!', 'success');
      },
      error: (err: HttpErrorResponse) => this.tratarErro(err)
    });
  }

  private tratarErro(err: HttpErrorResponse) {
    if (err.status === 403) {
      this.notification.show('Você não tem permissão para realizar esta ação.');
      return;
    }
    const mensagens = (err.error?.errorMessage as string[]) ?? ['Erro ao cadastrar cliente'];
    this.notification.show(mensagens.join(', '));
  }

  onCancelar() {
    this.cancelado.emit();
  }
}