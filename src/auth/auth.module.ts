import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { OAuthCallbackHandler } from '@odysseon/whoami-adapter-nestjs';
import {
  JoseReceiptSigner,
  JoseReceiptVerifier,
} from '@odysseon/whoami-adapter-jose';
import { Argon2PasswordHasher } from '@odysseon/whoami-adapter-argon2';
import {
  AccountRepository,
  AuthenticateOAuthUseCase,
  AuthenticateWithPasswordUseCase,
  IssueReceiptUseCase,
  OAuthCredentialStore,
  PasswordCredentialStore,
  RegisterWithPasswordUseCase,
  VerifyReceiptUseCase,
} from '@odysseon/whoami-core';
import { init } from '@paralleldrive/cuid2';
import { PrismaService } from '../prisma.service';
import { PrismaAccountRepository } from './infra/prisma-account.repository';
import { PrismaPasswordCredentialStore } from './infra/prisma-password-credential.store';
import { PrismaOAuthCredentialStore } from './infra/prisma-oauth-credential.store';
import { GoogleStrategy } from './strategies/google.strategy';
import { AuthController } from './controllers/auth.controller';

export const ACCOUNT_REPOSITORY = Symbol('AccountRepository');
export const PASSWORD_STORE = Symbol('PasswordCredentialStore');
export const OAUTH_STORE = Symbol('OAuthCredentialStore');

const createId = init({ length: 24 });

@Module({
  imports: [ConfigModule, PassportModule],
  controllers: [AuthController],
  providers: [
    PrismaService,

    {
      provide: ACCOUNT_REPOSITORY,
      useFactory: (prisma: PrismaService) =>
        new PrismaAccountRepository(prisma),
      inject: [PrismaService],
    },
    {
      provide: PASSWORD_STORE,
      useFactory: (prisma: PrismaService) =>
        new PrismaPasswordCredentialStore(prisma),
      inject: [PrismaService],
    },
    {
      provide: OAUTH_STORE,
      useFactory: (prisma: PrismaService) =>
        new PrismaOAuthCredentialStore(prisma),
      inject: [PrismaService],
    },

    {
      provide: IssueReceiptUseCase,
      useFactory: (config: ConfigService) =>
        new IssueReceiptUseCase({
          signer: new JoseReceiptSigner({
            secret: config.getOrThrow('JOSE_SECRET'),
            issuer: 'onenigeria',
          }),
          tokenLifespanMinutes: 60,
        }),
      inject: [ConfigService],
    },

    {
      provide: VerifyReceiptUseCase,
      useFactory: (config: ConfigService) =>
        new VerifyReceiptUseCase(
          new JoseReceiptVerifier({
            secret: config.getOrThrow('JOSE_SECRET'),
            issuer: 'onenigeria',
          }),
        ),
      inject: [ConfigService],
    },

    {
      provide: RegisterWithPasswordUseCase,
      useFactory: (
        accountRepo: AccountRepository,
        passwordStore: PasswordCredentialStore,
        issueReceipt: IssueReceiptUseCase,
      ) =>
        new RegisterWithPasswordUseCase({
          accountRepo,
          passwordStore,
          generateId: () => createId(),
          hashPassword: (plain) => new Argon2PasswordHasher().hash(plain),
          issueReceipt,
        }),
      inject: [ACCOUNT_REPOSITORY, PASSWORD_STORE, IssueReceiptUseCase],
    },

    {
      provide: AuthenticateWithPasswordUseCase,
      useFactory: (
        passwordStore: PasswordCredentialStore,
        issueReceipt: IssueReceiptUseCase,
      ) =>
        new AuthenticateWithPasswordUseCase({
          passwordStore,
          issueReceipt,
          passwordManager: new Argon2PasswordHasher(),
          logger: console,
        }),
      inject: [PASSWORD_STORE, IssueReceiptUseCase],
    },

    {
      provide: AuthenticateOAuthUseCase,
      useFactory: (
        accountRepo: AccountRepository,
        oauthStore: OAuthCredentialStore,
        issueReceipt: IssueReceiptUseCase,
      ) =>
        new AuthenticateOAuthUseCase({
          accountRepository: accountRepo,
          oauthCredentialStore: oauthStore,
          issueReceipt,
          generateId: () => createId(),
          logger: console,
        }),
      inject: [ACCOUNT_REPOSITORY, OAUTH_STORE, IssueReceiptUseCase],
    },

    OAuthCallbackHandler,
    GoogleStrategy,
  ],
  exports: [VerifyReceiptUseCase],
})
export class AuthModule {}
