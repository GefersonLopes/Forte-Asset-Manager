import { Routes } from '@angular/router';
export const routes: Routes = [
  { path: '', redirectTo: 'companies', pathMatch: 'full' },
  {
    path: 'companies',
    loadComponent: () =>
      import('../features/companies/companies-list.page').then((m) => m.CompaniesListPage),
  },
  {
    path: 'companies/:id',
    loadComponent: () =>
      import('../features/companies/company-detail.page').then((m) => m.CompanyDetailPage),
  },
  {
    path: 'employees/:id/assets',
    loadComponent: () =>
      import('../features/employees/employee-assets.page').then((m) => m.EmployeeAssetsPage),
  },
  { path: '**', redirectTo: 'companies' },
];
