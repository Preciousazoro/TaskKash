// Email service helpers for TaskKash platform
// Provides clean, reusable functions for different email types

import { sendEmail } from './email';
import type { EmailType } from './emailConfig';

// Helper function to get sender by email type
export function getEmailSenderByType(type: EmailType) {
  return type;
}

// Send transactional email (password reset, OTP, security alerts)
export async function sendTransactionalEmail(
  to: string,
  subject: string,
  html: string,
  text?: string,
  replyTo?: string
): Promise<boolean> {
  return await sendEmail({
    to,
    subject,
    html,
    text,
    from: 'NOREPLY', // Uses noreply@taskkash.xyz
    replyTo
  });
}

// Send broadcast email (announcements, newsletters, updates)
export async function sendBroadcastEmailService(
  to: string,
  subject: string,
  html: string,
  text?: string,
  replyTo?: string
): Promise<boolean> {
  return await sendEmail({
    to,
    subject,
    html,
    text,
    from: 'UPDATES', // Uses updates@taskkash.xyz
    replyTo
  });
}

// Send support email (contact form, user support)
export async function sendSupportEmailService(
  to: string,
  subject: string,
  html: string,
  text?: string,
  replyTo?: string
): Promise<boolean> {
  return await sendEmail({
    to,
    subject,
    html,
    text,
    from: 'SUPPORT', // Uses support@taskkash.xyz
    replyTo
  });
}

// Send marketing email (book a session, business inquiries)
export async function sendMarketingEmailService(
  to: string,
  subject: string,
  html: string,
  text?: string,
  replyTo?: string
): Promise<boolean> {
  return await sendEmail({
    to,
    subject,
    html,
    text,
    from: 'MARKETING', // Uses marketing@taskkash.xyz
    replyTo
  });
}

// Send info email (general informational communication)
export async function sendInfoEmailService(
  to: string,
  subject: string,
  html: string,
  text?: string,
  replyTo?: string
): Promise<boolean> {
  return await sendEmail({
    to,
    subject,
    html,
    text,
    from: 'INFO', // Uses info@taskkash.xyz
    replyTo
  });
}

// Email flow mapping for validation and debugging
export const EMAIL_FLOWS = {
  'forgot-password': {
    sender: 'NOREPLY',
    email: 'noreply@taskkash.xyz',
    description: 'Password reset emails'
  },
  'password-reset': {
    sender: 'NOREPLY', 
    email: 'noreply@taskkash.xyz',
    description: 'Password reset confirmation'
  },
  'email-verification': {
    sender: 'NOREPLY',
    email: 'noreply@taskkash.xyz', 
    description: 'Email verification OTP'
  },
  'security-alert': {
    sender: 'NOREPLY',
    email: 'noreply@taskkash.xyz',
    description: 'Security notifications and alerts'
  },
  'contact-form': {
    sender: 'SUPPORT',
    email: 'support@taskkash.xyz',
    description: 'Contact form submissions'
  },
  'user-support': {
    sender: 'SUPPORT',
    email: 'support@taskkash.xyz',
    description: 'User support requests'
  },
  'book-session': {
    sender: 'MARKETING',
    email: 'marketing@taskkash.xyz',
    description: 'Book a Session requests'
  },
  'business-inquiry': {
    sender: 'MARKETING',
    email: 'marketing@taskkash.xyz',
    description: 'Business partnership inquiries'
  },
  'broadcast': {
    sender: 'UPDATES',
    email: 'updates@taskkash.xyz',
    description: 'Broadcast announcements'
  },
  'newsletter': {
    sender: 'UPDATES',
    email: 'updates@taskkash.xyz',
    description: 'Newsletter subscriptions'
  },
  'platform-updates': {
    sender: 'UPDATES',
    email: 'updates@taskkash.xyz',
    description: 'Platform-wide updates'
  },
  'general-info': {
    sender: 'INFO',
    email: 'info@taskkash.xyz',
    description: 'General informational emails'
  }
} as const;

// Function to validate email flow uses correct sender
export function validateEmailFlow(flowType: keyof typeof EMAIL_FLOWS, actualSender: EmailType): boolean {
  const expectedSender = EMAIL_FLOWS[flowType]?.sender as EmailType;
  return expectedSender === actualSender;
}

// Function to get email flow details
export function getEmailFlowDetails(flowType: keyof typeof EMAIL_FLOWS) {
  return EMAIL_FLOWS[flowType] || null;
}
