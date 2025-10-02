import { CompaniesService } from '../companies/companies.service';
import { ICompaniesRepository } from '../companies/repositories/companies.repository';
import { Company } from '@prisma/client';

describe('CompaniesService', () => {
  let service: CompaniesService;
  let repo: jest.Mocked<ICompaniesRepository>;

  const now = new Date();
  const makeCompany = (overrides: Partial<Company> = {}): Company => ({
    id: '1',
    name: 'Forte',
    cnpj: '123',
    createdAt: now,
    updatedAt: now,
    ...overrides,
  });

  beforeEach(() => {
    repo = {
      create: jest.fn(),
      findById: jest.fn(),
      findByCnpj: jest.fn(),
      list: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    } as unknown as jest.Mocked<ICompaniesRepository>;

    service = new CompaniesService(repo);
  });

  it('deve criar empresa quando CNPJ não existe', async () => {
    repo.findByCnpj.mockResolvedValue(null);
    repo.create.mockResolvedValue(
      makeCompany({ id: '1', name: 'Forte', cnpj: '123' }),
    );

    const result = await service.create({ name: 'Forte', cnpj: '123' });

    expect(result.cnpj).toBe('123');

    expect(repo.create.mock.calls.length).toBeGreaterThan(0);
  });

  it('deve lançar conflito quando CNPJ existe', async () => {
    repo.findByCnpj.mockResolvedValue(makeCompany({ id: '1', cnpj: '1' }));

    await expect(service.create({ name: 'A', cnpj: '1' })).rejects.toThrow(
      'CNPJ já cadastrado.',
    );
  });
});
