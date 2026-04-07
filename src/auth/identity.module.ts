import { Module } from '@nestjs/common';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';
import {
  WhoamiAuthGuard,
  WhoamiModule,
  WhoamiModuleOptions,
  WhoamiExceptionFilter,
} from '@odysseon/whoami-adapter-nestjs';
import { JoseReceiptVerifier } from '@odysseon/whoami-adapter-jose';

@Module({
  imports: [
    WhoamiModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService): WhoamiModuleOptions => ({
        verifier: new JoseReceiptVerifier({
          secret: config.getOrThrow('JOSE_SECRET'),
          issuer: 'onenigeria',
        }),
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [
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
export class IdentityModule {}
