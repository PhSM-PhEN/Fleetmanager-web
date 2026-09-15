import { Component, inject, signal, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
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
export class TenantEditForm implements OnInit {
  private tenantService = inject(Tenant);
  private notification = inject(NotificationService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  clienteId = signal<number | null>(null);
  cliente = signal<TenantResponse | null>(null);

  editForm = new FormGroup({
    phoneNumber: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    email: new FormControl('', { nonNullable: true, validators: [Validators.email] }),
    street: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    number: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    neighborhood: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    city: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    state: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    zipCode: new FormControl('', { nonNullable: true, validators: [Validators.required] })
  });

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.clienteId.set(id);
      this.tenantService.buscarPorId(id).subscribe({
        next: (c) => {
          this.cliente.set(c);
          this.editForm.patchValue({
            phoneNumber: c.phoneNumber,
            email: c.email ?? '',
            street: c.address?.street ?? '',
            number: c.address?.number ?? '',
            neighborhood: c.address?.neighborhood ?? '',
            city: c.address?.city ?? '',
            state: c.address?.state ?? '',
            zipCode: c.address?.zipCode ?? ''
          });
        },
        error: () => this.notification.show('Erro ao carregar dados do cliente.')
      });
    }
  }

  onFormSubmit(event: Event) {
    event.preventDefault();
    this.onSubmit();
  }

  onSubmit() {
    const id = this.clienteId();
    const cliente = this.cliente();
    if (!id || !cliente || this.editForm.invalid) return;

    const dados = this.editForm.getRawValue();

    this.tenantService.atualizar(id, {
      phoneNumber: dados.phoneNumber,
      email: dados.email || undefined,
      addressId: cliente.address.id
    }).subscribe({
      next: () => {
        this.notification.show('Cliente atualizado com sucesso!', 'success');
        this.router.navigate(['/clients', id]);
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
    const id = this.clienteId();
    if (id) {
      this.router.navigate(['/clients', id]);
    } else {
      this.router.navigate(['/clients']);
    }
  }
}