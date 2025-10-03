import { IsOptional, IsUUID } from 'class-validator';
import { PaginationDto } from 'src/shared/dto/pagination.dto';

export class EmployeesListQueryDto extends PaginationDto {
  @IsOptional()
  @IsUUID('4')
  companyId?: string;
}
