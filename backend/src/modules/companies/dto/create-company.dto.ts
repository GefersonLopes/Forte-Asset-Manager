import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCompanyDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({ description: 'CNPJ da empresa' })
  @IsString()
  @IsNotEmpty()
  cnpj!: string;
}
