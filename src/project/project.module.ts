import { Module } from '@nestjs/common';
import { ProjectController } from './project.controller';
import { ProjectService } from './project.service';
import { ClientModule } from 'src/client/client.module';
import { DatabaseModule } from '@database/database.module';

@Module({
  controllers: [ProjectController],
  providers: [ProjectService],
  imports: [ClientModule, DatabaseModule],
})
export class ProjectModule {}
