import { NextRequest } from 'next/server';

// Simple in-memory rate limiter for development
// In production, use Redis or a proper rate limiting service
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

interface RateLimitConfig {
  windowMs: number; // Time window in milliseconds
  maxRequests: number; // Max requests per window
  message?: string;
}

export function rateLimit(config: RateLimitConfig) {
  return (identifier: string): { success: boolean; error?: string } => {
    const now = Date.now();
    const key = identifier;
    const record = rateLimitStore.get(key);

    if (!record || now > record.resetTime) {
      // New window or expired
      rateLimitStore.set(key, {
        count: 1,
        resetTime: now + config.windowMs,
      });
      return { success: true };
    }

    if (record.count >= config.maxRequests) {
      return {
        success: false,
        error: config.message || `Rate limit exceeded. Maximum ${config.maxRequests} requests per ${config.windowMs / 1000} seconds.`,
      };
    }

    record.count++;
    return { success: true };
  };
}

// Get client IP from request
export function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  const ip = forwarded?.split(',')[0] || realIP || 'unknown';
  return ip;
}

// Clean up expired entries periodically
setInterval(() => {
  const now = Date.now();
  for (const [key, record] of rateLimitStore.entries()) {
    if (now > record.resetTime) {
      rateLimitStore.delete(key);
    }
  }
}, 60000); // Clean up every minute

// Specific rate limiters for different endpoints
export const otpSendRateLimit = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  maxRequests: 3, // Max 3 OTP requests per 5 minutes
  message: 'Too many OTP requests. Please wait before requesting another code.',
});

export const otpVerifyRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 10, // Max 10 verification attempts per 15 minutes
  message: 'Too many verification attempts. Please try again later.',
});

export const otpResendRateLimit = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 1, // Max 1 resend per minute
  message: 'Please wait before requesting another verification code.',
});
