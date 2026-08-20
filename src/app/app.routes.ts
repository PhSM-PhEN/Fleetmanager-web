import { Routes } from '@angular/router';
import { Login } from './features/login/login';
import { Vehicles } from './features/vehicles/vehicles';
import { authGuard } from './core/guards/auth-guard';

export const routes: Routes = [
  { path: 'login', component: Login },
  { path: 'vehicles', component: Vehicles, canActivate: [authGuard] }
];