import { Inject } from '@nestjs/common';
import type { ResetTokenStorePort } from '../ports/reset-token-store.port';
import { PrismaService } from '../../prisma.service';
import { generateResetToken } from '../../shared/utils/otp';
import type { MailerPort } from '../../mailer/ports/mailer.port';

export class SendPasswordResetEmailUseCase {
  constructor(
    @Inject('MailerPort') private readonly mailer: MailerPort,
    @Inject('ResetTokenStorePort') private readonly tokenStore: ResetTokenStorePort,
    private readonly prisma: PrismaService,
  ) { }

  async execute(email: string): Promise<void> {
    const account = await this.prisma.account.findUnique({
      where: { email },
    });

    if (!account) {
      return;
    }

    const token = generateResetToken();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

    await this.tokenStore.save(account.id, token, expiresAt);
    await this.mailer.send({
      to: email,
      subject: 'Reset your password – OneNigeria',
      html: `<p>Your password reset code is <strong>${token}</strong>. It expires in 15 minutes.</p>`,
    });
  }
}
