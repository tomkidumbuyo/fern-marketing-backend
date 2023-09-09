import { DatabaseModule } from '@database/database.module';
import { Module } from '@nestjs/common';
import { UserController } from './user.controller';

import { MailModule } from 'src/lib/mail/mail.module';
import { UserService } from './user.service';

@Module({
  controllers: [UserController],
  providers: [UserService],
  imports: [DatabaseModule, MailModule],
  exports: [UserService],
})
export class UsersModule {}
