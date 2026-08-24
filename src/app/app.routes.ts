import { Routes } from '@angular/router';
import { Login } from './features/login/login';
import { RentalPlanList } from './features/rental-plan/rental-plan-list/rental-plan-list';
import { Layout } from './layout/layout/layout';
import { authGuard } from './core/guards/auth-guard';
import { CompanyList } from './features/company/company-list/company-list';
import { VehicleList } from './features/vehicle/vehicle-list/vehicle-list';
import { VehicleForm } from './features/vehicle/vehicle-form/vehicle-form';
import { VehicleDetail } from './features/vehicle/vehicle-detail/vehicle-detail';
import { TenantList } from './features/tenant/tenant-list/tenant-list';
import { TenantDetail } from './features/tenant/tenant-detail/tenant-detail';
import { ContractList } from './features/contract/contract-list/contract-list';
import { ContractForm } from './features/contract/contract-form/contract-form';
import { ContractDetail } from './features/contract/contract-detail/contract-detail';
import { Dashboard } from './features/dashboard/dashboard/dashboard';
import { IncidentReportList } from './features/incident-report/incident-report-list/incident-report-list';
import { IncidentReportDetail } from './features/incident-report/incident-report-detail/incident-report-detail';

export const routes: Routes = [
  { path: 'login', component: Login },
  {
    path: '',
    component: Layout,
    canActivate: [authGuard],
    children: [
      { path: 'vehicles', component: VehicleList },
      { path: 'vehicles/new', component: VehicleForm },
      { path: 'vehicles/:id', component: VehicleDetail },
      { path: 'rental-plans', component: RentalPlanList },
      { path: 'companies', component: CompanyList },
      { path: 'clients', component: TenantList },
      { path: 'clients/:id', component: TenantDetail },
      { path: 'contracts', component: ContractList },
      { path: 'contracts/new', component: ContractForm },
      { path: 'contracts/:id', component: ContractDetail },
      { path: 'dashboard', component: Dashboard },
      { path: 'incident-reports', component: IncidentReportList },
      { path: 'incident-reports/:id', component: IncidentReportDetail }
    ]
  }
];