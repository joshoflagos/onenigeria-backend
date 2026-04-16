import { Resend } from 'resend';
import { MailerPort, SendEmailOptions } from '../ports/mailer.port';

export class ResendMailerAdapter implements MailerPort {
  constructor(
    private readonly resend: Resend,
    private readonly from: string,
  ) {}

  async send(options: SendEmailOptions): Promise<void> {
    await this.resend.emails.send({
      from: this.from,
      to: [options.to],
      subject: options.subject,
      html: options.html,
    });
  }
}
