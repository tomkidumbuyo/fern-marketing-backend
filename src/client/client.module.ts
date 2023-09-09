import { Module } from '@nestjs/common';
import { ClientController } from './client.controller';
import { ClientService } from './client.service';
import { DatabaseModule } from '@database/database.module';

@Module({
  controllers: [ClientController],
  providers: [ClientService],
  imports: [DatabaseModule],
  exports: [ClientService],
})
export class ClientModule {}
