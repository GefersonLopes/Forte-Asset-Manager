import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Asset, Employee } from '../../shared/models';
@Injectable({ providedIn: 'root' })
export class EmployeesApiService {
  constructor(private http: HttpClient) {}
  create(body: Pick<Employee, 'name' | 'email' | 'cpf' | 'companyId'>): Observable<Employee> {
    return this.http.post<Employee>('/employees', body);
  }
  findById(id: string): Observable<Employee> {
    return this.http.get<Employee>(`/employees/${id}`);
  }
  update(id: string, body: Partial<Employee>): Observable<Employee> {
    return this.http.patch<Employee>(`/employees/${id}`, body);
  }
  delete(id: string): Observable<void> {
    return this.http.delete<void>(`/employees/${id}`);
  }
  assets(id: string): Observable<Asset[]> {
    return this.http.get<Asset[]>(`/employees/${id}/assets`);
  }
}
