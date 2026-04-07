import {
  Account,
  AccountId,
  AccountRepository,
  EmailAddress,
} from "@odysseon/whoami-core";
import { PrismaService } from "../../prisma.service";

export class PrismaAccountRepository implements AccountRepository {
  constructor(private readonly prisma: PrismaService) { }

  async save(account: Account): Promise<void> {
    await this.prisma.account.upsert({
      where: { id: account.id.value },
      create: { id: account.id.value, email: account.email.value },
      update: { email: account.email.value },
    });
  }

  async findById(id: AccountId): Promise<Account | null> {
    const row = await this.prisma.account.findUnique({
      where: { id: id.value },
    });
    if (!row) return null;
    return Account.create(new AccountId(row.id), new EmailAddress(row.email));
  }

  async findByEmail(email: EmailAddress): Promise<Account | null> {
    const row = await this.prisma.account.findUnique({
      where: { email: email.value },
    });
    if (!row) return null;
    return Account.create(new AccountId(row.id), new EmailAddress(row.email));
  }

  async delete(id: AccountId): Promise<void> {
    await this.prisma.account
      .delete({ where: { id: id.value } })
      .catch(() => {
        // treat missing record as no-op (idempotent)
      });
  }
}
