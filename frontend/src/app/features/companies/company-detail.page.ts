import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CompaniesApiService } from '../../core/services/companies-api.service';
import { Company, Employee } from '../../shared/models';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { EmployeeFormDialog } from './employee-form.dialog';

@Component({
  standalone: true,
  selector: 'app-company-detail-page',
  imports: [CommonModule, RouterLink, MatButtonModule, MatDialogModule],
  template: `
    <h1 class="text-2xl font-semibold mb-2">{{ company()?.name }}</h1>
    <div class="text-sm text-gray-600 mb-6">CNPJ: {{ company()?.cnpj }}</div>

    <div class="flex items-center justify-between mb-2">
      <h2 class="text-xl font-semibold">Funcionários</h2>
      <button mat-flat-button color="primary" (click)="openCreateEmployee()">
        Adicionar Funcionário
      </button>
    </div>

    <div class="grid gap-3">
      @for (e of employees(); track e.id) {
        <div class="p-3 rounded border bg-white flex items-center justify-between">
          <div>
            <div class="font-medium">{{ e.name }}</div>
            <div class="text-sm text-gray-600">{{ e.email }}</div>
          </div>
          <a mat-stroked-button color="primary" [routerLink]="['/employees', e.id, 'assets']"
            >Gerenciar Ativos</a
          >
        </div>
      }
    </div>
  `,
})
export class CompanyDetailPage {
  private route = inject(ActivatedRoute);
  private api = inject(CompaniesApiService);
  private dialog = inject(MatDialog);

  company = signal<Company | null>(null);
  employees = signal<Employee[]>([]);

  constructor() {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.api.findById(id).subscribe((c) => this.company.set(c));
    this.loadEmployees(id);
  }

  loadEmployees(id: string) {
    this.api.employees(id, 1, 50).subscribe((r) => this.employees.set(r.data));
  }
  openCreateEmployee() {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.dialog
      .open(EmployeeFormDialog, { width: '520px', data: { companyId: id } })
      .afterClosed()
      .subscribe((ok) => ok && this.loadEmployees(id));
  }
}
