import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { Auth } from '../../core/auth/auth';

function senhasIguaisValidator(group: AbstractControl): ValidationErrors | null {
  const senha = group.get('password')?.value;
  const confirmacao = group.get('confirmPassword')?.value;
  return senha === confirmacao ? null : { senhasDiferentes: true };
}

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class Register {
  private auth = inject(Auth);
  private router = inject(Router);

  errorMessage = signal('');
  carregando = signal(false);
  mostrarSenha = signal(false);
  mostrarConfirmacaoSenha = signal(false);

  registerForm = new FormGroup(
    {
      name: new FormControl('', [Validators.required, Validators.minLength(2)]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)]),
      confirmPassword: new FormControl('', [Validators.required]),
    },
    { validators: senhasIguaisValidator }
  );

  alternarSenha() {
    this.mostrarSenha.update((valor) => !valor);
  }

  alternarConfirmacaoSenha() {
    this.mostrarConfirmacaoSenha.update((valor) => !valor);
  }

  onSubmit() {
    this.errorMessage.set('');

    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    const { name, email, password } = this.registerForm.value;

    this.carregando.set(true);

    this.auth.register(name!, email!, password!).subscribe({
      next: () => {
        this.carregando.set(false);
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.carregando.set(false);
        const mensagens = err.error?.errorMessage ?? ['Erro ao registrar usuário'];
        this.errorMessage.set(mensagens.join(', '));
      },
    });
  }
}
