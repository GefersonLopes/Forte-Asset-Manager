import { IsOptional } from 'class-validator';
import { PaginationDto } from 'src/shared/dto/pagination.dto';

export class AssetsListQueryDto extends PaginationDto {
  @IsOptional()
  type?: string;

  @IsOptional()
  status?: string;
}
