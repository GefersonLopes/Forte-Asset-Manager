import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { IEmployeesRepository } from './employees.repository';
import { Employee } from '@prisma/client';

@Injectable()
export class PrismaEmployeesRepository implements IEmployeesRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(data: {
    name: string;
    email: string;
    cpf: string;
    companyId: string;
  }): Promise<Employee> {
    return this.prisma.employee.create({ data });
  }

  findById(id: string) {
    return this.prisma.employee.findUnique({ where: { id } });
  }

  findByEmail(email: string) {
    return this.prisma.employee.findUnique({ where: { email } });
  }

  findByCpf(cpf: string) {
    return this.prisma.employee.findUnique({ where: { cpf } });
  }

  async list(params: { page: number; limit: number; companyId?: string }) {
    const { page, limit, companyId } = params;
    const where = companyId ? { companyId } : {};
    const [data, total] = await this.prisma.$transaction([
      this.prisma.employee.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.employee.count({ where }),
    ]);
    return { data, total };
  }

  update(id: string, data: Partial<Employee>) {
    return this.prisma.employee.update({ where: { id }, data });
  }

  async delete(id: string) {
    await this.prisma.employee.delete({ where: { id } });
  }
}
