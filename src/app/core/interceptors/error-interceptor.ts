import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      const mensagens = error.error?.errorMessage ?? ['Erro desconhecido'];
      console.error('Erro da API:', req.url, mensagens);
      return throwError(() => error);
    })
  );
};