// Email configuration for TaskKash platform
// Each email account has specific responsibilities

export const EMAIL_CONFIG = {
  // System automated messages - users should not reply
  NOREPLY: {
    email: process.env.EMAIL_NOREPLY || 'noreply@taskkash.xyz',
    name: 'TaskKash System',
    description: 'Automated system messages (password reset, OTP, security notifications)',
    replyTo: null // No reply-to for automated messages
  },

  // User support communication
  SUPPORT: {
    email: process.env.EMAIL_SUPPORT || 'support@taskkash.xyz',
    name: 'TaskKash Support',
    description: 'User support, contact form submissions, help requests',
    replyTo: process.env.EMAIL_SUPPORT || 'support@taskkash.xyz'
  },

  // Business and booking related actions
  MARKETING: {
    email: process.env.EMAIL_MARKETING || 'marketing@taskkash.xyz',
    name: 'TaskKash Business',
    description: 'Book a Session form submissions, partnership requests, business inquiries',
    replyTo: process.env.EMAIL_MARKETING || 'marketing@taskkash.xyz'
  },

  // General informational communication
  INFO: {
    email: process.env.EMAIL_INFO || 'info@taskkash.xyz',
    name: 'TaskKash Info',
    description: 'General informational/system communication',
    replyTo: process.env.EMAIL_INFO || 'info@taskkash.xyz'
  },

  // Broadcast messages and announcements
  UPDATES: {
    email: process.env.EMAIL_UPDATES || 'updates@taskkash.xyz',
    name: 'TaskKash Updates',
    description: 'Broadcast messages, announcements, newsletters, platform-wide updates',
    replyTo: process.env.EMAIL_UPDATES || 'updates@taskkash.xyz'
  }
} as const;

// Export individual email configurations for easy access
export const NOREPLY_EMAIL = EMAIL_CONFIG.NOREPLY.email;
export const SUPPORT_EMAIL = EMAIL_CONFIG.SUPPORT.email;
export const MARKETING_EMAIL = EMAIL_CONFIG.MARKETING.email;
export const INFO_EMAIL = EMAIL_CONFIG.INFO.email;
export const UPDATES_EMAIL = EMAIL_CONFIG.UPDATES.email;

// Email types for type safety
export type EmailType = keyof typeof EMAIL_CONFIG;

// Get email configuration by type
export function getEmailConfig(type: EmailType) {
  return EMAIL_CONFIG[type];
}

// Default email configuration for backward compatibility  
export const DEFAULT_EMAIL = process.env.EMAIL_USER || 'noreply@taskkash.xyz';

// Note: Email provider configuration is now handled directly in email.ts
// using SMTP_HOST, SMTP_PORT, SMTP_USER, and SMTP_PASS environment variables
