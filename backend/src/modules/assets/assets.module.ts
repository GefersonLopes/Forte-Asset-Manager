import { Module } from '@nestjs/common';
import { AssetsController } from './assets.controller';
import { AssetsService } from './assets.service';
import { TOKENS } from '../../shared/constants/tokens';
import { PrismaAssetsRepository } from './repositories/prisma-assets.repository';
import { DatabaseModule } from '../../database/database.module';
import { PrismaEmployeesRepository } from '../employees/repositories/prisma-employees.repository';

@Module({
  imports: [DatabaseModule],
  controllers: [AssetsController],
  providers: [
    { provide: TOKENS.ASSETS_REPOSITORY, useClass: PrismaAssetsRepository },
    {
      provide: TOKENS.EMPLOYEES_REPOSITORY,
      useClass: PrismaEmployeesRepository,
    },
    {
      provide: AssetsService,
      useFactory: (
        assetsRepo: PrismaAssetsRepository,
        empRepo: PrismaEmployeesRepository,
      ) => new AssetsService(assetsRepo, empRepo),
      inject: [TOKENS.ASSETS_REPOSITORY, TOKENS.EMPLOYEES_REPOSITORY],
    },
  ],
  exports: [AssetsService],
})
export class AssetsModule {}
