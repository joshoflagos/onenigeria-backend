import { PrismaService } from '../../prisma.service';
import { ResetTokenStorePort } from '../ports/reset-token-store.port';

export class PrismaResetTokenStoreAdapter implements ResetTokenStorePort {
  constructor(private readonly prisma: PrismaService) {}

  async save(accountId: string, token: string, expiresAt: Date): Promise<void> {
    await this.prisma.oneNigeriaUser.upsert({
      where: { accountId },
      create: { accountId, resetToken: token, resetTokenExpiry: expiresAt },
      update: { resetToken: token, resetTokenExpiry: expiresAt },
    });
  }

  async findValid(
    token: string,
  ): Promise<{ accountId: string; email: string } | null> {
    const user = await this.prisma.oneNigeriaUser.findFirst({
      where: {
        resetToken: token,
        resetTokenExpiry: { gt: new Date() },
      },
      include: { account: true },
    });

    if (!user) return null;

    return {
      accountId: user.accountId,
      email: user.account.email,
    };
  }

  async clear(accountId: string): Promise<void> {
    await this.prisma.oneNigeriaUser.update({
      where: { accountId },
      data: { resetToken: null, resetTokenExpiry: null },
    });
  }
}
