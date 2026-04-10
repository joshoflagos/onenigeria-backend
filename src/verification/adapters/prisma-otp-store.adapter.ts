import { OtpStorePort } from '../ports/otp-store.port';
import { PrismaService } from '../../prisma.service';

export class PrismaOtpStoreAdapter implements OtpStorePort {
  constructor(private readonly prisma: PrismaService) { }

  async save(accountId: string, otp: string, expiresAt: Date): Promise<void> {
    await this.prisma.oneNigeriaUser.upsert({
      where: { accountId },
      create: { accountId, otp, otpExpiry: expiresAt },
      update: { otp, otpExpiry: expiresAt },
    });
  }

  async findValid(accountId: string, otp: string): Promise<boolean> {
    const user = await this.prisma.oneNigeriaUser.findUnique({
      where: { accountId },
    });
    return !!(
      user &&
      user.otp === otp &&
      user.otpExpiry &&
      user.otpExpiry > new Date()
    );
  }

  async clear(accountId: string): Promise<void> {
    await this.prisma.oneNigeriaUser.update({
      where: { accountId },
      data: { otp: null, otpExpiry: null, isVerified: true },
    });
  }
}
