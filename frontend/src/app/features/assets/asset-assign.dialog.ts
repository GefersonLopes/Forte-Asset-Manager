import { Component, Inject, signal } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { AssetsApiService } from '../../core/services/assets-api.service';
import { Asset, AssetStatusLabel } from '../../shared/models';

@Component({
  standalone: true,
  selector: 'app-asset-assign-dialog',
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatSelectModule],
  template: `
    <h2 mat-dialog-title>Associar Ativo</h2>
    <mat-dialog-content class="grid gap-3">
      <label class="text-sm">Selecione um ativo disponível <input class="hidden" /></label>
      <mat-select [(value)]="selectedId" aria-label="Ativos disponíveis">
        @for (a of available(); track a.id) {
          <mat-option [value]="a.id"> {{ a.name }} — {{ a.type }} </mat-option>
        }
      </mat-select>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Cancelar</button>
      <button mat-flat-button color="primary" [disabled]="!selectedId" (click)="confirm()">
        Associar
      </button>
    </mat-dialog-actions>
  `,
})
export class AssetAssignDialog {
  available = signal<Asset[]>([]);
  selectedId: string | null = null;

  constructor(
    private api: AssetsApiService,
    private ref: MatDialogRef<AssetAssignDialog>,
    @Inject(MAT_DIALOG_DATA) public data: { employeeId: string },
  ) {
    this.api
      .list(1, 50, undefined, 'Disponível' as AssetStatusLabel)
      .subscribe((res) => this.available.set(res.data));
  }

  confirm() {
    if (!this.selectedId) return;
    this.api
      .assign(this.selectedId, this.data.employeeId)
      .subscribe({ next: () => this.ref.close(true) });
  }
}
