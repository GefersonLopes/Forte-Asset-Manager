export interface Paginated<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}
export interface Company {
  id: string;
  name: string;
  cnpj: string;
  createdAt?: string;
  updatedAt?: string;
}
export interface Employee {
  id: string;
  name: string;
  email: string;
  cpf: string;
  companyId: string;
  createdAt?: string;
}
export type AssetType = 'Notebook' | 'Monitor' | 'Celular';
export type AssetStatusLabel = 'Disponível' | 'Em Uso' | 'Em Manutenção';
export type AssetStatus = 'Disponivel' | 'EmUso' | 'EmManutencao';

export interface Asset {
  id: string;
  name: string;
  type: AssetType;
  status: AssetStatus | AssetStatusLabel;
  employeeId?: string | null;
}
