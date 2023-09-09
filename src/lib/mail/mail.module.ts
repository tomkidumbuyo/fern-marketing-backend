import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { AuthMailService } from './auth.mail.service';
import { mailerConfig } from './mail.config';

@Module({
  imports: [MailerModule.forRoot(mailerConfig)],
  providers: [MailService, AuthMailService],
  exports: [MailService, AuthMailService],
})
export class MailModule {}
