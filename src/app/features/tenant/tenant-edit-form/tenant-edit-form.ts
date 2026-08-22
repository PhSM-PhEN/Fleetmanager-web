import { Component, inject, input, output, effect } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { Tenant } from '../services/tenant';
import { TenantResponse } from '../../../shared/models/tenant-response';
import { NotificationService } from '../../../core/services/notification';

@Component({
  selector: 'app-tenant-edit-form',
  imports: [ReactiveFormsModule],
  templateUrl: './tenant-edit-form.html',
  styleUrl: './tenant-edit-form.scss'
})
export class TenantEditForm {
  private tenantService = inject(Tenant);
  private notification = inject(NotificationService);

  clienteParaEditar = input.required<TenantResponse>();
  salvo = output<void>();
  cancelado = output<void>();

  editForm = new FormGroup({
    phoneNumber: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    email: new FormControl('', { nonNullable: true, validators: [Validators.email] }),
    street: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    number: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    city: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    state: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    zipCode: new FormControl('', { nonNullable: true, validators: [Validators.required] })
  });

  constructor() {
    effect(() => {
      const cliente = this.clienteParaEditar();
      this.editForm.patchValue({
        phoneNumber: cliente.phoneNumber,
        email: cliente.email ?? '',
        ...cliente.address
      });
    });
  }

  onFormSubmit(event: Event) {
    event.preventDefault();
    this.onSubmit();
  }

  onSubmit() {
    const cliente = this.clienteParaEditar();
    const dados = this.editForm.getRawValue();

    this.tenantService.atualizar(cliente.id, {
      phoneNumber: dados.phoneNumber,
      email: dados.email || undefined,
      addressId: cliente.address.id
    }).subscribe({
      next: () => {
        this.salvo.emit();
        this.notification.show('Cliente atualizado com sucesso!', 'success');
      },
      error: (err: HttpErrorResponse) => this.tratarErro(err)
    });
  }

  private tratarErro(err: HttpErrorResponse) {
    if (err.status === 403) {
      this.notification.show('Você não tem permissão para realizar esta ação.');
      return;
    }
    const mensagens = (err.error?.errorMessage as string[]) ?? ['Erro ao atualizar cliente'];
    this.notification.show(mensagens.join(', '));
  }

  onCancelar() {
    this.cancelado.emit();
  }
}