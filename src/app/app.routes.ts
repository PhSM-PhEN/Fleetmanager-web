import { Routes } from '@angular/router';
import { Login } from './features/login/login';
import { RentalPlanList } from './features/rental-plan/rental-plan-list/rental-plan-list';
import { Layout } from './layout/layout/layout';
import { authGuard } from './core/guards/auth-guard';
import { CompanyList } from './features/company/company-list/company-list';
import { VehicleList } from './features/vehicle/vehicle-list/vehicle-list';

export const routes: Routes = [
  { path: 'login', component: Login },
  {
    path: '',
    component: Layout,
    canActivate: [authGuard],
    children: [
      { path: 'vehicles', component: VehicleList },
      { path: 'rental-plans', component: RentalPlanList },
      { path: 'companies', component: CompanyList }
    ]
  }
];