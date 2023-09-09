import { Module } from '@nestjs/common';
import { BudgetController } from './budget.controller';
import { BudgetService } from './budget.service';
import { DatabaseModule } from '@database/database.module';

@Module({
  controllers: [BudgetController],
  providers: [BudgetService],
  imports: [DatabaseModule],
})
export class BudgetModule {}
