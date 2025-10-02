import { Employee } from '@prisma/client';

export interface IEmployeesRepository {
  create(data: {
    name: string;
    email: string;
    cpf: string;
    companyId: string;
  }): Promise<Employee>;
  findById(id: string): Promise<Employee | null>;
  findByEmail(email: string): Promise<Employee | null>;
  findByCpf(cpf: string): Promise<Employee | null>;
  list(params: {
    page: number;
    limit: number;
    companyId?: string;
  }): Promise<{ data: Employee[]; total: number }>;
  update(id: string, data: Partial<Employee>): Promise<Employee>;
  delete(id: string): Promise<void>;
}
