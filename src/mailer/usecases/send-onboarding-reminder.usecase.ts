import { Injectable, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MAILER_PORT, type MailerPort } from '../ports/mailer.port';
import { onboardingReminderTemplate } from '../templates/onboarding-reminder.template';

@Injectable()
export class SendOnboardingReminderUseCase {
  constructor(
    @Inject(MAILER_PORT) private readonly mailer: MailerPort,
    private readonly configService: ConfigService,
  ) {}

  async execute(email: string, fullname?: string) {
    const name = fullname || 'Supporter';
    const frontendUrl = this.configService.get<string>('FRONTEND_URL');
    const onboardingLink = `${frontendUrl}/onboarding`;

    const html = onboardingReminderTemplate(name, onboardingLink);

    await this.mailer.send({
      to: email,
      subject: 'Complete Your Profile - OneNigeria',
      html,
    });
  }
}
