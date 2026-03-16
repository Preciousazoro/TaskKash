import crypto from 'crypto';

export function generateOTP(): string {
  // Generate a 6-digit OTP
  return crypto.randomInt(100000, 999999).toString();
}

export function isValidOTPFormat(otp: string): boolean {
  return /^\d{6}$/.test(otp);
}

export function isOTPExpired(expiresAt: Date): boolean {
  return new Date() > expiresAt;
}

export function generateVerificationId(): string {
  return crypto.randomBytes(32).toString('hex');
}
