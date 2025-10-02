import { AssetsService } from '../assets/assets.service';
import { IAssetsRepository } from '../assets/repositories/assets.repository';
import { IEmployeesRepository } from '../employees/repositories/employees.repository';
import { AssetStatusDto, AssetTypeDto } from '../assets/dto/create-asset.dto';

import { Asset, Employee, AssetStatus, AssetType } from '@prisma/client';

describe('AssetsService', () => {
  let assetsRepo: jest.Mocked<IAssetsRepository>;
  let empRepo: jest.Mocked<IEmployeesRepository>;
  let service: AssetsService;

  const now = new Date();
  const makeAsset = (overrides: Partial<Asset> = {}): Asset => ({
    id: 'a1',
    name: 'NB',
    type: AssetType.Notebook,
    status: AssetStatus.Disponivel,
    employeeId: null,
    createdAt: now,
    updatedAt: now,
    ...overrides,
  });

  const makeEmployee = (overrides: Partial<Employee> = {}): Employee => ({
    id: 'e1',
    name: 'John',
    email: 'john@example.com',
    cpf: '12345678900',
    companyId: 'c1',
    createdAt: now,
    updatedAt: now,
    ...overrides,
  });

  beforeEach(() => {
    assetsRepo = {
      create: jest.fn(),
      findById: jest.fn(),
      list: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      countEmployeeNotebooks: jest.fn(),
      listByEmployee: jest.fn(),
    } as unknown as jest.Mocked<IAssetsRepository>;

    empRepo = {
      create: jest.fn(),
      findById: jest.fn(),
      findByEmail: jest.fn(),
      findByCpf: jest.fn(),
      list: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    } as unknown as jest.Mocked<IEmployeesRepository>;

    service = new AssetsService(assetsRepo, empRepo);
  });

  it('impede criar asset associado com status diferente de Em Uso', async () => {
    await expect(
      service.create({
        name: 'NB1',
        type: AssetTypeDto.Notebook,
        status: AssetStatusDto.Disponivel,
        employeeId: 'e1',
      }),
    ).rejects.toThrow('Ao criar ativo já associado');
  });

  it('impede segundo notebook para funcionário', async () => {
    assetsRepo.countEmployeeNotebooks.mockResolvedValue(1);
    await expect(
      service.create({
        name: 'NB2',
        type: AssetTypeDto.Notebook,
        status: AssetStatusDto.EmUso,
        employeeId: 'e1',
      }),
    ).rejects.toThrow('máximo 1 Notebook');
  });

  it('assign: só permite quando Disponível', async () => {
    assetsRepo.findById.mockResolvedValue(
      makeAsset({ status: AssetStatus.EmUso, type: AssetType.Notebook }),
    );
    await expect(service.assign('a1', 'e1')).rejects.toThrow(
      'Só é possível associar ativos',
    );
  });

  it('assign: aplica regra de 1 notebook', async () => {
    assetsRepo.findById.mockResolvedValue(
      makeAsset({ status: AssetStatus.Disponivel, type: AssetType.Notebook }),
    );
    empRepo.findById.mockResolvedValue(makeEmployee({ id: 'e1' }));
    assetsRepo.countEmployeeNotebooks.mockResolvedValue(1);

    await expect(service.assign('a1', 'e1')).rejects.toThrow(
      'máximo 1 Notebook',
    );
  });
});
