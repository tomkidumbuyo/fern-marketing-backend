import * as Mailgun from 'mailgun-js';
import * as dotenv from 'dotenv';

dotenv.config();

export const mailGunConfig: Mailgun.Mailgun = Mailgun({
  apiKey: process.env.MAILGUN_API_KEY,
  domain: process.env.MAILGUN_DOMAIN,
});

export enum MailTemplatesEnum {
  AUTHENTICATION_CREATE_PASSWORD = 'authentication/createPassword.hbs',
}
