# TaskKash Permanent Email Architecture

## Overview
All outbound email permanently uses `support@taskkash.xyz` as the real sender mailbox. This eliminates alias-based sender issues and ensures SMTP policy compliance.

## Core Configuration

### Single Real Sender
```typescript
const ACTUAL_FROM_EMAIL = "support@taskkash.xyz";
const ACTUAL_FROM_NAME = "TaskKash Support";
```

### Email Flow Rules
- **SYSTEM_EMAILS**: No replyTo allowed (OTP, password reset, broadcasts)
- **USER_FORMS**: replyTo allowed to submitter (contact form, booking inquiries)

## Email Flows

### System Emails (No replyTo)
- **OTP/Email Verification**
  - From: `"TaskKash Support" <support@taskkash.xyz>`
  - ReplyTo: DISABLED
- **Password Reset**
  - From: `"TaskKash Support" <support@taskkash.xyz>`
  - ReplyTo: DISABLED
- **Broadcast/Announcements**
  - From: `"TaskKash Support" <support@taskkash.xyz>`
  - ReplyTo: DISABLED

### User Form Emails (replyTo to submitter)
- **Contact Support Form**
  - From: `"TaskKash Support" <support@taskkash.xyz>`
  - ReplyTo: User's email
- **Booking/Business Inquiry**
  - From: `"TaskKash Support" <support@taskkash.xyz>`
  - ReplyTo: Business email

## SMTP Configuration
- Host: `process.env.SMTP_HOST`
- Port: `process.env.SMTP_PORT`
- Auth User: `process.env.SMTP_USER` (should be support@taskkash.xyz)
- Auth Pass: `process.env.SMTP_PASS`

## Aliases (Forwarders Only)
The following email addresses may exist as aliases/forwarders but are NOT used as actual senders:
- `noreply@taskkash.xyz` → `support@taskkash.xyz`
- `updates@taskkash.xyz` → `support@taskkash.xyz`
- `marketing@taskkash.xyz` → `support@taskkash.xyz`
- `info@taskkash.xyz` → `support@taskkash.xyz`

## Implementation Details

### Centralized Rules
```typescript
const EMAIL_FLOW_RULES = {
  SYSTEM_EMAILS: {
    allowedReplyTo: false,
    description: "OTP, password reset, security notifications, broadcasts"
  },
  USER_FORMS: {
    allowedReplyTo: true,
    description: "Contact form, booking inquiries"
  }
};
```

### Type Mapping
```typescript
const EMAIL_TYPE_RULES = {
  NOREPLY: EMAIL_FLOW_RULES.SYSTEM_EMAILS,
  SUPPORT: EMAIL_FLOW_RULES.USER_FORMS,
  MARKETING: EMAIL_FLOW_RULES.USER_FORMS,
  INFO: EMAIL_FLOW_RULES.SYSTEM_EMAILS,
  UPDATES: EMAIL_FLOW_RULES.SYSTEM_EMAILS
};
```

## Logging
Each email send logs:
- Final from address
- ReplyTo status (enabled/disabled)
- Flow type
- SMTP configuration

## Benefits
1. **Policy Compliance**: Single real sender prevents SMTP policy violations
2. **Simplified Architecture**: No complex alias sender logic
3. **Reliable Delivery**: Consistent sender address improves deliverability
4. **Easy Maintenance**: Centralized configuration for replyTo rules
5. **Production Ready**: Clean, modular, and permanent implementation

## Files Changed
- `/lib/email.ts` - Complete refactor with unified sender architecture

## Migration Complete
- ✅ All alias-based sender usage removed
- ✅ Single real sender mailbox implemented
- ✅ Centralized replyTo rules established
- ✅ Production-ready logging and error handling
- ✅ SMTP policy compliance achieved
