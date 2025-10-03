import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { IEmployeesRepository } from './repositories/employees.repository';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { Paginated } from '../../shared/dto/response.dto';

@Injectable()
export class EmployeesService {
  constructor(private readonly employeesRepo: IEmployeesRepository) {}

  async create(dto: CreateEmployeeDto) {
    const [emailExists, cpfExists] = await Promise.all([
      this.employeesRepo.findByEmail(dto.email),
      this.employeesRepo.findByCpf(dto.cpf),
    ]);
    if (emailExists) throw new ConflictException('Email já cadastrado.');
    if (cpfExists) throw new ConflictException('CPF já cadastrado.');
    return this.employeesRepo.create(dto);
  }

  async findById(id: string) {
    const emp = await this.employeesRepo.findById(id);
    if (!emp) throw new NotFoundException('Funcionário não encontrado.');
    return emp;
  }

  async list(
    page: number,
    limit: number,
    companyId?: string,
  ): Promise<Paginated<unknown>> {
    const { data, total } = await this.employeesRepo.list({
      page,
      limit,
      companyId,
    });
    return { data, total, page, limit };
  }

  async update(id: string, dto: UpdateEmployeeDto) {
    await this.findById(id);
    if (dto.email) {
      const e = await this.employeesRepo.findByEmail(dto.email);
      if (e && e.id !== id) throw new ConflictException('Email já cadastrado.');
    }
    if (dto.cpf) {
      const c = await this.employeesRepo.findByCpf(dto.cpf);
      if (c && c.id !== id) throw new ConflictException('CPF já cadastrado.');
    }
    return this.employeesRepo.update(id, dto);
  }

  async delete(id: string) {
    await this.findById(id);
    await this.employeesRepo.delete(id);
  }
}
