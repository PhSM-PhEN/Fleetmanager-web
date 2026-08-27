import { Component, signal, inject, OnInit } from "@angular/core";
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { Contract } from "../services/contract";
import { Company } from "../../company/services/company";
import { RentalPlan } from "../../rental-plan/services/rental-plan";
import { NotificationService } from "../../../core/services/notification";
import { RentalPlanResponse } from "../../../shared/models/rental-plan-response";
import { CompanyShortResponse } from "../../../shared/models/company-short-response";
import { HttpErrorResponse } from "@angular/common/http";
import { TenantShortResponse } from "../../../shared/models/tenant-short-response";
import { VehicleShortResponse } from "../../../shared/models/vehicle-short-response";
import { Vehicle } from "../../vehicle/services/vehicle";

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
    private companyService = inject(Company);
    private rentalPlanService = inject(RentalPlan);
    private veiculoService = inject(Vehicle);
    private notification = inject(NotificationService);

    empresas = signal<CompanyShortResponse[]>([]);
    planos = signal<RentalPlanResponse[]>([]);

    clientes = signal<TenantShortResponse[]>([]);
    veiculos = signal<VehicleShortResponse[]>([]);

    contractForm = new FormGroup({
        vehicleId: new FormControl<number | null>(null, { nonNullable: true, validators: [Validators.required] }),
        tenantId: new FormControl<number | null>(null, { nonNullable: true, validators: [Validators.required] }),
        rentalPlanId: new FormControl<number | null>(null, { nonNullable: true, validators: [Validators.required] }),
        startDate: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
        endDate: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
        totalValue: new FormControl(0, { nonNullable: true, validators: [Validators.required, Validators.min(0)] }),
        status: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
        mileageContracated: new FormControl(0, { nonNullable: true, validators: [Validators.required, Validators.min(0)] }),

    });

    ngOnInit() {
        this.companyService.listar().subscribe({
            next: (empresas) => this.empresas.set(empresas)
        });

        this.rentalPlanService.listar(1, 100).subscribe({
            next: (response) => this.planos.set(response.data)
        });
        this.veiculoService.listar(1, 100).subscribe({
            next: (response) => this.veiculos.set(response.data)
        })
    }

    onFormSubmit(event: Event) {
        event.preventDefault();
        this.onSubmit();
    }

    onSubmit() {
        const dados = this.contractForm.getRawValue();

        this.contractService.criar({
            ...dados,
            rentalType: "",
            totalAmount: dados.totalValue!,
            pickupDateTime: dados.endDate!,
            vehicleId: dados.vehicleId!,
            tenantId: dados.tenantId!,
            rentalPlanId: dados.rentalPlanId!
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