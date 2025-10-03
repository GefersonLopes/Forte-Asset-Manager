import { Component } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { CompaniesApiService } from '../../core/services/companies-api.service';

@Component({
  standalone: true,
  selector: 'app-company-form-dialog',
  imports: [
    MatDialogModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  template: `
    <h2 mat-dialog-title>Nova Empresa</h2>
    <form [formGroup]="form" (ngSubmit)="submit()" class="grid gap-4 p-4">
      <mat-form-field appearance="outline">
        <mat-label>Nome</mat-label>
        <input matInput formControlName="name" required />
        @if (form.get('name')?.invalid) {
          <mat-error>Informe o nome</mat-error>
        }
      </mat-form-field>

      <mat-form-field appearance="outline">
        <mat-label>CNPJ</mat-label>
        <input matInput formControlName="cnpj" required />
        @if (form.get('cnpj')?.invalid) {
          <mat-error>Informe o CNPJ</mat-error>
        }
      </mat-form-field>

      <div class="flex justify-end gap-2">
        <button mat-button mat-dialog-close>Cancelar</button>
        <button mat-flat-button color="primary" [disabled]="form.invalid || form.pending">
          Salvar
        </button>
      </div>
    </form>
  `,
})
export class CompanyFormDialog {
  form;
  constructor(
    private fb: FormBuilder,
    private api: CompaniesApiService,
    private ref: MatDialogRef<CompanyFormDialog>,
  ) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      cnpj: ['', Validators.required],
    });
  }
  submit() {
    if (this.form.invalid) return;
    this.api
      .create(this.form.value as { name: string; cnpj: string })
      .subscribe({ next: () => this.ref.close(true) });
  }
}
