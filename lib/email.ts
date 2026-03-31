import nodemailer from 'nodemailer';

// Permanent email sending configuration for TaskKash
// All outbound email uses support@taskkash.xyz as the real sender

// Single real sender mailbox - permanent production setup
const ACTUAL_FROM_EMAIL = "support@taskkash.xyz";
const ACTUAL_FROM_NAME = "TaskKash Support";

// Email flow rules - centralized configuration
const EMAIL_FLOW_RULES = {
  // System emails - no replyTo allowed
  SYSTEM_EMAILS: {
    allowedReplyTo: false,
    description: "OTP, password reset, security notifications, broadcasts"
  },
  
  // User-submitted forms - replyTo allowed to submitter
  USER_FORMS: {
    allowedReplyTo: true,
    description: "Contact form, booking inquiries"
  }
} as const;

// Email type mapping to flow rules
const EMAIL_TYPE_RULES = {
  NOREPLY: EMAIL_FLOW_RULES.SYSTEM_EMAILS,
  SUPPORT: EMAIL_FLOW_RULES.USER_FORMS,
  MARKETING: EMAIL_FLOW_RULES.USER_FORMS,
  INFO: EMAIL_FLOW_RULES.SYSTEM_EMAILS,
  UPDATES: EMAIL_FLOW_RULES.SYSTEM_EMAILS
} as const;

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
  from?: string; // Legacy parameter - now maps to unified sender
  replyTo?: string; // Only allowed for user form submissions
  forceReplyTo?: boolean; // Override for specific user form flows
}

// Create transporter using hosting SMTP configuration
const createTransporter = () => {
  const smtpHost = process.env.SMTP_HOST;
  const smtpPort = process.env.SMTP_PORT;
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;

  console.log('=== SMTP CONFIGURATION ===');
  console.log('SMTP Host:', smtpHost || 'NOT CONFIGURED');
  console.log('SMTP Port:', smtpPort || 'NOT CONFIGURED');
  console.log('SMTP User:', smtpUser || 'NOT CONFIGURED');
  console.log('SMTP Password configured:', smtpPass ? 'Yes' : 'No');
  console.log('===========================');

  if (!smtpHost || !smtpPort || !smtpUser || !smtpPass) {
    throw new Error('SMTP configuration is incomplete. Please set SMTP_HOST, SMTP_PORT, SMTP_USER, and SMTP_PASS environment variables.');
  }

  // Determine secure setting based on port
  const port = parseInt(smtpPort);
  const secure = port === 465; // true for port 465, false for 587

  // Create transporter with hosting SMTP
  return nodemailer.createTransport({
    host: smtpHost,
    port: port,
    secure: secure, // MUST be false for port 587, true for 465
    auth: {
      user: smtpUser,
      pass: smtpPass,
    },
    tls: {
      rejectUnauthorized: false, // Required for some hosting providers
    },
  });
};

// Permanent send email function - unified sender architecture
export async function sendEmail({ to, subject, html, text, from, replyTo, forceReplyTo = false }: EmailOptions): Promise<boolean> {
  try {
    console.log('=== EMAIL SEND ATTEMPT ===');
    console.log('To:', to);
    console.log('Subject:', subject);
    console.log('Legacy from type:', from || 'not specified');
    
    const transporter = createTransporter();
    
    // UNIFIED SENDER: Always use the real support mailbox
    const mailOptions: any = {
      from: `"${ACTUAL_FROM_NAME}" <${ACTUAL_FROM_EMAIL}>`,
      to,
      subject,
      html,
      text,
    };

    // REPLY-TO RULES: Only allow for user form submissions
    const flowRule = from ? EMAIL_TYPE_RULES[from as keyof typeof EMAIL_TYPE_RULES] : EMAIL_FLOW_RULES.SYSTEM_EMAILS;
    const allowReplyTo = forceReplyTo || (flowRule?.allowedReplyTo && !!replyTo);
    
    if (allowReplyTo && replyTo) {
      mailOptions.replyTo = replyTo;
      console.log('ReplyTo allowed:', replyTo);
    } else {
      console.log('ReplyTo: DISABLED for this flow type');
    }

    console.log('=== PERMANENT EMAIL CONFIG ===');
    console.log('Final from:', mailOptions.from);
    console.log('ReplyTo:', mailOptions.replyTo || 'DISABLED');
    console.log('Flow type:', from || 'SYSTEM_EMAILS');
    console.log('SMTP Host:', process.env.SMTP_HOST);
    console.log('SMTP User:', process.env.SMTP_USER);
    console.log('===============================');

    const result = await transporter.sendMail(mailOptions);
    console.log('✅ Email sent successfully:', (result as any)?.messageId);
    console.log('=== EMAIL SEND SUCCESS ===');
    return true;
  } catch (error) {
    console.error('❌ Error sending email:', error);
    console.error('Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      code: (error as any)?.code,
      command: (error as any)?.command,
      response: (error as any)?.response
    });
    console.log('=== EMAIL SEND FAILED ===');
    return false;
  }
}

// Password reset email template
export function createPasswordResetEmail(resetUrl: string, userName?: string): { html: string; text: string } {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Reset Your Password - TaskKash</title>
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background-color: #f4f4f4;
        }
        .container {
          background-color: #ffffff;
          border-radius: 10px;
          padding: 30px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .header {
          text-align: center;
          margin-bottom: 30px;
        }
        .logo {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          margin-bottom: 20px;
        }
        .logo img {
          width: 40px;
          height: 40px;
          border-radius: 8px;
          object-fit: contain;
          background: #f8f9fa;
          padding: 4px;
          border: 1px solid #e9ecef;
        }
        .logo-text {
          font-size: 24px;
          font-weight: bold;
          background: linear-gradient(45deg, #00ff9d, #8a2be2);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .title {
          color: #333;
          font-size: 24px;
          margin-bottom: 10px;
        }
        .content {
          margin-bottom: 30px;
        }
        .reset-button {
          display: inline-block;
          background: linear-gradient(45deg, #00ff9d, #8a2be2);
          color: white;
          padding: 15px 30px;
          text-decoration: none;
          border-radius: 5px;
          font-weight: bold;
          margin: 20px 0;
        }
        .reset-button:hover {
          opacity: 0.9;
        }
        .footer {
          text-align: center;
          color: #666;
          font-size: 14px;
          margin-top: 30px;
          padding-top: 20px;
          border-top: 1px solid #eee;
        }
        .warning {
          background-color: #fff3cd;
          border: 1px solid #ffeaa7;
          border-radius: 5px;
          padding: 15px;
          margin: 20px 0;
          color: #856404;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">
            <img src="https://taskkash.xyz/taskkash-logo.png" alt="TaskKash Logo" onerror="this.src='http://localhost:3000/taskkash-logo.png'" />
            <span class="logo-text">TaskKash</span>
          </div>
          <h1 class="title">Reset Your Password</h1>
        </div>
        
        <div class="content">
          <p>Hello${userName ? ` ${userName}` : ''},</p>
          
          <p>We received a request to reset your password for your TaskKash account. Click the button below to set a new password:</p>
          
          <div style="text-align: center;">
            <a href="${resetUrl}" class="reset-button">Reset Password</a>
          </div>
          
          <p>Or copy and paste this link into your browser:</p>
          <p style="word-break: break-all; background: #f8f9fa; padding: 10px; border-radius: 5px; font-family: monospace;">
            ${resetUrl}
          </p>
          
          <div class="warning">
            <strong>Important:</strong> This link will expire in 1 hour for security reasons. If you didn't request this password reset, please ignore this email.
          </div>
        </div>
        
        <div class="footer">
          <p>Best regards,<br>The TaskKash Team</p>
          <p style="font-size: 12px; color: #999;">
            This is an automated message. Please do not reply to this email.
          </p>
        </div>
      </div>
    </body>
    </html>
  `;

  const text = `
    Reset Your Password - TaskKash
    
    Hello${userName ? ` ${userName}` : ''},
    
    We received a request to reset your password for your TaskKash account. Visit the link below to set a new password:
    
    ${resetUrl}
    
    Important: This link will expire in 1 hour for security reasons. If you didn't request this password reset, please ignore this email.
    
    Best regards,
    The TaskKash Team
  `;

  return { html, text };
}

// Send password reset email - SYSTEM EMAIL (no replyTo)
export async function sendPasswordResetEmail(email: string, resetUrl: string, userName?: string): Promise<boolean> {
  const { html, text } = createPasswordResetEmail(resetUrl, userName);
  
  console.log('=== PASSWORD RESET EMAIL FLOW ===');
  console.log('Type: SYSTEM_EMAIL (no replyTo allowed)');
  console.log('Sender: TaskKash Support <support@taskkash.xyz>');
  console.log('===================================');
  
  return await sendEmail({
    to: email,
    subject: 'Reset Your Password - TaskKash',
    html,
    text,
    from: 'NOREPLY' // Maps to SYSTEM_EMAIL flow rule
  });
}

// Email verification OTP template
export function createVerificationEmail(otpCode: string, userName?: string): { html: string; text: string } {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Email Verification - TaskKash</title>
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background-color: #f4f4f4;
        }
        .container {
          background-color: #ffffff;
          border-radius: 10px;
          padding: 30px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .header {
          text-align: center;
          margin-bottom: 30px;
        }
        .logo {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          margin-bottom: 20px;
        }
        .logo img {
          width: 40px;
          height: 40px;
          border-radius: 8px;
          object-fit: contain;
          background: #f8f9fa;
          padding: 4px;
          border: 1px solid #e9ecef;
        }
        .logo-text {
          font-size: 24px;
          font-weight: bold;
          background: linear-gradient(45deg, #00ff9d, #8a2be2);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .title {
          color: #333;
          font-size: 24px;
          margin-bottom: 10px;
        }
        .content {
          margin-bottom: 30px;
        }
        .otp-container {
          background: linear-gradient(45deg, #00ff9d, #8a2be2);
          color: white;
          padding: 20px;
          border-radius: 10px;
          text-align: center;
          margin: 20px 0;
          font-size: 32px;
          font-weight: bold;
          letter-spacing: 8px;
          font-family: 'Courier New', monospace;
        }
        .footer {
          text-align: center;
          color: #666;
          font-size: 14px;
          margin-top: 30px;
          padding-top: 20px;
          border-top: 1px solid #eee;
        }
        .warning {
          background-color: #fff3cd;
          border: 1px solid #ffeaa7;
          border-radius: 5px;
          padding: 15px;
          margin: 20px 0;
          color: #856404;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">
            <img src="https://taskkash.xyz/taskkash-logo.png" alt="TaskKash Logo" onerror="this.src='http://localhost:3000/taskkash-logo.png'" />
            <span class="logo-text">TaskKash</span>
          </div>
          <h1 class="title">Email Verification</h1>
        </div>
        
        <div class="content">
          <p>Hello${userName ? ` ${userName}` : ''},</p>
          
          <p>Thank you for signing up for TaskKash! To complete your registration, please enter the verification code below:</p>
          
          <div class="otp-container">
            ${otpCode}
          </div>
          
          <p>This code will expire in <strong>2 minutes</strong> for security reasons.</p>
          
          <div class="warning">
            <strong>Important:</strong> If you didn't request this verification, please ignore this email. Never share this code with anyone.
          </div>
        </div>
        
        <div class="footer">
          <p>Best regards,<br>The TaskKash Team</p>
          <p style="font-size: 12px; color: #999;">
            This is an automated message. Please do not reply to this email.
          </p>
        </div>
      </div>
    </body>
    </html>
  `;

  const text = `
    Email Verification - TaskKash
    
    Hello${userName ? ` ${userName}` : ''},
    
    Thank you for signing up for TaskKash! Your verification code is:
    
    ${otpCode}
    
    This code will expire in 2 minutes for security reasons.
    
    If you didn't request this verification, please ignore this email. Never share this code with anyone.
    
    Best regards,
    The TaskKash Team
  `;

  return { html, text };
}

// Send email verification OTP - SYSTEM EMAIL (no replyTo)
export async function sendVerificationEmail(email: string, otpCode: string, userName?: string): Promise<boolean> {
  const { html, text } = createVerificationEmail(otpCode, userName);
  
  console.log('=== OTP VERIFICATION EMAIL FLOW ===');
  console.log('Type: SYSTEM_EMAIL (no replyTo allowed)');
  console.log('Sender: TaskKash Support <support@taskkash.xyz>');
  console.log('===================================');
  
  return await sendEmail({
    to: email,
    subject: 'Taskkash Email Verification Code',
    html,
    text,
    from: 'NOREPLY' // Maps to SYSTEM_EMAIL flow rule
  });
}

// Support email template for contact form submissions
export function createSupportEmail(name: string, userEmail: string, subject: string, message: string): { html: string; text: string } {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>New Support Request - TaskKash</title>
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background-color: #f4f4f4;
        }
        .container {
          background-color: #ffffff;
          border-radius: 10px;
          padding: 30px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .header {
          text-align: center;
          margin-bottom: 30px;
        }
        .logo {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          margin-bottom: 20px;
        }
        .logo img {
          width: 40px;
          height: 40px;
          border-radius: 8px;
          object-fit: contain;
          background: #f8f9fa;
          padding: 4px;
          border: 1px solid #e9ecef;
        }
        .logo-text {
          font-size: 24px;
          font-weight: bold;
          background: linear-gradient(45deg, #00ff9d, #8a2be2);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .title {
          color: #333;
          font-size: 24px;
          margin-bottom: 10px;
        }
        .content {
          margin-bottom: 30px;
        }
        .field {
          margin-bottom: 20px;
        }
        .field-label {
          font-weight: bold;
          color: #555;
          margin-bottom: 5px;
        }
        .field-value {
          background: #f8f9fa;
          padding: 10px;
          border-radius: 5px;
          border-left: 4px solid #00ff9d;
        }
        .message-content {
          background: #f8f9fa;
          padding: 15px;
          border-radius: 5px;
          border-left: 4px solid #8a2be2;
          white-space: pre-wrap;
        }
        .footer {
          text-align: center;
          color: #666;
          font-size: 14px;
          margin-top: 30px;
          padding-top: 20px;
          border-top: 1px solid #eee;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">
            <img src="https://taskkash.xyz/taskkash-logo.png" alt="TaskKash Logo" onerror="this.src='http://localhost:3000/taskkash-logo.png'" />
            <span class="logo-text">TaskKash</span>
          </div>
          <h1 class="title">New Support Request</h1>
        </div>
        
        <div class="content">
          <div class="field">
            <div class="field-label">From:</div>
            <div class="field-value">${name} &lt;${userEmail}&gt;</div>
          </div>
          
          <div class="field">
            <div class="field-label">Subject:</div>
            <div class="field-value">${subject}</div>
          </div>
          
          <div class="field">
            <div class="field-label">Message:</div>
            <div class="message-content">${message}</div>
          </div>
        </div>
        
        <div class="footer">
          <p>This support request was submitted via the TaskKash contact form.</p>
          <p>Please respond to the user at: ${userEmail}</p>
        </div>
      </div>
    </body>
    </html>
  `;

  const text = `
    New Support Request - TaskKash
    
    From: ${name} <${userEmail}>
    Subject: ${subject}
    
    Message:
    ${message}
    
    ---
    This support request was submitted via the TaskKash contact form.
    Please respond to the user at: ${userEmail}
  `;

  return { html, text };
}

// Send support email - USER FORM (replyTo allowed to submitter)
export async function sendSupportEmail(name: string, userEmail: string, subject: string, message: string): Promise<boolean> {
  const { html, text } = createSupportEmail(name, userEmail, subject, message);
  
  console.log('=== CONTACT SUPPORT EMAIL FLOW ===');
  console.log('Type: USER_FORM (replyTo allowed to submitter)');
  console.log('Sender: TaskKash Support <support@taskkash.xyz>');
  console.log('ReplyTo:', userEmail);
  console.log('=====================================');
  
  return await sendEmail({
    to: 'support@taskkash.xyz', // Send to support team
    subject: `Support Request: ${subject}`,
    html,
    text,
    from: 'SUPPORT', // Maps to USER_FORM flow rule
    replyTo: userEmail, // Reply directly to the user who submitted
    forceReplyTo: true // Explicitly enable replyTo for user form
  });
}

// Marketing email template for booking submissions
export function createMarketingEmail(companyName: string, email: string, phone: string, message: string): { html: string; text: string } {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>New Booking Request - TaskKash</title>
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background-color: #f4f4f4;
        }
        .container {
          background-color: #ffffff;
          border-radius: 10px;
          padding: 30px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .header {
          text-align: center;
          margin-bottom: 30px;
        }
        .logo {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          margin-bottom: 20px;
        }
        .logo img {
          width: 40px;
          height: 40px;
          border-radius: 8px;
          object-fit: contain;
          background: #f8f9fa;
          padding: 4px;
          border: 1px solid #e9ecef;
        }
        .logo-text {
          font-size: 24px;
          font-weight: bold;
          background: linear-gradient(45deg, #00ff9d, #8a2be2);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .title {
          color: #333;
          font-size: 24px;
          margin-bottom: 10px;
        }
        .content {
          margin-bottom: 30px;
        }
        .field {
          margin-bottom: 20px;
        }
        .field-label {
          font-weight: bold;
          color: #555;
          margin-bottom: 5px;
        }
        .field-value {
          background: #f8f9fa;
          padding: 10px;
          border-radius: 5px;
          border-left: 4px solid #00ff9d;
        }
        .message-content {
          background: #f8f9fa;
          padding: 15px;
          border-radius: 5px;
          border-left: 4px solid #8a2be2;
          white-space: pre-wrap;
        }
        .footer {
          text-align: center;
          color: #666;
          font-size: 14px;
          margin-top: 30px;
          padding-top: 20px;
          border-top: 1px solid #eee;
        }
        .badge {
          display: inline-block;
          background: linear-gradient(45deg, #00ff9d, #8a2be2);
          color: white;
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: bold;
          margin-bottom: 20px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">
            <img src="https://taskkash.xyz/taskkash-logo.png" alt="TaskKash Logo" onerror="this.src='http://localhost:3000/taskkash-logo.png'" />
            <span class="logo-text">TaskKash</span>
          </div>
          <div class="badge">BUSINESS INQUIRY</div>
          <h1 class="title">New Booking Request</h1>
        </div>
        
        <div class="content">
          <div class="field">
            <div class="field-label">Company Name:</div>
            <div class="field-value">${companyName}</div>
          </div>
          
          <div class="field">
            <div class="field-label">Email:</div>
            <div class="field-value">${email}</div>
          </div>
          
          ${phone ? `
          <div class="field">
            <div class="field-label">Phone:</div>
            <div class="field-value">${phone}</div>
          </div>
          ` : ''}
          
          <div class="field">
            <div class="field-label">Message/Requirements:</div>
            <div class="message-content">${message || 'No additional message provided'}</div>
          </div>
        </div>
        
        <div class="footer">
          <p>This booking request was submitted via the TaskKash booking form.</p>
          <p>Please respond to the business inquiry at: ${email}</p>
        </div>
      </div>
    </body>
    </html>
  `;

  const text = `
    New Booking Request - TaskKash Business
    
    Company Name: ${companyName}
    Email: ${email}
    ${phone ? `Phone: ${phone}` : ''}
    
    Message/Requirements:
    ${message || 'No additional message provided'}
    
    ---
    This booking request was submitted via the TaskKash booking form.
    Please respond to the business inquiry at: ${email}
  `;

  return { html, text };
}

// Send marketing email - USER FORM (replyTo allowed to submitter)
export async function sendMarketingEmail(companyName: string, email: string, phone: string, message: string): Promise<boolean> {
  const { html, text } = createMarketingEmail(companyName, email, phone, message);
  
  console.log('=== BOOKING INQUIRY EMAIL FLOW ===');
  console.log('Type: USER_FORM (replyTo allowed to submitter)');
  console.log('Sender: TaskKash Support <support@taskkash.xyz>');
  console.log('ReplyTo:', email);
  console.log('=====================================');
  
  return await sendEmail({
    to: 'marketing@taskkash.xyz', // Send to marketing team
    subject: `Booking Request: ${companyName}`,
    html,
    text,
    from: 'MARKETING', // Maps to USER_FORM flow rule
    replyTo: email, // Reply directly to the business
    forceReplyTo: true // Explicitly enable replyTo for user form
  });
}

// Broadcast email template
export function createBroadcastEmail(title: string, message: string, userName?: string): { html: string; text: string } {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${title} - TaskKash</title>
      <style>
        /* Reset and base styles */
        body, table, td, div, p, a {
          margin: 0;
          padding: 0;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
          -webkit-text-size-adjust: 100%;
          -ms-text-size-adjust: 100%;
        }
        
        body {
          background-color: #f8fafc;
          color: #1e293b;
          line-height: 1.6;
        }
        
        /* Container for email clients that don't support body background */
        .email-wrapper {
          background-color: #f8fafc;
          padding: 20px;
        }
        
        .container {
          max-width: 600px;
          margin: 0 auto;
          background-color: #ffffff;
          border-radius: 8px;
          overflow: hidden;
          border: 1px solid #e2e8f0;
        }
        
        /* Header section */
        .header {
          background-color: #ffffff;
          padding: 30px;
          text-align: center;
          border-bottom: 1px solid #e2e8f0;
        }
        
        .logo {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          margin-bottom: 20px;
        }
        
        .logo img {
          width: 40px;
          height: 40px;
          border-radius: 8px;
          object-fit: contain;
        }
        
        .logo-text {
          font-size: 24px;
          font-weight: 700;
          color: #1e293b;
        }
        
        .badge {
          display: inline-block;
          background-color: #10b981;
          color: #ffffff;
          padding: 6px 16px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
          margin-bottom: 20px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        
        .title {
          color: #0f172a;
          font-size: 28px;
          font-weight: 700;
          margin-bottom: 0;
          line-height: 1.3;
        }
        
        /* Content section */
        .content {
          padding: 40px 30px;
        }
        
        .greeting {
          font-size: 18px;
          color: #374151;
          margin-bottom: 16px;
        }
        
        .intro-text {
          font-size: 16px;
          color: #6b7280;
          margin-bottom: 24px;
          line-height: 1.6;
        }
        
        .message-content {
          background-color: #f9fafb;
          border: 1px solid #e5e7eb;
          border-left: 4px solid #10b981;
          padding: 24px;
          border-radius: 6px;
          margin: 24px 0;
        }
        
        .message-content p {
          color: #1f2937;
          font-size: 16px;
          line-height: 1.7;
          font-weight: 400;
          margin-bottom: 16px;
        }
        
        .message-content p:last-child {
          margin-bottom: 0;
        }
        
        .message-content h1, .message-content h2, .message-content h3 {
          color: #1f2937;
          font-weight: 600;
          margin-bottom: 12px;
          margin-top: 20px;
        }
        
        .message-content h1:first-child, .message-content h2:first-child, .message-content h3:first-child {
          margin-top: 0;
        }
        
        .message-content ul, .message-content ol {
          color: #1f2937;
          font-size: 16px;
          line-height: 1.7;
          margin-bottom: 16px;
          padding-left: 20px;
        }
        
        .message-content li {
          margin-bottom: 8px;
        }
        
        /* CTA Button */
        .cta-container {
          text-align: center;
          margin: 32px 0;
        }
        
        .cta-button {
          display: inline-block;
          background-color: #10b981;
          color: #ffffff;
          padding: 14px 32px;
          text-decoration: none;
          border-radius: 6px;
          font-weight: 600;
          font-size: 16px;
        }
        
        .cta-button:hover {
          background-color: #059669;
        }
        
        /* Footer section */
        .footer {
          background-color: #f9fafb;
          padding: 30px;
          text-align: center;
          border-top: 1px solid #e2e8f0;
        }
        
        .footer-text {
          color: #6b7280;
          font-size: 14px;
          line-height: 1.6;
          margin-bottom: 12px;
        }
        
        .footer-signature {
          color: #374151;
          font-weight: 600;
          margin-bottom: 8px;
        }
        
        .footer-disclaimer {
          font-size: 12px;
          color: #9ca3af;
          margin-top: 16px;
          padding-top: 16px;
          border-top: 1px solid #e5e7eb;
        }
        
        /* Mobile optimizations */
        @media screen and (max-width: 600px) {
          .email-wrapper {
            padding: 10px;
          }
          
          .container {
            margin: 0;
            border-radius: 0;
          }
          
          .header {
            padding: 24px 20px;
          }
          
          .title {
            font-size: 24px;
          }
          
          .content {
            padding: 24px 20px;
          }
          
          .message-content {
            padding: 20px;
          }
          
          .cta-button {
            padding: 12px 24px;
            font-size: 15px;
          }
          
          .footer {
            padding: 24px 20px;
          }
        }
      </style>
    </head>
    <body>
      <div class="email-wrapper">
        <div class="container">
          <!-- Header Section -->
          <div class="header">
            <div class="logo">
              <img src="https://taskkash.xyz/taskkash-logo.png" alt="TaskKash Logo" onerror="this.src='http://localhost:3000/taskkash-logo.png'" />
              <span class="logo-text">TaskKash</span>
            </div>
            <div class="badge">Official Announcement</div>
            <h1 class="title">${title}</h1>
          </div>
          
          <!-- Content Section -->
          <div class="content">
            <p class="greeting">Hello${userName ? ` ${userName}` : ''},</p>
            
            <p class="intro-text">We have an important announcement to share with you:</p>
            
            <div class="message-content">
              ${message}
            </div>
            
            <div class="cta-container">
              <a href="https://taskkash.xyz" class="cta-button">Visit TaskKash</a>
            </div>
          </div>
          
          <!-- Footer Section -->
          <div class="footer">
            <p class="footer-signature">Best regards,<br>The TaskKash Team</p>
            <p class="footer-text">
              Thank you for being part of our community!
            </p>
            <div class="footer-disclaimer">
              This is an official announcement from TaskKash. You received this because you are a registered user.
            </div>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;

  const text = `
    ${title} - TaskKash Official Announcement
    
    Hello${userName ? ` ${userName}` : ''},
    
    We have an important announcement to share with you:
    
    ${message}
    
    Visit TaskKash: https://taskkash.xyz
    
    Best regards,
    The TaskKash Team
    
    ---
    This is an official announcement from TaskKash. You received this because you are a registered user.
  `;

  return { html, text };
}

// Send broadcast email to multiple users - SYSTEM EMAIL (no replyTo)
export async function sendBroadcastEmail(users: { email: string; name?: string }[], title: string, message: string): Promise<{ sent: number; errors: string[] }> {
  const results = { sent: 0, errors: [] as string[] };
  
  console.log('=== BROADCAST EMAIL FLOW ===');
  console.log('Type: SYSTEM_EMAIL (no replyTo allowed)');
  console.log('Sender: TaskKash Support <support@taskkash.xyz>');
  console.log('==============================');
  
  if (users.length === 0) {
    console.log('📧 No users to send broadcast to');
    return results;
  }

  console.log(`📧 Starting broadcast email send to ${users.length} users`);
  console.log(`📧 Title: "${title}"`);
  
  const BATCH_SIZE = 15; // Send emails in batches of 15 to balance performance and server load
  const batches = [];
  
  // Create batches of users
  for (let i = 0; i < users.length; i += BATCH_SIZE) {
    batches.push(users.slice(i, i + BATCH_SIZE));
  }
  
  console.log(`📧 Processing ${batches.length} batches of up to ${BATCH_SIZE} emails each`);
  
  // Process each batch sequentially, but emails within each batch in parallel
  for (let batchIndex = 0; batchIndex < batches.length; batchIndex++) {
    const batch = batches[batchIndex];
    const batchNumber = batchIndex + 1;
    const totalBatches = batches.length;
    
    console.log(`📧 Sending batch ${batchNumber}/${totalBatches} (${batch.length} emails)`);
    
    try {
      // Send all emails in this batch in parallel using Promise.all()
      const batchPromises = batch.map(async (user) => {
        try {
          const { html, text } = createBroadcastEmail(title, message, user.name);
          
          const success = await sendEmail({
            to: user.email,
            subject: title,
            html,
            text,
            from: 'UPDATES' // Maps to SYSTEM_EMAIL flow rule (no replyTo)
          });
          
          return {
            email: user.email,
            success,
            error: success ? null : `Failed to send to ${user.email}`
          };
        } catch (error) {
          console.error(`Error sending broadcast email to ${user.email}:`, error);
          return {
            email: user.email,
            success: false,
            error: `Error sending to ${user.email}: ${error instanceof Error ? error.message : 'Unknown error'}`
          };
        }
      });
      
      // Wait for all emails in this batch to complete
      const batchResults = await Promise.all(batchPromises);
      
      // Process results from this batch
      for (const result of batchResults) {
        if (result.success) {
          results.sent++;
        } else {
          results.errors.push(result.error || `Failed to send to ${result.email}`);
        }
      }
      
      console.log(`✅ Batch ${batchNumber}/${totalBatches} completed: ${batchResults.filter(r => r.success).length}/${batchResults.length} emails sent successfully`);
      
      // Add small delay between batches to prevent overwhelming the server
      if (batchIndex < batches.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 100)); // 100ms delay between batches
      }
      
    } catch (batchError) {
      console.error(`❌ Batch ${batchNumber}/${totalBatches} failed:`, batchError);
      results.errors.push(`Batch ${batchNumber} failed: ${batchError instanceof Error ? batchError.message : 'Unknown error'}`);
    }
  }
  
  console.log(`📧 Broadcast completed: ${results.sent}/${users.length} emails sent successfully`);
  if (results.errors.length > 0) {
    console.log(`📧 Errors encountered: ${results.errors.length}`);
  }
  
  return results;
}
