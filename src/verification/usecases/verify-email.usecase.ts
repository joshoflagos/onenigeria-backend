import { Inject, BadRequestException } from '@nestjs/common';
import type { OtpStorePort } from '../ports/otp-store.port';

export class VerifyEmailUseCase {
  constructor(
    @Inject('OtpStorePort') private readonly otpStore: OtpStorePort,
  ) { }

  async execute(accountId: string, otp: string): Promise<void> {
    const isValid = await this.otpStore.findValid(accountId, otp);
    if (!isValid) {
      throw new BadRequestException('Invalid or expired OTP');
    }
    await this.otpStore.clear(accountId);
  }
}
