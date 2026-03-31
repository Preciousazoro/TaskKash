# TaskKash Email Setup Guide

## Overview
TaskKash uses a professional SMTP configuration for sending emails with proper domain branding. All emails are sent through your hosting provider's SMTP server using domain-specific email addresses.

## Required Environment Variables

Add these to your `.env.local` file:

```env
# SMTP Configuration (Required)
SMTP_HOST=smtp.yourhostingprovider.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=noreply@taskkash.xyz
SMTP_PASS=your_smtp_password

# Branded Email Addresses (Optional - defaults shown)
EMAIL_NOREPLY=noreply@taskkash.xyz
EMAIL_SUPPORT=support@taskkash.xyz
EMAIL_MARKETING=marketing@taskkash.xyz
EMAIL_INFO=info@taskkash.xyz
EMAIL_UPDATES=updates@taskkash.xyz
```

## SMTP Configuration Examples

### Common Hosting Providers

**cPanel/HostGator/Bluehost:**
```env
SMTP_HOST=smtp.taskkash.xyz
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=noreply@taskkash.xyz
SMTP_PASS=your_email_password
```

**Google Workspace (if using domain):**
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=noreply@taskkash.xyz
SMTP_PASS=your_app_password
```

**Microsoft 365:**
```env
SMTP_HOST=smtp.office365.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=noreply@taskkash.xyz
SMTP_PASS=your_app_password
```

**SendGrid:**
```env
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=apikey
SMTP_PASS=YOUR_SENDGRID_API_KEY
```

**Mailgun:**
```env
SMTP_HOST=smtp.mailgun.org
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=postmaster@taskkash.xyz
SMTP_PASS=YOUR_MAILGUN_PASSWORD
```

## Email Types and Their Uses

The system automatically uses the correct sender for each email type:

- **NOREPLY** (`noreply@taskkash.xyz`) - System messages (password reset, OTP, security)
- **SUPPORT** (`support@taskkash.xyz`) - Support form submissions and help requests
- **MARKETING** (`marketing@taskkash.xyz`) - Business inquiries and booking requests
- **INFO** (`info@taskkash.xyz`) - General informational messages
- **UPDATES** (`updates@taskkash.xyz`) - Broadcast announcements and newsletters

## Port Configuration

- **Port 587** with `SMTP_SECURE=false` (recommended) - TLS encryption
- **Port 465** with `SMTP_SECURE=true` - SSL encryption

## Verification

1. Restart your application
2. Check the console logs for SMTP configuration
3. Send a test email (password reset or contact form)
4. Verify the sender shows as your branded domain email

## Email Flow Examples

**Password Reset:**
```
From: TaskKash System <noreply@taskkash.xyz>
To: user@example.com
```

**Support Form:**
```
From: TaskKash Support <support@taskkash.xyz>
To: support@taskkash.xyz
Reply-To: user@example.com
```

**Business Inquiry:**
```
From: TaskKash Business <marketing@taskkash.xyz>
To: marketing@taskkash.xyz
Reply-To: business@example.com
```

**Broadcast Announcement:**
```
From: TaskKash Updates <updates@taskkash.xyz>
To: user@example.com
```

## Troubleshooting

### Common Issues

**"SMTP configuration is incomplete"**
- Ensure all four SMTP variables are set: SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS

**"Email authentication failed"**
- Verify SMTP credentials are correct
- Check if your hosting provider requires app passwords
- Ensure the SMTP user has permission to send emails

**"Connection refused"**
- Verify SMTP_HOST and SMTP_PORT are correct
- Check if firewall is blocking SMTP connections
- Try alternative ports (587 or 465)

### Debug Logging

The system logs SMTP configuration without exposing sensitive data:
```
=== SMTP CONFIGURATION ===
SMTP Host: smtp.taskkash.xyz
SMTP Port: 587
SMTP User: noreply@taskkash.xyz
SMTP Password configured: Yes
===========================
```

## Security Notes

- Use app passwords instead of primary account passwords when possible
- Rotate SMTP passwords regularly
- Monitor email sending volume to avoid spam flags
- Ensure SPF, DKIM, and DMARC records are configured for your domain

## Migration from Gmail

If you were previously using Gmail SMTP:
1. Update your environment variables with the new SMTP configuration
2. Remove any Gmail-specific environment variables (EMAIL_SERVICE, EMAIL_PASSWORD, etc.)
3. Test all email flows to ensure proper sender branding
4. Update any documentation that references Gmail

The new system will automatically use your domain email addresses as senders, eliminating the "via taskkash.web3@gmail.com" issue.
