import type { Credential as PrismaCredential } from "../../generated/prisma/client";
import {
  Credential,
  CredentialId,
  AccountId,
  EmailAddress,
  PasswordCredentialStore,
} from "@odysseon/whoami-core";
import { PrismaService } from "../../prisma.service";

function toDomain(row: PrismaCredential): Credential {
  if (row.kind !== "password" || row.hash === null) {
    throw new Error(
      `PrismaPasswordCredentialStore: expected password row, got kind="${row.kind}" id="${row.id}"`,
    );
  }
  return Credential.loadExisting({
    id: new CredentialId(row.id),
    accountId: new AccountId(row.accountId),
    proof: { kind: "password", hash: row.hash },
  });
}

export class PrismaPasswordCredentialStore implements PasswordCredentialStore {
  constructor(private readonly prisma: PrismaService) { }

  async findByEmail(email: EmailAddress): Promise<Credential | null> {
    const row = await this.prisma.credential.findFirst({
      where: {
        kind: "password",
        account: { email: email.value },
      },
    });
    return row ? toDomain(row) : null;
  }

  async findByAccountId(accountId: AccountId): Promise<Credential | null> {
    const row = await this.prisma.credential.findFirst({
      where: { accountId: accountId.value, kind: "password" },
    });
    return row ? toDomain(row) : null;
  }

  async save(credential: Credential): Promise<void> {
    await this.prisma.credential.upsert({
      where: { id: credential.id.value },
      create: {
        id: credential.id.value,
        accountId: credential.accountId.value,
        kind: "password",
        hash: credential.passwordHash,
      },
      update: {
        hash: credential.passwordHash,
      },
    });
  }

  async delete(credentialId: CredentialId): Promise<void> {
    await this.prisma.credential
      .delete({ where: { id: credentialId.value } })
      .catch(() => { });
  }

  async deleteByAccountId(accountId: AccountId): Promise<void> {
    await this.prisma.credential.deleteMany({
      where: { accountId: accountId.value, kind: "password" },
    });
  }

  async existsForAccount(accountId: AccountId): Promise<boolean> {
    const count = await this.prisma.credential.count({
      where: { accountId: accountId.value, kind: "password" },
    });
    return count > 0;
  }
}
