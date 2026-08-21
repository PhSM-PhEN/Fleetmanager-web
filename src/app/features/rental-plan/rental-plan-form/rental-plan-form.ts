import { Component, inject, input, output, signal, effect } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { RentalPlan } from '../services/rental-plan';
import { RentalPlanResponse } from '../../../shared/models/rental-plan-response';
import { NotificationService } from '../../../core/services/notification';

@Component({
  selector: 'app-rental-plan-form',
  imports: [ReactiveFormsModule],
  templateUrl: './rental-plan-form.html',
  styleUrl: './rental-plan-form.scss'
})
export class RentalPlanForm {
  private rentalPlanService = inject(RentalPlan);

  planoParaEditar = input<RentalPlanResponse | null>(null);
  salvo = output<void>();
  cancelado = output<void>();

  errorMessage = signal('');

  planoForm = new FormGroup({
    name: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    dailyPrice: new FormControl(0, { nonNullable: true, validators: [Validators.required, Validators.min(0)] }),
    monthlyPrice: new FormControl(0, { nonNullable: true, validators: [Validators.required, Validators.min(0)] }),
    excessMileageRate: new FormControl(0, { nonNullable: true, validators: [Validators.required, Validators.min(0)] }),
    mileagePerDay: new FormControl(0, { nonNullable: true, validators: [Validators.required, Validators.min(0)] }),
    mileagePerMonthly: new FormControl(0, { nonNullable: true, validators: [Validators.required, Validators.min(0)] })
  });

  constructor() {
    effect(() => {
      const plano = this.planoParaEditar();
      if (plano) {
        this.planoForm.patchValue(plano);
      }
    });
  }

  onSubmit() {
    this.errorMessage.set('');
    const dados = this.planoForm.getRawValue();
    const plano = this.planoParaEditar();

    if (plano) {
      this.rentalPlanService.atualizar(plano.id, dados).subscribe({
        next: () => this.salvo.emit(),
        error: (err: HttpErrorResponse) => this.tratarErro(err)
      });
    } else {
      this.rentalPlanService.criar(dados).subscribe({
        next: () => this.salvo.emit(),
        error: (err: HttpErrorResponse) => this.tratarErro(err)
      });
    }
  }
  private notification = inject(NotificationService);
  private tratarErro(err: HttpErrorResponse) {
    if (err.status === 403) {
      this.notification.show('Você não tem permissão para realizar esta ação.');
      return;
    }
  
    const mensagens = (err.error?.errorMessage as string[]) ?? ['Erro ao salvar plano'];
    this.notification.show(mensagens.join(', '));
  }

  onCancelar() {
    this.cancelado.emit();
  }
}