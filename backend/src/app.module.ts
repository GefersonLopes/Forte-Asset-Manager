import { Module } from '@nestjs/common';
import { CompaniesModule } from './modules/companies/companies.module';
import { EmployeesModule } from './modules/employees/employees.module';
import { AssetsModule } from './modules/assets/assets.module';
import { HealthModule } from './health/health.module';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [
    CompaniesModule,
    EmployeesModule,
    AssetsModule,
    DatabaseModule,
    HealthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
