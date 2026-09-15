import { Component, inject, signal, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
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
export class CompanyForm implements OnInit {
  private companyService = inject(Company);
  private notification = inject(NotificationService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  isEditMode = signal(false);
  empresaId = signal<number | null>(null);
  empresaAtual = signal<CompanyResponse | null>(null);

  empresaForm = new FormGroup({
    cnpj: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    legalName: new FormControl('', { nonNullable: false, validators: [] }),
    tradeName: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    stateRegistration: new FormControl('', { nonNullable: false, validators: [] }),
    municipalRegistration: new FormControl('', { nonNullable: false, validators: [] }),
    phoneNumber: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    taxRegime: new FormControl('', { nonNullable: false, validators: [] }),
    primaryCnae: new FormControl('', { nonNullable: false, validators: [] }),
    email: new FormControl('', { nonNullable: false, validators: [] })
  });

  enderecoForm = new FormGroup({
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
      this.isEditMode.set(true);
      this.empresaId.set(id);
      this.companyService.buscarPorId(id).subscribe({
        next: (empresa) => {
          this.empresaAtual.set(empresa);
          this.empresaForm.patchValue({
            tradeName: empresa.TradeName,
            cnpj: empresa.cnpj,
            phoneNumber: empresa.phoneNumber
          });
          if (empresa.address) {
            this.enderecoForm.patchValue(empresa.address);
          }
        },
        error: () => this.notification.show('Erro ao carregar dados da empresa.')
      });
    }
  }

  onFormSubmit(event: Event) {
    event.preventDefault();
    this.onSubmit();
  }

  onSubmit() {
    if (this.empresaForm.invalid || this.enderecoForm.invalid) return;

    const id = this.empresaId();
    const empresa = this.empresaAtual();

    if (this.isEditMode() && id && empresa) {
      this.companyService.atualizar(id, this.empresaForm.getRawValue(), empresa.address.id).subscribe({
        next: () => {
          this.notification.show('Empresa atualizada com sucesso!', 'success');
          this.router.navigate(['/companies']);
        },
        error: (err: HttpErrorResponse) => this.tratarErro(err)
      });
    } else {
      this.companyService.criar(this.empresaForm.getRawValue(), this.enderecoForm.getRawValue()).subscribe({
        next: () => {
          this.notification.show('Empresa criada com sucesso!', 'success');
          this.router.navigate(['/companies']);
        },
        error: (err: HttpErrorResponse) => this.tratarErro(err)
      });
    }
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
    this.router.navigate(['/companies']);
  }
}