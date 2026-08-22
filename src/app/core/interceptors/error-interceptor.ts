import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { Auth } from '../auth/auth';
import { NotificationService } from '../services/notification';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const auth = inject(Auth);
  const notification = inject(NotificationService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        auth.logout();
        notification.show('Sua sessão expirou. Faça login novamente.');
        router.navigate(['/login']);
      }

      const mensagens = error.error?.errorMessage ?? ['Erro desconhecido'];
      console.error('Erro da API:', req.url, mensagens);
      return throwError(() => error);
    })
  );
};