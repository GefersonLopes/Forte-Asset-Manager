import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ICompaniesRepository } from './repositories/companies.repository';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { Paginated } from '../../shared/dto/response.dto';

@Injectable()
export class CompaniesService {
  constructor(private readonly companiesRepo: ICompaniesRepository) {}

  async create(dto: CreateCompanyDto) {
    const exists = await this.companiesRepo.findByCnpj(dto.cnpj);
    if (exists) {
      throw new ConflictException('CNPJ já cadastrado.');
    }
    return this.companiesRepo.create(dto);
  }
  async findById(id: string) {
    const company = await this.companiesRepo.findById(id);
    if (!company) throw new NotFoundException('Empresa não encontrada.');
    return company;
  }

  async list(page: number, limit: number): Promise<Paginated<unknown>> {
    const { data, total } = await this.companiesRepo.list({ page, limit });
    return { data, total, page, limit };
  }

  async update(id: string, dto: UpdateCompanyDto) {
    await this.findById(id);
    if (dto.cnpj) {
      const c = await this.companiesRepo.findByCnpj(dto.cnpj);
      if (c && c.id !== id) throw new ConflictException('CNPJ já cadastrado.');
    }
    return this.companiesRepo.update(id, dto);
  }

  async delete(id: string) {
    await this.findById(id);
    await this.companiesRepo.delete(id);
  }
}
