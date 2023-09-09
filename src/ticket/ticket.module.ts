import { Module } from '@nestjs/common';
import { TicketController } from './ticket.controller';
import { TicketService } from './ticket.service';
import { DatabaseModule } from '@database/database.module';
import { ClientModule } from 'src/client/client.module';

@Module({
  controllers: [TicketController],
  providers: [TicketService],
  imports: [ClientModule, DatabaseModule],
})
export class TicketModule {}
