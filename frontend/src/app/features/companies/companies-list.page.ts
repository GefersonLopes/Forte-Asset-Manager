import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CompaniesApiService } from '../../core/services/companies-api.service';
import { Company } from '../../shared/models';
import { CompanyFormDialog } from './company-form.dialog';

@Component({
  standalone: true,
  selector: 'app-companies-list-page',
  imports: [
    CommonModule,
    RouterLink,
    MatTableModule,
    MatButtonModule,
    MatDialogModule,
  ],
  template: `
    <div class="flex items-center justify-between mb-4">
      <h1 class="text-2xl font-semibold">Empresas</h1>
      <button mat-flat-button color="primary" (click)="openCreate()">Nova Empresa</button>
    </div>

    <div class="overflow-auto">
      <table mat-table [dataSource]="companies()" class="min-w-full">
        <ng-container matColumnDef="name">
          <th mat-header-cell *matHeaderCellDef>Nome</th>
          <td mat-cell *matCellDef="let c">{{ c.name }}</td>
        </ng-container>
        <ng-container matColumnDef="cnpj">
          <th mat-header-cell *matHeaderCellDef>CNPJ</th>
          <td mat-cell *matCellDef="let c">{{ c.cnpj }}</td>
        </ng-container>
        <ng-container matColumnDef="actions">
          <th mat-header-cell *matHeaderCellDef class="w-40">Ações</th>
          <td mat-cell *matCellDef="let c">
            <a mat-stroked-button color="primary" [routerLink]="['/companies', c.id]"
              >Ver detalhes</a
            >
          </td>
        </ng-container>

        <tr mat-header-row *matHeaderRowDef="displayed"></tr>
        <tr mat-row *matRowDef="let r; columns: displayed"></tr>
      </table>
    </div>
  `,
})
export class CompaniesListPage {
  private api = inject(CompaniesApiService);
  private dialog = inject(MatDialog);

  companies = signal<Company[]>([]);
  displayed = ['name', 'cnpj', 'actions'];

  constructor() {
    this.load();
  }
  load() {
    this.api.list(1, 50).subscribe((r) => this.companies.set(r.data));
  }
  openCreate() {
    this.dialog
      .open(CompanyFormDialog, { width: '520px' })
      .afterClosed()
      .subscribe((ok) => ok && this.load());
  }
}
