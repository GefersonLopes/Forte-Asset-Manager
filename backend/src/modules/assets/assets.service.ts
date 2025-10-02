import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { IAssetsRepository } from './repositories/assets.repository';
import {
  CreateAssetDto,
  AssetStatusDto,
  AssetTypeDto,
} from './dto/create-asset.dto';
import { UpdateAssetDto } from './dto/update-asset.dto';
import { Paginated } from 'src/shared/dto/response.dto';
import { AssetStatus, AssetType } from '@prisma/client';
import { IEmployeesRepository } from '../employees/repositories/employees.repository';

const mapTypeDtoToPrisma = (t: AssetTypeDto): AssetType => {
  switch (t) {
    case AssetTypeDto.Notebook:
      return 'Notebook';
    case AssetTypeDto.Monitor:
      return 'Monitor';
    case AssetTypeDto.Celular:
      return 'Celular';
  }
};
const mapStatusDtoToPrisma = (s: AssetStatusDto | undefined): AssetStatus => {
  if (!s || s === AssetStatusDto.Disponivel) return 'Disponivel';
  if (s === AssetStatusDto.EmUso) return 'EmUso';
  return 'EmManutencao';
};

@Injectable()
export class AssetsService {
  constructor(
    private readonly assetsRepo: IAssetsRepository,
    private readonly employeesRepo: IEmployeesRepository,
  ) {}

  async create(dto: CreateAssetDto) {
    const status = mapStatusDtoToPrisma(dto.status);
    const type = mapTypeDtoToPrisma(dto.type);

    if (dto.employeeId && status !== 'EmUso') {
      throw new UnprocessableEntityException(
        'Ao criar ativo já associado a um funcionário, o status deve ser "Em Uso".',
      );
    }

    if (dto.employeeId && type === 'Notebook') {
      const count = await this.assetsRepo.countEmployeeNotebooks(
        dto.employeeId,
      );
      if (count >= 1) {
        throw new ConflictException(
          'Funcionário já possui um Notebook em uso. Regra: máximo 1 Notebook por funcionário.',
        );
      }
    }

    return this.assetsRepo.create({
      name: dto.name,
      type,
      status,
      employeeId: dto.employeeId ?? null,
    });
  }

  async findById(id: string) {
    const asset = await this.assetsRepo.findById(id);
    if (!asset) throw new NotFoundException('Ativo não encontrado.');
    return asset;
  }

  async list(
    page: number,
    limit: number,
    type?: AssetTypeDto,
    status?: AssetStatusDto,
  ): Promise<Paginated<unknown>> {
    const t = type ? mapTypeDtoToPrisma(type) : undefined;
    const s = status ? mapStatusDtoToPrisma(status) : undefined;
    const { data, total } = await this.assetsRepo.list({
      page,
      limit,
      type: t,
      status: s,
    });
    return { data, total, page, limit };
  }

  async update(id: string, dto: UpdateAssetDto) {
    const current = await this.findById(id);

    if (
      dto.employeeId !== undefined &&
      dto.employeeId === null &&
      dto.status === AssetStatusDto.EmUso
    ) {
      throw new UnprocessableEntityException(
        'Não é possível definir status "Em Uso" com employeeId nulo.',
      );
    }

    if (
      dto.employeeId &&
      (dto.status === undefined || dto.status === AssetStatusDto.Disponivel)
    ) {
      throw new UnprocessableEntityException(
        'Ativo associado a funcionário não pode estar "Disponível".',
      );
    }

    const newType = dto.type ? mapTypeDtoToPrisma(dto.type) : current.type;
    const newStatus = dto.status
      ? mapStatusDtoToPrisma(dto.status)
      : current.status;
    const newEmployeeId = dto.employeeId ?? current.employeeId;

    if (newEmployeeId && newType === 'Notebook' && newStatus === 'EmUso') {
      const count = await this.assetsRepo.countEmployeeNotebooks(newEmployeeId);
      const alreadyHas =
        count >= 1 &&
        !(current.type === 'Notebook' && current.employeeId === newEmployeeId);
      if (alreadyHas) {
        throw new ConflictException(
          'Funcionário já possui um Notebook em uso. Regra: máximo 1 Notebook por funcionário.',
        );
      }
    }

    return this.assetsRepo.update(id, {
      name: dto.name ?? current.name,
      type: newType,
      status: newStatus,
      employeeId: dto.employeeId ?? current.employeeId,
    });
  }

  async delete(id: string) {
    await this.findById(id);
    await this.assetsRepo.delete(id);
  }

  async assign(assetId: string, employeeId: string) {
    const asset = await this.findById(assetId);
    if (asset.status !== 'Disponivel') {
      throw new UnprocessableEntityException(
        'Só é possível associar ativos com status "Disponível".',
      );
    }

    const employee = await this.employeesRepo.findById(employeeId);
    if (!employee) throw new NotFoundException('Funcionário não encontrado.');

    if (asset.type === 'Notebook') {
      const count = await this.assetsRepo.countEmployeeNotebooks(employeeId);
      if (count >= 1) {
        throw new ConflictException(
          'Funcionário já possui um Notebook em uso. Regra: máximo 1 Notebook por funcionário.',
        );
      }
    }

    return this.assetsRepo.update(assetId, {
      employeeId,
      status: 'EmUso',
    });
  }

  async unassign(assetId: string) {
    await this.findById(assetId);
    return this.assetsRepo.update(assetId, {
      employeeId: null,
      status: 'Disponivel',
    });
  }

  listByEmployee(employeeId: string) {
    return this.assetsRepo.listByEmployee(employeeId);
  }
}
