import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import WithdrawalVisibility from '@/models/WithdrawalVisibility';
import User from '@/models/User';
import { sendBroadcastEmailService } from '@/lib/emailService';

// GET - Fetch current withdrawal visibility
export async function GET() {
  try {
    const session = await auth();
    
    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    let visibility = await WithdrawalVisibility.findOne();
    
    // Create default visibility if none exists
    if (!visibility) {
      visibility = await WithdrawalVisibility.create({
        isVisible: true
      });
    }

    return NextResponse.json({ isVisible: visibility.isVisible });
  } catch (error) {
    console.error('Error fetching withdrawal visibility:', error);
    return NextResponse.json(
      { error: 'Failed to fetch withdrawal visibility' },
      { status: 500 }
    );
  }
}

// POST - Update withdrawal visibility and send emails
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { isVisible } = await request.json();

    if (typeof isVisible !== 'boolean') {
      return NextResponse.json(
        { error: 'isVisible must be a boolean' },
        { status: 400 }
      );
    }

    let visibility = await WithdrawalVisibility.findOne();
    
    if (!visibility) {
      visibility = await WithdrawalVisibility.create({
        isVisible,
        lastUpdatedBy: session.user?.id,
        lastUpdatedAt: new Date()
      });
    } else {
      const previousState = visibility.isVisible;
      visibility.isVisible = isVisible;
      visibility.lastUpdatedBy = session.user?.id;
      visibility.lastUpdatedAt = new Date();
      await visibility.save();

      // Send email notifications only when state changes
      if (previousState !== isVisible) {
        await sendVisibilityEmails(isVisible);
      }
    }

    return NextResponse.json({ 
      success: true, 
      isVisible: visibility.isVisible 
    });
  } catch (error) {
    console.error('Error updating withdrawal visibility:', error);
    return NextResponse.json(
      { error: 'Failed to update withdrawal visibility' },
      { status: 500 }
    );
  }
}

// Helper function to send emails to all users
async function sendVisibilityEmails(isVisible: boolean) {
  try {
    const users = await User.find({ 
      role: 'user', 
      emailVerified: true 
    }).select('email name');

    const subject = isVisible 
      ? 'Withdrawals Now Available - TaskKash'
      : 'Withdrawals Temporarily Locked - TaskKash';

    const html = isVisible
      ? createUnlockEmailTemplate()
      : createLockEmailTemplate();

    const text = isVisible
      ? 'Withdrawals are now available on TaskKash. You can request withdrawals from your dashboard.'
      : 'Withdrawals are temporarily locked for maintenance. Your funds are safe. We will notify you when withdrawals are available again.';

    // Send emails to all verified users
    const emailPromises = users.map(user =>
      sendBroadcastEmailService(
        user.email,
        subject,
        html.replace('{{userName}}', user.name || 'User'),
        text
      )
    );

    await Promise.allSettled(emailPromises);
    console.log(`Sent ${isVisible ? 'unlock' : 'lock'} emails to ${users.length} users`);
  } catch (error) {
    console.error('Error sending visibility emails:', error);
  }
}

function createLockEmailTemplate(): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Withdrawals Temporarily Locked - TaskKash</title>
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
        .badge {
          display: inline-block;
          background-color: #f59e0b;
          color: white;
          padding: 8px 16px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: bold;
          margin-bottom: 20px;
        }
        .content {
          margin-bottom: 30px;
        }
        .info-box {
          background-color: #fef3c7;
          border: 1px solid #fcd34d;
          border-radius: 8px;
          padding: 20px;
          margin: 20px 0;
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
          <div class="badge">IMPORTANT UPDATE</div>
          <h1 class="title">Withdrawals Temporarily Locked</h1>
        </div>
        
        <div class="content">
          <p>Hello {{userName}},</p>
          
          <p>We wanted to inform you that withdrawal operations have been temporarily locked for scheduled maintenance and system updates.</p>
          
          <div class="info-box">
            <strong>🔒 What this means:</strong>
            <ul>
              <li>New withdrawal requests are temporarily paused</li>
              <li>Your existing Task Points (TP) balance remains 100% safe</li>
              <li>All pending withdrawals will continue to be processed</li>
            </ul>
          </div>
          
          <p>We are working hard to complete this maintenance as quickly as possible. You will receive another email notification as soon as withdrawals are unlocked.</p>
          
          <p>Thank you for your patience and understanding.</p>
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
}

function createUnlockEmailTemplate(): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Withdrawals Now Available - TaskKash</title>
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
        .badge {
          display: inline-block;
          background-color: #10b981;
          color: white;
          padding: 8px 16px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: bold;
          margin-bottom: 20px;
        }
        .content {
          margin-bottom: 30px;
        }
        .cta-button {
          display: inline-block;
          background: linear-gradient(45deg, #00ff9d, #8a2be2);
          color: white;
          padding: 15px 30px;
          text-decoration: none;
          border-radius: 5px;
          font-weight: bold;
          margin: 20px 0;
        }
        .info-box {
          background-color: #d1fae5;
          border: 1px solid #10b981;
          border-radius: 8px;
          padding: 20px;
          margin: 20px 0;
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
          <div class="badge">GOOD NEWS</div>
          <h1 class="title">Withdrawals Now Available!</h1>
        </div>
        
        <div class="content">
          <p>Hello {{userName}},</p>
          
          <p>Great news! The scheduled maintenance has been completed and withdrawal operations are now fully available again.</p>
          
          <div class="info-box">
            <strong>✅ What you can do now:</strong>
            <ul>
              <li>Request new withdrawals from your dashboard</li>
              <li>Access all withdrawal features without restrictions</li>
              <li>Your Task Points (TP) are ready to be withdrawn</li>
            </ul>
          </div>
          
          <div style="text-align: center;">
            <a href="https://taskkash.xyz/user-dashboard/withdraw" class="cta-button">Request Withdrawal</a>
          </div>
          
          <p>Thank you for your patience during the maintenance period. We appreciate your continued trust in TaskKash!</p>
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
}
