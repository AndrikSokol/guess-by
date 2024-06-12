import { Test, TestingModule } from '@nestjs/testing';
import { MailerService } from '@nestjs-modules/mailer';
import { HttpException } from '@nestjs/common';
import { SentMessageInfo } from 'nodemailer';
import { EmailService } from './email.service';
import { Status } from '@/enum/status.enum';

// Mock the MailerService
jest.mock('@nestjs-modules/mailer', () => ({
  MailerService: jest.fn().mockImplementation(() => ({
    sendMail: jest.fn().mockResolvedValue({} as SentMessageInfo),
  })),
}));

describe('EmailService', () => {
  let emailService: EmailService;
  let mailerService: MailerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmailService,
        {
          provide: MailerService,
          useValue: {
            sendMail: jest.fn().mockResolvedValue({} as SentMessageInfo),
          },
        },
      ],
    }).compile();

    emailService = module.get<EmailService>(EmailService);
    mailerService = module.get<MailerService>(MailerService);
  });

  it('should be defined', () => {
    expect(emailService).toBeDefined();
  });

  describe('send', () => {
    it('should send email with success status', async () => {
      const emailData = { to: 'test@example.com', subject: 'Test Subject' };
      const vinylsName = 'Vinyl Name';
      const totalPrice = 100;
      const status = Status.Success;

      const result = await emailService.send(
        emailData,
        status,
        vinylsName,
        totalPrice,
      );

      expect(result).toBeDefined();
      expect(mailerService.sendMail).toHaveBeenCalledWith({
        from: 'andreiAPI <andrushamailer@gmail.com>',
        to: emailData.to,
        subject: emailData.subject,
        html: expect.stringContaining(vinylsName),
      });
    });

    it('should send email with canceled status', async () => {
      const emailData = { to: 'test@example.com', subject: 'Test Subject' };
      const status = Status.Canceled;

      const result = await emailService.send(emailData, status, '', 0);

      expect(result).toBeDefined();
      expect(mailerService.sendMail).toHaveBeenCalledWith({
        from: 'andreiAPI <andrushamailer@gmail.com>',
        to: emailData.to,
        subject: emailData.subject,
        html: expect.stringContaining('Canceled'),
      });
    });

    it('should throw HttpException if sending email fails', async () => {
      const emailData = { to: 'test@example.com', subject: 'Test Subject' };
      const status = Status.Success;
      (mailerService.sendMail as jest.Mock).mockRejectedValueOnce(new Error());

      await expect(
        emailService.send(emailData, status, '', 0),
      ).rejects.toThrowError(HttpException);
    });
  });
});
