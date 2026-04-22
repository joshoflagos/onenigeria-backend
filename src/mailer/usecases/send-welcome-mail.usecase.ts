import { Injectable, Inject } from '@nestjs/common';
import { MAILER_PORT, type MailerPort } from '../ports/mailer.port';
import { welcomeTemplate } from '../templates/welcome.template';

@Injectable()
export class SendWelcomeEmailUseCase {
  constructor(@Inject(MAILER_PORT) private readonly mailer: MailerPort) {}

  async execute(email: string, fullname: string) {
    const html = welcomeTemplate(fullname);

    await this.mailer.send({
      to: email,
      subject: 'Welcome to the Movement!',
      html,
    });
  }
}
