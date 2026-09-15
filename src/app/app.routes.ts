import { Routes } from '@angular/router';
import { Login } from './features/login/login';
import { Register } from './features/register/register';
import { Layout } from './layout/layout/layout';
import { authGuard } from './core/guards/auth-guard';
import { Dashboard } from './features/dashboard/dashboard/dashboard';

import { VehicleList } from './features/vehicle/vehicle-list/vehicle-list';
import { VehicleForm } from './features/vehicle/vehicle-form/vehicle-form';
import { VehicleDetail } from './features/vehicle/vehicle-detail/vehicle-detail';

import { ContractList } from './features/contract/contract-list/contract-list';
import { ContractForm } from './features/contract/contract-form/contract-form';
import { ContractDetail } from './features/contract/contract-detail/contract-detail';

import { TenantList } from './features/tenant/tenant-list/tenant-list';
import { TenantForm } from './features/tenant/tenant-form/tenant-form';
import { TenantDetail } from './features/tenant/tenant-detail/tenant-detail';
import { TenantEditForm } from './features/tenant/tenant-edit-form/tenant-edit-form';

import { CompanyList } from './features/company/company-list/company-list';
import { CompanyForm } from './features/company/company-form/company-form';

import { RentalPlanList } from './features/rental-plan/rental-plan-list/rental-plan-list';
import { RentalPlanForm } from './features/rental-plan/rental-plan-form/rental-plan-form';

import { IncidentReportList } from './features/incident-report/incident-report-list/incident-report-list';
import { IncidentReportForm } from './features/incident-report/incident-report-form/incident-report-form';
import { IncidentReportDetail } from './features/incident-report/incident-report-detail/incident-report-detail';

export const routes: Routes = [
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  {
    path: '',
    component: Layout,
    canActivate: [authGuard],
    children: [
      { path: 'dashboard', component: Dashboard },

      { path: 'vehicles', component: VehicleList },
      { path: 'vehicles/new', component: VehicleForm },
      { path: 'vehicles/:id', component: VehicleDetail },

      { path: 'contracts', component: ContractList },
      { path: 'contracts/new', component: ContractForm },
      { path: 'contracts/:id', component: ContractDetail },

      { path: 'clients', component: TenantList },
      { path: 'clients/new', component: TenantForm },
      { path: 'clients/:id/edit', component: TenantEditForm },
      { path: 'clients/:id', component: TenantDetail },

      { path: 'companies', component: CompanyList },
      { path: 'companies/new', component: CompanyForm },
      { path: 'companies/:id/edit', component: CompanyForm },

      { path: 'rental-plans', component: RentalPlanList },
      { path: 'rental-plans/new', component: RentalPlanForm },
      { path: 'rental-plans/:id/edit', component: RentalPlanForm },

      { path: 'incident-reports', component: IncidentReportList },
      { path: 'incident-reports/new', component: IncidentReportForm },
      { path: 'incident-reports/:id', component: IncidentReportDetail }
    ]
  }
];