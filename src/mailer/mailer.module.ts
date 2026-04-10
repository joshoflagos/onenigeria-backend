import { Module, Global } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';
import { ResendMailerAdapter } from './adapters/resend-mailer.adapter';

@Global()
@Module({
  providers: [
    {
      provide: 'MailerPort',
      useFactory: (config: ConfigService) => {
        const apiKey = config.getOrThrow('RESEND_API_KEY');
        const from = config.get('MAIL_FROM', 'OneNigeria <noreply@onenigeria.ng>');
        return new ResendMailerAdapter(new Resend(apiKey), from);
      },
      inject: [ConfigService],
    },
  ],
  exports: ['MailerPort'],
})
export class MailerModule { }
