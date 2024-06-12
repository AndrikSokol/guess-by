import { MailerService as Mailer } from '@nestjs-modules/mailer';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { SentMessageInfo } from 'nodemailer';
import { Email } from './types/email.type';

@Injectable()
export class EmailService {
  constructor(private readonly mailer: Mailer) {}

  async send(emailData: Email, link: string): Promise<SentMessageInfo> {
    return await this.mailer
      .sendMail({
        from: 'andreiAPI <andrushamailer@gmail.com>',
        to: emailData.to,
        subject: emailData.subject,
        html: `You try to change password!\n Click for change password ${link}\n If you didn\`t send it, just ignore!\nGood luck `,
      })
      .catch(() => {
        throw new HttpException(
          `Error with mail:`,
          HttpStatus.UNPROCESSABLE_ENTITY,
        );
      });
  }
}
