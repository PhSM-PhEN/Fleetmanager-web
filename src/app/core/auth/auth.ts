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
  private readonly nameKey = 'auth_user_name';

  login(email: string, password: string) {
    return this.api.post<AuthResponse>('Login', { email, password }).pipe(
      tap((response) => {
        this.setToken(response.token);
        this.setName(response.name);
      })
    );
  }

  register(name: string, email: string, password: string) {
    return this.api.post<AuthResponse>('User', { name, email, password }).pipe(
      tap((response) => {
        this.setToken(response.token);
        this.setName(response.name);
      })
    );
  }

  private setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  private setName(name: string): void {
    if (name) localStorage.setItem(this.nameKey, name);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  getName(): string | null {
    return localStorage.getItem(this.nameKey);
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) return false;
    return !this.isTokenExpired(token);
  }

  private isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      if (!payload.exp) return false;
      return Date.now() >= payload.exp * 1000;
    } catch {
      return true;
    }
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.nameKey);
  }
}