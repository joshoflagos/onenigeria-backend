export interface ResetTokenStorePort {
  save(accountId: string, token: string, expiresAt: Date): Promise<void>;
  findValid(
    token: string,
  ): Promise<{ accountId: string; email: string } | null>;
  clear(accountId: string): Promise<void>;
}
