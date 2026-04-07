import { Module } from '@nestjs/common';
import { JoseReceiptVerifier } from '@odysseon/whoami-adapter-jose';
import { WhoamiModule, WhoamiModuleOptions } from '@odysseon/whoami-adapter-nestjs';

@Module({
  imports: [
    WhoamiModule.registerAsync({
      useFactory: (): WhoamiModuleOptions => ({
        verifier: new JoseReceiptVerifier({
          secret:
            process.env["JOSE_SECRET"] ?? "dev-secret-at-least-32-chars-long!!",
          issuer: "onenigeria",
        }),
      }),
    }),
  ]
})
export class AuthModule { }
