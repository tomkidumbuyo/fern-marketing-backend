import { Module } from '@nestjs/common';
import entities from './entities';
import { repositories } from './repositories';

@Module({
  providers: [...repositories, ...entities],
  exports: [...repositories, ...entities],
})
export class DatabaseModule {}
