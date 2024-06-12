import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';
import { getMailConfig } from '@/configs/mail.config';
import { EmailService } from './email.service';

@Module({
  imports: [
    ConfigModule,
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: getMailConfig,
    }),
  ],
  controllers: [],
  providers: [{ provide: 'EMAIL_SERVICE', useClass: EmailService }],
  exports: [{ provide: 'EMAIL_SERVICE', useClass: EmailService }],
})
export class EmailModule {}
