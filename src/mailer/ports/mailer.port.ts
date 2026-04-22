export const MAILER_PORT = Symbol('MAILER_PORT');

export interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
}

export interface MailerPort {
  send(options: SendEmailOptions): Promise<void>;
}
