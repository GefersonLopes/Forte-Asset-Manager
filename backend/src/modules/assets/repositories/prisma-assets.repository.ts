import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { IAssetsRepository } from './assets.repository';
import { Asset, AssetStatus, AssetType } from '@prisma/client';

@Injectable()
export class PrismaAssetsRepository implements IAssetsRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(data: {
    name: string;
    type: AssetType;
    status: AssetStatus;
    employeeId?: string | null;
  }): Promise<Asset> {
    return this.prisma.asset.create({ data });
  }

  findById(id: string) {
    return this.prisma.asset.findUnique({ where: { id } });
  }

  async list(params: {
    page: number;
    limit: number;
    type?: AssetType;
    status?: AssetStatus;
  }) {
    const { page, limit, type, status } = params;
    const where: Record<string, unknown> = {};
    if (type) where.type = type;
    if (status) where.status = status;
    const [data, total] = await this.prisma.$transaction([
      this.prisma.asset.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.asset.count({ where }),
    ]);
    return { data, total };
  }

  update(id: string, data: Partial<Asset>) {
    return this.prisma.asset.update({ where: { id }, data });
  }

  async delete(id: string) {
    await this.prisma.asset.delete({ where: { id } });
  }

  countEmployeeNotebooks(employeeId: string) {
    return this.prisma.asset.count({
      where: { employeeId, type: 'Notebook', status: 'EmUso' },
    });
  }

  listByEmployee(employeeId: string) {
    return this.prisma.asset.findMany({ where: { employeeId } });
  }
}
