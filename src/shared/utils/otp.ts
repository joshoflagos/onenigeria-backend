import { randomInt } from 'crypto';

/**
 * Generates a 6-digit numeric OTP.
 */
export const generateOtp = (): string => {
  return randomInt(100000, 999999).toString();
};

/**
 * Generates a secure random token for password reset.
 * Uses 32 bytes -> 64 hex characters.
 */
export const generateResetToken = (): string => {
  return require('crypto').randomBytes(32).toString('hex');
};
