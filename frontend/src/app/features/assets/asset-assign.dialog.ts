import { Component, Inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';

import { AssetsApiService } from '../../core/services/assets-api.service';
import { Asset, AssetStatusLabel } from '../../shared/models';

@Component({
  standalone: true,
  selector: 'app-asset-assign-dialog',
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatSelectModule,
    MatFormFieldModule,
    MatIconModule,
  ],
  templateUrl: './asset-assign.dialog.html',
})
export class AssetAssignDialog {
  available = signal<Asset[]>([]);
  selectedId: string | null = null;
  loading = signal<boolean>(false);

  constructor(
    private api: AssetsApiService,
    private ref: MatDialogRef<AssetAssignDialog>,
    @Inject(MAT_DIALOG_DATA) public data: { employeeId: string },
  ) {
    this.loading.set(true);
    this.api.list(1, 50, undefined, 'Disponível' as AssetStatusLabel).subscribe((res) => {
      this.available.set(res.data);
      this.loading.set(false);
    });
  }

  confirm() {
    if (!this.selectedId) return;
    this.loading.set(true);
    this.api.assign(this.selectedId, this.data.employeeId).subscribe({
      next: () => this.ref.close(true),
      error: () => this.loading.set(false),
    });
  }
}
