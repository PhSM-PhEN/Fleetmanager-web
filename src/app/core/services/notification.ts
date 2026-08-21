import { Injectable, signal } from '@angular/core';

export interface ToastMessage {
  message: string;
  type: 'success' | 'error';
}

@Injectable({ providedIn: 'root' })
export class NotificationService {
  toast = signal<ToastMessage | null>(null);

  private timeoutId?: ReturnType<typeof setTimeout>;

  show(message: string, type: 'success' | 'error' = 'error') {
    if (this.timeoutId) clearTimeout(this.timeoutId);

    this.toast.set({ message, type });

    this.timeoutId = setTimeout(() => {
      this.toast.set(null);
    }, 4000);
  }
}