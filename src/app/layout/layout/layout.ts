import { Component, inject, signal } from '@angular/core';
import { Router, RouterOutlet, RouterLink, RouterLinkActive, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';
import { Auth } from '../../core/auth/auth';
import { Toast } from '../../shared/components/toast/toast';

const TITULOS_POR_ROTA: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/vehicles': 'Veículos',
  '/contracts': 'Contratos',
  '/clients': 'Clientes',
  '/rental-plans': 'Planos de Locação',
  '/companies': 'Empresas',
  '/incident-reports': 'Ocorrências'
};

@Component({
  selector: 'app-layout',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, Toast],
  templateUrl: './layout.html',
  styleUrl: './layout.scss'
})
export class Layout {
  private auth = inject(Auth);
  private router = inject(Router);

  sidebarRecolhida = signal(false);
  nomeUsuario = this.auth.getName() ?? 'Administrador';
  tituloPagina = signal(this.tituloParaUrl(this.router.url));

  constructor() {
    this.router.events
      .pipe(filter((evento) => evento instanceof NavigationEnd))
      .subscribe((evento) => {
        this.tituloPagina.set(this.tituloParaUrl(evento.urlAfterRedirects));
      });
  }

  private tituloParaUrl(url: string): string {
    const base = '/' + url.split('/').filter(Boolean)[0];
    return TITULOS_POR_ROTA[base] ?? 'Sistema de Gestão';
  }

  alternarSidebar() {
    this.sidebarRecolhida.update((valor) => !valor);
  }

  sair() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}