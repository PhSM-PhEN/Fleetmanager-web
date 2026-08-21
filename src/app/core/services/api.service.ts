import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environments';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl;

  get<T>(path: string, params?: Record<string, string | number>) {
    let httpParams = new HttpParams();
    if (params) {
      for (const key in params) {
        httpParams = httpParams.set(key, params[key]);
      }
    }
    return this.http.get<T>(`${this.baseUrl}/${path}`, { params: httpParams });
  }

  post<T>(path: string, body: unknown) {
    return this.http.post<T>(`${this.baseUrl}/${path}`, body);
  }

  put<T>(path: string, body: unknown) {
    return this.http.put<T>(`${this.baseUrl}/${path}`, body);
  }

  patch<T>(path: string, body: unknown) {
    return this.http.patch<T>(`${this.baseUrl}/${path}`, body);
  }

  delete<T>(path: string) {
    return this.http.delete<T>(`${this.baseUrl}/${path}`);
  }
}