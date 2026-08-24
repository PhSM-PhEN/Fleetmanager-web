import { Component, inject, signal, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { Vehicle } from '../services/vehicle';
import { Company } from '../../company/services/company';
import { RentalPlan } from '../../rental-plan/services/rental-plan';
import { CompanyShortResponse } from '../../../shared/models/company-short-response';
import { RentalPlanResponse } from '../../../shared/models/rental-plan-response';
import { NotificationService } from '../../../core/services/notification';

@Component({
  selector: 'app-vehicle-form',
  imports: [ReactiveFormsModule],
  templateUrl: './vehicle-form.html',
  styleUrl: './vehicle-form.scss'
})
export class VehicleForm implements OnInit {
  private vehicleService = inject(Vehicle);
  private companyService = inject(Company);
  private rentalPlanService = inject(RentalPlan);
  private notification = inject(NotificationService);
  private router = inject(Router);

  empresas = signal<CompanyShortResponse[]>([]);
  planos = signal<RentalPlanResponse[]>([]);

  veiculoForm = new FormGroup({
    brand: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    model: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    color: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    manufacturingYear: new FormControl('', {
    nonNullable: true, validators: [Validators.required, Validators.pattern(/^\d{4}\/\d{4}$/)]
}),
    renavam: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    chassiNumber: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    licensePlate: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    currentMileage: new FormControl(0, { nonNullable: true, validators: [Validators.required, Validators.min(0)] }),
    companyId: new FormControl<number | null>(null, { validators: [Validators.required] }),
    rentalPlanId: new FormControl<number | null>(null, { validators: [Validators.required] })
  });

  ngOnInit() {
    this.companyService.listar().subscribe({
      next: (empresas) => this.empresas.set(empresas)
    });

    this.rentalPlanService.listar(1, 100).subscribe({
      next: (response) => this.planos.set(response.data)
    });
  }
  

  onFormSubmit(event: Event) {
    event.preventDefault();
    this.onSubmit();
  }

  onSubmit() {
    const dados = this.veiculoForm.getRawValue();

    this.vehicleService.criar({
      ...dados,
      companyId: dados.companyId!,
      rentalPlanId: dados.rentalPlanId!
    }).subscribe({
      next: () => {
        this.notification.show('Veículo cadastrado com sucesso!', 'success');
        this.router.navigate(['/vehicles']);
      },
      error: (err: HttpErrorResponse) => this.tratarErro(err)
    });
  }

  private tratarErro(err: HttpErrorResponse) {
    if (err.status === 403) {
      this.notification.show('Você não tem permissão para realizar esta ação.');
      return;
    }
    const mensagens = (err.error?.errorMessage as string[]) ?? ['Erro ao cadastrar veículo'];
    this.notification.show(mensagens.join(', '));
  }

  onCancelar() {
    this.router.navigate(['/vehicles']);
  }
}