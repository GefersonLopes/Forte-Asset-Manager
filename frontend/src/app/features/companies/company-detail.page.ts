import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CompaniesApiService } from '../../core/services/companies-api.service';
import { Company, Employee } from '../../shared/models';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { EmployeeFormDialog } from './employee-form.dialog';
import { MatIconModule } from '@angular/material/icon';

@Component({
  standalone: true,
  selector: 'app-company-detail-page',
  imports: [CommonModule, RouterLink, MatButtonModule, MatDialogModule, MatIconModule],
  templateUrl: 'company-detail.page.html',
})
export class CompanyDetailPage {
  private route = inject(ActivatedRoute);
  private api = inject(CompaniesApiService);
  private dialog = inject(MatDialog);

  company = signal<Company | null>(null);
  employees = signal<Employee[]>([]);

  total = signal<number>(0);
  page = signal<number>(1);
  limit = signal<number>(10);

  totalPages = computed(() => Math.max(1, Math.ceil(this.total() / this.limit())));
  startIndex = computed(() => (this.page() - 1) * this.limit());
  endIndex = computed(() => Math.min(this.startIndex() + this.limit(), this.total()));

  query = signal<string>('');
  filtered = computed(() => {
    const q = this.query().toLowerCase().trim();
    if (!q) return this.employees();
    return this.employees().filter(
      (e) => (e.name ?? '').toLowerCase().includes(q) || (e.email ?? '').toLowerCase().includes(q),
    );
  });

  private companyId!: string;

  constructor() {
    this.companyId = this.route.snapshot.paramMap.get('id')!;
    this.api.findById(this.companyId).subscribe((c) => this.company.set(c));
    this.fetch();
  }

  fetch() {
    this.api.employees(this.companyId, this.page(), this.limit()).subscribe((r) => {
      this.employees.set(r.data);
      this.total.set(r.total);
    });
  }

  goTo(p: number) {
    if (p < 1 || p > this.totalPages()) return;
    this.page.set(p);
    this.fetch();
  }
  nextPage() {
    if (this.page() < this.totalPages()) {
      this.page.update((v) => v + 1);
      this.fetch();
    }
  }
  prevPage() {
    if (this.page() > 1) {
      this.page.update((v) => v - 1);
      this.fetch();
    }
  }
  setLimit(value: string | number) {
    const size = Number(value) || this.limit();
    this.limit.set(size);
    this.page.set(1);
    this.fetch();
  }

  newThisMonth(): number {
    const now = new Date();
    const y = now.getFullYear();
    const m = now.getMonth();
    return this.employees().filter((e) => {
      const d = new Date(e.createdAt || '');
      return d.getFullYear() === y && d.getMonth() === m;
    }).length;
  }
  formatDate(iso: string): string {
    return new Date(iso).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
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

  openCreateEmployee() {
    const id = this.companyId;
    this.dialog
      .open(EmployeeFormDialog, { width: '520px', data: { companyId: id } })
      .afterClosed()
      .subscribe((ok) => ok && this.fetch());
  }
}
