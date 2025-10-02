import { Module } from '@nestjs/common';
import { CompaniesModule } from './modules/companies/companies.module';
import { EmployeesModule } from './modules/employees/employees.module';
import { AssetsModule } from './modules/assets/assets.module';

@Module({
  imports: [CompaniesModule, EmployeesModule, AssetsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
