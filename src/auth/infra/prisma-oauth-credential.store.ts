import type { Credential as PrismaCredential } from "../../generated/prisma/client";
import {
  Credential,
  CredentialId,
  AccountId,
  OAuthCredentialStore,
} from "@odysseon/whoami-core";
import { PrismaService } from "../../prisma.service";

function toDomain(row: PrismaCredential): Credential {
  if (
    row.kind !== "oauth" ||
    row.provider === null ||
    row.providerId === null
  ) {
    throw new Error(
      `PrismaOAuthCredentialStore: expected oauth row, got kind="${row.kind}" id="${row.id}"`,
    );
  }
  return Credential.loadExisting({
    id: new CredentialId(row.id),
    accountId: new AccountId(row.accountId),
    proof: { kind: "oauth", provider: row.provider, providerId: row.providerId },
  });
}

export class PrismaOAuthCredentialStore implements OAuthCredentialStore {
  constructor(private readonly prisma: PrismaService) { }

  async findByProvider(
    provider: string,
    providerId: string,
  ): Promise<Credential | null> {
    const row = await this.prisma.credential.findUnique({
      where: { provider_providerId: { provider, providerId } },
    });
    return row ? toDomain(row) : null;
  }

  async findAllByAccountId(accountId: AccountId): Promise<Credential[]> {
    const rows = await this.prisma.credential.findMany({
      where: { accountId: accountId.value, kind: "oauth" },
    });
    return rows.map(toDomain);
  }

  async save(credential: Credential): Promise<void> {
    await this.prisma.credential.upsert({
      where: { id: credential.id.value },
      create: {
        id: credential.id.value,
        accountId: credential.accountId.value,
        kind: "oauth",
        provider: credential.oauthProvider,
        providerId: credential.oauthProviderId,
      },
      update: {
        provider: credential.oauthProvider,
        providerId: credential.oauthProviderId,
      },
    });
  }

  async delete(credentialId: CredentialId): Promise<void> {
    await this.prisma.credential
      .delete({ where: { id: credentialId.value } })
      .catch(() => { });
  }

  async deleteByProvider(accountId: AccountId, provider: string): Promise<void> {
    await this.prisma.credential.deleteMany({
      where: { accountId: accountId.value, kind: "oauth", provider },
    });
  }

  async deleteAllForAccount(accountId: AccountId): Promise<void> {
    await this.prisma.credential.deleteMany({
      where: { accountId: accountId.value, kind: "oauth" },
    });
  }

  async existsForAccount(accountId: AccountId): Promise<boolean> {
    const count = await this.prisma.credential.count({
      where: { accountId: accountId.value, kind: "oauth" },
    });
    return count > 0;
  }
}
