import nodemailer from 'nodemailer';
import { EMAIL_PROVIDER, NOREPLY_EMAIL, SUPPORT_EMAIL, MARKETING_EMAIL, getEmailConfig, type EmailType } from './emailConfig';

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
  from?: EmailType; // Email type to use as sender
  replyTo?: string; // Optional reply-to override
}

// Create transporter using Gmail
const createTransporter = () => {
  const emailUser = EMAIL_PROVIDER.user;
  const emailPassword = EMAIL_PROVIDER.password;

  console.log('Email configuration check:');
  console.log('- Email user:', emailUser);
  console.log('- Email password configured:', emailPassword ? 'Yes' : 'No');

  if (!emailPassword) {
    throw new Error('EMAIL_PASSWORD environment variable is not configured. Please set up email credentials.');
  }

  return nodemailer.createTransport({
    service: EMAIL_PROVIDER.service,
    auth: {
      user: emailUser,
      pass: emailPassword, // Use app password for Gmail
    },
  });
};

// Send email function
export async function sendEmail({ to, subject, html, text, from = 'NOREPLY', replyTo }: EmailOptions): Promise<boolean> {
  try {
    console.log('=== EMAIL SEND ATTEMPT ===');
    console.log('To:', to);
    console.log('Subject:', subject);
    console.log('From type:', from);
    
    const transporter = createTransporter();
    const emailConfig = getEmailConfig(from);

    const mailOptions: any = {
      from: `"${emailConfig.name}" <${EMAIL_PROVIDER.user}>`,
      to,
      subject,
      html,
      text,
    };

    // Add sender if supported by the transport
    if (emailConfig.email !== EMAIL_PROVIDER.user) {
      mailOptions.sender = emailConfig.email;
    }

    // Add replyTo if provided
    const finalReplyTo = replyTo || emailConfig.replyTo;
    if (finalReplyTo) {
      mailOptions.replyTo = finalReplyTo;
    }

    console.log('Sending mail with options:', { 
      ...mailOptions, 
      html: '[HTML CONTENT]', 
      text: '[TEXT CONTENT]',
      sender: mailOptions.sender
    });

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

// Send password reset email
export async function sendPasswordResetEmail(email: string, resetUrl: string, userName?: string): Promise<boolean> {
  const { html, text } = createPasswordResetEmail(resetUrl, userName);
  
  return await sendEmail({
    to: email,
    subject: 'Reset Your Password - TaskKash',
    html,
    text,
    from: 'NOREPLY' // Explicitly use noreply email for system messages
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

// Send email verification OTP
export async function sendVerificationEmail(email: string, otpCode: string, userName?: string): Promise<boolean> {
  const { html, text } = createVerificationEmail(otpCode, userName);
  
  return await sendEmail({
    to: email,
    subject: 'Taskkash Email Verification Code',
    html,
    text,
    from: 'NOREPLY' // Explicitly use noreply email for system messages
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

// Send support email (for contact form submissions)
export async function sendSupportEmail(name: string, userEmail: string, subject: string, message: string): Promise<boolean> {
  const { html, text } = createSupportEmail(name, userEmail, subject, message);
  
  return await sendEmail({
    to: 'support@taskkash.xyz', // Send to support team
    subject: `Support Request: ${subject}`,
    html,
    text,
    from: 'SUPPORT', // Use support email as sender
    replyTo: userEmail // Reply directly to the user
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

// Send marketing email (for booking submissions)
export async function sendMarketingEmail(companyName: string, email: string, phone: string, message: string): Promise<boolean> {
  const { html, text } = createMarketingEmail(companyName, email, phone, message);
  
  return await sendEmail({
    to: 'marketing@taskkash.xyz', // Send to marketing team
    subject: `Booking Request: ${companyName}`,
    html,
    text,
    from: 'MARKETING', // Use marketing email as sender
    replyTo: email // Reply directly to the business
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
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          line-height: 1.6;
          color: #f9fafb;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background-color: #0f172a;
        }
        .container {
          background-color: #111827;
          border-radius: 10px;
          padding: 30px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.3);
          border: 1px solid #374151;
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
          background: #1f2937;
          padding: 4px;
          border: 1px solid #374151;
        }
        .logo-text {
          font-size: 24px;
          font-weight: bold;
          background: linear-gradient(45deg, #7c3aed, #a855f7);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .title {
          color: #7c3aed;
          font-size: 28px;
          margin-bottom: 10px;
          font-weight: bold;
        }
        .content {
          margin-bottom: 30px;
        }
        .message-content {
          background: #1f2937;
          padding: 25px;
          border-radius: 10px;
          border-left: 5px solid #7c3aed;
          white-space: pre-wrap;
          font-size: 16px;
          line-height: 1.8;
          margin: 20px 0;
          color: #f9fafb;
        }
        .badge {
          display: inline-block;
          background: linear-gradient(45deg, #7c3aed, #a855f7);
          color: white;
          padding: 6px 16px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: bold;
          margin-bottom: 20px;
          text-transform: uppercase;
          letter-spacing: 1px;
        }
        .footer {
          text-align: center;
          color: #9ca3af;
          font-size: 14px;
          margin-top: 30px;
          padding-top: 20px;
          border-top: 1px solid #374151;
        }
        .cta-button {
          display: inline-block;
          background: linear-gradient(45deg, #7c3aed, #a855f7);
          color: white;
          padding: 15px 30px;
          text-decoration: none;
          border-radius: 5px;
          font-weight: bold;
          margin: 20px 0;
          text-align: center;
        }
        .cta-button:hover {
          opacity: 0.9;
        }
        p {
          color: #f9fafb;
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
          <div class="badge">Official Announcement</div>
          <h1 class="title">${title}</h1>
        </div>
        
        <div class="content">
          <p>Hello${userName ? ` ${userName}` : ''},</p>
          
          <p>We have an important announcement to share with you:</p>
          
          <div class="message-content">${message}</div>
          
          <div style="text-align: center;">
            <a href="https://taskkash.xyz" class="cta-button">Visit TaskKash</a>
          </div>
        </div>
        
        <div class="footer">
          <p>Best regards,<br>The TaskKash Team</p>
          <p style="font-size: 12px; color: #6b7280;">
            This is an official announcement from TaskKash. You received this because you are a registered user.
          </p>
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

// Send broadcast email to multiple users with optimized batch processing
export async function sendBroadcastEmail(users: { email: string; name?: string }[], title: string, message: string): Promise<{ sent: number; errors: string[] }> {
  const results = { sent: 0, errors: [] as string[] };
  
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
            from: 'NOREPLY' // Use NOREPLY to match SMTP email and avoid mismatch
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
