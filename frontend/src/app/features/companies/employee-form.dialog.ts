import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { EmployeesApiService } from '../../core/services/employees-api.service';

@Component({
  standalone: true,
  selector: 'app-employee-form-dialog',
  imports: [
    MatDialogModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  template: `
    <h2 mat-dialog-title>Novo Funcionário</h2>
    <form [formGroup]="form" (ngSubmit)="submit()" class="grid gap-4 p-4">
      <mat-form-field appearance="outline">
        <mat-label>Nome</mat-label>
        <input matInput formControlName="name" required />
        @if (form.get('name')?.invalid) {
          <mat-error>Informe o nome</mat-error>
        }
      </mat-form-field>

      <mat-form-field appearance="outline">
        <mat-label>Email</mat-label>
        <input matInput formControlName="email" required type="email" />
        @if (form.get('email')?.invalid) {
          <mat-error>Informe um email válido</mat-error>
        }
      </mat-form-field>

      <mat-form-field appearance="outline">
        <mat-label>CPF</mat-label>
        <input matInput formControlName="cpf" required />
        @if (form.get('cpf')?.invalid) {
          <mat-error>Informe o CPF</mat-error>
        }
      </mat-form-field>

      <div class="flex justify-end gap-2">
        <button mat-button mat-dialog-close>Cancelar</button>
        <button mat-flat-button color="primary" [disabled]="form.invalid">Salvar</button>
      </div>
    </form>
  `,
})
export class EmployeeFormDialog {
  form;

  constructor(
    private fb: FormBuilder,
    private api: EmployeesApiService,
    private ref: MatDialogRef<EmployeeFormDialog>,
    @Inject(MAT_DIALOG_DATA) public data: { companyId: string },
  ) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      cpf: ['', Validators.required],
    });
  }
  submit() {
    if (this.form.invalid) return;
    const body = { ...this.form.value, companyId: this.data.companyId } as {
      name: string;
      email: string;
      cpf: string;
      companyId: string;
    };
    this.api.create(body).subscribe({ next: () => this.ref.close(true) });
  }
}
