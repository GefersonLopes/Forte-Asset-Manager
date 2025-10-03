import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';
import { ICompaniesRepository } from './companies.repository';
import { Company } from '@prisma/client';

@Injectable()
export class PrismaCompaniesRepository implements ICompaniesRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(data: { name: string; cnpj: string }): Promise<Company> {
    return this.prisma.company.create({ data });
  }

  findById(id: string) {
    return this.prisma.company.findUnique({ where: { id } });
  }

  findByCnpj(cnpj: string) {
    return this.prisma.company.findUnique({ where: { cnpj } });
  }

  async list(params: { page: number; limit: number }) {
    const { page, limit } = params;
    const [data, total] = await this.prisma.$transaction([
      this.prisma.company.findMany({
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.company.count(),
    ]);
    return { data, total };
  }

  update(id: string, data: { name?: string; cnpj?: string }) {
    return this.prisma.company.update({ where: { id }, data });
  }

  async delete(id: string) {
    await this.prisma.company.delete({ where: { id } });
  }
}
