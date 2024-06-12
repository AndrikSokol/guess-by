import { MailerOptions } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';

export const getMailConfig = async (
  configService: ConfigService,
): Promise<MailerOptions> => {
  return {
    transport: {
      service: 'gmail',
      host: 'smtp.gmail.com',
      port: 587,
      auth: {
        user: configService.get<string>('SMT_USER'),
        pass: configService.get<string>('SMT_PASSWORD'),
      },
    },
  };
};
