import { Module } from '@nestjs/common';
import { EmployeesController } from './employees.controller';
import { EmployeesService } from './employees.service';
import { TOKENS } from 'src/shared/constants/tokens';
import { PrismaEmployeesRepository } from './repositories/prisma-employees.repository';
import { DatabaseModule } from 'src/database/database.module';
import { AssetsModule } from '../assets/assets.module';

@Module({
  imports: [DatabaseModule, AssetsModule],
  controllers: [EmployeesController],
  providers: [
    {
      provide: TOKENS.EMPLOYEES_REPOSITORY,
      useClass: PrismaEmployeesRepository,
    },
    {
      provide: EmployeesService,
      useFactory: (repo: PrismaEmployeesRepository) =>
        new EmployeesService(repo),
      inject: [TOKENS.EMPLOYEES_REPOSITORY],
    },
  ],
  exports: [EmployeesService],
})
export class EmployeesModule {}
