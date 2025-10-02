import { Asset, AssetStatus, AssetType } from '@prisma/client';

export interface IAssetsRepository {
  create(data: {
    name: string;
    type: AssetType;
    status: AssetStatus;
    employeeId?: string | null;
  }): Promise<Asset>;
  findById(id: string): Promise<Asset | null>;
  list(params: {
    page: number;
    limit: number;
    type?: AssetType;
    status?: AssetStatus;
  }): Promise<{ data: Asset[]; total: number }>;
  update(id: string, data: Partial<Asset>): Promise<Asset>;
  delete(id: string): Promise<void>;
  countEmployeeNotebooks(employeeId: string): Promise<number>;
  listByEmployee(employeeId: string): Promise<Asset[]>;
}
