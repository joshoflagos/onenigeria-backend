import {
  JoseReceiptSigner,
  JoseReceiptVerifier,
} from '@odysseon/whoami-adapter-jose';
import { Argon2PasswordHasher } from '@odysseon/whoami-adapter-argon2';
import {
  IssueReceiptUseCase,
  VerifyReceiptUseCase
} from '@odysseon/whoami-core/internal';
import { PrismaAccountRepository } from './infra/prisma-account.repository';
import { PrismaPasswordCredentialStore } from './infra/prisma-password-credential.store';
import { PrismaOAuthCredentialStore } from './infra/prisma-oauth-credential.store';
import { init } from '@paralleldrive/cuid2';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma.service';

const createId = init({ length: 24 });

export const createWhoamiOptions = async (
  configService: ConfigService,
  prisma: PrismaService,
) => {
  const accountRepo = new PrismaAccountRepository(prisma);
  const passwordStore = new PrismaPasswordCredentialStore(prisma);
  const oauthStore = new PrismaOAuthCredentialStore(prisma);
  const hasher = new Argon2PasswordHasher();

  const joseSecret = configService.getOrThrow<string>('JOSE_SECRET');
  const tokenLifespanMinutes = configService.get<number>('TOKEN_LIFESPAN_MINUTES', 60);

  const signer = new JoseReceiptSigner({
    secret: joseSecret,
    issuer: 'onenigeria',
  });

  const verifier = new JoseReceiptVerifier({
    secret: joseSecret,
    issuer: 'onenigeria',
  });

  return {
    accountRepo,
    tokenSigner: new IssueReceiptUseCase({
      signer,
      tokenLifespanMinutes,
    }),
    verifyReceipt: new VerifyReceiptUseCase(verifier),
    logger: console,
    generateId: () => createId(),
    password: {
      hashManager: hasher,
      passwordStore,
    },
    oauth: {
      oauthStore,
    },
  };
}

