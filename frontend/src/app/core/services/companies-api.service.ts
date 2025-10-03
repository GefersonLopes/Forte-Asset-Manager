import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Company, Employee, Paginated } from '../../shared/models';
@Injectable({ providedIn: 'root' })
export class CompaniesApiService {
  constructor(private http: HttpClient) {}
  list(page = 1, limit = 10): Observable<Paginated<Company>> {
    return this.http.get<Paginated<Company>>(`/companies?page=${page}&limit=${limit}`);
  }
  create(body: Pick<Company, 'name' | 'cnpj'>): Observable<Company> {
    return this.http.post<Company>('/companies', body);
  }
  findById(id: string): Observable<Company> {
    return this.http.get<Company>(`/companies/${id}`);
  }
  update(id: string, body: Partial<Company>): Observable<Company> {
    return this.http.patch<Company>(`/companies/${id}`, body);
  }
  delete(id: string): Observable<void> {
    return this.http.delete<void>(`/companies/${id}`);
  }
  employees(companyId: string, page = 1, limit = 10): Observable<Paginated<Employee>> {
    return this.http.get<Paginated<Employee>>(
      `/employees?companyId=${companyId}&page=${page}&limit=${limit}`,
    );
  }
}
