import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import {
  WhoamiAuthGuard,
  WhoamiExceptionFilter,
  WhoamiModule,
} from '@odysseon/whoami-adapter-nestjs';
import { PrismaService } from '../prisma.service';
import { GoogleStrategy } from './strategies/google.strategy';
import { AuthController } from './controllers/auth.controller';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { createWhoamiOptions } from './auth-config.factory';
import { PrismaPasswordCredentialStore } from './infra/prisma-password-credential.store';
import { VerificationModule } from '../verification/verification.module';
import { MailerModule } from '../mailer/mailer.module';

@Global()
@Module({
  imports: [
    MailerModule,
    VerificationModule,
    ConfigModule,
    PassportModule,
    WhoamiModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService, PrismaService],
      useFactory: createWhoamiOptions,
    }),
  ],
  controllers: [AuthController],
  providers: [
    GoogleStrategy,
    {
      provide: APP_GUARD,
      useClass: WhoamiAuthGuard,
    },
    {
      provide: APP_FILTER,
      useClass: WhoamiExceptionFilter,
    },
    PrismaPasswordCredentialStore,
  ],
  exports: [PrismaPasswordCredentialStore],
})
export class AuthModule {}
