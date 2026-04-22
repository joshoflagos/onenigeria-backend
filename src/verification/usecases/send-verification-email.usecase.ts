import { Inject } from '@nestjs/common';
import type { OtpStorePort } from '../ports/otp-store.port';
import { generateOtp } from '../../shared/utils/otp';
import { MAILER_PORT, type MailerPort } from '../../mailer/ports/mailer.port';

export class SendVerificationEmailUseCase {
  constructor(
    @Inject(MAILER_PORT) private readonly mailer: MailerPort,
    @Inject('OtpStorePort') private readonly otpStore: OtpStorePort,
  ) {}

  async execute(accountId: string, email: string): Promise<void> {
    const otp = generateOtp();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await this.otpStore.save(accountId, otp, expiresAt);
    await this.mailer.send({
      to: email,
      subject: 'Verify your email – OneNigeria',
      html: `<p>Your verification code is <strong>${otp}</strong>. It expires in 10 minutes.</p>`,
    });
  }
}
