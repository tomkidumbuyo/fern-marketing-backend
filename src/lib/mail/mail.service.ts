import { Injectable } from '@nestjs/common';
import * as mailConfigFile from './mail.config';
import * as fs from 'fs';
import { join } from 'path';
import * as handlebars from 'handlebars';

@Injectable()
export class MailService {
  constructor() {}

  mg = mailConfigFile.mailGunConfig;

  async sendEmail(to: string, subject: string, text: string) {
    const payload = {
      from: `Your Name <no-reply@${process.env.MAILGUN_DOMAIN}>`,
      to,
      subject,
      text,
    };

    try {
      const response = await this.mg.messages().send(payload);
      console.log('Email sent:', response);
      return response;
    } catch (error) {
      throw error;
    }
  }

  private parseTemplate(
    templateName: mailConfigFile.MailTemplatesEnum,
    variables: any,
  ): string {
    const templatePath = join(__dirname, 'templates', `${templateName}.hbs`);
    const templateSource = fs.readFileSync(templatePath, 'utf8');
    const compiledTemplate = handlebars.compile(templateSource);
    return compiledTemplate(variables);
  }

  async sendEmailTemplate(
    to: string,
    subject: string,
    template: mailConfigFile.MailTemplatesEnum,
    data: any,
  ) {
    const html = this.parseTemplate(template, data);
    const payload = {
      from: `Your Name <no-reply@${process.env.MAILGUN_DOMAIN}>`,
      to,
      subject,
      html,
    };

    try {
      const response = await this.mg.messages().send(payload);
      return response;
    } catch (error) {
      throw error;
    }
  }
}
