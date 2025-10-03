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
import { AssetsService } from './assets.service';
import {
  CreateAssetDto,
  AssetStatusDto,
  AssetTypeDto,
} from './dto/create-asset.dto';
import { UpdateAssetDto } from './dto/update-asset.dto';
import { ApiBody, ApiQuery, ApiTags } from '@nestjs/swagger';
import { AssetsListQueryDto } from './dto/list-asset.dto';

@ApiTags('assets')
@Controller('assets')
export class AssetsController {
  constructor(private readonly service: AssetsService) {}

  @Post()
  create(@Body() dto: CreateAssetDto) {
    return this.service.create(dto);
  }

  @Get()
  @ApiQuery({ name: 'type', enum: AssetTypeDto, required: false })
  @ApiQuery({ name: 'status', enum: AssetStatusDto, required: false })
  list(
    @Query() { page, limit }: AssetsListQueryDto,
    @Query('type') type?: AssetTypeDto,
    @Query('status') status?: AssetStatusDto,
  ) {
    return this.service.list(page, limit, type, status);
  }

  @Get(':id')
  find(@Param('id') id: string) {
    return this.service.findById(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateAssetDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.delete(id);
  }

  @Post(':id/assign')
  @ApiBody({
    schema: { properties: { employeeId: { type: 'string', format: 'uuid' } } },
  })
  assign(@Param('id') id: string, @Body('employeeId') employeeId: string) {
    return this.service.assign(id, employeeId);
  }

  @Post(':id/unassign')
  unassign(@Param('id') id: string) {
    return this.service.unassign(id);
  }
}
