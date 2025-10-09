import { Component } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { CompaniesApiService } from '../../core/services/companies-api.service';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { cnpjValidator } from '../../shared/utils/cnpj.validator';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';

@Component({
  standalone: true,
  selector: 'app-company-form-dialog',
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
  providers: [CompaniesApiService, provideNgxMask()],
  templateUrl: './company-form.dialog.html',
})
export class CompanyFormDialog {
  form;
  constructor(
    private fb: FormBuilder,
    private api: CompaniesApiService,
    private ref: MatDialogRef<CompanyFormDialog>,
  ) {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      cnpj: ['', [Validators.required, cnpjValidator()]],
    });
  }
  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.api
      .create(this.form.value as { name: string; cnpj: string })
      .subscribe({ next: () => this.ref.close(true) });
  }
}
