import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

import { CompaniesApiService } from '../../core/services/companies-api.service';
import { Company } from '../../shared/models';
import { CompanyFormDialog } from './company-form.dialog';

@Component({
  standalone: true,
  selector: 'app-companies-list-page',
  imports: [CommonModule, RouterLink, MatButtonModule, MatDialogModule, MatIconModule],
  templateUrl: './companies-list.page.html',
})
export class CompaniesListPage {
  private api = inject(CompaniesApiService);
  private dialog = inject(MatDialog);

  companies = signal<Company[]>([]);
  total = signal<number>(0);

  page = signal<number>(1);
  limit = signal<number>(10);
  totalPages = computed(() => Math.max(1, Math.ceil(this.total() / this.limit())));
  startIndex = computed(() => (this.page() - 1) * this.limit());
  endIndex = computed(() => Math.min(this.startIndex() + this.limit(), this.total()));

  query = signal<string>('');
  filtered = computed(() => {
    const q = this.query().toLowerCase().trim();
    if (!q) return this.companies();
    return this.companies().filter(
      (c) => (c.name ?? '').toLowerCase().includes(q) || (c.cnpj ?? '').toLowerCase().includes(q),
    );
  });

  constructor() {
    this.fetch();
  }

  fetch() {
    this.api.list(this.page(), this.limit()).subscribe((r) => {
      this.companies.set(r.data);
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
    return this.companies().filter((c) => {
      const d = new Date(c.createdAt || '');
      return d.getFullYear() === y && d.getMonth() === m;
    }).length;
  }
  formatDate(iso?: string): string {
    if (!iso) return '—';
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

  openCreate() {
    this.dialog
      .open(CompanyFormDialog, { width: '520px' })
      .afterClosed()
      .subscribe((ok) => ok && this.fetch());
  }
}
