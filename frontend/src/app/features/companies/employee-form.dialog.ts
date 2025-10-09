import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { EmployeesApiService } from '../../core/services/employees-api.service';
import { CommonModule } from '@angular/common';
import { emailStrictValidator } from '../../shared/utils/email-strict.validator';
import { cpfValidator } from '../../shared/utils/cpf.validator';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';

@Component({
  standalone: true,
  selector: 'app-employee-form-dialog',
  imports: [
    MatDialogModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    CommonModule,
    NgxMaskDirective,
  ],
  providers: [provideNgxMask()],
  templateUrl: './employee-form.dialog.html',
})
export class EmployeeFormDialog {
  form;

  constructor(
    private fb: FormBuilder,
    private api: EmployeesApiService,
    private ref: MatDialogRef<EmployeeFormDialog>,
    @Inject(MAT_DIALOG_DATA) public data: { companyId: string },
  ) {
    this.form = this.fb.nonNullable.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, emailStrictValidator()]],
      cpf: ['', [Validators.required, cpfValidator()]],
    });
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const raw = this.form.getRawValue();
    const body = {
      name: raw.name,
      email: raw.email,
      cpf: (raw.cpf ?? '').toString().replace(/\D/g, ''),
      companyId: this.data.companyId,
    };

    this.api.create(body).subscribe({
      next: () => {
        this.form.reset();
        this.ref.close(true);
      },
      error: () => {
        this.form.reset();
        this.ref.close(false);
      },
    });
  }
}
