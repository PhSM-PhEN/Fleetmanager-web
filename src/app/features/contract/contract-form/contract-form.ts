import { Component, inject, signal, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { CurrencyPipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { Contract } from '../services/contract';
import { Vehicle } from '../../vehicle/services/vehicle';
import { Tenant } from '../../tenant/services/tenant';
import { VehicleShortResponse } from '../../../shared/models/vehicle-short-response';
import { TenantShortResponse } from '../../../shared/models/tenant-short-response';
import { ContractPreviewResponse } from '../../../shared/models/contract-preview-response'
import { NotificationService } from '../../../core/services/notification';
import { DateTimePicker } from '../../../shared/date-time-picker/date-time-picker';

@Component({
    selector: 'app-contract-form',
    imports: [ReactiveFormsModule, CurrencyPipe, DateTimePicker],
    templateUrl: './contract-form.html',
    styleUrl: './contract-form.scss'
})
export class ContractForm implements OnInit {
    private contractService = inject(Contract);
    private vehicleService = inject(Vehicle);
    private tenantService = inject(Tenant);
    private notification = inject(NotificationService);
    private router = inject(Router);

    veiculos = signal<VehicleShortResponse[]>([]);
    clientes = signal<TenantShortResponse[]>([]);
    preview = signal<ContractPreviewResponse | null>(null);

    previewForm = new FormGroup({
        vehicleId: new FormControl<number | null>(null, { validators: [Validators.required] }),
        tenantId: new FormControl<number | null>(null, { validators: [Validators.required] }),
        rentalType: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
        pickupDateTime: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
        returnDueDateTime: new FormControl(''),
        desiredExcessMileage: new FormControl(0, { nonNullable: true, validators: [Validators.required, Validators.min(0)] })
    });

    totalAmountControl = new FormControl(0, { nonNullable: true, validators: [Validators.required, Validators.min(0)] });

    ngOnInit() {
        this.vehicleService.listar(1, 100).subscribe({
            next: (response) => this.veiculos.set(response.data)
        });

        this.tenantService.listar(1, 100).subscribe({
            next: (response) => this.clientes.set(response.data)
        });
    }

    gerarPreview() {
        const dados = this.previewForm.getRawValue();

        this.contractService.preview({
            vehicleId: dados.vehicleId!,
            tenantId: dados.tenantId!,
            rentalType: dados.rentalType,
            pickupDateTime: dados.pickupDateTime,
            returnDueDateTime: dados.returnDueDateTime || undefined,
            desiredExcessMileage: dados.desiredExcessMileage
        }).subscribe({
            next: (resultado) => {
                this.preview.set(resultado);
                this.totalAmountControl.setValue(resultado.totalAmount);
            },
            error: (err: HttpErrorResponse) => this.tratarErro(err)
        });
    }

    confirmarContrato() {
        const p = this.preview();
        if (!p || this.totalAmountControl.invalid) return;

        this.contractService.criar({
            vehicleId: p.vehicleId,
            tenantId: p.tenantId,
            rentalPlanId: p.rentalPlanId,
            rentalType: p.rentalType,
            mileageContracted: p.mileageContracted,
            totalAmount: this.totalAmountControl.getRawValue(),
            pickupDateTime: p.pickupDateTime,
            returnDueDateTime: p.returnDueDateTime
        }).subscribe({
            next: () => {
                this.notification.show('Contrato criado com sucesso!', 'success');
                this.router.navigate(['/contracts']);
            },
            error: (err: HttpErrorResponse) => this.tratarErro(err)
        });
    }

    voltarParaEdicao() {
        this.preview.set(null);
    }

    private tratarErro(err: HttpErrorResponse) {
        if (err.status === 403) {
            this.notification.show('Você não tem permissão para realizar esta ação.');
            return;
        }
        const mensagens = (err.error?.errorMessage as string[]) ?? ['Erro ao processar contrato'];
        this.notification.show(mensagens.join(', '));
    }

    onCancelar() {
        this.router.navigate(['/contracts']);
    }
}