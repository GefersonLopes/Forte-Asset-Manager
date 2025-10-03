import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { EmployeesApiService } from '../../core/services/employees-api.service';
import { AssetsApiService } from '../../core/services/assets-api.service';
import { Asset, Employee } from '../../shared/models';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AssetAssignDialog } from '../assets/asset-assign.dialog';

@Component({
  standalone: true,
  selector: 'app-employee-assets-page',
  imports: [CommonModule, MatButtonModule, MatDialogModule],
  template: `
    <h1 class="text-2xl font-semibold mb-2">Ativos do Funcionário</h1>

    @if (employee()) {
      <section class="mb-4">
        <div class="p-4 rounded border bg-white grid gap-1">
          <div class="font-medium">{{ employee()?.name }}</div>
          <div class="text-sm text-gray-600">{{ employee()?.email }}</div>
        </div>
      </section>
    }

    <div class="flex items-center justify-between mb-2">
      <h2 class="text-xl font-semibold">Ativos Associados</h2>
      <button mat-flat-button color="primary" (click)="openAssign()">Associar Ativo</button>
    </div>

    <div class="grid gap-3 md:grid-cols-2">
      @for (a of assets(); track a.id) {
        <div class="p-4 bg-white rounded border">
          <div class="font-medium">{{ a.name }}</div>
          <div class="text-sm text-gray-600">Tipo: {{ a.type }} • Status: {{ a.status }}</div>
          <div class="mt-2">
            <button mat-stroked-button color="warn" (click)="unassign(a.id)">Desassociar</button>
          </div>
        </div>
      }
    </div>
  `,
})
export class EmployeeAssetsPage {
  private route = inject(ActivatedRoute);
  private employeesApi = inject(EmployeesApiService);
  private assetsApi = inject(AssetsApiService);
  private dialog = inject(MatDialog);

  employee = signal<Employee | null>(null);
  assets = signal<Asset[]>([]);

  constructor() {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.employeesApi.findById(id).subscribe((e) => this.employee.set(e));
    this.loadAssets();
  }

  loadAssets() {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.employeesApi.assets(id).subscribe((list) => this.assets.set(list));
  }
  openAssign() {
    const id = this.route.snapshot.paramMap.get('id')!;
    const ref = this.dialog.open(AssetAssignDialog, { width: '640px', data: { employeeId: id } });
    ref.afterClosed().subscribe((ok) => ok && this.loadAssets());
  }
  unassign(assetId: string) {
    this.assetsApi.unassign(assetId).subscribe(() => this.loadAssets());
  }
}
