import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { PrismaOtpStoreAdapter } from './adapters/prisma-otp-store.adapter';
import { SendVerificationEmailUseCase } from './usecases/send-verification-email.usecase';
import { VerifyEmailUseCase } from './usecases/verify-email.usecase';
import { MailerModule } from '../mailer/mailer.module';

@Module({
  imports: [MailerModule],
  providers: [
    PrismaService,
    {
      provide: 'OtpStorePort',
      useFactory: (prisma: PrismaService) => new PrismaOtpStoreAdapter(prisma),
      inject: [PrismaService],
    },
    SendVerificationEmailUseCase,
    VerifyEmailUseCase,
  ],
  exports: [SendVerificationEmailUseCase, VerifyEmailUseCase],
})
export class VerificationModule {}
