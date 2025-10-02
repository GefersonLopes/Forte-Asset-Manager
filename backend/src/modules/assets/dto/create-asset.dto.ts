import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export enum AssetTypeDto {
  Notebook = 'Notebook',
  Monitor = 'Monitor',
  Celular = 'Celular',
}
export enum AssetStatusDto {
  Disponivel = 'Disponível',
  EmUso = 'Em Uso',
  EmManutencao = 'Em Manutenção',
}

export class CreateAssetDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({ enum: AssetTypeDto })
  @IsEnum(AssetTypeDto)
  type!: AssetTypeDto;

  @ApiPropertyOptional({
    enum: AssetStatusDto,
    default: AssetStatusDto.Disponivel,
  })
  @IsOptional()
  @IsEnum(AssetStatusDto)
  status?: AssetStatusDto;

  @ApiPropertyOptional({
    description: 'ID do funcionário (UUID) para associação inicial',
  })
  @IsOptional()
  @IsUUID()
  employeeId?: string;
}
