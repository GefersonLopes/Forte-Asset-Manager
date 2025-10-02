import { Module } from '@nestjs/common';
import { CompaniesController } from './companies.controller';
import { CompaniesService } from './companies.service';
import { TOKENS } from 'src/shared/constants/tokens';
import { PrismaCompaniesRepository } from './repositories/prisma-companies.repository';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [CompaniesController],
  providers: [
    CompaniesService,
    {
      provide: TOKENS.COMPANIES_REPOSITORY,
      useClass: PrismaCompaniesRepository,
    },
    {
      provide: CompaniesService,
      useFactory: (repo: PrismaCompaniesRepository) =>
        new CompaniesService(repo),
      inject: [TOKENS.COMPANIES_REPOSITORY],
    },
  ],
  exports: [CompaniesService],
})
export class CompaniesModule {}
