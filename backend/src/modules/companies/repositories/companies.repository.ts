import { Company } from '@prisma/client';

export interface ICompaniesRepository {
  create(data: { name: string; cnpj: string }): Promise<Company>;
  findById(id: string): Promise<Company | null>;
  findByCnpj(cnpj: string): Promise<Company | null>;
  list(params: {
    page: number;
    limit: number;
  }): Promise<{ data: Company[]; total: number }>;
  update(id: string, data: { name?: string; cnpj?: string }): Promise<Company>;
  delete(id: string): Promise<void>;
}
