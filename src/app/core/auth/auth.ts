import { Injectable, inject } from '@angular/core';
import { tap } from 'rxjs';
import { ApiService } from '../services/api.service';
import { AuthResponse } from '../../shared/models/auth-response';

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private api = inject(ApiService);
  private readonly tokenKey = 'auth_token';

  login(email: string, password: string) {
    return this.api.post<AuthResponse>('Login', { email, password }).pipe(
      tap((response) => this.setToken(response.token))
    );
  }

  private setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
  }
}