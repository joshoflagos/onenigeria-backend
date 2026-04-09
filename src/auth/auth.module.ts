import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import {
  OAuthCallbackHandler,
  WhoamiAuthGuard,
  WhoamiExceptionFilter,
  WhoamiModule,
} from '@odysseon/whoami-adapter-nestjs';
import { PrismaService } from '../prisma.service';
import { GoogleStrategy } from './strategies/google.strategy';
import { AuthController } from './controllers/auth.controller';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { createWhoamiOptions } from './auth-config.factory';

@Module({
  imports: [
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
  ],
})
export class AuthModule {}
