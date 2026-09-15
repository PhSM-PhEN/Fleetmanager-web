import { Component, signal, inject, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { Contract } from '../services/contract';
import { RentalPlan } from '../../rental-plan/services/rental-plan';
import { Vehicle } from '../../vehicle/services/vehicle';
import { Tenant } from '../../tenant/services/tenant';
import { NotificationService } from '../../../core/services/notification';
import { RentalPlanResponse } from '../../../shared/models/rental-plan-response';
import { TenantShortResponse } from '../../../shared/models/tenant-short-response';
import { VehicleShortResponse } from '../../../shared/models/vehicle-short-response';

@Component({
  standalone: true,
  imports: [ReactiveFormsModule],
  selector: 'app-contract-form',
  templateUrl: './contract-form.html',
  styleUrl: './contract-form.scss'
})
export class ContractForm implements OnInit {
  private router = inject(Router);
  private contractService = inject(Contract);
  private rentalPlanService = inject(RentalPlan);
  private veiculoService = inject(Vehicle);
  private tenantService = inject(Tenant);
  private notification = inject(NotificationService);

  planos = signal<RentalPlanResponse[]>([]);
  clientes = signal<TenantShortResponse[]>([]);
  veiculos = signal<VehicleShortResponse[]>([]);

  contractForm = new FormGroup({
    vehicleId: new FormControl<number | null>(null, { nonNullable: true, validators: [Validators.required] }),
    tenantId: new FormControl<number | null>(null, { nonNullable: true, validators: [Validators.required] }),
    rentalPlanId: new FormControl<number | null>(null, { nonNullable: true, validators: [Validators.required] }),
    rentalType: new FormControl('Daily', { nonNullable: true, validators: [Validators.required] }),
    pickupDateTime: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    returnDueDateTime: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    mileageContracted: new FormControl(0, { nonNullable: true, validators: [Validators.required, Validators.min(0)] }),
    totalAmount: new FormControl(0, { nonNullable: true, validators: [Validators.required, Validators.min(0)] })
  });

  ngOnInit() {
    this.rentalPlanService.listar(1, 100).subscribe({
      next: (response) => this.planos.set(response.data)
    });

    this.veiculoService.listar(1, 100).subscribe({
      next: (response) => this.veiculos.set(response.data)
    });

    this.tenantService.listar(1, 100).subscribe({
      next: (response) => this.clientes.set(response.data)
    });
  }

  onFormSubmit(event: Event) {
    event.preventDefault();
    this.onSubmit();
  }

  onSubmit() {
    if (this.contractForm.invalid) return;
    const dados = this.contractForm.getRawValue();

    this.contractService.criar({
      vehicleId: dados.vehicleId!,
      tenantId: dados.tenantId!,
      rentalPlanId: dados.rentalPlanId!,
      rentalType: dados.rentalType,
      mileageContracted: dados.mileageContracted,
      totalAmount: dados.totalAmount,
      pickupDateTime: dados.pickupDateTime,
      returnDueDateTime: dados.returnDueDateTime || undefined
    }).subscribe({
      next: () => {
        this.notification.show('Contrato cadastrado com sucesso!', 'success');
        this.router.navigate(['/contracts']);
      },
      error: (err: HttpErrorResponse) => this.tratarErro(err)
    });
  }

  private tratarErro(err: HttpErrorResponse) {
    if (err.status === 403) {
      this.notification.show('Você não tem permissão para realizar esta ação.');
      return;
    }
    const mensagens = (err.error?.errorMessage as string[]) ?? ['Erro ao cadastrar contrato'];
    this.notification.show(mensagens.join(', '));
  }

  onCancelar() {
    this.router.navigate(['/contracts']);
  }
}