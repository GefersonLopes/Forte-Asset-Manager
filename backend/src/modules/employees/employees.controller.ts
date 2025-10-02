import {
  Controller,
  Post,
  Body,
  Get,
  Query,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import { EmployeesService } from './employees.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { PaginationDto } from 'src/shared/dto/pagination.dto';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { AssetsService } from '../assets/assets.service';

@ApiTags('employees')
@Controller('employees')
export class EmployeesController {
  constructor(
    private readonly service: EmployeesService,
    private readonly assetsService: AssetsService,
  ) {}

  @Post()
  create(@Body() dto: CreateEmployeeDto) {
    return this.service.create(dto);
  }

  @Get()
  @ApiQuery({ name: 'companyId', required: false })
  list(
    @Query() { page, limit }: PaginationDto,
    @Query('companyId') companyId?: string,
  ) {
    return this.service.list(page, limit, companyId);
  }

  @Get(':id/assets')
  listAssets(@Param('id') id: string) {
    return this.assetsService.listByEmployee(id);
  }

  @Get(':id')
  find(@Param('id') id: string) {
    return this.service.findById(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateEmployeeDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.delete(id);
  }
}
