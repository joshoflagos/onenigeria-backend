import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { SendPasswordResetEmailUseCase } from './usecases/send-password-reset-email.usecase';
import { ResetPasswordUseCase } from './usecases/reset-password.usecase';
import { PrismaResetTokenStoreAdapter } from './adapters/prisma-reset-token-store.adapter';
import { Argon2PasswordHasher } from '@odysseon/whoami-adapter-argon2';
import { PasswordResetController } from './password-reset.controller';

@Module({
  providers: [
    PrismaService,
    {
      provide: 'ResetTokenStorePort',
      useFactory: (prisma: PrismaService) =>
        new PrismaResetTokenStoreAdapter(prisma),
      inject: [PrismaService],
    },
    SendPasswordResetEmailUseCase,
    ResetPasswordUseCase,
    Argon2PasswordHasher,
  ],
  controllers: [PasswordResetController],
  exports: [SendPasswordResetEmailUseCase, ResetPasswordUseCase],
})
export class PasswordResetModule {}
