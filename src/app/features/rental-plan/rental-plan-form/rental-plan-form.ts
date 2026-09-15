import { Component, inject, signal, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { RentalPlan } from '../services/rental-plan';
import { NotificationService } from '../../../core/services/notification';

@Component({
  selector: 'app-rental-plan-form',
  imports: [ReactiveFormsModule],
  templateUrl: './rental-plan-form.html',
  styleUrl: './rental-plan-form.scss'
})
export class RentalPlanForm implements OnInit {
  private rentalPlanService = inject(RentalPlan);
  private notification = inject(NotificationService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  isEditMode = signal(false);
  planoId = signal<number | null>(null);

  planoForm = new FormGroup({
    name: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    dailyPrice: new FormControl(0, { nonNullable: true, validators: [Validators.required, Validators.min(0)] }),
    monthlyPrice: new FormControl(0, { nonNullable: true, validators: [Validators.required, Validators.min(0)] }),
    excessMileageRate: new FormControl(0, { nonNullable: true, validators: [Validators.required, Validators.min(0)] }),
    mileagePerDay: new FormControl(0, { nonNullable: true, validators: [Validators.required, Validators.min(0)] }),
    mileagePerMonthly: new FormControl(0, { nonNullable: true, validators: [Validators.required, Validators.min(0)] })
  });

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.isEditMode.set(true);
      this.planoId.set(id);
      this.rentalPlanService.buscarPorId(id).subscribe({
        next: (plano) => {
          this.planoForm.patchValue(plano);
        },
        error: () => this.notification.show('Erro ao carregar dados do plano.')
      });
    }
  }

  onSubmit() {
    if (this.planoForm.invalid) return;

    const dados = this.planoForm.getRawValue();
    const id = this.planoId();

    if (this.isEditMode() && id) {
      this.rentalPlanService.atualizar(id, dados).subscribe({
        next: () => {
          this.notification.show('Plano atualizado com sucesso!', 'success');
          this.router.navigate(['/rental-plans']);
        },
        error: (err: HttpErrorResponse) => this.tratarErro(err)
      });
    } else {
      this.rentalPlanService.criar(dados).subscribe({
        next: () => {
          this.notification.show('Plano cadastrado com sucesso!', 'success');
          this.router.navigate(['/rental-plans']);
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
    const mensagens = (err.error?.errorMessage as string[]) ?? ['Erro ao salvar plano'];
    this.notification.show(mensagens.join(', '));
  }

  onCancelar() {
    this.router.navigate(['/rental-plans']);
  }
}