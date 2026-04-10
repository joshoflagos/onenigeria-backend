export interface OtpStorePort {
  save(accountId: string, otp: string, expiresAt: Date): Promise<void>;
  findValid(accountId: string, otp: string): Promise<boolean>;
  clear(accountId: string): Promise<void>;
}
