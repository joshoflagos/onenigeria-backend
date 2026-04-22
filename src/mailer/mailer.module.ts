import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Resend } from 'resend';
import { MAILER_PORT } from './ports/mailer.port';
import { ResendMailerAdapter } from './adapters/resend-mailer.adapter';
import { SendOnboardingReminderUseCase } from './usecases/send-onboarding-reminder.usecase';
import { SendWelcomeEmailUseCase } from './usecases/send-welcome-mail.usecase';

@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: Resend,
      useFactory: (configService: ConfigService) => {
        return new Resend(configService.get<string>('RESEND_API_KEY'));
      },
      inject: [ConfigService],
    },
    {
      provide: MAILER_PORT,
      useFactory: (resend: Resend, configService: ConfigService) => {
        return new ResendMailerAdapter(
          resend,
          configService.get<string>('MAIL_FROM') || 'onboarding@onenigeria.com',
        );
      },
      inject: [Resend, ConfigService],
    },
    SendOnboardingReminderUseCase,
    SendWelcomeEmailUseCase,
  ],
  exports: [
    MAILER_PORT,
    SendOnboardingReminderUseCase,
    SendWelcomeEmailUseCase,
  ],
})
export class MailerModule {}
