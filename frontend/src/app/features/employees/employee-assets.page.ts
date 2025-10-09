import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

import { EmployeesApiService } from '../../core/services/employees-api.service';
import { AssetsApiService } from '../../core/services/assets-api.service';
import { Asset, Employee } from '../../shared/models';
import { AssetAssignDialog } from '../assets/asset-assign.dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';

@Component({
  standalone: true,
  selector: 'app-employee-assets-page',
  imports: [
    CommonModule,
    MatButtonModule,
    MatDialogModule,
    MatIconModule,
    MatFormFieldModule,
    MatSelectModule,
  ],
  templateUrl: './employee-assets.page.html',
})
export class EmployeeAssetsPage {
  private route = inject(ActivatedRoute);
  private employeesApi = inject(EmployeesApiService);
  private assetsApi = inject(AssetsApiService);
  private dialog = inject(MatDialog);

  employee = signal<Employee | null>(null);
  assets = signal<Asset[]>([]);
  loading = signal<boolean>(false);

  constructor() {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.employeesApi.findById(id).subscribe((e) => this.employee.set(e));
    this.loadAssets();
  }

  loadAssets() {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.loading.set(true);
    this.employeesApi.assets(id).subscribe((list) => {
      this.assets.set(list);
      this.loading.set(false);
    });
  }

  openAssign() {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.dialog
      .open(AssetAssignDialog, { width: '640px', data: { employeeId: id } })
      .afterClosed()
      .subscribe((ok) => ok && this.loadAssets());
  }

  unassign(assetId: string) {
    this.assetsApi.unassign(assetId).subscribe(() => this.loadAssets());
  }

  initials(name?: string): string {
    if (!name) return '—';
    return name
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((n) => n[0]!.toUpperCase())
      .join('');
  }

  formatDate(iso?: string): string {
    if (!iso) return '—';
    return new Date(iso).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  }
}
