import { UserEntity } from '@database/entities';
import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthMailService {
  constructor(private mailerService: MailerService) {}

  async sendUserCreatePassword(user: UserEntity, token: string) {
    const url = `${process.env.FRONTEND_URL}/auth/createNewPassword/${token}`;
    await this.mailerService.sendMail({
      to: user.email,
      subject: 'Create Password To Your New Account',
      template: './authentication/createPassword',
      context: {
        name: user.firstName,
        url,
      },
    });
  }
}
