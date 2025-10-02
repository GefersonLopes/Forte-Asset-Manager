import { EmployeesService } from '../employees/employees.service';
import { IEmployeesRepository } from '../employees/repositories/employees.repository';

import { Employee } from '@prisma/client';

describe('EmployeesService', () => {
  let service: EmployeesService;
  let repo: jest.Mocked<IEmployeesRepository>;

  const now = new Date();
  const makeEmployee = (overrides: Partial<Employee> = {}): Employee => ({
    id: '1',
    name: 'Fulano',
    email: 'f@a.com',
    cpf: '000',
    companyId: 'c1',
    createdAt: now,
    updatedAt: now,
    ...overrides,
  });

  beforeEach(() => {
    repo = {
      create: jest.fn(),
      findById: jest.fn(),
      findByEmail: jest.fn(),
      findByCpf: jest.fn(),
      list: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    } as unknown as jest.Mocked<IEmployeesRepository>;

    service = new EmployeesService(repo);
  });

  it('deve criar quando email e cpf são únicos', async () => {
    repo.findByEmail.mockResolvedValue(null);
    repo.findByCpf.mockResolvedValue(null);

    repo.create.mockResolvedValue(
      makeEmployee({
        id: '1',
        name: 'Fulano',
        email: 'f@a.com',
        cpf: '000',
        companyId: 'c1',
      }),
    );

    const created = await service.create({
      name: 'Fulano',
      email: 'f@a.com',
      cpf: '000',
      companyId: 'c1',
    });

    expect(created.id).toBe('1');
  });

  it('deve bloquear email duplicado', async () => {
    repo.findByEmail.mockResolvedValue(
      makeEmployee({ id: 'x', email: 'x@a.com' }),
    );
    repo.findByCpf.mockResolvedValue(null);

    await expect(
      service.create({
        name: 'X',
        email: 'x@a.com',
        cpf: '1',
        companyId: 'c1',
      }),
    ).rejects.toThrow('Email já cadastrado.');
  });
});
