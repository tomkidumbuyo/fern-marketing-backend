import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './lib/database/database.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MailModule } from './lib/mail/mail.module';
import { ClientModule } from './client/client.module';
import { ProjectModule } from './project/project.module';
import { BudgetService } from './budget/budget.service';
import { BudgetModule } from './budget/budget.module';
import { TicketModule } from './ticket/ticket.module';

import ormConfig from '@database/config/ormconfig';

@Module({
  imports: [
    DatabaseModule,
    AuthModule,
    UsersModule,
    TypeOrmModule.forRoot(ormConfig),
    MailModule,
    ClientModule,
    ProjectModule,
    BudgetModule,
    TicketModule,
  ],
  controllers: [AppController],
  providers: [AppService, BudgetService],
})
export class AppModule {}
