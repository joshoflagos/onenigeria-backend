import { Inject, BadRequestException } from '@nestjs/common';
import type { ResetTokenStorePort } from '../ports/reset-token-store.port';
import { Argon2PasswordHasher } from '@odysseon/whoami-adapter-argon2';
import { AccountId, Credential } from '@odysseon/whoami-core';
import { PrismaPasswordCredentialStore } from '../../auth/infra/prisma-password-credential.store';

export class ResetPasswordUseCase {
  constructor(
    @Inject('ResetTokenStorePort') private readonly tokenStore: ResetTokenStorePort,
    private readonly hashManager: Argon2PasswordHasher,
    private readonly credentialStore: PrismaPasswordCredentialStore,
  ) { }

  async execute(token: string, newPassword: string): Promise<void> {
    const result = await this.tokenStore.findValid(token);

    if (!result) {
      throw new BadRequestException('Invalid or expired reset token');
    }
    const accountId = new AccountId(result.accountId);

    // Find the existing password credential
    const existingCredential = await this.credentialStore.findByAccountId(accountId);

    if (!existingCredential) {
      throw new BadRequestException('No password credential found for this account');
    }

    const hashedPassword = await this.hashManager.hash(newPassword);
    // Create updated credential with new password hash
    const updatedCredential = Credential.loadExisting({
      id: existingCredential.id,
      accountId: existingCredential.accountId,
      proof: { kind: 'password', hash: hashedPassword },
    });

    // Save the updated credential
    await this.credentialStore.save(updatedCredential);

    // Clear the used token
    await this.tokenStore.clear(result.accountId);
  }
}
